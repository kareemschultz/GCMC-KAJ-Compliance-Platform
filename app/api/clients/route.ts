import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
        include: {
          _count: {
            select: {
              properties: true,
              employees: true,
              auditCases: true,
              bankServices: true,
              expediteJobs: true
            }
          }
        }
      }),
      prisma.client.count({ where }),
    ])

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createClientSchema.parse(body)

    // Prepare client data with proper field mapping
    const clientData = {
      name: validatedData.name || (validatedData.type === "INDIVIDUAL"
        ? `${validatedData.firstName} ${validatedData.surname}`.trim()
        : ""),
      type: validatedData.type,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address || "",

      // Map flexible ID fields to database fields
      tinNumber: validatedData.tin || validatedData.tinNumber,
      nisNumber: validatedData.nis || validatedData.nisNumber,

      // Store additional fields as metadata or in extended client profile
      ...(validatedData.type === "INDIVIDUAL" && {
        // Individual-specific fields could be stored in a profile table
        firstName: validatedData.firstName,
        surname: validatedData.surname,
        middleName: validatedData.middleName,
        dateOfBirth: validatedData.dateOfBirth,
        placeOfBirth: validatedData.placeOfBirth,
        gender: validatedData.gender,
        primaryIdType: validatedData.primaryIdType,
        primaryIdNumber: validatedData.primaryIdNumber,
        secondaryIdType: validatedData.secondaryIdType,
        secondaryIdNumber: validatedData.secondaryIdNumber,
        isLocalContentQualified: validatedData.isLocalContentQualified,
      }),

      ...(validatedData.type === "COMPANY" && {
        regNumber: validatedData.regNumber,
        vat: validatedData.vat,
      }),
    }

    const client = await prisma.client.create({
      data: clientData,
      include: {
        _count: {
          select: {
            properties: true,
            employees: true,
            auditCases: true,
            bankServices: true,
            expediteJobs: true
          }
        }
      }
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating client:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}