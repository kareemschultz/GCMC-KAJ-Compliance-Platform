import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Printer, Send } from "lucide-react"
import Link from "next/link"
import { VATReturnForm } from "@/components/filings/vat-return-form"

export default function VATReturnPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/filings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GRA VAT Return (Form VAT-3)</h1>
            <p className="text-sm text-muted-foreground">Complete and submit your VAT return to GRA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" /> Save as Draft
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print Preview
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" /> Submit to GRA
          </Button>
        </div>
      </div>

      <VATReturnForm />
    </div>
  )
}
