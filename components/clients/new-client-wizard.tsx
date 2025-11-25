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
import { Plus, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { NewClientWizardContext, NewClientWizardData } from "./new-client-wizard/wizard-context"
import { Step1_BasicInfo } from "./new-client-wizard/Step1_BasicInfo"
import { Step2_ContactDetails } from "./new-client-wizard/Step2_ContactDetails"
import { Step3_Identification } from "./new-client-wizard/Step3_Identification"
import { Step4_ServiceSelection } from "./new-client-wizard/Step4_ServiceSelection"
import { Step5_Review } from "./new-client-wizard/Step5_Review"

interface NewClientWizardProps {
  onClientCreated?: (client: any) => void
}

const getStepTitle = (step: number) => {
  switch (step) {
    case 1: return "Basic Information"
    case 2: return "Contact Details"
    case 3: return "Identification & Registration"
    case 4: return "Service Selection"
    case 5: return "Requirements Review"
    default: return ""
  }
}

export function NewClientWizard({ onClientCreated }: NewClientWizardProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = React.useState<NewClientWizardData>({
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
          const hasPrimaryId = formData.primaryIdType && formData.primaryIdNumber.length > 3
          const hasDateOfBirth = formData.dateOfBirth.length > 0
          return hasPrimaryId && hasDateOfBirth
        }
        return formData.tin.length > 3 || formData.regNumber.length > 3
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step) && step < totalSteps) {
      setStep(step + 1)
    } else if (!validateStep(step)) {
      let errorMessage = "Please fill in all required fields correctly."
      // Error messages as before
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
    setIsLoading(true);
    try {
      const response = await api.clients.create(formData);
      const newClient = {
        id: response.id,
        name: response.name || formData.name || `${formData.firstName} ${formData.surname}`.trim(),
        type: response.type || formData.type,
        email: response.email || formData.email,
        phone: response.phone || formData.phone,
        tin: response.tinNumber || response.tin || formData.tin,
        status: response.isActive ? "Active" : "Inactive",
        compliance: 75,
        documents: Object.keys(formData.uploadedFiles).length,
        lastActivity: "Just now",
        createdAt: response.createdAt || new Date().toISOString()
      };
      toast({
        title: "Client Created Successfully",
        description: `${newClient.name} has been added to the platform.`,
      });
      if (onClientCreated) {
        onClientCreated(newClient);
      }
      setOpen(false);
      setStep(1);
      // Reset form
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const toggleService = (serviceName: string) => {
    setFormData((prev) => {
      const services = prev.selectedServices.includes(serviceName)
        ? prev.selectedServices.filter((s) => s !== serviceName)
        : [...prev.selectedServices, serviceName];
      return { ...prev, selectedServices: services };
    });
  }

  const handleFileUpload = (requirementName: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: {
        ...prev.uploadedFiles,
        [requirementName]: file,
      },
    }));
    toast({
      title: "File Attached",
      description: `${file.name} attached for ${requirementName}`,
    });
  }

  const handleRemoveFile = (requirementName: string) => {
    setFormData((prev) => {
      const newFiles = { ...prev.uploadedFiles };
      delete newFiles[requirementName];
      return { ...prev, uploadedFiles: newFiles };
    });
  }

  const contextValue = {
    formData,
    setFormData,
    step,
    setStep,
    totalSteps,
    handleNext,
    handleBack,
    isLoading,
    validateStep,
    toggleService,
    handleFileUpload,
    handleRemoveFile
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="new-client-button">
          <Plus className="mr-2 h-4 w-4" /> New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]" data-testid="client-wizard-modal">
        <NewClientWizardContext.Provider value={contextValue}>
          <DialogHeader>
            <DialogTitle data-testid="wizard-title">New Client Onboarding</DialogTitle>
            <DialogDescription data-testid="wizard-description">
              Step {step} of {totalSteps}: {getStepTitle(step)}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6 flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn("h-2 flex-1 rounded-full transition-colors", i + 1 <= step ? "bg-primary" : "bg-muted")}
                />
              ))}
            </div>

            {step === 1 && <Step1_BasicInfo />}
            {step === 2 && <Step2_ContactDetails />}
            {step === 3 && <Step3_Identification />}
            {step === 4 && <Step4_ServiceSelection />}
            {step === 5 && <Step5_Review />}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleBack} disabled={step === 1} data-testid="wizard-back-button">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(step)}
                className={!validateStep(step) ? "opacity-50 cursor-not-allowed" : ""}
                data-testid="wizard-next-button"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading} data-testid="submit-client">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    Add <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </NewClientWizardContext.Provider>
      </DialogContent>
    </Dialog>
  )
}