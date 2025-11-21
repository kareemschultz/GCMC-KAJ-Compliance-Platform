"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Plus } from "lucide-react"

interface User {
  id: number | string
  name: string
  email: string
  role: string
}

interface AddUserDialogProps {
  onUserAdded?: () => void
  user?: User
  trigger?: React.ReactNode
}

export function AddUserDialog({ onUserAdded, user, trigger }: AddUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Staff",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } else {
      setFormData({ name: "", email: "", role: "Staff" })
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        await api.users.update(user.id, formData)
        toast.success("User updated successfully")
      } else {
        await api.users.create(formData)
        toast.success("User invited successfully", {
          description: `An invitation email has been sent to ${formData.email}`,
        })
      }
      setOpen(false)
      if (!user) setFormData({ name: "", email: "", role: "Staff" })
      onUserAdded?.()
    } catch (error) {
      toast.error(user ? "Failed to update user" : "Failed to invite user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Invite New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update user details and role permissions."
              : "Send an invitation to a new team member. They will receive an email to set up their account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : user ? "Save Changes" : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
