import type { Metadata } from "next"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { TaskFilters } from "@/components/tasks/task-filters"

export const metadata: Metadata = {
  title: "Tasks | GCMC Platform",
  description: "Manage compliance tasks and workflows",
}

export default function TasksPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your team's workload and track compliance progress</p>
        </div>
      </div>
      <TaskFilters />
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  )
}
