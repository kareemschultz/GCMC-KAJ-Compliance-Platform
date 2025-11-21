import { Button } from "@/components/ui/button"
import { ArrowLeft, Archive, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ClientDetailHeader } from "@/components/clients/client-detail-header"
import { ClientTabs } from "@/components/clients/client-tabs"
import { PrintButton } from "@/components/print-button"
import { EditClientDialog } from "@/components/clients/edit-client-dialog"
import { ClientReportModal } from "@/components/clients/client-report-modal"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // TODO: In production, fetch client data using the id
  // const client = await api.clients.getById(id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              {/* TODO: Replace with {client.name} when API is connected */}
              <h1 className="text-2xl font-bold tracking-tight">ABC Corporation Ltd</h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Company
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground">TIN: 123-456-789 • Client since Jan 2023</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
            <Link href="/portal" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Client Portal
            </Link>
          </Button>
          <PrintButton />
          <EditClientDialog />
          <ClientReportModal />
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Archive className="mr-2 h-4 w-4" /> Archive
          </Button>
        </div>
      </div>

      <ClientDetailHeader />
      <ClientTabs />
    </div>
  )
}
