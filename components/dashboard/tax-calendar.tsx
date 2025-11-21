import { CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const UPCOMING_DEADLINES = [
  {
    date: "2025-04-21",
    title: "VAT Return (March)",
    agency: "GRA",
    type: "Monthly",
    status: "Upcoming",
  },
  {
    date: "2025-04-30",
    title: "Corporation Tax Return",
    agency: "GRA",
    type: "Annual",
    status: "Urgent",
  },
  {
    date: "2025-05-09",
    title: "Tax Filing Extension Deadline",
    agency: "GRA",
    type: "Extension",
    status: "Important",
  },
  {
    date: "2025-05-15",
    title: "NIS Contributions (April)",
    agency: "NIS",
    type: "Monthly",
    status: "Upcoming",
  },
  {
    date: "2025-05-21",
    title: "VAT Return (April)",
    agency: "GRA",
    type: "Monthly",
    status: "Upcoming",
  },
]

export function TaxCalendarWidget() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Compliance Calendar
            </CardTitle>
            <CardDescription>Upcoming GRA & NIS deadlines for 2025</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {UPCOMING_DEADLINES.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.agency} • {item.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(item.date).getFullYear()}</p>
                </div>
                <Badge
                  variant={item.status === "Urgent" ? "destructive" : "secondary"}
                  className={item.status === "Important" ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
