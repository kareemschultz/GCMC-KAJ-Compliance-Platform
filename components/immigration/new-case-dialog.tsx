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

export function NewImmigrationCaseDialog() {
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
      title: "Case Created",
      description: "New immigration case has been started successfully.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Immigration Case</DialogTitle>
          <DialogDescription>Start a new visa or work permit application.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client Name</Label>
            <Input id="client" placeholder="Search client..." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Application Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work-permit">Work Permit</SelectItem>
                <SelectItem value="visa-extension">Visa Extension</SelectItem>
                <SelectItem value="citizenship">Citizenship by Naturalization</SelectItem>
                <SelectItem value="marriage">Marriage Registration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" placeholder="e.g. Brazilian" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passport">Passport Number</Label>
            <Input id="passport" placeholder="Passport #" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Case
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
