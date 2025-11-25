import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPartnerSchema = z.object({
  companyName: z.string().min(1),
  category: z.enum([
    "REAL_ESTATE",
    "IT_TECHNICIAN",
    "LAW_FIRM",
    "ACCOUNTING",
    "INSURANCE",
    "BANKING",
    "LOGISTICS",
    "CONSTRUCTION",
    "CONSULTING",
    "OTHER"
  ]),
  contactPerson: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  website: z.string().url().optional().nullable(),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (category) where.category = category
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const skip = (page - 1) * limit

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { companyName: "asc" },
      }),
      prisma.partner.count({ where }),
    ])

    return NextResponse.json({
      partners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching partners:", error)
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
    const validatedData = createPartnerSchema.parse(body)

    const partner = await prisma.partner.create({
      data: validatedData,
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating partner:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}