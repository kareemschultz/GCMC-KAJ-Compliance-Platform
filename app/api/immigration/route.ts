import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createVisaApplicationSchema = z.object({
  clientId: z.string(),
  applicantName: z.string().min(1),
  permitType: z.enum(["WORK_PERMIT", "BUSINESS_VISA", "CITIZENSHIP", "RESIDENCE_PERMIT"]),
  expiryDate: z.string(),
  status: z.enum([
    "APPLICATION_SUBMITTED",
    "DOCUMENTS_PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "EXPIRED"
  ]).optional(),
  notes: z.string().optional(),
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

    const [applications, total] = await Promise.all([
      prisma.visaApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expiryDate: "asc" }, // Show expiring soon first
        select: {
          id: true,
          applicantName: true,
          permitType: true,
          expiryDate: true,
          status: true,
          clientId: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.visaApplication.count({ where }),
    ])

    // Add expiry warnings
    const applicationsWithWarnings = applications.map(app => {
      const expiryDate = new Date(app.expiryDate)
      const today = new Date()
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      return {
        ...app,
        daysUntilExpiry,
        expiryWarning: daysUntilExpiry <= 30 ? 'EXPIRING_SOON' :
                      daysUntilExpiry <= 0 ? 'EXPIRED' :
                      daysUntilExpiry <= 90 ? 'WARNING' : 'OK'
      }
    })

    return NextResponse.json({
      applications: applicationsWithWarnings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching visa applications:", error)
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
    const validatedData = createVisaApplicationSchema.parse(body)

    const visaApplication = await prisma.visaApplication.create({
      data: {
        clientId: validatedData.clientId,
        applicantName: validatedData.applicantName,
        permitType: validatedData.permitType,
        expiryDate: new Date(validatedData.expiryDate),
        status: validatedData.status || "APPLICATION_SUBMITTED",
      },
      select: {
        id: true,
        applicantName: true,
        permitType: true,
        expiryDate: true,
        status: true,
        clientId: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(visaApplication, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating visa application:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}