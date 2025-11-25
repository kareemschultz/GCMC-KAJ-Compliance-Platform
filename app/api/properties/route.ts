import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPropertySchema = z.object({
  clientId: z.string(),
  address: z.string().min(1),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "MIXED_USE"]),
  status: z.enum(["VACANT", "OCCUPIED", "MAINTENANCE"]).optional(),
  monthlyRent: z.number().min(0),
  managementFee: z.number().min(0),
  tenantName: z.string().optional(),
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (clientId) where.clientId = clientId
    if (status) where.status = status

    const skip = (page - 1) * limit

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { address: "asc" },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.property.count({ where }),
    ])

    // Calculate lease status for each property
    const propertiesWithStatus = properties.map(property => {
      let leaseStatus = 'N/A'
      if (property.leaseEndDate) {
        const endDate = new Date(property.leaseEndDate)
        const today = new Date()
        const daysUntilExpiry = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilExpiry < 0) {
          leaseStatus = 'EXPIRED'
        } else if (daysUntilExpiry <= 30) {
          leaseStatus = 'EXPIRING_SOON'
        } else {
          leaseStatus = 'ACTIVE'
        }
      }

      return {
        ...property,
        leaseStatus,
        daysUntilExpiry: property.leaseEndDate
          ? Math.floor((new Date(property.leaseEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null
      }
    })

    return NextResponse.json({
      properties: propertiesWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching properties:", error)
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
    const validatedData = createPropertySchema.parse(body)

    const property = await prisma.property.create({
      data: {
        clientId: validatedData.clientId,
        address: validatedData.address,
        type: validatedData.type,
        status: validatedData.status || "VACANT",
        monthlyRent: validatedData.monthlyRent,
        managementFee: validatedData.managementFee,
        tenantName: validatedData.tenantName,
        leaseStartDate: validatedData.leaseStartDate ? new Date(validatedData.leaseStartDate) : null,
        leaseEndDate: validatedData.leaseEndDate ? new Date(validatedData.leaseEndDate) : null,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating property:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}