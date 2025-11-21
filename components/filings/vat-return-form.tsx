"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, Printer } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function VATReturnForm() {
  const [standardSales, setStandardSales] = useState<string>("")
  const [zeroRateSales, setZeroRateSales] = useState<string>("")
  const [exemptSales, setExemptSales] = useState<string>("")
  const [purchases, setPurchases] = useState<string>("")
  const [adjustments, setAdjustments] = useState<string>("")
  const [penalties, setPenalties] = useState<string>("")

  const [outputVAT, setOutputVAT] = useState<number>(0)
  const [inputVAT, setInputVAT] = useState<number>(0)
  const [totalSales, setTotalSales] = useState<number>(0)
  const [netVAT, setNetVAT] = useState<number>(0)
  const [totalDue, setTotalDue] = useState<number>(0)

  // Auto-calculate on input change
  useEffect(() => {
    const standard = Number.parseFloat(standardSales) || 0
    const zero = Number.parseFloat(zeroRateSales) || 0
    const exempt = Number.parseFloat(exemptSales) || 0
    const purch = Number.parseFloat(purchases) || 0
    const adj = Number.parseFloat(adjustments) || 0
    const pen = Number.parseFloat(penalties) || 0

    // Calculate Output VAT (14% of standard rate sales)
    const calcOutputVAT = standard * 0.14

    // Calculate Input VAT (14/114 of purchases)
    const calcInputVAT = (purch * 14) / 114

    // Calculate Total Sales
    const calcTotalSales = standard + zero + exempt

    // Calculate Net VAT
    const calcNetVAT = calcOutputVAT - calcInputVAT

    const calcTotalDue = calcNetVAT + adj + pen

    setOutputVAT(calcOutputVAT)
    setInputVAT(calcInputVAT)
    setTotalSales(calcTotalSales)
    setNetVAT(calcNetVAT)
    setTotalDue(calcTotalDue)
  }, [standardSales, zeroRateSales, exemptSales, purchases, adjustments, penalties])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GY", {
      style: "currency",
      currency: "GYD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="grid gap-6 print:block print:space-y-6">
      <style jsx global>{`
        @media print {
          header, aside, nav, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Form Header */}
      <Card className="print:border-none print:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Section 1: Taxpayer Information</CardTitle>
            <CardDescription>Client and filing period details</CardDescription>
          </div>
          <Button variant="outline" onClick={handlePrint} className="no-print bg-transparent">
            <Printer className="mr-2 h-4 w-4" /> Print Return
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select defaultValue="abc-corp">
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abc-corp">ABC Corporation Ltd</SelectItem>
                <SelectItem value="tech-solutions">Guyana Tech Solutions</SelectItem>
                <SelectItem value="georgetown">Georgetown Retailers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tin">TIN Number</Label>
            <Input id="tin" value="123-456-789" disabled className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Filing Period</Label>
            <Select defaultValue="q4-2024">
              <SelectTrigger id="period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q4-2024">Q4 2024 (Oct-Dec)</SelectItem>
                <SelectItem value="q3-2024">Q3 2024 (Jul-Sep)</SelectItem>
                <SelectItem value="q2-2024">Q2 2024 (Apr-Jun)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input id="due-date" value="January 21, 2025" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Sales/Output Section */}
      <Card className="print:break-inside-avoid print:border-none print:shadow-none">
        <CardHeader>
          <CardTitle>Section 2: Sales / Output</CardTitle>
          <CardDescription>Enter your sales figures for the period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="standard-sales">Row 1: Standard Rate Sales (14%)</Label>
              <Input
                id="standard-sales"
                type="number"
                placeholder="0.00"
                value={standardSales}
                onChange={(e) => setStandardSales(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Output VAT (Auto-calculated)</Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono font-medium">
                {formatCurrency(outputVAT)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="zero-rate-sales">Row 2: Zero Rate Sales</Label>
              <Input
                id="zero-rate-sales"
                type="number"
                placeholder="0.00"
                value={zeroRateSales}
                onChange={(e) => setZeroRateSales(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exempt-sales">Row 3: Exempt Sales</Label>
              <Input
                id="exempt-sales"
                type="number"
                placeholder="0.00"
                value={exemptSales}
                onChange={(e) => setExemptSales(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-semibold">Row 4: Total Sales</Label>
              <div className="flex h-10 items-center rounded-md border-2 border-primary bg-primary/5 px-3 py-2 text-sm font-mono font-bold">
                {formatCurrency(totalSales)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-primary">Row 5: Output VAT</Label>
              <div className="flex h-10 items-center rounded-md border-2 border-primary bg-primary/10 px-3 py-2 text-sm font-mono font-bold text-primary">
                {formatCurrency(outputVAT)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases/Input Section */}
      <Card className="print:break-inside-avoid print:border-none print:shadow-none">
        <CardHeader>
          <CardTitle>Section 3: Purchases / Input</CardTitle>
          <CardDescription>Enter your purchase figures for the period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchases">Row 6: Purchases (VAT Inclusive)</Label>
              <Input
                id="purchases"
                type="number"
                placeholder="0.00"
                value={purchases}
                onChange={(e) => setPurchases(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-primary">Row 7: Input VAT (Auto-calculated)</Label>
              <div className="flex h-10 items-center rounded-md border-2 border-primary bg-primary/10 px-3 py-2 text-sm font-mono font-bold text-primary">
                {formatCurrency(inputVAT)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Calculation Section */}
      <Card className="border-2 print:break-inside-avoid print:border-black">
        <CardHeader>
          <CardTitle>Section 4: Tax Calculation</CardTitle>
          <CardDescription>Final VAT calculation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <span className="font-medium">Row 8: Output VAT</span>
              <span className="font-mono font-bold">{formatCurrency(outputVAT)}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <span className="font-medium">Row 9: Less Input VAT</span>
              <span className="font-mono font-bold">({formatCurrency(inputVAT)})</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adjustments">Row 10: Adjustments (+/-)</Label>
                <Input
                  id="adjustments"
                  type="number"
                  placeholder="0.00"
                  value={adjustments}
                  onChange={(e) => setAdjustments(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penalties">Row 11: Penalties & Interest</Label>
                <Input
                  id="penalties"
                  type="number"
                  placeholder="0.00"
                  value={penalties}
                  onChange={(e) => setPenalties(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <Separator className="my-2" />

            <div
              className={`flex items-center justify-between p-6 rounded-lg border-2 ${
                totalDue > 0
                  ? "bg-red-50 border-red-200 dark:bg-red-950/20"
                  : "bg-green-50 border-green-200 dark:bg-green-950/20"
              }`}
            >
              <div>
                <div className="text-sm font-medium text-muted-foreground">Row 12: Total Tax Due</div>
                <div
                  className={`text-2xl font-bold ${totalDue > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {totalDue > 0 ? "Payable" : "Refundable"}
                </div>
              </div>
              <div
                className={`text-3xl font-bold font-mono ${totalDue > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
              >
                {formatCurrency(Math.abs(totalDue))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 no-print">
            <Button variant="outline" size="lg">
              <Calculator className="mr-2 h-4 w-4" /> Recalculate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
