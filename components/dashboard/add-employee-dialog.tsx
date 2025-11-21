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

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setOpen(false)
    toast({
      title: "Employee Added",
      description: "New employee has been added to the registry.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Enter employee details for payroll and NIS.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Job Title</Label>
            <Input id="role" placeholder="e.g. Accountant" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nis">NIS Number</Label>
              <Input id="nis" placeholder="A-1234567" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tin">TIN</Label>
              <Input id="tin" placeholder="123-456-789" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">Gross Monthly Salary (GYD)</Label>
            <Input id="salary" type="number" placeholder="0.00" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
