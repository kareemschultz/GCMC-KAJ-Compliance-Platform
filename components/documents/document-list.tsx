"use client"

import { MoreHorizontal, File, Download, Trash, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Document } from "@/types"
import { useState } from "react"
import { DocumentPreviewModal } from "./document-preview-modal"

const documents: Document[] = [
  {
    id: "1",
    name: "Certificate of Incorporation",
    type: "Legal",
    referenceNumber: "C-12345",
    clientName: "Tech Solutions Ltd",
    clientId: "1",
    uploadDate: "2023-10-15",
    status: "Valid",
    size: "2.4 MB",
    uploadedBy: "John Doe",
  },
  {
    id: "2",
    name: "Firearm Liability Clearance",
    type: "Compliance",
    referenceNumber: "FL-998877",
    clientName: "Green Grocers Inc",
    clientId: "2",
    uploadDate: "2023-09-20",
    expiryDate: "2023-12-31",
    status: "Expiring Soon",
    size: "1.1 MB",
    uploadedBy: "Jane Smith",
  },
  {
    id: "3",
    name: "Work Permit Application",
    type: "Immigration",
    clientName: "Tech Solutions Ltd",
    clientId: "1",
    uploadDate: "2023-01-15",
    expiryDate: "2023-07-15",
    status: "Expired",
    size: "0.8 MB",
    uploadedBy: "John Doe",
  },
  {
    id: "4",
    name: "Affidavit of Support",
    type: "Paralegal",
    clientName: "Construction Pros",
    clientId: "3",
    uploadDate: "2023-06-30",
    status: "Valid",
    size: "0.5 MB",
    uploadedBy: "Mike Johnson",
  },
  {
    id: "5",
    name: "Co-op Audit Report 2023",
    type: "Audit",
    clientName: "Green Grocers Inc",
    clientId: "2",
    uploadDate: "2023-03-10",
    status: "Valid",
    size: "3.5 MB",
    uploadedBy: "Jane Smith",
  },
]

export function DocumentList() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setIsPreviewOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:underline"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <File className="h-4 w-4 text-muted-foreground" />
                      {doc.name}
                    </div>
                    {doc.referenceNumber && (
                      <span className="text-xs text-muted-foreground ml-6">Ref: {doc.referenceNumber}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{doc.clientName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>{doc.uploadDate}</TableCell>
                <TableCell>{doc.expiryDate || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      doc.status === "Valid" ? "default" : doc.status === "Expiring Soon" ? "secondary" : "destructive"
                    }
                    className={
                      doc.status === "Valid"
                        ? "bg-green-500 hover:bg-green-600"
                        : doc.status === "Expiring Soon"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : ""
                    }
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DocumentPreviewModal document={selectedDocument} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />
    </>
  )
}
