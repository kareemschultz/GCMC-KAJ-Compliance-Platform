"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { VisaApplication } from "@/types"
import { format, differenceInDays, parseISO } from "date-fns"
import { Progress } from "@/components/ui/progress"

// Define columns
const columns = {
  APPLICATION_SUBMITTED: {
    id: "APPLICATION_SUBMITTED",
    title: "Submitted",
    color: "bg-blue-500/10 text-blue-500",
  },
  UNDER_REVIEW: {
    id: "UNDER_REVIEW",
    title: "In Review",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  APPROVED: {
    id: "APPROVED",
    title: "Approved",
    color: "bg-green-500/10 text-green-500",
  },
}

export function ImmigrationKanban() {
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.immigration.list()
        setApplications(data)
      } catch (error) {
        console.error("Failed to fetch visa applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const newApplications = applications.map((app) => {
        if (app.id === result.draggableId) {
          return { ...app, status: destination.droppableId as any }
        }
        return app
      })

      setApplications(newApplications)
      // In a real app, we would call the API to update the status here
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="flex flex-col gap-4">
            <div className={`flex items-center justify-between rounded-lg p-3 ${column.color}`}>
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary" className="bg-background/50">
                {applications.filter((app) => app.status === column.id).length}
              </Badge>
            </div>

            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-1 flex-col gap-3 rounded-lg bg-muted/50 p-2"
                >
                  {applications
                    .filter((app) => app.status === column.id)
                    .map((app, index) => {
                      const expiryDate = parseISO(app.expiryDate)
                      const daysUntilExpiry = differenceInDays(expiryDate, new Date())
                      const isExpiringSoon = daysUntilExpiry < 30 && daysUntilExpiry > 0

                      // Calculate progress based on status
                      let progress = 0
                      if (app.status === "APPLICATION_SUBMITTED") progress = 33
                      if (app.status === "UNDER_REVIEW") progress = 66
                      if (app.status === "APPROVED") progress = 100

                      return (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {app.applicantName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="grid gap-1">
                                    <CardTitle className="text-sm font-medium leading-none">
                                      {app.applicantName}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">{app.permitType.replace("_", " ")}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </CardHeader>
                              <CardContent className="p-4 pt-2">
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>Expires: {format(expiryDate, "MMM d, yyyy")}</span>
                                    </div>
                                    {isExpiringSoon && (
                                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                        Expiring Soon
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span className="font-medium">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-1.5" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      )
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
