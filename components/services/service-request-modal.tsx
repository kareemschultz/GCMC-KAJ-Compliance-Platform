"use client"

import * as React from "react"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SERVICE_CATALOG } from "@/lib/constants"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"

export function ServiceRequestModal() {
  const [open, setOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await api.services.request({
        service: selectedService,
        notes,
        clientId: "current-client-id", // In a real app, this would come from context or props
      })

      toast({
        title: "Service Requested",
        description: `${selectedService} has been added to the queue.`,
      })

      setOpen(false)
      setSelectedService("")
      setNotes("")
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Could not submit service request.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>Select a service to add to this client's portfolio.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="service">Service Type</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {SERVICE_CATALOG.map((category, i) => (
                  <SelectGroup key={i}>
                    <SelectLabel className="text-primary font-bold">
                      {category.category} - {category.subcategory}
                    </SelectLabel>
                    {category.items.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes / Specific Requirements</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any specific details about this service request..."
              className="h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedService || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              "Add Service"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
