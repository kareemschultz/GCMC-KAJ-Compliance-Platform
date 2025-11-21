"use client"

import { Users, FolderOpen, FileText, ShieldCheck, AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import { ReportCard } from "@/components/reports/report-card"
import { RecentReports } from "@/components/reports/recent-reports"
import { ClientGrowthChart } from "@/components/reports/client-growth-chart"

export default function ReportsPage() {
  const handleGenerate = (reportType: string) => {
    console.log(`Generating ${reportType} report...`)
    // In a real app, this would open a modal or start a download
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate compliance reports and view business insights</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          title="Client File Report"
          description="Comprehensive client summary including all documents, filings, and compliance status."
          icon={Users}
          onGenerate={() => handleGenerate("Client File")}
        />
        <ReportCard
          title="Documents Inventory"
          description="Complete list of all documents with expiry status and upload history."
          icon={FolderOpen}
          onGenerate={() => handleGenerate("Documents Inventory")}
        />
        <ReportCard
          title="Filings Summary"
          description="Filing history with status breakdown by agency (GRA, NIS, DCRA)."
          icon={FileText}
          onGenerate={() => handleGenerate("Filings Summary")}
        />
        <ReportCard
          title="Compliance Report"
          description="Compliance scores, issues, and recommendations for all clients."
          icon={ShieldCheck}
          onGenerate={() => handleGenerate("Compliance")}
        />
        <ReportCard
          title="Overdue Items"
          description="All overdue filings and expired documents requiring immediate attention."
          icon={AlertTriangle}
          onGenerate={() => handleGenerate("Overdue Items")}
        />
        <ReportCard
          title="Revenue Report"
          description="Service revenue breakdown by client and period."
          icon={DollarSign}
          onGenerate={() => handleGenerate("Revenue")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ClientGrowthChart />
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Analytics Summary</h3>
            </div>
            <p className="text-muted-foreground">
              Based on the current data, your client base has grown by <strong>45%</strong> this year. Compliance scores
              are positively correlated with revenue, suggesting that clients who maintain better records also tend to
              engage more services.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">82</div>
                <div className="text-xs text-muted-foreground">Active Clients</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-xs text-muted-foreground">Retention Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecentReports />
    </div>
  )
}
