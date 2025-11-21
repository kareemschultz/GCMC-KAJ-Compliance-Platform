"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calculator, Download, RefreshCw } from "lucide-react"

export function PayrollCalculator() {
  const [grossSalary, setGrossSalary] = useState<number>(0)
  const [allowances, setAllowances] = useState<number>(0)
  const [results, setResults] = useState({
    grossTotal: 0,
    nisEmployee: 0,
    nisEmployer: 0,
    paye: 0,
    netSalary: 0,
    totalRemittance: 0,
  })

  const calculatePayroll = () => {
    const totalGross = grossSalary + allowances

    // NIS Calculations (Guyana)
    // Employee: 5.6% of Gross Salary (Insurable Earnings Ceiling applies, simplified here)
    // Employer: 8.4% of Gross Salary
    const nisEmployee = grossSalary * 0.056
    const nisEmployer = grossSalary * 0.084

    // PAYE Calculations (Guyana)
    // Statutory Deduction: $85,000/month or 1/3 of Gross, whichever is higher
    // Tax Rate: 28% on taxable income up to a limit, 40% above (Simplified to 28% for this demo)
    const statutoryDeduction = Math.max(85000, totalGross / 3)
    const taxableIncome = Math.max(0, totalGross - statutoryDeduction - nisEmployee)
    const paye = taxableIncome * 0.28

    const netSalary = totalGross - nisEmployee - paye
    const totalRemittance = nisEmployee + nisEmployer + paye

    setResults({
      grossTotal: totalGross,
      nisEmployee,
      nisEmployer,
      paye,
      netSalary,
      totalRemittance,
    })
  }

  useEffect(() => {
    calculatePayroll()
  }, [grossSalary, allowances])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Salary Input
          </CardTitle>
          <CardDescription>Enter monthly earnings to calculate deductions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gross-salary">Basic Salary (GYD)</Label>
            <Input
              id="gross-salary"
              type="number"
              placeholder="e.g. 150000"
              value={grossSalary || ""}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowances">Taxable Allowances (GYD)</Label>
            <Input
              id="allowances"
              type="number"
              placeholder="e.g. 20000"
              value={allowances || ""}
              onChange={(e) => setAllowances(Number(e.target.value))}
            />
          </div>
          <div className="pt-4">
            <Button className="w-full" onClick={calculatePayroll}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Calculation Results</CardTitle>
          <CardDescription>Estimated breakdown for the current month.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross Total:</span>
              <span className="font-medium">{results.grossTotal.toLocaleString()} GYD</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NIS (Employee 5.6%):</span>
              <span className="text-red-500">-{results.nisEmployee.toLocaleString()} GYD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">PAYE (Income Tax):</span>
              <span className="text-red-500">-{results.paye.toLocaleString()} GYD</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Net Salary:</span>
              <span className="text-green-600">{results.netSalary.toLocaleString()} GYD</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-background p-4">
            <h4 className="mb-2 text-sm font-semibold">Employer Costs</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">NIS (Employer 8.4%):</span>
              <span>{results.nisEmployer.toLocaleString()} GYD</span>
            </div>
            <div className="mt-2 flex justify-between text-sm font-medium">
              <span>Total Remittance to GRA/NIS:</span>
              <span>{results.totalRemittance.toLocaleString()} GYD</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Payslip
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
