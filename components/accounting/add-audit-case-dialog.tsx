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
import { FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export function AddAuditCaseDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Mock API call
      await api.accounting.updateAuditCase("new", {})
      setOpen(false)
      toast({
        title: "Audit Case Created",
        description: "New audit case has been initiated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create audit case.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Audit Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Audit Case</DialogTitle>
          <DialogDescription>Initiate a new audit for an NGO or Co-op.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="entity">Entity Name</Label>
            <Input id="entity" placeholder="Search entity..." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Entity Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="Co-op">Co-operative Society</SelectItem>
                <SelectItem value="Friendly Society">Friendly Society</SelectItem>
                <SelectItem value="Union">Credit Union</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Audit Year</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="auditor">Lead Auditor</Label>
            <Input id="auditor" placeholder="Auditor Name" required />
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
