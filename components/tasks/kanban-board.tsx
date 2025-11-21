import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TaskCard } from "@/components/tasks/task-card"
import type { Task } from "@/types"

const tasks: Task[] = [
  {
    id: "1",
    title: "Prepare VAT Return for Q3",
    clientName: "Tech Solutions Ltd",
    clientId: "1",
    assignee: { name: "John Doe", initials: "JD" },
    dueDate: "Oct 20",
    priority: "High",
    status: "In Progress",
    type: "Filing Prep",
    checklist: [
      { id: "1", text: "Collect invoices", completed: true },
      { id: "2", text: "Verify input tax", completed: false },
      { id: "3", text: "Calculate liability", completed: false },
    ],
    labels: ["Tax", "Urgent"],
  },
  {
    id: "2",
    title: "Renew Business Registration",
    clientName: "Green Grocers Inc",
    clientId: "2",
    assignee: { name: "Jane Smith", initials: "JS" },
    dueDate: "Nov 15",
    priority: "Medium",
    status: "To Do",
    type: "Document Collection",
    checklist: [],
    labels: ["Compliance"],
  },
  {
    id: "3",
    title: "Client Onboarding Meeting",
    clientName: "New Ventures LLC",
    clientId: "3",
    assignee: { name: "John Doe", initials: "JD" },
    dueDate: "Tomorrow",
    priority: "Low",
    status: "To Do",
    type: "Client Meeting",
    checklist: [],
    labels: ["Meeting"],
  },
  {
    id: "4",
    title: "Review NIS Contributions",
    clientName: "Tech Solutions Ltd",
    clientId: "1",
    assignee: { name: "Mike Johnson", initials: "MJ" },
    dueDate: "Oct 14",
    priority: "Urgent",
    status: "Review",
    type: "Review",
    checklist: [
      { id: "1", text: "Check schedule", completed: true },
      { id: "2", text: "Verify payments", completed: true },
    ],
    labels: ["NIS", "Audit"],
  },
  {
    id: "5",
    title: "File Annual Returns",
    clientName: "Construction Pros",
    clientId: "4",
    assignee: { name: "Jane Smith", initials: "JS" },
    dueDate: "Sep 30",
    priority: "High",
    status: "Done",
    type: "Filing Prep",
    checklist: [],
    labels: ["Annual", "Compliance"],
  },
]

const columns = [
  { id: "To Do", title: "To Do", color: "bg-slate-100 dark:bg-slate-800/50" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "Review", title: "Review", color: "bg-yellow-50 dark:bg-yellow-900/20" },
  { id: "Done", title: "Done", color: "bg-green-50 dark:bg-green-900/20" },
]

export function KanbanBoard() {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id)

        return (
          <div key={column.id} className="flex h-full min-w-[300px] flex-col rounded-lg border bg-background">
            <div className={`flex items-center justify-between p-4 border-b ${column.color}`}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background text-xs font-medium border">
                  {columnTasks.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 border-t">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
