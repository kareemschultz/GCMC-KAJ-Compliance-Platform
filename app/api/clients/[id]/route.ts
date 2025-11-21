import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateClientSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.enum(["INDIVIDUAL", "COMPANY"]).optional(),
  tinNumber: z.string().optional(),
  nisNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(1, "Phone is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true, email: true, fullName: true, role: true }
        },
        employees: true,
        properties: true,
        taxReturns: true,
        nisSchedules: true,
        visas: true,
        legalDocs: true,
        financialStatements: true,
        auditCases: true,
        bankServices: true,
        expediteJobs: true,
      },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateClientSchema.parse(body)

    const client = await prisma.client.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        users: {
          select: { id: true, email: true, fullName: true, role: true }
        }
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating client:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: params.id },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Delete client (cascade will handle related records)
    await prisma.client.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Client deleted successfully" })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}