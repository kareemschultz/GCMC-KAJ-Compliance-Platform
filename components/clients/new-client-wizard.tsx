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
import { SearchableSelect } from "@/components/ui/searchable-select"
import { DROPDOWN_DATA } from "@/lib/dropdown-data"
import { formatPhoneNumber, formatNationalId, validateFormat } from "@/lib/input-formatters"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SERVICE_CATALOG, COMMON_REQUIREMENTS, SERVICE_REQUIREMENTS } from "@/lib/constants"
import { Plus, ArrowRight, ArrowLeft, Check, CheckCircle, AlertCircle, Loader2, Info, Upload, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface NewClientWizardProps {
  onClientCreated?: (client: any) => void
}

export function NewClientWizard({ onClientCreated }: NewClientWizardProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    type: "COMPANY",
    name: "",
    email: "",
    phone: "",
    address: "",
    tin: "",
    nis: "",
    vat: "",
    regNumber: "",
    primaryIdType: "National ID",
    primaryIdNumber: "",
    secondaryIdType: "",
    secondaryIdNumber: "",
    firstName: "",
    middleName: "",
    surname: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "Male",
    passportNumber: "",
    passportExpiry: "",
    idIssueDate: "",
    isLocalContentQualified: false,
    isLocalAccount: false,
    selectedServices: [] as string[],
    uploadedFiles: {} as Record<string, File>,
  })

  const totalSteps = 5

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (formData.type === "INDIVIDUAL") {
          return formData.firstName.length > 1 && formData.surname.length > 1
        }
        return formData.name.length > 2
      case 2:
        return formData.email.includes("@") && formData.phone.length > 5
      case 3:
        if (formData.type === "INDIVIDUAL") {
          // Must have primary ID, ID number, and date of birth
          const hasPrimaryId = formData.primaryIdType && formData.primaryIdNumber.length > 3
          const hasDateOfBirth = formData.dateOfBirth.length > 0
          const hasOptionalGovId = formData.tin.length > 3 || formData.nis.length > 3

          // Primary ID + DOB is sufficient, government IDs are optional
          return hasPrimaryId && hasDateOfBirth
        }
        // For companies - at least one of TIN or business reg (more flexible for new businesses)
        return formData.tin.length > 3 || formData.regNumber.length > 3
      default:
        return true
    }
  }

  const handleNext = () => {
    console.log('handleNext called, step:', step, 'validation result:', validateStep(step))
    console.log('Form data for validation:', {
      type: formData.type,
      primaryIdType: formData.primaryIdType,
      primaryIdNumber: formData.primaryIdNumber,
      dateOfBirth: formData.dateOfBirth,
      firstName: formData.firstName,
      surname: formData.surname,
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    })

    if (validateStep(step) && step < totalSteps) {
      setStep(step + 1)
    } else if (!validateStep(step)) {
      let errorMessage = "Please fill in all required fields correctly."

      if (step === 1) {
        if (formData.type === "INDIVIDUAL") {
          errorMessage = "Please fill in First Name and Surname."
        } else {
          errorMessage = "Please fill in Company Name."
        }
      } else if (step === 2) {
        errorMessage = "Please fill in Email and Phone Number."
      } else if (step === 3) {
        if (formData.type === "INDIVIDUAL") {
          if (!formData.dateOfBirth) {
            errorMessage = "Date of Birth is required. Please go back to Step 1 and fill it in."
          } else if (!formData.primaryIdType || formData.primaryIdNumber.length <= 3) {
            errorMessage = "Please select an ID type and enter the ID number."
          }
        } else {
          errorMessage = "Please provide either TIN or Business Registration Number."
        }
      }

      toast({
        title: "Validation Error",
        description: errorMessage,
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
      console.log("Submitting client data:", formData)

      const response = await api.clients.create(formData)
      console.log("API response:", response)

      // Use actual database response to create client object
      const newClient = {
        id: response.id,
        name: response.name || formData.name || `${formData.firstName} ${formData.surname}`.trim(),
        type: response.type || formData.type,
        email: response.email || formData.email,
        phone: response.phone || formData.phone,
        tin: response.tinNumber || response.tin || formData.tin,
        status: response.isActive ? "Active" : "Inactive",
        compliance: 75, // Default compliance score for UI
        documents: Object.keys(formData.uploadedFiles).length,
        lastActivity: "Just now",
        createdAt: response.createdAt || new Date().toISOString()
      }

      toast({
        title: "Client Created Successfully",
        description: `${newClient.name} has been added to the platform with ${Object.keys(formData.uploadedFiles).length} documents.`,
      })

      // Call the callback if provided
      if (onClientCreated) {
        onClientCreated(newClient)
      }

      setOpen(false)
      setStep(1)

      setFormData({
        type: "COMPANY",
        name: "",
        email: "",
        phone: "",
        address: "",
        tin: "",
        nis: "",
        vat: "",
        regNumber: "",
        primaryIdType: "National ID",
        primaryIdNumber: "",
        secondaryIdType: "",
        secondaryIdNumber: "",
        firstName: "",
        middleName: "",
        surname: "",
        dateOfBirth: "",
        placeOfBirth: "",
        gender: "Male",
        passportNumber: "",
        passportExpiry: "",
        idIssueDate: "",
        isLocalContentQualified: false,
        isLocalAccount: false,
        selectedServices: [],
        uploadedFiles: {},
      })
    } catch (error) {
      console.error("Error creating client:", error)
      toast({
        title: "Error",
        description: `Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
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
                <SearchableSelect
                  options={DROPDOWN_DATA.clientTypes}
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  placeholder="Select client type"
                  showDescriptions={true}
                  className="w-full"
                />
              </div>

              {formData.type === "INDIVIDUAL" ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        placeholder="A."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="surname">Surname</Label>
                      <Input
                        id="surname"
                        value={formData.surname}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <SearchableSelect
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Other", label: "Other" },
                          { value: "Prefer not to say", label: "Prefer not to say" }
                        ]}
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        placeholder="Select Gender"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pob">Place of Birth (Region/City)</Label>
                    <Input
                      id="pob"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      placeholder="Georgetown, Region 4"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="localContent"
                      checked={formData.isLocalContentQualified}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isLocalContentQualified: checked as boolean })
                      }
                    />
                    <Label htmlFor="localContent" className="font-medium">
                      Local Content Qualified (Guyanese National)
                    </Label>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ABC Corp Ltd"
                  />
                </div>
              )}
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="localAccount"
                  checked={formData.isLocalAccount}
                  onCheckedChange={(checked) => setFormData({ ...formData, isLocalAccount: checked as boolean })}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="localAccount" className="font-medium">
                    Create as Local Account
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Do not send an email invitation. The account will be managed internally.
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setFormData({ ...formData, phone: formatted.formatted })
                  }}
                  placeholder="+592-123-4567"
                />
                <p className="text-xs text-muted-foreground">
                  Enter Guyanese phone number (will auto-format)
                </p>
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
              <div className="rounded-md border p-4 bg-blue-50/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  Flexible Identification Requirements
                </h4>
                <p className="text-sm text-blue-700">
                  Provide at least one primary form of identification. Additional documents can be added later.
                </p>
              </div>

              {/* Validation Status Indicator */}
              {formData.type === "INDIVIDUAL" && (
                <div className="rounded-md border p-3 bg-gray-50">
                  <h5 className="font-medium mb-2 text-sm">Required Information Status:</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      {formData.dateOfBirth ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      )}
                      <span className={formData.dateOfBirth ? "text-green-700" : "text-amber-700"}>
                        Date of Birth {formData.dateOfBirth ? "(✓ provided in Step 1)" : "(⚠ missing from Step 1)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.primaryIdType && formData.primaryIdNumber.length > 3 ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      )}
                      <span className={formData.primaryIdType && formData.primaryIdNumber.length > 3 ? "text-green-700" : "text-amber-700"}>
                        Primary ID {formData.primaryIdType && formData.primaryIdNumber.length > 3 ? `(✓ ${formData.primaryIdType})` : "(⚠ select type and enter number)"}
                      </span>
                    </div>
                    {!formData.dateOfBirth && (
                      <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                        <strong>Tip:</strong> Please go back to Step 1 and fill in the Date of Birth field to continue.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {formData.type === "INDIVIDUAL" ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="primaryIdType">Primary ID Type *</Label>
                      <SearchableSelect
                        options={DROPDOWN_DATA.idTypes}
                        value={formData.primaryIdType}
                        onValueChange={(value) => setFormData({ ...formData, primaryIdType: value })}
                        placeholder="Select ID type"
                        showDescriptions={true}
                        className="w-full"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="primaryIdNumber">Primary ID Number *</Label>
                      <Input
                        id="primaryIdNumber"
                        value={formData.primaryIdNumber}
                        onChange={(e) => {
                          const formatted = formData.primaryIdType === "National ID"
                            ? formatNationalId(e.target.value)
                            : { formatted: e.target.value, isValid: true }
                          setFormData({ ...formData, primaryIdNumber: formatted.formatted })
                        }}
                        placeholder={formData.primaryIdType === "National ID" ? "144123456" :
                                   formData.primaryIdType === "Passport" ? "R0712345" :
                                   formData.primaryIdType === "Driver's License" ? "DL123456" :
                                   "ID Number"}
                      />
                      {formData.primaryIdType && (
                        <p className="text-xs text-muted-foreground">
                          Format will be validated based on selected ID type
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="secondaryIdType">Secondary ID Type (Optional)</Label>
                      <SearchableSelect
                        options={[
                          { value: "", label: "None", description: "No additional ID required" },
                          ...DROPDOWN_DATA.idTypes
                        ]}
                        value={formData.secondaryIdType}
                        onValueChange={(value) => setFormData({ ...formData, secondaryIdType: value })}
                        placeholder="Select additional ID"
                        showDescriptions={true}
                        className="w-full"
                        clearable={true}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="secondaryIdNumber">Secondary ID Number</Label>
                      <Input
                        id="secondaryIdNumber"
                        value={formData.secondaryIdNumber}
                        onChange={(e) => setFormData({ ...formData, secondaryIdNumber: e.target.value })}
                        placeholder="Optional"
                        disabled={!formData.secondaryIdType}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="idIssue">ID Issue Date (Optional)</Label>
                    <Input
                      id="idIssue"
                      type="date"
                      value={formData.idIssueDate}
                      onChange={(e) => setFormData({ ...formData, idIssueDate: e.target.value })}
                    />
                  </div>
                </div>
              ) : null}

              <div className="border-t pt-4">
                <h5 className="font-medium mb-3 text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  Government Registration Numbers (Optional)
                </h5>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    {formData.type === "COMPANY" ? (
                      <div className="grid gap-2">
                        <Label htmlFor="tin">TIN (Taxpayer ID)</Label>
                        <Input
                          id="tin"
                          value={formData.tin}
                          onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                          placeholder="123-456-789 (if available)"
                        />
                        <p className="text-xs text-muted-foreground">Required for tax filings</p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="tin">TIN (Optional for individuals)</Label>
                        <Input
                          id="tin"
                          value={formData.tin}
                          onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                          placeholder="123-456-789"
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="nis">NIS Number</Label>
                      <Input
                        id="nis"
                        value={formData.nis}
                        onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                        placeholder="A-123456 (if available)"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.type === "INDIVIDUAL" ? "For employment/benefits" : "For company NIS"}
                      </p>
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
                      <p className="text-xs text-muted-foreground">Only if VAT registered</p>
                    </div>
                    {formData.type !== "INDIVIDUAL" && (
                      <div className="grid gap-2">
                        <Label htmlFor="reg">Business Registration (DCRA)</Label>
                        <Input
                          id="reg"
                          value={formData.regNumber}
                          onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                          placeholder="C-12345 (if incorporated)"
                        />
                        <p className="text-xs text-muted-foreground">For incorporated companies</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <strong>Required:</strong> Primary ID and Date of Birth are sufficient to proceed.
                      TIN/NIS numbers are optional and can be added later in the client profile.
                    </p>
                  </div>
                </div>
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
                  <div>
                    <span className="text-muted-foreground block text-xs">Account Type</span>
                    <span className="font-medium">
                      {formData.isLocalAccount ? "Local (No Invite)" : "Standard (Invite Sent)"}
                    </span>
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
            <Button
              onClick={handleNext}
              disabled={!validateStep(step)}
              className={!validateStep(step) ? "opacity-50 cursor-not-allowed" : ""}
            >
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
