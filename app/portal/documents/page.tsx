import { PortalDocumentList } from "@/components/portal/portal-document-list"
import { DocumentUploadModal } from "@/components/documents/document-upload-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PortalDocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">Access and manage your business documents.</p>
        </div>
        <DocumentUploadModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>All your uploaded and generated documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <PortalDocumentList />
        </CardContent>
      </Card>
    </div>
  )
}
