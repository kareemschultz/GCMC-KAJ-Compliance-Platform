import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { TaxCalculator } from "@/lib/calculations/tax-calculator"

const createNISScheduleSchema = z.object({
  clientId: z.string(),
  month: z.string(),
  totalWages: z.number().min(0),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (clientId) where.clientId = clientId

    const skip = (page - 1) * limit

    const [nisSchedules, total] = await Promise.all([
      prisma.nISSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: { month: "desc" },
        select: {
          id: true,
          month: true,
          totalWages: true,
          employeeDed: true,
          employerCont: true,
          totalRemit: true,
          status: true,
          clientId: true,
          client: {
            select: {
              id: true,
              name: true,
              nisNumber: true,
            }
          }
        }
      }),
      prisma.nISSchedule.count({ where }),
    ])

    return NextResponse.json({
      nisSchedules,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching NIS schedules:", error)
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
    const validatedData = createNISScheduleSchema.parse(body)

    // Calculate NIS contributions using the tax calculator
    const nisCalculation = TaxCalculator.calculateNIS(validatedData.totalWages, "monthly")

    const nisSchedule = await prisma.nISSchedule.create({
      data: {
        clientId: validatedData.clientId,
        month: validatedData.month,
        totalWages: validatedData.totalWages,
        employeeDed: nisCalculation.employeeContribution,
        employerCont: nisCalculation.employerContribution,
        totalRemit: nisCalculation.totalContribution,
        status: "DRAFT",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            nisNumber: true,
          }
        }
      }
    })

    return NextResponse.json({
      ...nisSchedule,
      calculation: nisCalculation
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating NIS schedule:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

