"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useState } from "react";
import { DocumentPreviewModal } from "@/components/documents/document-preview-modal";

export const IdentificationTab = () => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  return (
    <>
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
      <DocumentPreviewModal document={selectedDocument} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />
    </>
  );
};
