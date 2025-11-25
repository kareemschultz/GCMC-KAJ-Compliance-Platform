import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { TaxCalculator } from "@/lib/calculations/tax-calculator"

const createTaxReturnSchema = z.object({
  clientId: z.string(),
  filingType: z.enum(["VAT_RETURN", "INCOME_TAX", "CORPORATE_TAX", "PAYE", "WITHHOLDING_TAX"]),
  period: z.string(),
  dueDate: z.string(),
  grossIncome: z.number().min(0),
  deductions: z.number().min(0).optional(),
  status: z.enum(["DRAFT", "PENDING", "SUBMITTED", "APPROVED", "REJECTED"]).optional(),
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

    const [taxReturns, total] = await Promise.all([
      prisma.taxReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { filingDate: "desc" },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              tinNumber: true,
            }
          }
        }
      }),
      prisma.taxReturn.count({ where }),
    ])

    // Calculate tax amounts for each return
    const taxReturnsWithCalculations = taxReturns.map(taxReturn => {
      let taxCalculation: any = {}

      switch (taxReturn.filingType) {
        case "VAT_RETURN":
          taxCalculation = TaxCalculator.calculateVAT(taxReturn.grossIncome)
          break
        case "INCOME_TAX":
        case "PAYE":
          taxCalculation = TaxCalculator.calculatePAYE(taxReturn.grossIncome, "annual")
          break
        case "CORPORATE_TAX":
          taxCalculation = TaxCalculator.calculateCorporateTax(
            taxReturn.grossIncome,
            false,
            taxReturn.deductions || 0
          )
          break
        case "WITHHOLDING_TAX":
          taxCalculation = TaxCalculator.calculate7BTax(taxReturn.grossIncome, "7B1")
          break
      }

      return {
        ...taxReturn,
        amountDue: taxCalculation.corporateTax ||
                   taxCalculation.payeTax ||
                   taxCalculation.vatAmount ||
                   taxCalculation.withholdingTax ||
                   0,
        taxCalculation
      }
    })

    return NextResponse.json({
      taxReturns: taxReturnsWithCalculations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tax returns:", error)
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
    const validatedData = createTaxReturnSchema.parse(body)

    // Calculate tax based on type
    let amountDue = 0
    let taxDetails = {}

    switch (validatedData.filingType) {
      case "VAT_RETURN":
        const vatCalc = TaxCalculator.calculateVAT(validatedData.grossIncome)
        amountDue = vatCalc.vatAmount
        taxDetails = vatCalc
        break
      case "INCOME_TAX":
      case "PAYE":
        const payeCalc = TaxCalculator.calculatePAYE(validatedData.grossIncome, "annual")
        amountDue = payeCalc.payeTax
        taxDetails = payeCalc
        break
      case "CORPORATE_TAX":
        const corpCalc = TaxCalculator.calculateCorporateTax(
          validatedData.grossIncome,
          false,
          validatedData.deductions || 0
        )
        amountDue = corpCalc.corporateTax
        taxDetails = corpCalc
        break
      case "WITHHOLDING_TAX":
        const whCalc = TaxCalculator.calculate7BTax(validatedData.grossIncome, "7B1")
        amountDue = whCalc.withholdingTax
        taxDetails = whCalc
        break
    }

    const taxReturn = await prisma.taxReturn.create({
      data: {
        clientId: validatedData.clientId,
        filingType: validatedData.filingType,
        period: validatedData.period,
        filingDate: new Date(validatedData.dueDate),
        amountDue,
        status: validatedData.status || "DRAFT",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            tinNumber: true,
          }
        }
      }
    })

    return NextResponse.json({
      ...taxReturn,
      taxCalculation: taxDetails
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating tax return:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}