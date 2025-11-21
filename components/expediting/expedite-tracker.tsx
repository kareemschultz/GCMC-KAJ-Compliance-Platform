"use client"

import { useState } from "react"
import { Package, MapPin, Clock, Check, Truck, Building } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockExpediteJobs } from "@/lib/mock-data"
import type { ExpediteJob } from "@/types"
import { cn } from "@/lib/utils"
import { AddExpediteJobDialog } from "./add-expedite-job-dialog"

const statusConfig = {
  PICKED_UP: {
    label: "Document Picked Up",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  AT_AGENCY: {
    label: "Dropped at Agency",
    icon: Building,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  PROCESSING: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  READY_FOR_COLLECTION: {
    label: "Ready for Collection",
    icon: Check,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: Truck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  COMPLETED: {
    label: "Delivered",
    icon: Check,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
}

const statusOrder = ["PICKED_UP", "AT_AGENCY", "PROCESSING", "READY_FOR_COLLECTION", "OUT_FOR_DELIVERY", "COMPLETED"]

export function ExpediteTracker() {
  const [jobs] = useState<ExpediteJob[]>(mockExpediteJobs)

  const getStatusIndex = (status: ExpediteJob["status"]) => {
    return statusOrder.indexOf(status)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expediting Tracker</CardTitle>
            <CardDescription>Track documents through government agencies</CardDescription>
          </div>
          <AddExpediteJobDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {jobs.map((job) => {
            const currentStatusIndex = getStatusIndex(job.status)
            return (
              <div key={job.id} className="rounded-lg border p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{job.documentType}</div>
                    <div className="text-sm text-muted-foreground">
                      {job.clientName} • {job.agencyName}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      Ref: {job.referenceNumber}
                      <span className="mx-1">•</span>
                      Runner: {job.assignedRunner}
                    </div>
                  </div>
                  <Badge variant="outline">Expected: {new Date(job.expectedCompletion).toLocaleDateString()}</Badge>
                </div>

                {/* Progress Timeline */}
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                  <div className="space-y-4">
                    {statusOrder.map((statusKey, index) => {
                      const status = statusKey as ExpediteJob["status"]
                      const config = statusConfig[status]
                      const Icon = config.icon
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex

                      const historyEntry = job.statusHistory.find((h) => h.status === status)

                      return (
                        <div key={status} className="relative flex items-start gap-4">
                          <div
                            className={cn(
                              "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                              isCompleted
                                ? `${config.bgColor} border-current ${config.color}`
                                : "border-border bg-background",
                            )}
                          >
                            <Icon className={cn("h-4 w-4", isCompleted ? config.color : "text-muted-foreground")} />
                          </div>
                          <div className="flex-1 pb-4">
                            <div className={cn("font-medium", isCurrent && "text-primary")}>{config.label}</div>
                            {historyEntry && (
                              <div className="mt-1 space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  {new Date(historyEntry.timestamp).toLocaleString()}
                                </div>
                                {historyEntry.notes && (
                                  <div className="text-sm text-muted-foreground">{historyEntry.notes}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
