"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Printer, Save } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export function NISComplianceForm() {
  const [employerType, setEmployerType] = useState("employer")

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="grid gap-6 print:block print:space-y-6">
      <style jsx global>{`
        @media print {
          header, aside, nav, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
        }
      `}</style>

      <Card className="print:border-none print:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>NIS Compliance Certificate Application</CardTitle>
            <CardDescription>Form C100F72 / C100F72A</CardDescription>
          </div>
          <div className="flex gap-2 no-print">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Application Type */}
          <div className="space-y-4">
            <Label>Application Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-employer"
                  checked={employerType === "employer"}
                  onCheckedChange={() => setEmployerType("employer")}
                />
                <Label htmlFor="type-employer">Employer (C100F72)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-self"
                  checked={employerType === "self-employed"}
                  onCheckedChange={() => setEmployerType("self-employed")}
                />
                <Label htmlFor="type-self">Self-Employed (C100F72A)</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section A: Particulars of Applicant */}
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Section A: Particulars of Applicant</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business-name">Name of Business / Applicant</Label>
                <Input id="business-name" placeholder="Enter business name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nis-number">NIS Number</Label>
                <Input id="nis-number" placeholder="Enter NIS number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea id="address" placeholder="Enter full business address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nature-business">Nature of Business</Label>
                <Input id="nature-business" placeholder="e.g. Retail, Construction" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Section B: Registration Details */}
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Section B: Registration Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-date">Date of Registration</Label>
                <Input id="reg-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commence-date">Date Business Commenced</Label>
                <Input id="commence-date" type="date" />
              </div>
              {employerType === "employer" && (
                <div className="space-y-2">
                  <Label htmlFor="employee-count">Number of Employees</Label>
                  <Input id="employee-count" type="number" placeholder="0" />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Section C: Compliance Details */}
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Section C: Compliance Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Application</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tender">Tender Submission</SelectItem>
                    <SelectItem value="bank">Bank Requirement</SelectItem>
                    <SelectItem value="land">Land Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-payment">Period of Last Payment</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="month" />
                  <Input placeholder="Receipt Number" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Declaration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="declaration" />
              <Label htmlFor="declaration" className="text-sm text-muted-foreground">
                I hereby declare that the information given in this application is true and correct to the best of my
                knowledge and belief.
              </Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2 pt-4">
              <div className="space-y-2">
                <Label>Signature of Applicant</Label>
                <div className="h-12 border-b border-dashed border-gray-400"></div>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="h-12 border-b border-dashed border-gray-400"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
