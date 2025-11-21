import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, CheckCircle } from "lucide-react"

const kpiData = [
  {
    title: "Total Clients",
    value: "156",
    change: "+12% from last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Monthly Revenue",
    value: "GYD 847K",
    change: "+8.2% from last month",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Forms Processed",
    value: "2,847",
    change: "+15% from last month",
    icon: FileText,
    trend: "up",
  },
  {
    title: "Avg. Compliance Score",
    value: "98.5%",
    change: "+0.3% from last month",
    icon: CheckCircle,
    trend: "up",
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color || ""}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpi.color || ""}`}>{kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
