import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { TaxCalculator } from "@/lib/calculations/tax-calculator"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { wages, period = "monthly" } = body

    if (!wages || wages < 0) {
      return NextResponse.json(
        { error: "Invalid wages amount" },
        { status: 400 }
      )
    }

    const calculation = TaxCalculator.calculateNIS(wages, period as "monthly" | "weekly")

    return NextResponse.json(calculation)
  } catch (error) {
    console.error("Error calculating NIS:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}