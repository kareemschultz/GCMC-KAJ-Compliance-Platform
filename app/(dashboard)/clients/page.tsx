import { ClientTable } from "@/components/clients/client-table"
import { ClientFilters } from "@/components/clients/client-filters"
import { NewClientWizard } from "@/components/clients/new-client-wizard"

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">156</span>
        </div>
        <NewClientWizard />
      </div>

      <div className="flex flex-col gap-4">
        <ClientFilters />
        <ClientTable />
      </div>
    </div>
  )
}
