import { NextRequest, NextResponse } from "next/server"
import { logger } from "./logger"

interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string
  onRateLimitReached?: (request: NextRequest) => void
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  private getClientKey(request: NextRequest, keyGenerator?: (req: NextRequest) => string): string {
    if (keyGenerator) {
      return keyGenerator(request)
    }

    // Try to get client IP
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'

    return `${ip}:${request.nextUrl.pathname}`
  }

  public async checkLimit(request: NextRequest, config: RateLimitConfig): Promise<boolean> {
    const key = this.getClientKey(request, config.keyGenerator)
    const now = Date.now()

    // Initialize or get existing entry
    let entry = this.store[key]

    if (!entry || entry.resetTime < now) {
      // Create new entry
      entry = {
        count: 1,
        resetTime: now + config.windowMs
      }
      this.store[key] = entry
      return true
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      logger.warn('Rate limit exceeded', {
        key,
        count: entry.count,
        maxRequests: config.maxRequests,
        windowMs: config.windowMs
      })

      if (config.onRateLimitReached) {
        config.onRateLimitReached(request)
      }

      return false
    }

    // Increment counter
    entry.count++
    return true
  }

  public getRemainingRequests(request: NextRequest, config: RateLimitConfig): number {
    const key = this.getClientKey(request, config.keyGenerator)
    const entry = this.store[key]

    if (!entry || entry.resetTime < Date.now()) {
      return config.maxRequests
    }

    return Math.max(0, config.maxRequests - entry.count)
  }

  public getResetTime(request: NextRequest, config: RateLimitConfig): number {
    const key = this.getClientKey(request, config.keyGenerator)
    const entry = this.store[key]

    return entry?.resetTime || Date.now() + config.windowMs
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

// Predefined rate limit configurations
export const RATE_LIMITS = {
  STRICT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  MODERATE: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 300
  },
  LENIENT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5 // Very strict for auth endpoints
  },
  FILE_UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  }
} as const

export function withRateLimit(config: RateLimitConfig) {
  return function(handler: (request: NextRequest, params?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, params?: any): Promise<NextResponse> => {
      const isAllowed = await rateLimiter.checkLimit(request, config)

      if (!isAllowed) {
        const resetTime = rateLimiter.getResetTime(request, config)
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)

        return NextResponse.json(
          {
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
            retryAfter: retryAfter,
            timestamp: new Date().toISOString()
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': resetTime.toString()
            }
          }
        )
      }

      // Add rate limit headers to response
      const response = await handler(request, params)
      const remaining = rateLimiter.getRemainingRequests(request, config)
      const resetTime = rateLimiter.getResetTime(request, config)

      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', resetTime.toString())

      return response
    }
  }
}

export { rateLimiter }