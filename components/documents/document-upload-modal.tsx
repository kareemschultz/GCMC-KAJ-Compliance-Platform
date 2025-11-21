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
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"

const DOCUMENT_TYPES = [
  { value: "id_card", label: "National ID Card", hasReference: true, refLabel: "ID Number" },
  { value: "passport", label: "Passport Bio Page", hasReference: true, refLabel: "Passport Number" },
  { value: "tin_cert", label: "TIN Certificate", hasReference: true, refLabel: "TIN Number" },
  { value: "nis_card", label: "NIS Card", hasReference: true, refLabel: "NIS Number" },
  { value: "vat_cert", label: "VAT Registration Certificate", hasReference: true, refLabel: "VAT Number" },
  { value: "business_reg", label: "Business Registration", hasReference: true, refLabel: "Registration Number" },
  { value: "compliance_gra", label: "GRA Compliance Letter", hasReference: true, refLabel: "Reference Number" },
  { value: "compliance_nis", label: "NIS Compliance Letter", hasReference: true, refLabel: "Reference Number" },
  { value: "financial_stmt", label: "Financial Statement", hasReference: false },
  { value: "other", label: "Other Document", hasReference: false },
]

export function DocumentUploadModal() {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const selectedTypeConfig = DOCUMENT_TYPES.find((t) => t.value === selectedType)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setIsLoading(true)
      // Gather metadata from form
      const formData = new FormData(e.target as HTMLFormElement)
      const metadata = {
        type: selectedType,
        referenceNumber: formData.get("ref-number"),
        issueDate: formData.get("issue-date"),
        expiryDate: formData.get("expiry-date"),
        notes: formData.get("notes"),
      }

      await api.documents.upload(file, metadata)

      toast({
        title: "Document Uploaded",
        description: `${file.name} has been successfully stored.`,
      })

      setOpen(false)
      setFile(null)
      setSelectedType("")
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload client documents, IDs, or compliance certificates.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doc-type">Document Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="doc-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTypeConfig?.hasReference && (
            <div className="space-y-2">
              <Label htmlFor="ref-number">{selectedTypeConfig.refLabel}</Label>
              <Input id="ref-number" placeholder={`Enter ${selectedTypeConfig.refLabel}`} required />
            </div>
          )}

          {selectedType.includes("compliance") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue-date">Issue Date</Label>
                <Input id="issue-date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input id="expiry-date" type="date" required />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Document File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                  <FileText className="h-4 w-4" />
                  {file.name}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Drag & drop or <span className="text-primary font-medium">click to browse</span>
                  </div>
                  <div className="text-xs text-muted-foreground/75">PDF, JPG, PNG up to 10MB</div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" placeholder="Add any additional details..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || !selectedType || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
