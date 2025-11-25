import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { logger } from "./logger"

export interface SecurityHeaders {
  'Content-Security-Policy'?: string
  'X-Frame-Options'?: string
  'X-Content-Type-Options'?: string
  'Referrer-Policy'?: string
  'Permissions-Policy'?: string
  'Strict-Transport-Security'?: string
  'X-XSS-Protection'?: string
}

const DEFAULT_SECURITY_HEADERS: SecurityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', '),
  'X-XSS-Protection': '1; mode=block'
}

// Add HSTS for production
if (process.env.NODE_ENV === 'production') {
  DEFAULT_SECURITY_HEADERS['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(DEFAULT_SECURITY_HEADERS).forEach(([header, value]) => {
    if (value) {
      response.headers.set(header, value)
    }
  })
  return response
}

// Input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potential XSS vectors
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }

  if (input && typeof input === 'object') {
    const sanitized: any = {}
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeInput(input[key])
    })
    return sanitized
  }

  return input
}

// CORS configuration
export function configureCORS(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*')
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

  return response
}

// Authentication middleware
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const session = await getServerSession()

  if (!session?.user) {
    logger.warn('Unauthorized access attempt', {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    })

    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Authentication required",
        timestamp: new Date().toISOString()
      },
      { status: 401 }
    )
  }

  return null
}

// Role-based access control
export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<NextResponse | null> {
  const authError = await requireAuth(request)
  if (authError) return authError

  const session = await getServerSession()
  const userRole = session?.user?.role

  if (!userRole || !allowedRoles.includes(userRole)) {
    logger.warn('Forbidden access attempt', {
      url: request.url,
      method: request.method,
      userRole,
      allowedRoles,
      userId: session?.user?.id
    })

    return NextResponse.json(
      {
        error: "Forbidden",
        message: "Insufficient permissions",
        timestamp: new Date().toISOString()
      },
      { status: 403 }
    )
  }

  return null
}

// Request validation
export function validateRequestMethod(request: NextRequest, allowedMethods: string[]): NextResponse | null {
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      {
        error: "Method not allowed",
        allowed: allowedMethods,
        timestamp: new Date().toISOString()
      },
      { status: 405 }
    )
  }
  return null
}

// Security middleware composer
export function withSecurity(options: {
  requireAuth?: boolean
  allowedRoles?: string[]
  allowedMethods?: string[]
  customHeaders?: SecurityHeaders
  enableCORS?: boolean
} = {}) {
  return function(handler: (request: NextRequest, params?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, params?: any): Promise<NextResponse> => {
      // Handle OPTIONS requests for CORS
      if (request.method === 'OPTIONS' && options.enableCORS) {
        let response = new NextResponse(null, { status: 200 })
        response = configureCORS(response, request.headers.get('origin') || undefined)
        response = addSecurityHeaders(response)
        return response
      }

      // Method validation
      if (options.allowedMethods) {
        const methodError = validateRequestMethod(request, options.allowedMethods)
        if (methodError) return addSecurityHeaders(methodError)
      }

      // Authentication check
      if (options.requireAuth) {
        const authError = await requireAuth(request)
        if (authError) return addSecurityHeaders(authError)
      }

      // Role-based access control
      if (options.allowedRoles) {
        const roleError = await requireRole(request, options.allowedRoles)
        if (roleError) return addSecurityHeaders(roleError)
      }

      // Execute handler
      let response = await handler(request, params)

      // Add security headers
      response = addSecurityHeaders(response)

      // Add CORS headers if enabled
      if (options.enableCORS) {
        response = configureCORS(response, request.headers.get('origin') || undefined)
      }

      // Add custom headers
      if (options.customHeaders) {
        Object.entries(options.customHeaders).forEach(([header, value]) => {
          if (value) {
            response.headers.set(header, value)
          }
        })
      }

      return response
    }
  }
}