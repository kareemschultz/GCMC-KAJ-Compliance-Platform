"use client"

import { Button } from "@/components/ui/button"
import { FilingsStats } from "@/components/filings/filings-stats"
import { FilingsFilters } from "@/components/filings/filings-filters"
import { FilingsList } from "@/components/filings/filings-list"
import { FilingsCalendar } from "@/components/filings/filings-calendar"
import { FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { NewFilingDropdown } from "@/components/filings/new-filing-dropdown"

// Mock data - in a real app this would come from an API
const filingsData = [
  {
    id: "1",
    clientName: "ABC Corporation Ltd",
    type: "VAT Return",
    agency: "GRA" as const,
    period: "Q4 2024",
    dueDate: "Jan 21, 2025",
    amount: 45000,
    status: "Draft" as const,
  },
  {
    id: "2",
    clientName: "Guyana Tech Solutions",
    type: "PAYE",
    agency: "GRA" as const,
    period: "Dec 2024",
    dueDate: "Jan 14, 2025",
    amount: 12500,
    status: "Overdue" as const,
  },
  {
    id: "3",
    clientName: "Georgetown Retailers",
    type: "NIS Contribution",
    agency: "NIS" as const,
    period: "Dec 2024",
    dueDate: "Jan 14, 2025",
    amount: 8200,
    status: "Submitted" as const,
  },
  {
    id: "4",
    clientName: "John Smith Trading",
    type: "Business Registration",
    agency: "DCRA" as const,
    period: "N/A",
    dueDate: "Feb 15, 2025",
    amount: 5000,
    status: "Draft" as const,
  },
]

export default function FilingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="filings-page-title">Filings & Compliance</h1>
          <p className="text-muted-foreground" data-testid="filings-page-description">Manage tax returns and regulatory filings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/filings/nis-compliance">
              <FileText className="mr-2 h-4 w-4" /> NIS Compliance
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/filings/vat-return">
              <FileText className="mr-2 h-4 w-4" /> New VAT Return
            </Link>
          </Button>
          {/* Replaced generic button with NewFilingDropdown */}
          <NewFilingDropdown />
        </div>
      </div>

      <FilingsStats />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-5">
          <FilingsFilters />
          <div className="mt-4">
            <Tabs defaultValue="list" className="space-y-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4">
                <FilingsList data={filingsData} />
              </TabsContent>
              <TabsContent value="calendar" className="space-y-4">
                <FilingsCalendar data={filingsData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="col-span-3 lg:col-span-2 space-y-4">{/* Quick Actions or Mini Calendar could go here */}</div>
      </div>
    </div>
  )
}
