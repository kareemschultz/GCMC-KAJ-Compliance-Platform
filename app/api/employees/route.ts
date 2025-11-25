import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { TaxCalculator } from "@/lib/calculations/tax-calculator"

const createEmployeeSchema = z.object({
  clientId: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  nisNumber: z.string().min(1),
  tinNumber: z.string().optional(),
  position: z.string().min(1),
  department: z.string().min(1),
  salary: z.number().min(0),
  hireDate: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
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
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (clientId) where.clientId = clientId
    if (status) where.status = status

    const skip = (page - 1) * limit

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: "asc" },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }),
      prisma.employee.count({ where }),
    ])

    // Calculate tax deductions for each employee
    const employeesWithTax = employees.map(emp => {
      const taxCalc = TaxCalculator.calculateEmployeeTaxes(Number(emp.salary), "monthly")
      return {
        ...emp,
        taxDeductions: taxCalc,
        netSalary: taxCalc.netTakeHome
      }
    })

    return NextResponse.json({
      employees: employeesWithTax,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching employees:", error)
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
    const validatedData = createEmployeeSchema.parse(body)

    const employee = await prisma.employee.create({
      data: {
        clientId: validatedData.clientId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        nisNumber: validatedData.nisNumber,
        tinNumber: validatedData.tinNumber,
        position: validatedData.position,
        department: validatedData.department,
        salary: validatedData.salary,
        hireDate: new Date(validatedData.hireDate),
        status: validatedData.status || "ACTIVE",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Calculate tax deductions
    const taxCalc = TaxCalculator.calculateEmployeeTaxes(Number(employee.salary), "monthly")

    return NextResponse.json({
      ...employee,
      taxDeductions: taxCalc,
      netSalary: taxCalc.netTakeHome
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}