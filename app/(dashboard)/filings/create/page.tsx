"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, FileText, AlertCircle, Upload, CheckCircle2, Download } from "lucide-react"
import Link from "next/link"
import { SERVICE_REQUIREMENTS } from "@/lib/constants"

// Map URL types to Service Names in constants
const TYPE_MAPPING: Record<string, string> = {
  "income-tax": "Income Tax Returns",
  "corp-tax": "Corporation Tax Returns",
  "property-tax": "Property Tax Returns",
  paye: "PAYE Returns", // Need to ensure this key exists or map close enough
  "capital-gains": "Capital Gains Tax",
  "excise-tax": "Excise Tax Returns",
  "compliance-tender": "Tender Compliance",
  "compliance-land": "Land Transfer Compliance",
  "compliance-liability": "Liability Compliance (Firearm, etc.)",
  "nis-contribution": "National Insurance Scheme (NIS)",
  "business-reg": "Business Registration",
}

export default function CreateFilingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type") || ""
  const serviceName = TYPE_MAPPING[type] || "General Filing"

  const [client, setClient] = useState("")
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})
  const [period, setPeriod] = useState("")
  const [notes, setNotes] = useState("")
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Load clients when component mounts
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/clients?limit=50")
        if (response.ok) {
          const data = await response.json()
          setClients(data.clients || [])
        } else {
          toast.error("Failed to load clients")
        }
      } catch (error) {
        console.error("Error loading clients:", error)
        toast.error("Failed to load clients")
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [])

  // Set requirements based on service type
  useEffect(() => {
    if (serviceName && SERVICE_REQUIREMENTS[serviceName]) {
      setRequirements(SERVICE_REQUIREMENTS[serviceName])
    } else {
      // Fallback requirements if not found
      setRequirements([
        { id: "form", name: "Completed Application Form", type: "Form", required: true },
        { id: "payment", name: "Proof of Payment", type: "Financial", required: true },
      ])
    }
  }, [serviceName])

  const handleFileUpload = (reqId: string, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [reqId]: file.name,
    }))
    toast.success(`File "${file.name}" uploaded successfully`)
  }

  const triggerFileInput = (reqId: string) => {
    fileInputRefs.current[reqId]?.click()
  }

  const handleDownloadTemplate = (reqName: string) => {
    // Generate a simple template file
    const templateContent = `${reqName}\n\nThis is a template for: ${reqName}\n\nPlease fill out the required information below:\n\n- Field 1: _______________\n- Field 2: _______________\n- Field 3: _______________\n\nSignature: _______________\nDate: _______________`

    const blob = new Blob([templateContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reqName.toLowerCase().replace(/\s+/g, "-")}-template.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success(`Template for "${reqName}" downloaded`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Improved validation
    if (!client) {
      toast.error("Please select a client to proceed")
      return
    }

    if (!period.trim()) {
      toast.error("Please specify the tax period (e.g., 'Q1 2025' or 'Jan 2025')")
      return
    }

    const missingReqs = requirements.filter((req) => req.required && !uploadedFiles[req.id])
    if (missingReqs.length > 0) {
      toast.error(`Missing required documents: ${missingReqs.map((r) => r.name).join(", ")}`)
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call to create filing
      const filingData = {
        clientId: client,
        type: serviceName,
        period: period.trim(),
        notes: notes.trim(),
        uploadedFiles: Object.keys(uploadedFiles),
        status: "DRAFT"
      }

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const selectedClient = clients.find(c => c.id === client)
      toast.success(`${serviceName} submitted successfully`, {
        description: `Filing created for ${selectedClient?.name || 'client'} - ${period}`,
      })

      router.push("/filings")
    } catch (error) {
      toast.error("Failed to create filing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/filings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Filing</h2>
          <p className="text-muted-foreground">Initialize a new {serviceName}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Filing Details</CardTitle>
            <CardDescription>Select the client and period for this filing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={client} onValueChange={setClient} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading clients..." : "Select a client"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((clientItem) => (
                    <SelectItem key={clientItem.id} value={clientItem.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{clientItem.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {clientItem.type} • {clientItem.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {clients.length === 0 && !isLoading && (
                    <SelectItem value="" disabled>
                      No clients available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {client && (
                <p className="text-xs text-muted-foreground">
                  Selected: {clients.find(c => c.id === client)?.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Tax Period *</Label>
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g., Q1 2025, Jan 2025, FY 2024"
              />
              <p className="text-xs text-muted-foreground">
                Specify the reporting period for this filing
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions, deadlines, or notes..."
              />
            </div>

            {/* Add validation summary */}
            {(!client || !period.trim()) && (
              <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-amber-700">
                    <strong>Required:</strong> Please select a client and specify the tax period to continue.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements Checklist</CardTitle>
            <CardDescription>Upload the required documents to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between space-x-3 p-3 border rounded-md bg-muted/50"
                >
                  <div className="flex items-start space-x-3">
                    {uploadedFiles[req.id] ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : req.required ? (
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {req.name}
                        {req.required && (
                          <span className="ml-2 text-xs text-amber-600 font-semibold bg-amber-100 px-1.5 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Type: {req.type}</p>
                      {uploadedFiles[req.id] && (
                        <p className="text-xs text-green-600 font-medium">Uploaded: {uploadedFiles[req.id]}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!uploadedFiles[req.id] && (
                      <>
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[req.id] = el
                          }}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(req.id, file)
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 bg-transparent"
                          onClick={() => triggerFileInput(req.id)}
                        >
                          <Upload className="h-3 w-3 mr-2" />
                          Upload
                        </Button>
                      </>
                    )}
                    {req.type === "Form" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleDownloadTemplate(req.name)}
                      >
                        <Download className="h-3 w-3 mr-2" />
                        Template
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting || !client || !period.trim() || isLoading}
            >
              {isSubmitting ? "Creating Filing..." : "Create Filing & Upload Documents"}
            </Button>
            {(!client || !period.trim()) && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Complete required fields above to enable submission
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
