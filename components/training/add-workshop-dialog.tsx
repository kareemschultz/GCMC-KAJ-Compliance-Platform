"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddWorkshopDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setOpen(false)
    toast({
      title: "Workshop Scheduled",
      description: "The new training session has been added to the calendar.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Workshop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Workshop</DialogTitle>
          <DialogDescription>Create a new training session or seminar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Workshop Title</Label>
            <Input id="title" placeholder="e.g. Advanced Leadership" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input id="instructor" placeholder="Instructor Name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" type="number" placeholder="e.g. 20" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Workshop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
