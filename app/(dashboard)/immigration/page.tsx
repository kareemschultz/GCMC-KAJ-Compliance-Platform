import { ImmigrationKanban } from "@/components/immigration/immigration-kanban"
import { NewImmigrationCaseDialog } from "@/components/immigration/new-case-dialog"

export default function ImmigrationPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Immigration Pipeline</h1>
          <p className="text-muted-foreground">Track work permits, visas, and citizenship applications.</p>
        </div>
        <NewImmigrationCaseDialog />
      </div>
      <ImmigrationKanban />
    </div>
  )
}
