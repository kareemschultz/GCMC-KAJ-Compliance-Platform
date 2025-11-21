"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Loader2, Printer, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define dynamic fields for templates
const TEMPLATE_FIELDS: Record<string, { label: string; placeholder: string; type?: string }[]> = {
  "Affidavit of Income": [
    { label: "Monthly Income (GYD)", placeholder: "e.g. 150,000", type: "number" },
    { label: "Source of Income", placeholder: "e.g. Salary from ABC Corp" },
    { label: "Occupation", placeholder: "e.g. Accountant" },
  ],
  "Agreement of Sale": [
    { label: "Property Address", placeholder: "Lot 123..." },
    { label: "Sale Price (GYD)", placeholder: "e.g. 25,000,000", type: "number" },
    { label: "Purchaser Name", placeholder: "Full Name" },
  ],
  "Employment Contract": [
    { label: "Employee Name", placeholder: "Full Name" },
    { label: "Position Title", placeholder: "e.g. Sales Clerk" },
    { label: "Start Date", placeholder: "YYYY-MM-DD", type: "date" },
    { label: "Salary (GYD)", placeholder: "e.g. 80,000", type: "number" },
  ],
  "Business Proposal": [
    { label: "Client Name", placeholder: "Target Company Name" },
    { label: "Project Scope", placeholder: "Brief description..." },
    { label: "Estimated Budget", placeholder: "e.g. 500,000" },
  ],
}

export function DocumentGeneratorModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!template) return

    setLoading(true)
    // Mock generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
    setOpen(false)
    setShowPreview(false)
    setFormData({})

    toast({
      title: "Document Generated",
      description: `${template} has been generated and saved to documents.`,
    })
  }

  const handleInputChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <FileText className="mr-2 h-4 w-4" /> Generate Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Legal Document</DialogTitle>
          <DialogDescription>
            Select a template to generate a standardized legal document for this client.
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template">Document Template</Label>
              <Select
                value={template}
                onValueChange={(val) => {
                  setTemplate(val)
                  setFormData({})
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Affidavit of Income">Affidavit of Income</SelectItem>
                  <SelectItem value="Agreement of Sale">Agreement of Sale</SelectItem>
                  <SelectItem value="Settlement Agreement">Settlement Agreement</SelectItem>
                  <SelectItem value="Will & Testament">Will & Testament</SelectItem>
                  <SelectItem value="Business Proposal">Business Proposal</SelectItem>
                  <SelectItem value="Partnership Agreement">Partnership Agreement</SelectItem>
                  <SelectItem value="Employment Contract">Employment Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {template && (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input id="title" defaultValue={`${template} - ${new Date().getFullYear()}`} />
                  </div>

                  {/* Dynamic Fields */}
                  {TEMPLATE_FIELDS[template]?.map((field) => (
                    <div key={field.label} className="grid gap-2">
                      <Label>{field.label}</Label>
                      <Input
                        placeholder={field.placeholder}
                        type={field.type || "text"}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes / Clauses</Label>
                    <Textarea placeholder="Enter any specific clauses or notes to include..." />
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        ) : (
          <div className="py-4">
            <div className="border rounded-md p-8 bg-white text-black shadow-sm min-h-[400px] font-serif text-sm leading-relaxed">
              <h2 className="text-center font-bold text-xl mb-8 uppercase underline">{template}</h2>

              <p className="mb-4">
                <strong>DATE:</strong> {new Date().toLocaleDateString()}
              </p>

              {Object.entries(formData).map(([key, value]) => (
                <p key={key} className="mb-4">
                  <strong>{key.toUpperCase()}:</strong> {value || "______________________"}
                </p>
              ))}

              <p className="mb-4">
                This document serves as a formal {template.toLowerCase()} between the parties mentioned above...
              </p>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="border-t border-black pt-2 text-center">Signature</div>
                <div className="border-t border-black pt-2 text-center">Witness</div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          {showPreview ? (
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Edit
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}

          <div className="flex gap-2">
            {!showPreview && template && (
              <Button variant="secondary" onClick={() => setShowPreview(true)}>
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
            )}
            <Button onClick={handleGenerate} disabled={!template || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Printer className="mr-2 h-4 w-4" /> Generate Document
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
