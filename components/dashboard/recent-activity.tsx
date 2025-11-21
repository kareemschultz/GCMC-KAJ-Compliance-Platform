import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "John Doe",
    action: "uploaded TIN Certificate",
    target: "ABC Corp Ltd",
    time: "2 hours ago",
    initials: "JD",
  },
  {
    user: "Sarah Smith",
    action: "filed VAT Return",
    target: "XYZ Holdings",
    time: "4 hours ago",
    initials: "SS",
  },
  {
    user: "Mike Jones",
    action: "added new client",
    target: "Guyana Tech Solutions",
    time: "Yesterday",
    initials: "MJ",
  },
  {
    user: "System",
    action: "flagged overdue filing",
    target: "Retail Plus Inc",
    time: "Yesterday",
    initials: "SYS",
  },
]

export function RecentActivity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{activity.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  for {activity.target}
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
