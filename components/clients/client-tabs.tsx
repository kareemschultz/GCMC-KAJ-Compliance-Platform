"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Upload,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
  MessageSquare,
  Eye,
} from "lucide-react"
import { ServiceRequestModal } from "@/components/services/service-request-modal"
import { DocumentUploadModal } from "@/components/documents/document-upload-modal"
import { DocumentGeneratorModal } from "@/components/documents/document-generator-modal"
import { DocumentPreviewModal } from "@/components/documents/document-preview-modal"
import { ImmigrationKanban } from "@/components/immigration/immigration-kanban"
import { COMMON_REQUIREMENTS, SERVICE_REQUIREMENTS } from "@/lib/constants"
import { useState } from "react"
import { Plus } from "lucide-react"

export function ClientTabs() {
  // Mock active services for this client
  const activeServices = [
    { name: "Income Tax Returns", category: "KAJ - GRA", status: "Active", since: "Jan 2023" },
    { name: "Work Permits", category: "GCMC - Immigration", status: "Active", since: "Feb 2023" },
    { name: "Business Registration", category: "GCMC - Consultancy", status: "Completed", since: "Jan 2020" },
  ]

  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc)
    setIsPreviewOpen(true)
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="identification">Identification</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="filings">Filings</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="immigration">Immigration</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">contact@abccorp.gy</div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">+592 223-4567</div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">123 Camp Street, Georgetown, Guyana</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Assigned Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">John Doe</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">Sarah Smith</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-muted-foreground">Registration #</div>
                  <div className="font-medium">C-12345</div>
                  <div className="text-muted-foreground">Incorporation Date</div>
                  <div className="font-medium">Jan 15, 2020</div>
                  <div className="text-muted-foreground">Fiscal Year End</div>
                  <div className="font-medium">December 31</div>
                  <div className="text-muted-foreground">Industry</div>
                  <div className="font-medium">Retail & Distribution</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Document Uploaded", detail: "VAT Certificate 2024", time: "2 hours ago" },
                    { action: "Filing Submitted", detail: "Q4 2024 VAT Return", time: "1 day ago" },
                    { action: "Task Completed", detail: "Client Onboarding", time: "3 days ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 text-sm">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                        <Clock className="h-3 w-3" />
                      </div>
                      <div className="grid gap-0.5">
                        <div className="font-medium">{item.action}</div>
                        <div className="text-muted-foreground">{item.detail}</div>
                        <div className="text-xs text-muted-foreground">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="identification" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { type: "TIN Certificate", number: "123-456-789", expiry: "No Expiry", status: "valid" },
            { type: "NIS Registration", number: "E-98765", expiry: "No Expiry", status: "valid" },
            { type: "National ID Card", number: "ID-11223344", expiry: "Mar 20, 2025", status: "warning" },
            { type: "Passport", number: "P-99887766", expiry: "Dec 15, 2028", status: "valid" },
            { type: "Driver's License", number: "DL-554433", expiry: "Jul 10, 2026", status: "valid" },
            { type: "VAT Registration", number: "V-12345", expiry: "No Expiry", status: "valid" },
            { type: "Business Registration", number: "BR-55443", expiry: "Jan 15, 2026", status: "valid" },
          ].map((id, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{id.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold mb-2">{id.number}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Expires: {id.expiry}</div>
                  {id.status === "valid" ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Expiring Soon
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 h-8"
                  onClick={() =>
                    handleViewDocument({
                      name: id.type,
                      type: "Identification",
                      referenceNumber: id.number,
                      status: id.status === "valid" ? "Valid" : "Expiring Soon",
                      uploadDate: "Jan 15, 2023",
                      uploadedBy: "System",
                    })
                  }
                >
                  View Document
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              All Types
            </Button>
            <Button variant="ghost" size="sm">
              KYC
            </Button>
            <Button variant="ghost" size="sm">
              Service Specific
            </Button>
          </div>
          <div className="flex gap-2">
            <DocumentGeneratorModal />
            <DocumentUploadModal />
          </div>
        </div>

        {/* Common KYC Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Common KYC Requirements</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {COMMON_REQUIREMENTS.map((req, i) => (
              <Card key={i} className="border-dashed">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                  <div className="mb-2 rounded-full bg-green-100 p-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="font-medium text-sm">{req.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Uploaded Jan 15, 2024</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-6 text-xs"
                    onClick={() =>
                      handleViewDocument({
                        name: req.name,
                        type: "KYC Document",
                        uploadDate: "Jan 15, 2024",
                        status: "Valid",
                        uploadedBy: "John Doe",
                      })
                    }
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Specific Section */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Service Specific Requirements</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service) => {
              const requirements = SERVICE_REQUIREMENTS[service.name] || []
              if (requirements.length === 0) return null

              return (
                <Card key={service.name} className="col-span-full md:col-span-1 lg:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {requirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          {req.required ? (
                            idx % 2 === 0 ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                            )
                          ) : (
                            <Info className="h-3 w-3 text-blue-500" />
                          )}
                          <span
                            className={
                              req.required && idx % 2 !== 0 ? "font-medium text-amber-700" : "text-muted-foreground"
                            }
                          >
                            {req.name}
                            {!req.required && (
                              <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-500">
                                Optional
                              </span>
                            )}
                          </span>
                        </div>
                        {(req.required && idx % 2 !== 0) || !req.required ? (
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Upload className="h-3 w-3" />
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Existing Documents Grid (Legacy/Uploaded) */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-medium text-muted-foreground">All Uploaded Files</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Certificate of Incorporation.pdf", type: "Incorporation", date: "Jan 15, 2020", size: "2.4 MB" },
              { name: "Firearm Liability Clearance.pdf", type: "Compliance", date: "Feb 01, 2024", size: "1.1 MB" },
              { name: "Cash Flow Projection 2024.pdf", type: "Financials", date: "Mar 10, 2024", size: "4.5 MB" },
              { name: "Work Permit Application.pdf", type: "Immigration", date: "Jan 20, 2024", size: "0.8 MB" },
              { name: "Agreement of Sale.pdf", type: "Paralegal", date: "Jan 05, 2024", size: "1.2 MB" },
            ].map((doc, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium line-clamp-1">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {doc.type} • {doc.size}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleViewDocument({
                          name: doc.name,
                          type: doc.type,
                          uploadDate: doc.date,
                          size: doc.size,
                          status: "Valid",
                          uploadedBy: "System",
                        })
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div>Uploaded {doc.date}</div>
                    <Badge variant="secondary" className="font-normal">
                      Valid
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="filings" className="space-y-4">
        <div className="text-sm text-muted-foreground">Filings content placeholder</div>
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <div className="text-sm text-muted-foreground">Compliance content placeholder</div>
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Active Services</h3>
            <p className="text-sm text-muted-foreground">Manage services provided to this client.</p>
          </div>
          <ServiceRequestModal />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeServices.map((service, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <div className="text-xs text-muted-foreground mt-1">{service.category}</div>
                  </div>
                  <Badge variant={service.status === "Active" ? "default" : "secondary"}>{service.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Service active since {service.since}</div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="immigration" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Immigration Cases</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Case
          </Button>
        </div>
        <div className="rounded-md border p-4">
          <ImmigrationKanban />
        </div>
      </TabsContent>

      <TabsContent value="communications" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Communication Log</h3>
            <p className="text-sm text-muted-foreground">Track emails, calls, and meetings with this client.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="mailto:contact@abccorp.gy">
                <Mail className="mr-2 h-4 w-4" /> Send Email
              </a>
            </Button>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" /> Log Communication
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            {
              type: "Email",
              subject: "VAT Return Confirmation",
              date: "Today, 10:23 AM",
              user: "Sarah Smith",
              content: "Sent confirmation of Q1 VAT return filing.",
            },
            {
              type: "Call",
              subject: "Compliance Review",
              date: "Yesterday, 2:15 PM",
              user: "John Doe",
              content: "Discussed missing NIS documents. Client promised to send by Friday.",
            },
            {
              type: "Meeting",
              subject: "Annual Strategy",
              date: "Jan 15, 2024",
              user: "Sarah Smith",
              content: "In-person meeting to discuss 2024 business goals and tax strategy.",
            },
          ].map((comm, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        comm.type === "Email"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : comm.type === "Call"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
                      {comm.type}
                    </Badge>
                    <span className="font-medium text-sm">{comm.subject}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{comm.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{comm.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback>
                      {comm.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>Logged by {comm.user}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <div className="text-sm text-muted-foreground">Tasks content placeholder</div>
      </TabsContent>

      <DocumentPreviewModal document={selectedDocument} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />
    </Tabs>
  )
}
