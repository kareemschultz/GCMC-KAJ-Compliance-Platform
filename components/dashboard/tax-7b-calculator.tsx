"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, RefreshCw, FileText } from "lucide-react"

export function Tax7BCalculator() {
  const [grossIncome, setGrossIncome] = useState<number>(0)
  const [nonTaxableAllowances, setNonTaxableAllowances] = useState<number>(0)
  const [results, setResults] = useState({
    totalIncome: 0,
    nisDeduction: 0,
    statutoryFreePay: 0,
    taxableIncome: 0,
    incomeTax: 0,
    netPay: 0,
  })

  const calculateTax7B = () => {
    // Logic based on GRA Form 7B requirements
    const totalIncome = grossIncome + nonTaxableAllowances

    // NIS Deduction: 5.6% of Gross Income (Capped at ceiling, but using flat rate for estimation)
    // Note: In reality, NIS is calculated on Insurable Earnings, which has a monthly ceiling.
    // For this calculator, we'll assume 5.6% of Gross Income as a baseline estimate.
    const nisDeduction = grossIncome * 0.056

    // Statutory Free Pay (2024/2025): $100,000/month or 1/3 of Gross Income, whichever is higher
    // Note: The threshold changes periodically. Using $100,000 as the current standard base.
    const statutoryFreePay = Math.max(100000, totalIncome / 3)

    // Taxable Income = Total Income - (NIS + Free Pay)
    // Ensure it doesn't go below zero
    const taxableIncome = Math.max(0, totalIncome - (nisDeduction + statutoryFreePay))

    // Income Tax: 28% on Taxable Income
    // Note: There is a 40% bracket for higher earners, but 28% covers the vast majority.
    // We'll stick to the standard 28% for this "Estimated Liability" tool.
    const incomeTax = taxableIncome * 0.28

    const netPay = totalIncome - nisDeduction - incomeTax

    setResults({
      totalIncome,
      nisDeduction,
      statutoryFreePay,
      taxableIncome,
      incomeTax,
      netPay,
    })
  }

  useEffect(() => {
    calculateTax7B()
  }, [grossIncome, nonTaxableAllowances])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            GRA Form 7B Estimator
          </CardTitle>
          <CardDescription>Calculate estimated Income Tax liability based on GRA rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gross-income">Gross Salary / Wages (GYD)</Label>
            <Input
              id="gross-income"
              type="number"
              placeholder="e.g. 200000"
              value={grossIncome || ""}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowances">Non-Taxable Allowances (GYD)</Label>
            <Input
              id="allowances"
              type="number"
              placeholder="e.g. Travel, Uniform (25000)"
              value={nonTaxableAllowances || ""}
              onChange={(e) => setNonTaxableAllowances(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Includes Travel, Uniform, and other exempt allowances.</p>
          </div>
          <div className="pt-4">
            <Button className="w-full" onClick={calculateTax7B}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Calculation
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle>Estimated Liability (7B)</CardTitle>
          <CardDescription>Breakdown for your tax return.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Income:</span>
              <span className="font-medium">{results.totalIncome.toLocaleString()} GYD</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Less: NIS Deduction (5.6%):</span>
              <span className="text-red-600">-{results.nisDeduction.toLocaleString()} GYD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Less: Statutory Free Pay:</span>
              <span className="text-green-600">-{results.statutoryFreePay.toLocaleString()} GYD</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-medium">
              <span>Chargeable (Taxable) Income:</span>
              <span>{results.taxableIncome.toLocaleString()} GYD</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 p-3 bg-white rounded border">
              <span>Income Tax (PAYE):</span>
              <span className="text-red-600">{results.incomeTax.toLocaleString()} GYD</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Est. Net Pay:</span>
              <span className="font-medium text-slate-900">{results.netPay.toLocaleString()} GYD</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full bg-white hover:bg-slate-100">
            <Download className="mr-2 h-4 w-4" />
            Generate 7B Form (PDF)
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
