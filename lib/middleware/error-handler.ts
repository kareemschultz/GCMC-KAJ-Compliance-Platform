import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { logger } from "./logger"

export interface ApiError {
  message: string
  statusCode: number
  code?: string
  details?: any
}

export class AppError extends Error implements ApiError {
  public statusCode: number
  public code?: string
  public details?: any

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleApiError(error: any, request: NextRequest): NextResponse {
  const requestId = crypto.randomUUID()
  const url = request.url
  const method = request.method

  logger.error('API Error', {
    requestId,
    url,
    method,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code }),
      ...(error.statusCode && { statusCode: error.statusCode })
    }
  })

  // Handle different error types
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.errors,
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    )
  }

  // Database errors
  if (error.code === 'P2002') { // Prisma unique constraint error
    return NextResponse.json(
      {
        error: "Resource already exists",
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 409 }
    )
  }

  if (error.code === 'P2025') { // Prisma record not found error
    return NextResponse.json(
      {
        error: "Resource not found",
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 404 }
    )
  }

  // Generic server error
  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production'
        ? "Internal server error"
        : error.message,
      requestId,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  )
}

export function withErrorHandler(
  handler: (request: NextRequest, params?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      return await handler(request, params)
    } catch (error) {
      return handleApiError(error, request)
    }
  }
}