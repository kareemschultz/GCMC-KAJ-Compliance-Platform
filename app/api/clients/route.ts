import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { withErrorHandler } from "@/lib/middleware/error-handler"
import { withRateLimit, RATE_LIMITS } from "@/lib/middleware/rate-limit"
import { withSecurity, sanitizeInput } from "@/lib/middleware/security"
import { logger } from "@/lib/middleware/logger"

const createClientSchema = z.object({
  // Basic info - flexible based on type
  name: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  surname: z.string().optional(),
  type: z.enum(["INDIVIDUAL", "COMPANY"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().optional(),

  // Flexible identification - at least one should be provided
  tinNumber: z.string().optional(),
  tin: z.string().optional(),
  nisNumber: z.string().optional(),
  nis: z.string().optional(),
  regNumber: z.string().optional(),
  vat: z.string().optional(),

  // Primary/Secondary ID system
  primaryIdType: z.string().optional(),
  primaryIdNumber: z.string().optional(),
  secondaryIdType: z.string().optional(),
  secondaryIdNumber: z.string().optional(),

  // Individual-specific fields
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.string().optional(),
  idIssueDate: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),

  // Flags
  isLocalContentQualified: z.boolean().optional(),
  isLocalAccount: z.boolean().optional(),

  // Services and files
  selectedServices: z.array(z.string()).optional(),
  uploadedFiles: z.record(z.any()).optional(),
}).refine((data) => {
  // For individuals, require first and surname OR name
  if (data.type === "INDIVIDUAL") {
    const hasNames = data.firstName && data.surname;
    const hasName = data.name;
    return hasNames || hasName;
  }
  // For companies, require name
  if (data.type === "COMPANY") {
    return data.name && data.name.length > 0;
  }
  return true;
}, {
  message: "Name information is required",
  path: ["name"]
}).refine((data) => {
  // Require at least one form of identification
  const hasGovId = data.tin || data.nis || data.tinNumber || data.nisNumber || data.regNumber;
  const hasPrimaryId = data.primaryIdNumber && data.primaryIdType;
  return hasGovId || hasPrimaryId;
}, {
  message: "At least one form of identification is required",
  path: ["identification"]
})

const getHandler = withErrorHandler(async (request: NextRequest) => {
  const startTime = Date.now()
  logger.apiRequest('GET', '/api/clients')

  const session = await getServerSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { tinNumber: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          type: true,
          tinNumber: true,
          nisNumber: true,
          email: true,
          phone: true,
          address: true,
          createdAt: true,
        }
      }),
      prisma.client.count({ where }),
    ])

  const duration = Date.now() - startTime
  logger.apiResponse('GET', '/api/clients', 200, duration)

  return NextResponse.json({
    clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})

const postHandler = withErrorHandler(async (request: NextRequest) => {
  const startTime = Date.now()
  logger.apiRequest('POST', '/api/clients')

  const session = await getServerSession()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const body = await request.json()
  const sanitizedBody = sanitizeInput(body)
  const validatedData = createClientSchema.parse(sanitizedBody)

    // Prepare client data with only fields that exist in the schema
    const clientData = {
      name: validatedData.name || (validatedData.type === "INDIVIDUAL"
        ? `${validatedData.firstName || ''} ${validatedData.surname || ''}`.trim()
        : ""),
      type: validatedData.type,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address || "",

      // Map flexible ID fields to database fields
      tinNumber: validatedData.tin || validatedData.tinNumber || null,
      nisNumber: validatedData.nis || validatedData.nisNumber || null,
    }

    const client = await prisma.client.create({
      data: clientData,
      select: {
        id: true,
        name: true,
        type: true,
        tinNumber: true,
        nisNumber: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      }
    })

  const duration = Date.now() - startTime
  logger.apiResponse('POST', '/api/clients', 201, duration)
  logger.info('Client created successfully', { clientId: client.id, name: client.name })

  return NextResponse.json(client, { status: 201 })
})

// Apply middleware
export const GET = withSecurity({
  requireAuth: true,
  allowedMethods: ['GET'],
  enableCORS: true
})(withRateLimit(RATE_LIMITS.MODERATE)(getHandler))

export const POST = withSecurity({
  requireAuth: true,
  allowedMethods: ['POST'],
  enableCORS: true
})(withRateLimit(RATE_LIMITS.STRICT)(postHandler))