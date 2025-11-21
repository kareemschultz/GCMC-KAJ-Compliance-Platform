import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParalegalDashboard } from "@/components/documents/paralegal-dashboard"
import { TemplateLibrary } from "@/components/documents/template-library"
import { DocumentWizard } from "@/components/documents/document-wizard"
import { DocumentStats } from "@/components/documents/document-stats"
import { DocumentFilters } from "@/components/documents/document-filters"
import { DocumentList } from "@/components/documents/document-list"

export const metadata: Metadata = {
  title: "Documents | GK Enterprise Suite",
  description: "Manage client documents and compliance files",
}

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Paralegal & Documents</h2>
          <p className="text-muted-foreground">Generate legal documents, manage templates, and track client files</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wizard">Document Wizard</TabsTrigger>
          <TabsTrigger value="templates">Template Library</TabsTrigger>
          <TabsTrigger value="files">All Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ParalegalDashboard />
          <DocumentStats />
        </TabsContent>

        <TabsContent value="wizard" className="space-y-4">
          <DocumentWizard />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateLibrary />
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <DocumentFilters />
          <DocumentList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
