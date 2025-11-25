"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";
import { DocumentGeneratorModal } from "@/components/documents/document-generator-modal";
import { CheckCircle2, AlertCircle, Info, Upload, X, FileText, Eye } from "lucide-react";
import { COMMON_REQUIREMENTS, SERVICE_REQUIREMENTS } from "@/lib/constants";
import { useState } from "react";
import { DocumentPreviewModal } from "@/components/documents/document-preview-modal";

export const DocumentsTab = () => {
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleViewDocument = (doc: any) => {
        setSelectedDocument(doc);
        setIsPreviewOpen(true);
    };

    const activeServices = [
        { name: "Income Tax Returns", category: "KAJ - GRA", status: "Active", since: "Jan 2023" },
        { name: "Work Permits", category: "GCMC - Immigration", status: "Active", since: "Feb 2023" },
        { name: "Business Registration", category: "GCMC - Consultancy", status: "Completed", since: "Jan 2020" },
    ]

  return (
      <>
    <div className="space-y-4">
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
            const requirements = SERVICE_REQUIREMENTS[service.name] || [];
            if (requirements.length === 0) return null;

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
                            `text-sm ${
                            req.required ? "font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {req.name}
                        </span>
                        {req.required && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Upload className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
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
    </div>
      <DocumentPreviewModal document={selectedDocument} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />
    </>
  );
};
