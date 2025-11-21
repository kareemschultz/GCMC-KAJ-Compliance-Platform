import { Bell, Check, Clock, AlertTriangle, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: "overdue" | "expiring" | "due-soon" | "completed" | "assigned" | "system"
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "VAT Return Overdue",
    description: "VAT Return for Tech Solutions Ltd is overdue",
    time: "2 hours ago",
    type: "overdue",
    read: false,
  },
  {
    id: "2",
    title: "TIN Certificate Expiring",
    description: "TIN Certificate for Green Grocers Inc expires in 7 days",
    time: "5 hours ago",
    type: "expiring",
    read: false,
  },
  {
    id: "3",
    title: "New Task Assigned",
    description: "You have been assigned to 'Client Onboarding'",
    time: "1 day ago",
    type: "assigned",
    read: true,
  },
  {
    id: "4",
    title: "Filing Accepted",
    description: "GRA Filing for Construction Pros was accepted",
    time: "1 day ago",
    type: "completed",
    read: true,
  },
]

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    case "expiring":
      return <Clock className="h-4 w-4 text-orange-500" />
    case "due-soon":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "completed":
      return <Check className="h-4 w-4 text-green-500" />
    case "assigned":
      return <User className="h-4 w-4 text-blue-500" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

export function NotificationDropdown() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs font-normal text-muted-foreground cursor-pointer hover:text-primary">
              Mark all read
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col gap-1 p-1">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex w-full items-start gap-2">
                  <div
                    className={cn(
                      "mt-0.5 rounded-full p-1",
                      notification.type === "overdue" && "bg-red-100 dark:bg-red-900/20",
                      notification.type === "expiring" && "bg-orange-100 dark:bg-orange-900/20",
                      notification.type === "due-soon" && "bg-yellow-100 dark:bg-yellow-900/20",
                      notification.type === "completed" && "bg-green-100 dark:bg-green-900/20",
                      notification.type === "assigned" && "bg-blue-100 dark:bg-blue-900/20",
                      notification.type === "system" && "bg-slate-100 dark:bg-slate-800",
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn("text-sm font-medium leading-none", !notification.read && "font-bold")}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                    <p className="text-[10px] text-muted-foreground">{notification.time}</p>
                  </div>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full cursor-pointer justify-center text-center text-sm font-medium text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
