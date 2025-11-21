"use client"

import { useBrand } from "@/components/brand-context"
import { useClient } from "@/components/client-context"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ExchangeRateWidget } from "@/components/dashboard/exchange-rate-widget"
import { NISScheduleTable } from "@/components/dashboard/nis-schedule-table"
import { TaxFilingStatus } from "@/components/dashboard/tax-filing-status"
import { ImmigrationKanban } from "@/components/immigration/immigration-kanban"
import { TrainingCalendar } from "@/components/training/training-calendar"
import { PartnerDirectory } from "@/components/network/partner-directory"
import { LocalContentTracker } from "@/components/dashboard/local-content-tracker" // Import the new component
import { ComplianceTrafficLight } from "@/components/dashboard/compliance-traffic-light" // Import the new component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { brand } = useBrand()
  const { selectedClient } = useClient()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {selectedClient ? <span className="text-primary">{selectedClient.name} - </span> : null}
          {brand === "KAJ" ? "Financial Dashboard" : "Consultancy Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {selectedClient
            ? `Managing services and compliance for ${selectedClient.name} (${selectedClient.type})`
            : brand === "KAJ"
              ? "Overview of tax compliance, payroll, and financial filings."
              : "Manage immigration cases, legal documents, and training sessions."}
        </p>
      </div>

      {brand === "KAJ" ? (
        // KAJ Financial Dashboard
        <div className="space-y-6">
          <KPICards />
          <ComplianceTrafficLight />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <ComplianceChart />
            </div>
            <div className="col-span-3">
              <ExchangeRateWidget />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <NISScheduleTable />
            <TaxFilingStatus />
          </div>
          <RecentActivity />
        </div>
      ) : (
        // GCMC Consultancy Dashboard
        <div className="space-y-6">
          <Tabs defaultValue="immigration" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              {" "}
              {/* Changed to 4 columns */}
              <TabsTrigger value="immigration">Immigration</TabsTrigger>
              <TabsTrigger value="local-content">Local Content</TabsTrigger> {/* Added new tab */}
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
            </TabsList>
            <TabsContent value="immigration" className="mt-6">
              <ImmigrationKanban />
            </TabsContent>
            <TabsContent value="local-content" className="mt-6">
              {" "}
              {/* Added content for new tab */}
              <div className="grid gap-6 md:grid-cols-2">
                <LocalContentTracker />
                <div className="space-y-6">
                  <QuickActions />
                  <RecentActivity />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="training" className="mt-6">
              <TrainingCalendar />
            </TabsContent>
            <TabsContent value="network" className="mt-6">
              <PartnerDirectory />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
