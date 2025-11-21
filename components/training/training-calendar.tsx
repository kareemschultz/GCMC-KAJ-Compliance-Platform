"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin } from "lucide-react"
import { api } from "@/lib/api"
import type { TrainingSession } from "@/types"
import { format, parseISO } from "date-fns"
import { AddWorkshopDialog } from "./add-workshop-dialog"

export function TrainingCalendar() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await api.training.list()
        setSessions(data)
      } catch (error) {
        console.error("Failed to fetch training sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming Workshops</h2>
        <AddWorkshopDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{session.title}</CardTitle>
                  <CardDescription>{format(parseISO(session.date), "EEEE, MMMM d, yyyy")}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/5">
                  ${session.price.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(parseISO(session.date), "h:mm a")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {session.attendees.length} / {session.capacity} Registered
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>GCMC Training Center</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">
                    {Math.round((session.attendees.length / session.capacity) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${(session.attendees.length / session.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Register Attendee</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
