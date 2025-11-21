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
import { Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export function AddExpediteJobDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.expediting.create({
        documentType: "New Document",
        clientName: "Client",
      })
      setOpen(false)
      toast({
        title: "Job Started",
        description: "New expediting job has been created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job.",
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
          <Package className="mr-2 h-4 w-4" />
          New Expedite Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Expedite Job</DialogTitle>
          <DialogDescription>Track a new document through government agencies.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client Name</Label>
            <Input id="client" placeholder="Search client..." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document">Document Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliance">GRA Compliance</SelectItem>
                <SelectItem value="nis">NIS Compliance</SelectItem>
                <SelectItem value="business-reg">Business Registration</SelectItem>
                <SelectItem value="deed">Deed/Title</SelectItem>
                <SelectItem value="passport">Passport Application</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="agency">Target Agency</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GRA">GRA</SelectItem>
                <SelectItem value="NIS">NIS</SelectItem>
                <SelectItem value="Deeds">Deeds Registry</SelectItem>
                <SelectItem value="Immigration">Immigration Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="runner">Assigned Runner</Label>
            <Input id="runner" placeholder="Runner Name" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
