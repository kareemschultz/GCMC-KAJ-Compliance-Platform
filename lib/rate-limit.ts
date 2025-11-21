import { NextRequest } from "next/server"

interface RateLimitOptions {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Maximum number of requests per window
}

class RateLimit {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(private options: RateLimitOptions) {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, data] of this.requests.entries()) {
      if (data.resetTime < now) {
        this.requests.delete(key)
      }
    }
  }

  private getKey(request: NextRequest): string {
    // Use IP address as the key
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown"
    return ip
  }

  isAllowed(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    const key = this.getKey(request)
    const now = Date.now()
    const resetTime = now + this.options.windowMs

    const existing = this.requests.get(key)

    if (!existing || existing.resetTime < now) {
      // First request or window has expired
      this.requests.set(key, { count: 1, resetTime })
      return {
        allowed: true,
        remaining: this.options.maxRequests - 1,
        resetTime
      }
    }

    if (existing.count >= this.options.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime
      }
    }

    // Increment count
    existing.count++
    this.requests.set(key, existing)

    return {
      allowed: true,
      remaining: this.options.maxRequests - existing.count,
      resetTime: existing.resetTime
    }
  }
}

// Different rate limits for different endpoints
export const authRateLimit = new RateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }) // 5 auth attempts per 15 minutes
export const apiRateLimit = new RateLimit({ windowMs: 60 * 1000, maxRequests: 100 }) // 100 API requests per minute
export const generalRateLimit = new RateLimit({ windowMs: 60 * 1000, maxRequests: 200 }) // 200 general requests per minute

export function checkRateLimit(request: NextRequest, limiter: RateLimit) {
  const result = limiter.isAllowed(request)

  if (!result.allowed) {
    throw new Error(`Rate limit exceeded. Try again after ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`)
  }

  return result
}