"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./client-tabs/OverviewTab"
import { IdentificationTab } from "./client-tabs/IdentificationTab"
import { DocumentsTab } from "./client-tabs/DocumentsTab"
import { FilingsTab } from "./client-tabs/FilingsTab"
import { ComplianceTab } from "./client-tabs/ComplianceTab"
import { ServicesTab } from "./client-tabs/ServicesTab"
import { ImmigrationTab } from "./client-tabs/ImmigrationTab"
import { CommunicationsTab } from "./client-tabs/CommunicationsTab"
import { TasksTab } from "./client-tabs/TasksTab"

export function ClientTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="identification">Identification</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="filings">Filings</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="immigration">Immigration</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <OverviewTab />
      </TabsContent>

      <TabsContent value="identification" className="space-y-4">
        <IdentificationTab />
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <DocumentsTab />
      </TabsContent>

      <TabsContent value="filings" className="space-y-4">
        <FilingsTab />
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <ComplianceTab />
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        <ServicesTab />
      </TabsContent>

      <TabsContent value="immigration" className="space-y-4">
        <ImmigrationTab />
      </TabsContent>

      <TabsContent value="communications" className="space-y-4">
        <CommunicationsTab />
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <TasksTab />
      </TabsContent>
    </Tabs>
  )
}