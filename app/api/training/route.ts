import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createTrainingSessionSchema = z.object({
  title: z.string().min(1),
  date: z.string(),
  capacity: z.number().min(1),
  price: z.number().min(0),
})

const registerAttendeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get("upcoming") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (upcoming) {
      where.date = {
        gte: new Date()
      }
    }

    const skip = (page - 1) * limit

    const [sessions, total] = await Promise.all([
      prisma.trainingSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: upcoming ? "asc" : "desc" },
        select: {
          id: true,
          title: true,
          date: true,
          capacity: true,
          price: true,
          _count: {
            select: {
              attendees: true
            }
          }
        }
      }),
      prisma.trainingSession.count({ where }),
    ])

    // Calculate available spots and status
    const sessionsWithStatus = sessions.map(session => {
      const registeredCount = session._count.attendees
      const availableSpots = session.capacity - registeredCount
      const isFull = availableSpots <= 0
      const isUpcoming = new Date(session.date) > new Date()

      return {
        ...session,
        registeredCount,
        availableSpots,
        isFull,
        isUpcoming,
        status: isFull ? 'FULL' :
               !isUpcoming ? 'COMPLETED' :
               availableSpots <= 5 ? 'ALMOST_FULL' : 'OPEN'
      }
    })

    return NextResponse.json({
      sessions: sessionsWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching training sessions:", error)
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
    const validatedData = createTrainingSessionSchema.parse(body)

    const trainingSession = await prisma.trainingSession.create({
      data: {
        title: validatedData.title,
        date: new Date(validatedData.date),
        capacity: validatedData.capacity,
        price: validatedData.price,
      },
      select: {
        id: true,
        title: true,
        date: true,
        capacity: true,
        price: true,
        _count: {
          select: {
            attendees: true
          }
        }
      }
    })

    return NextResponse.json(trainingSession, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating training session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}