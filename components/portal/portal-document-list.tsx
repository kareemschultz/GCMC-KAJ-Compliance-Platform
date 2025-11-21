import { File, Download, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Document } from "@/types"

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
]

export function PortalDocumentList() {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
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
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    {doc.name}
                  </div>
                  {doc.referenceNumber && (
                    <span className="text-xs text-muted-foreground ml-6">Ref: {doc.referenceNumber}</span>
                  )}
                </div>
              </TableCell>
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
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
