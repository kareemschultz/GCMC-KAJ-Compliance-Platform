import { PartnerDirectory } from "@/components/network/partner-directory"
import { AddPartnerDialog } from "@/components/network/add-partner-dialog"

export default function NetworkPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GCMC Network Hub</h1>
          <p className="text-muted-foreground">Connect with our trusted partners in Real Estate, IT, and Law.</p>
        </div>
        <AddPartnerDialog />
      </div>
      <PartnerDirectory />
    </div>
  )
}
