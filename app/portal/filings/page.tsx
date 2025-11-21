"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Search, Filter } from "lucide-react"

const formatDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const getPeriod = (monthsAgo: number) => {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function PortalFilingsPage() {
  const filings = [
    {
      name: `VAT Return - ${getPeriod(1)}`,
      type: "VAT",
      date: formatDate(6),
      status: "Submitted",
      amount: "$45,200",
    },
    {
      name: `NIS Schedule - ${getPeriod(1)}`,
      type: "NIS",
      date: formatDate(11),
      status: "Submitted",
      amount: "$12,500",
    },
    {
      name: `PAYE Return - ${getPeriod(1)}`,
      type: "PAYE",
      date: formatDate(6),
      status: "Processing",
      amount: "$8,900",
    },
    {
      name: `VAT Return - ${getPeriod(2)}`,
      type: "VAT",
      date: formatDate(37),
      status: "Approved",
      amount: "$42,100",
    },
    {
      name: `NIS Schedule - ${getPeriod(2)}`,
      type: "NIS",
      date: formatDate(42),
      status: "Approved",
      amount: "$12,500",
    },
    {
      name: "Quarterly Tax Estimate",
      type: "CIT",
      date: formatDate(52),
      status: "Approved",
      amount: "$150,000",
    },
  ]

  const handleDownload = (filingName: string) => {
    const blob = new Blob([`${filingName} - Filing Document`], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filingName.toLowerCase().replace(/\s+/g, "-")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Filings</h1>
          <p className="text-muted-foreground">View and download your tax and compliance submissions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button>Request Filing</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search filings..." className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="vat">VAT Returns</SelectItem>
            <SelectItem value="nis">NIS Schedules</SelectItem>
            <SelectItem value="paye">PAYE Returns</SelectItem>
            <SelectItem value="cit">Corp. Tax</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="2023">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filing History</CardTitle>
          <CardDescription>A complete record of your submissions to GRA and NIS.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filings.map((filing, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{filing.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{filing.date}</span>
                      <span>•</span>
                      <span>{filing.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-medium">{filing.amount}</p>
                    <Badge
                      variant={
                        filing.status === "Approved"
                          ? "default" // Using default (primary color) for Approved/Success
                          : filing.status === "Submitted"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        filing.status === "Approved"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                          : ""
                      }
                    >
                      {filing.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(filing.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
