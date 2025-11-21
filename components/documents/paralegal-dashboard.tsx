"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export function ParalegalDashboard() {
  const stats = [
    {
      title: "Active Documents",
      value: "24",
      description: "In progress",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pending Review",
      value: "8",
      description: "Awaiting approval",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      title: "Completed",
      value: "156",
      description: "This month",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Urgent",
      value: "3",
      description: "Due within 48hrs",
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
