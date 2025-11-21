"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const WIZARD_STEPS = [
  { id: 1, title: "Select Template", description: "Choose document type" },
  { id: 2, title: "Client Information", description: "Enter client details" },
  { id: 3, title: "Document Details", description: "Fill in specific information" },
  { id: 4, title: "Review & Generate", description: "Verify and create document" },
]

export function DocumentWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    template: "",
    clientName: "",
    clientEmail: "",
    documentTitle: "",
    notes: "",
  })
  const { toast } = useToast()

  const progress = (currentStep / WIZARD_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerate = () => {
    toast({
      title: "Document Generated",
      description: "Your document has been created successfully.",
    })
    setCurrentStep(1)
    setFormData({
      template: "",
      clientName: "",
      clientEmail: "",
      documentTitle: "",
      notes: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Creation Wizard</CardTitle>
        <CardDescription>
          Step {currentStep} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep - 1].description}
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Select Template */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="template">Document Template</Label>
              <Select value={formData.template} onValueChange={(val) => setFormData({ ...formData, template: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="affidavit-income">Affidavit of Income</SelectItem>
                  <SelectItem value="agreement-sale">Agreement of Sale</SelectItem>
                  <SelectItem value="employment-contract">Employment Contract</SelectItem>
                  <SelectItem value="business-proposal">Business Proposal</SelectItem>
                  <SelectItem value="will-testament">Will & Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Client Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Enter client full name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 3: Document Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="documentTitle">Document Title</Label>
              <Input
                id="documentTitle"
                placeholder="Enter document title"
                value={formData.documentTitle}
                onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any specific clauses or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Document Summary</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Template:</span> {formData.template || "Not selected"}
                </p>
                <p>
                  <span className="font-medium">Client:</span> {formData.clientName || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {formData.clientEmail || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Title:</span> {formData.documentTitle || "Not provided"}
                </p>
                {formData.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {formData.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < WIZARD_STEPS.length ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleGenerate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Generate Document
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
