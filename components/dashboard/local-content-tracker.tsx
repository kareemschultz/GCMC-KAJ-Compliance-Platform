"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Upload, AlertCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface Requirement {
  id: string
  label: string
  description: string
  status: "pending" | "uploaded" | "verified"
  fileName?: string
}

export function LocalContentTracker() {
  const { toast } = useToast()
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: "biz-reg",
      label: "Business Registration",
      description: "Certificate of Registration from Commercial Registry",
      status: "pending",
    },
    {
      id: "nis-comp",
      label: "NIS Compliance",
      description: "Valid NIS Compliance Certificate",
      status: "pending",
    },
    {
      id: "tin-cert",
      label: "TIN Certificate",
      description: "Taxpayer Identification Number Certificate",
      status: "pending",
    },
    {
      id: "owner-id",
      label: "Owner Identification",
      description: "National ID or Passport of Guyanese Owners",
      status: "pending",
    },
    {
      id: "org-chart",
      label: "Organizational Chart",
      description: "Showing management structure and local employment",
      status: "pending",
    },
  ])

  const uploadedCount = requirements.filter((r) => r.status !== "pending").length
  const progress = (uploadedCount / requirements.length) * 100
  const isComplete = uploadedCount === requirements.length

  const handleUpload = (id: string) => {
    // Simulate file upload
    setRequirements((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "uploaded", fileName: `${req.label.replace(/\s+/g, "_")}.pdf` } : req,
      ),
    )
    toast({
      title: "Document Uploaded",
      description: "The document has been attached to the application.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Local Content Registration
            </CardTitle>
            <CardDescription>Ministry of Natural Resources Compliance Checklist</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">
              {uploadedCount}/{requirements.length}
            </span>
            <p className="text-xs text-muted-foreground">Documents Ready</p>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={cn(
                "flex items-start justify-between p-3 rounded-lg border",
                req.status === "uploaded" ? "bg-green-50 border-green-200" : "bg-white text-slate-900",
              )}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {req.status === "uploaded" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className={cn("font-medium text-sm", req.status === "uploaded" && "text-green-900")}>
                    {req.label}
                  </h4>
                  <p className={cn("text-xs", req.status === "uploaded" ? "text-green-700" : "text-slate-500")}>
                    {req.description}
                  </p>
                  {req.fileName && (
                    <p className="text-xs text-green-700 mt-1 font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {req.fileName}
                    </p>
                  )}
                </div>
              </div>

              {req.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs bg-transparent"
                  onClick={() => handleUpload(req.id)}
                >
                  <Upload className="mr-2 h-3 w-3" /> Upload
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t p-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>All 5 documents required for submission</span>
          </div>
          <Button disabled={!isComplete} className={cn(isComplete ? "bg-green-600 hover:bg-green-700" : "")}>
            Submit Application
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
