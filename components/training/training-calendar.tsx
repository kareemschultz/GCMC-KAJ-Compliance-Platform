"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"

const UPCOMING_TRAININGS = [
  {
    id: 1,
    title: "Customer Relations Workshop",
    date: new Date(2025, 3, 15), // April 15, 2025
    time: "09:00 AM - 04:00 PM",
    location: "GCMC Conference Room",
    instructor: "Sarah James",
    capacity: 20,
    enrolled: 12,
    type: "Workshop",
  },
  {
    id: 2,
    title: "HR Management Fundamentals",
    date: new Date(2025, 3, 22), // April 22, 2025
    time: "10:00 AM - 02:00 PM",
    location: "Virtual (Zoom)",
    instructor: "Michael Forde",
    capacity: 50,
    enrolled: 45,
    type: "Webinar",
  },
  {
    id: 3,
    title: "Co-operatives Leadership",
    date: new Date(2025, 4, 5), // May 5, 2025
    time: "09:00 AM - 03:00 PM",
    location: "Pegasus Hotel",
    instructor: "Dr. Ali",
    capacity: 30,
    enrolled: 5,
    type: "Seminar",
  },
]

export function TrainingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTraining, setSelectedTraining] = useState<(typeof UPCOMING_TRAININGS)[0] | null>(null)

  const handleBookTraining = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API
    alert("Booking request submitted!")
  }

  return (
    <div className="grid gap-6 md:grid-cols-7">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Training Calendar</CardTitle>
          <CardDescription>View and schedule upcoming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              training: UPCOMING_TRAININGS.map((t) => t.date),
            }}
            modifiersStyles={{
              training: { fontWeight: "bold", textDecoration: "underline", color: "var(--primary)" },
            }}
          />
          <div className="mt-4 space-y-4">
            <h4 className="text-sm font-medium">Upcoming Sessions</h4>
            {UPCOMING_TRAININGS.map((training) => (
              <div
                key={training.id}
                className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedTraining(training)}
              >
                <div className="grid gap-1">
                  <div className="font-medium">{training.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(training.date, "MMM d, yyyy")} • {training.time}
                  </div>
                </div>
                <Badge variant={training.type === "Webinar" ? "secondary" : "outline"}>{training.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>
            {selectedTraining ? "Review details and register participants" : "Select a session to view details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTraining ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{format(selectedTraining.date, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTraining.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTraining.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedTraining.enrolled} / {selectedTraining.capacity} Enrolled
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Instructor</h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedTraining.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{selectedTraining.instructor}</div>
                    <div className="text-xs text-muted-foreground">Senior Consultant, GCMC</div>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">Register Participant</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register for {selectedTraining.title}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBookTraining} className="space-y-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Participant Name</Label>
                      <Input id="name" placeholder="Enter full name" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter email" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company / Organization</Label>
                      <Input id="company" placeholder="Enter company name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="invoice">Invoice Company</SelectItem>
                          <SelectItem value="cash">Cash at Door</SelectItem>
                          <SelectItem value="transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Confirm Registration
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
              <GraduationCap className="h-12 w-12 opacity-20" />
              <p>Select a training session from the calendar to view details and register participants.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
