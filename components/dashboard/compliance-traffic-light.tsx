"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, CalendarClock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComplianceItem {
  id: string
  label: string
  expiryDate: string
  status: "valid" | "warning" | "expired"
  daysRemaining: number
}

const complianceItems: ComplianceItem[] = [
  {
    id: "gra-tcc",
    label: "GRA Compliance (TCC)",
    expiryDate: "2025-10-30",
    status: "valid",
    daysRemaining: 245,
  },
  {
    id: "nis-cert",
    label: "NIS Compliance Cert",
    expiryDate: "2025-03-15",
    status: "warning",
    daysRemaining: 22,
  },
  {
    id: "biz-reg",
    label: "Business Annual Return",
    expiryDate: "2025-01-15",
    status: "expired",
    daysRemaining: -35,
  },
]

export function ComplianceTrafficLight() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {complianceItems.map((item) => (
        <Card key={item.id} className={cn("border-l-4", getBorderColor(item.status))}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            {getIcon(item.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {item.daysRemaining > 0 ? `${item.daysRemaining} Days` : "Overdue"}
            </div>
            <p className="text-xs text-muted-foreground">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
            <div className={cn("mt-2 text-xs font-medium px-2 py-1 rounded-full w-fit", getBadgeColor(item.status))}>
              {getStatusText(item.status)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getBorderColor(status: ComplianceItem["status"]) {
  switch (status) {
    case "valid":
      return "border-l-green-500"
    case "warning":
      return "border-l-amber-500"
    case "expired":
      return "border-l-red-500"
  }
}

function getBadgeColor(status: ComplianceItem["status"]) {
  switch (status) {
    case "valid":
      return "bg-green-100 text-green-700"
    case "warning":
      return "bg-amber-100 text-amber-700"
    case "expired":
      return "bg-red-100 text-red-700"
  }
}

function getIcon(status: ComplianceItem["status"]) {
  switch (status) {
    case "valid":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "warning":
      return <CalendarClock className="h-4 w-4 text-amber-500" />
    case "expired":
      return <XCircle className="h-4 w-4 text-red-500" />
  }
}

function getStatusText(status: ComplianceItem["status"]) {
  switch (status) {
    case "valid":
      return "Active & Valid"
    case "warning":
      return "Expiring Soon"
    case "expired":
      return "Action Required"
  }
}
