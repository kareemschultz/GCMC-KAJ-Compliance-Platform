"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertCircle, CheckCircle, Clock, ArrowRight, Briefcase, Download } from "lucide-react"
import Link from "next/link"

const formatDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const getCurrentPeriod = (monthsAgo = 1) => {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function PortalDashboard() {
  const recentFilings = [
    {
      name: `VAT Return (${getCurrentPeriod(1)})`,
      status: "Submitted",
      date: formatDate(6),
      amount: "$45,200",
    },
    {
      name: `NIS Contribution (${getCurrentPeriod(1)})`,
      status: "Submitted",
      date: formatDate(11),
      amount: "$12,500",
    },
    {
      name: `PAYE Return (${getCurrentPeriod(1)})`,
      status: "Processing",
      date: formatDate(6),
      amount: "$8,900",
    },
  ]

  const handleContactSupport = () => {
    window.location.href = "mailto:support@gcmc-kaj.com?subject=Support Request"
  }

  const handleDownload = (docName: string) => {
    // In production, this would fetch the actual document
    const blob = new Blob([`${docName} - Sample Document Content`], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${docName.toLowerCase().replace(/\s+/g, "-")}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">Here is an overview of your business compliance status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleContactSupport}>
            Contact Support
          </Button>
          <Button asChild>
            <Link href="/portal/services">Request Service</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">98%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent standing. Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Filings</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">VAT Return due in 5 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Uploaded this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Services</CardTitle>
              <CardDescription>Services currently managed by GCMC & KAJ.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Tax Compliance", type: "Recurring", status: "Active" },
                  { name: "NIS Management", type: "Recurring", status: "Active" },
                  { name: "Business Registration", type: "One-time", status: "Completed" },
                  { name: "Work Permit Processing", type: "One-time", status: "In Progress" },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-muted/40">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.type}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        service.status === "Active"
                          ? "default"
                          : service.status === "Completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Filings</CardTitle>
                <CardDescription>Your latest tax and compliance submissions.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/portal/filings">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFilings.map((filing, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{filing.name}</p>
                        <p className="text-xs text-muted-foreground">{filing.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{filing.amount}</p>
                      <Badge variant="outline" className="mt-1 text-[10px] h-5">
                        {filing.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/10 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="text-orange-900 dark:text-orange-200 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white dark:bg-background p-4 rounded-lg border shadow-sm">
                  <h4 className="font-semibold text-sm">Business Registration Renewal</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Your business registration expires in 30 days. Please upload the renewal form.
                  </p>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/portal/documents">Upload Document</Link>
                  </Button>
                </div>
                <div className="bg-white dark:bg-background p-4 rounded-lg border shadow-sm">
                  <h4 className="font-semibold text-sm">Missing TIN Certificate</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    We need a copy of your TIN certificate for the new tax year.
                  </p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/portal/documents">Upload Document</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Downloads</CardTitle>
              <CardDescription>Frequently accessed documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Tax Compliance Certificate", "Business Registration", "Last Month VAT Return"].map((doc, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-between h-auto py-3"
                    onClick={() => handleDownload(doc)}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[180px]">{doc}</span>
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/portal/documents">View All Documents</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
