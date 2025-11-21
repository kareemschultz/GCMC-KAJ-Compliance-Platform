import type { Metadata } from "next"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentStats } from "@/components/documents/document-stats"
import { DocumentFilters } from "@/components/documents/document-filters"
import { DocumentList } from "@/components/documents/document-list"

export const metadata: Metadata = {
  title: "Documents | GCMC Platform",
  description: "Manage client documents and compliance files",
}

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>
      <DocumentStats />
      <div className="space-y-4">
        <DocumentFilters />
        <DocumentList />
      </div>
    </div>
  )
}
