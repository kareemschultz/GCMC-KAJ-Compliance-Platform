"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, User, File } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DocumentPreviewModalProps {
  document: {
    name: string
    type?: string
    uploadDate?: string
    uploadedBy?: string
    size?: string
    status?: string
    referenceNumber?: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentPreviewModal({ document, open, onOpenChange }: DocumentPreviewModalProps) {
  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between mr-6">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {document.name}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2">
                <span>{document.type || "Document"}</span>
                {document.size && (
                  <>
                    <span>•</span>
                    <span>{document.size}</span>
                  </>
                )}
                {document.status && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      {document.status}
                    </Badge>
                  </>
                )}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-muted/30 rounded-md border flex flex-col items-center justify-center p-8 overflow-hidden relative">
          {/* Mock Preview */}
          <div className="absolute inset-0 bg-[url('/placeholder-text.png')] opacity-5 bg-repeat space-y-4 p-8 pointer-events-none">
            {/* Background pattern simulation */}
          </div>

          <div className="bg-background shadow-lg border rounded-lg p-12 max-w-lg w-full aspect-[1/1.4] flex flex-col items-center justify-center text-center z-10">
            <File className="h-16 w-16 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Document Preview</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              This is a preview placeholder for <b>{document.name}</b>.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              In a production environment, the actual PDF or image file would be rendered here.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Separator className="mb-4" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Uploaded By</span>
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span>{document.uploadedBy || "System User"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Upload Date</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{document.uploadDate || "N/A"}</span>
              </div>
            </div>
            {document.referenceNumber && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">Reference Number</span>
                <div className="font-mono">{document.referenceNumber}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
