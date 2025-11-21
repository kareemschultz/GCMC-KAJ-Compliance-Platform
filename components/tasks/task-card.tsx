import { Calendar, CheckSquare, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const completedItems = task.checklist.filter((item) => item.completed).length
  const totalItems = task.checklist.length

  return (
    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2 space-y-0">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={cn(
                "mb-2",
                task.priority === "Urgent" && "border-red-500 text-red-500",
                task.priority === "High" && "border-orange-500 text-orange-500",
                task.priority === "Medium" && "border-yellow-500 text-yellow-500",
                task.priority === "Low" && "border-blue-500 text-blue-500",
              )}
            >
              {task.priority}
            </Badge>
            <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
            {task.clientName && (
              <p className="text-xs text-muted-foreground hover:underline cursor-pointer">{task.clientName}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label) => (
            <span key={label} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
          {totalItems > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              <span>
                {completedItems}/{totalItems}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <Avatar className="h-6 w-6">
          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-[10px]">{task.assignee.initials}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            task.status === "To Do" && "bg-slate-300",
            task.status === "In Progress" && "bg-blue-500",
            task.status === "Review" && "bg-yellow-500",
            task.status === "Done" && "bg-green-500",
          )}
        />
      </CardFooter>
    </Card>
  )
}
