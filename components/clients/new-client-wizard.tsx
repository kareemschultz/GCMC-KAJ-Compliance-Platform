"use client"

import * as React from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SERVICE_CATALOG, COMMON_REQUIREMENTS, SERVICE_REQUIREMENTS } from "@/lib/constants"
import { Plus, ArrowRight, ArrowLeft, Check, AlertCircle, Loader2, Info, Upload, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export function NewClientWizard() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    type: "Company",
    name: "",
    email: "",
    phone: "",
    address: "",
    tin: "",
    nis: "",
    vat: "",
    regNumber: "",
    idType: "National ID",
    idNumber: "",
    selectedServices: [] as string[],
    uploadedFiles: {} as Record<string, File>,
  })

  const totalSteps = 5

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.name.length > 2
      case 2:
        return formData.email.includes("@") && formData.phone.length > 5
      case 3:
        return formData.idNumber.length > 3 && formData.tin.length > 5
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step) && step < totalSteps) setStep(step + 1)
    else if (!validateStep(step)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      console.log("Uploading files:", formData.uploadedFiles)

      await api.clients.create(formData)

      toast({
        title: "Client Created Successfully",
        description: `${formData.name} has been added to the platform with ${Object.keys(formData.uploadedFiles).length} documents.`,
      })

      setOpen(false)
      setStep(1)
      router.push("/clients/1")

      setFormData({
        type: "Company",
        name: "",
        email: "",
        phone: "",
        address: "",
        tin: "",
        nis: "",
        vat: "",
        regNumber: "",
        idType: "National ID",
        idNumber: "",
        selectedServices: [],
        uploadedFiles: {},
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleService = (serviceName: string) => {
    setFormData((prev) => {
      const services = prev.selectedServices.includes(serviceName)
        ? prev.selectedServices.filter((s) => s !== serviceName)
        : [...prev.selectedServices, serviceName]
      return { ...prev, selectedServices: services }
    })
  }

  const handleFileUpload = (requirementName: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: {
        ...prev.uploadedFiles,
        [requirementName]: file,
      },
    }))
    toast({
      title: "File Attached",
      description: `${file.name} attached for ${requirementName}`,
    })
  }

  const handleRemoveFile = (requirementName: string) => {
    setFormData((prev) => {
      const newFiles = { ...prev.uploadedFiles }
      delete newFiles[requirementName]
      return { ...prev, uploadedFiles: newFiles }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>New Client Onboarding</DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {getStepTitle(step)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Progress Bar */}
          <div className="mb-6 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn("h-2 flex-1 rounded-full transition-colors", i + 1 <= step ? "bg-primary" : "bg-muted")}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Client Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Sole Trader">Sole Trader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">{formData.type === "Individual" ? "Full Name" : "Business Name"}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={formData.type === "Individual" ? "John Doe" : "ABC Corp Ltd"}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+592 ..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Lot 123..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="idType">Primary Identification</Label>
                  <Select
                    value={formData.idType}
                    onValueChange={(value) => setFormData({ ...formData, idType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National ID">National ID Card</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Drivers License">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="idNumber">{formData.idType} Number</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    placeholder={
                      formData.idType === "National ID"
                        ? "123456789"
                        : formData.idType === "Passport"
                          ? "P1234567"
                          : "D1234567"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tin">TIN (Taxpayer ID)</Label>
                  <Input
                    id="tin"
                    value={formData.tin}
                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    placeholder="123-456-789"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nis">NIS Number</Label>
                  <Input
                    id="nis"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="A-123456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vat">VAT Number (Optional)</Label>
                  <Input
                    id="vat"
                    value={formData.vat}
                    onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                    placeholder="V-123456"
                  />
                </div>
                {formData.type !== "Individual" && (
                  <div className="grid gap-2">
                    <Label htmlFor="reg">Business Reg. No. (DCRA)</Label>
                    <Input
                      id="reg"
                      value={formData.regNumber}
                      onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                      placeholder="C-12345"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-2">
              <Label className="mb-4 block">Select Initial Services</Label>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-6">
                  {SERVICE_CATALOG.map((category, i) => (
                    <div key={i} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        {category.category} - {category.subcategory}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {category.items.map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                              id={item}
                              checked={formData.selectedServices.includes(item)}
                              onCheckedChange={() => toggleService(item)}
                            />
                            <Label
                              htmlFor={item}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {step === 5 && (
            <div className="py-2 space-y-6">
              <div className="rounded-md border p-4 bg-muted/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" /> Review Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">Client Name</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Type</span>
                    <span className="font-medium">{formData.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Email</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">TIN</span>
                    <span className="font-medium">{formData.tin}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 text-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <h4 className="font-semibold">Required Documents Checklist</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Please upload the available documents below. You can also skip this step and upload them later in the
                  client profile.
                </p>
              </div>

              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-6">
                  {/* Common Requirements */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                        1
                      </span>
                      Standard KYC Documents
                    </h4>
                    <div className="grid gap-3 pl-8">
                      {COMMON_REQUIREMENTS.map((req, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-slate-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{req.name}</div>
                              <div className="text-xs text-muted-foreground">Required for all clients</div>
                            </div>
                          </div>

                          {formData.uploadedFiles[req.name] ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <Check className="h-3 w-3" /> {formData.uploadedFiles[req.name].name.substring(0, 15)}
                                ...
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveFile(req.name)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="file"
                                id={`file-${req.name}`}
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleFileUpload(req.name, e.target.files[0])
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-transparent"
                                onClick={() => document.getElementById(`file-${req.name}`)?.click()}
                              >
                                <Upload className="mr-2 h-3 w-3" /> Upload
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Specific Requirements */}
                  {formData.selectedServices.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                          2
                        </span>
                        Service Specific Requirements
                      </h4>
                      <div className="space-y-4 pl-8">
                        {formData.selectedServices.map((service) => {
                          const requirements = SERVICE_REQUIREMENTS[service] || []
                          if (requirements.length === 0) return null

                          return (
                            <div key={service} className="rounded-lg border p-4 bg-muted/10">
                              <div className="font-medium text-sm mb-3 text-primary flex items-center gap-2">
                                {service}
                                <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                                  {requirements.length} documents
                                </span>
                              </div>
                              <div className="grid gap-2">
                                {requirements.map((req, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 bg-background rounded border border-dashed"
                                  >
                                    <div className="flex items-center gap-2">
                                      {req.required ? (
                                        <AlertCircle className="h-3 w-3 text-amber-600" />
                                      ) : (
                                        <Info className="h-3 w-3 text-blue-500" />
                                      )}
                                      <span
                                        className={cn(
                                          "text-sm",
                                          req.required ? "font-medium" : "text-muted-foreground",
                                        )}
                                      >
                                        {req.name}
                                      </span>
                                      {req.required && (
                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                          Required
                                        </span>
                                      )}
                                    </div>

                                    {formData.uploadedFiles[`${service}-${req.name}`] ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                          <Check className="h-3 w-3" /> Uploaded
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => handleRemoveFile(`${service}-${req.name}`)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="relative">
                                        <input
                                          type="file"
                                          id={`file-${service}-${req.name}`}
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files?.[0])
                                              handleFileUpload(`${service}-${req.name}`, e.target.files[0])
                                          }}
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
                                          onClick={() =>
                                            document.getElementById(`file-${service}-${req.name}`)?.click()
                                          }
                                        >
                                          <Upload className="mr-2 h-3 w-3" /> Upload
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  Complete Onboarding <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getStepTitle(step: number) {
  switch (step) {
    case 1:
      return "Basic Information"
    case 2:
      return "Contact Details"
    case 3:
      return "Identification & Registration"
    case 4:
      return "Service Selection"
    case 5:
      return "Requirements Review"
    default:
      return ""
  }
}
