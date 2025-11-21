import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createFilingSchema = z.object({
  filingType: z.enum(["VAT", "PAYE", "INCOME_TAX", "CORP_TAX"]),
  period: z.string().min(1, "Period is required"),
  amountDue: z.number().min(0, "Amount must be positive"),
  clientId: z.string().min(1, "Client ID is required"),
  filingDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
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
    const clientId = searchParams.get("clientId")
    const status = searchParams.get("status")
    const filingType = searchParams.get("filingType")

    const skip = (page - 1) * limit

    const where: any = {}
    if (clientId) where.clientId = clientId
    if (status) where.status = status
    if (filingType) where.filingType = filingType

    // Role-based filtering
    if (session.user.role === "CLIENT" && session.user.clientId) {
      where.clientId = session.user.clientId
    }

    const [filings, total] = await Promise.all([
      prisma.taxReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          client: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.taxReturn.count({ where }),
    ])

    return NextResponse.json({
      filings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching filings:", error)
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
    const validatedData = createFilingSchema.parse(body)

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: validatedData.clientId }
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Role-based access control
    if (session.user.role === "CLIENT" && session.user.clientId !== validatedData.clientId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const filing = await prisma.taxReturn.create({
      data: {
        ...validatedData,
        status: "PENDING"
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(filing, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating filing:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}