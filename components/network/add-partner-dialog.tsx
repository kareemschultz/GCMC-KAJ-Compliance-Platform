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

export function AddPartnerDialog() {
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
      title: "Partner Added",
      description: "New partner has been added to the directory.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Network Partner</DialogTitle>
          <DialogDescription>Add a trusted contact to the GCMC network.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Partner Name</Label>
            <Input id="name" placeholder="Company or Individual Name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="legal">Legal / Attorney</SelectItem>
                <SelectItem value="it">IT Services</SelectItem>
                <SelectItem value="banking">Banking</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact">Contact Person</Label>
            <Input id="contact" placeholder="Name of contact" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email address" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Phone number" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Partner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
