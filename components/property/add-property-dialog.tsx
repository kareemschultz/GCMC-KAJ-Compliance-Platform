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
import { Building2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export function AddPropertyDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // In a real app, we would gather form data here
      await api.property.create({
        address: "New Property",
        type: "Residential",
      })
      setOpen(false)
      toast({
        title: "Property Added",
        description: "New property has been added to the portfolio.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Building2 className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>Enter the details of the new property to manage.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Property Address</Label>
            <Input id="address" placeholder="123 Main St, Georgetown" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Property Type</Label>
            <Select defaultValue="Residential">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="owner">Owner Name</Label>
            <Input id="owner" placeholder="Client Name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fee">Management Fee (%)</Label>
            <Input id="fee" type="number" placeholder="10" min="0" max="100" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
