"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, FileText, AlertCircle } from "lucide-react"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<any[]>([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) {
      toast.error("Please select a client")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`${serviceName} created successfully`, {
      description: "The filing record has been initialized.",
    })

    setIsSubmitting(false)
    router.push("/filings")
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
              <Label htmlFor="client">Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">ABC Corporation Ltd</SelectItem>
                  <SelectItem value="c2">Guyana Tech Solutions</SelectItem>
                  <SelectItem value="c3">Georgetown Retailers</SelectItem>
                  <SelectItem value="c4">John Smith Trading</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Tax Period</Label>
              <Input id="period" placeholder="e.g., Q1 2025 or Jan 2025" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Input id="notes" placeholder="Any special instructions..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements Checklist</CardTitle>
            <CardDescription>Ensure these documents are ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-md bg-muted/50">
                  {req.required ? (
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating Record..." : "Initialize Filing Record"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
