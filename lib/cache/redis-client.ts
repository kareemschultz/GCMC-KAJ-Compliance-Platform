import Redis from 'ioredis'
import { logger } from '../middleware/logger'

interface CacheConfig {
  defaultTTL?: number
  keyPrefix?: string
  enableCompression?: boolean
}

class CacheManager {
  private redis: Redis | null = null
  private isEnabled: boolean = false
  private config: Required<CacheConfig>

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultTTL: config.defaultTTL || 300, // 5 minutes
      keyPrefix: config.keyPrefix || 'gk:',
      enableCompression: config.enableCompression || false
    }

    if (process.env.REDIS_URL && process.env.ENABLE_CACHE === 'true') {
      this.init()
    }
  }

  private async init(): Promise<void> {
    try {
      this.redis = new Redis(process.env.REDIS_URL!, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      })

      this.redis.on('connect', () => {
        logger.info('Redis connected successfully')
        this.isEnabled = true
      })

      this.redis.on('error', (err) => {
        logger.error('Redis connection error', err)
        this.isEnabled = false
      })

      await this.redis.connect()
    } catch (error) {
      logger.error('Failed to initialize Redis cache', error)
      this.isEnabled = false
    }
  }

  private getKey(key: string): string {
    return `${this.config.keyPrefix}${key}`
  }

  private serialize(data: any): string {
    try {
      return JSON.stringify(data)
    } catch (error) {
      logger.error('Failed to serialize cache data', error)
      throw error
    }
  }

  private deserialize(data: string): any {
    try {
      return JSON.parse(data)
    } catch (error) {
      logger.error('Failed to deserialize cache data', error)
      return null
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.isEnabled || !this.redis) {
      return null
    }

    try {
      const cached = await this.redis.get(this.getKey(key))
      if (!cached) return null

      const data = this.deserialize(cached)
      logger.debug('Cache hit', { key })
      return data as T
    } catch (error) {
      logger.error('Cache get error', { key, error })
      return null
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.isEnabled || !this.redis) {
      return false
    }

    try {
      const serialized = this.serialize(value)
      const expiry = ttl || this.config.defaultTTL

      await this.redis.setex(this.getKey(key), expiry, serialized)
      logger.debug('Cache set', { key, ttl: expiry })
      return true
    } catch (error) {
      logger.error('Cache set error', { key, error })
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.redis) {
      return false
    }

    try {
      const result = await this.redis.del(this.getKey(key))
      logger.debug('Cache delete', { key, deleted: result > 0 })
      return result > 0
    } catch (error) {
      logger.error('Cache delete error', { key, error })
      return false
    }
  }

  async flush(): Promise<boolean> {
    if (!this.isEnabled || !this.redis) {
      return false
    }

    try {
      await this.redis.flushall()
      logger.info('Cache flushed')
      return true
    } catch (error) {
      logger.error('Cache flush error', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.redis) {
      return false
    }

    try {
      const result = await this.redis.exists(this.getKey(key))
      return result === 1
    } catch (error) {
      logger.error('Cache exists check error', { key, error })
      return false
    }
  }

  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isEnabled || !this.redis || keys.length === 0) {
      return keys.map(() => null)
    }

    try {
      const prefixedKeys = keys.map(key => this.getKey(key))
      const values = await this.redis.mget(...prefixedKeys)

      return values.map((value, index) => {
        if (!value) return null
        const data = this.deserialize(value)
        logger.debug('Cache multi-get hit', { key: keys[index] })
        return data as T
      })
    } catch (error) {
      logger.error('Cache mget error', { keys, error })
      return keys.map(() => null)
    }
  }

  async mset(keyValuePairs: Record<string, any>, ttl?: number): Promise<boolean> {
    if (!this.isEnabled || !this.redis) {
      return false
    }

    try {
      const pipeline = this.redis.pipeline()
      const expiry = ttl || this.config.defaultTTL

      Object.entries(keyValuePairs).forEach(([key, value]) => {
        const serialized = this.serialize(value)
        pipeline.setex(this.getKey(key), expiry, serialized)
      })

      await pipeline.exec()
      logger.debug('Cache multi-set', { count: Object.keys(keyValuePairs).length, ttl: expiry })
      return true
    } catch (error) {
      logger.error('Cache mset error', { keys: Object.keys(keyValuePairs), error })
      return false
    }
  }

  // Utility method to wrap database queries with caching
  async withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch from source
    const data = await fetcher()

    // Cache the result
    await this.set(key, data, ttl)

    return data
  }

  isAvailable(): boolean {
    return this.isEnabled
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect()
      this.isEnabled = false
      logger.info('Redis disconnected')
    }
  }
}

// Export singleton instance
export const cache = new CacheManager()

// Export cache middleware for API routes
export function withCache(
  keyGenerator: (request: any) => string,
  ttl?: number
) {
  return function<T extends (...args: any[]) => Promise<any>>(target: T): T {
    return (async function(this: any, ...args: any[]) {
      const key = keyGenerator(args[0]) // Assuming first arg is request

      // Try cache first
      const cached = await cache.get(key)
      if (cached) {
        return cached
      }

      // Execute original function
      const result = await target.apply(this, args)

      // Cache result
      await cache.set(key, result, ttl)

      return result
    }) as T
  }
}