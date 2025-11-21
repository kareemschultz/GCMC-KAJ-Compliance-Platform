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
import { Plus, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddResourceModalProps {
  onAdd: (resource: any) => void
}

export function AddResourceModal({ onAdd }: AddResourceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "PDF",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newResource = {
      name: formData.name,
      type: formData.type,
      size: "1.5 MB", // Mock size
      updated: new Date().toISOString().split("T")[0],
    }

    onAdd({ category: formData.category, item: newResource })

    toast({
      title: "Resource Added",
      description: `${formData.name} has been added to the Knowledge Base.`,
    })

    setLoading(false)
    setOpen(false)
    setFormData({ name: "", category: "", type: "PDF" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Knowledge Base</DialogTitle>
          <DialogDescription>Upload a new form, guide, or policy document.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              placeholder="e.g., 2025 Tax Guidelines"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GRA (Revenue Authority)">GRA (Revenue Authority)</SelectItem>
                <SelectItem value="NIS (National Insurance)">NIS (National Insurance)</SelectItem>
                <SelectItem value="DCRA (Commercial Registry)">DCRA (Commercial Registry)</SelectItem>
                <SelectItem value="System Documentation">System Documentation</SelectItem>
                <SelectItem value="Compliance Manuals">Compliance Manuals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Document Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF Document</SelectItem>
                <SelectItem value="DOCX">Word Document</SelectItem>
                <SelectItem value="XLSX">Excel Spreadsheet</SelectItem>
                <SelectItem value="LINK">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>File Upload</Label>
            <div className="flex items-center justify-center rounded-md border border-dashed p-6">
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <span className="mt-2 block text-sm text-muted-foreground">Drag & drop or click to upload</span>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
