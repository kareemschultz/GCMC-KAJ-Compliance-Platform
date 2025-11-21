import { AuditLogTable } from "@/components/audit/audit-log-table"

export default function AuditLogsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">View and track all system activities and user actions.</p>
        </div>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <AuditLogTable />
      </div>
    </div>
  )
}
