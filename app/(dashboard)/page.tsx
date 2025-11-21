import { KPICards } from "@/components/dashboard/kpi-cards"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { FilingsChart } from "@/components/dashboard/filings-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { RevenueComplianceChart } from "@/components/dashboard/revenue-compliance-chart"
import { ServicesChart } from "@/components/dashboard/services-chart"
import { TaxCalendarWidget } from "@/components/dashboard/tax-calendar"
import { NewClientWizard } from "@/components/clients/new-client-wizard"
import { DocumentUploadModal } from "@/components/documents/document-upload-modal"
import { NewFilingDropdown } from "@/components/filings/new-filing-dropdown"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DocumentUploadModal />

          <NewFilingDropdown variant="outline" size="sm" />

          <NewClientWizard />
        </div>
      </div>

      <KPICards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <ActivityChart />
        <div className="col-span-3">
          <RecentActivity />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <FilingsChart />
        </div>
        <div className="col-span-3">
          <ComplianceChart />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueComplianceChart />
        </div>
        <div className="col-span-3">
          <ServicesChart />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <TaxCalendarWidget />
        {/* ExchangeRateWidget is no longer imported, so it's removed */}
      </div>
    </div>
  )
}
