import { NISComplianceForm } from "@/components/filings/nis-compliance-form"

export default function NISCompliancePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">NIS Compliance</h2>
      </div>
      <NISComplianceForm />
    </div>
  )
}
