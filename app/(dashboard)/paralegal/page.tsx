import { DocumentGeneratorModal } from "@/components/documents/document-generator-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Scale, ScrollText, Stamp } from "lucide-react"

export default function ParalegalPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paralegal Services</h1>
          <p className="text-muted-foreground">Generate legal documents, manage affidavits, and track agreements.</p>
        </div>
        <DocumentGeneratorModal />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">4 pending signature</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notarizations</CardTitle>
            <Stamp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Recently generated legal documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Affidavit of Income - John Doe", date: "Today", type: "Affidavit" },
                { name: "Agreement of Sale - Lot 42", date: "Yesterday", type: "Agreement" },
                { name: "Employment Contract - Sarah Smith", date: "2 days ago", type: "Contract" },
                { name: "Business Proposal - Tech Corp", date: "3 days ago", type: "Proposal" },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <ScrollText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.date}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common paralegal tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start h-auto py-4 px-4 bg-transparent">
              <Scale className="mr-4 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Draft Agreement of Sale</div>
                <div className="text-xs text-muted-foreground">Property transfer template</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 px-4 bg-transparent">
              <Stamp className="mr-4 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Notary Request</div>
                <div className="text-xs text-muted-foreground">Schedule notarization</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 px-4 bg-transparent">
              <FileText className="mr-4 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Deed Poll</div>
                <div className="text-xs text-muted-foreground">Name change application</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
