import { LocalContentTracker } from "@/components/dashboard/local-content-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LocalContentPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Local Content Compliance</h1>
        <p className="text-muted-foreground">
          Manage your Ministry of Natural Resources compliance checklist and documentation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LocalContentTracker />

        <Card>
          <CardHeader>
            <CardTitle>About Local Content</CardTitle>
            <CardDescription>Guyana's Local Content Act</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              The Local Content Act ensures that Guyanese nationals and companies participate in the petroleum sector.
              Compliance requires submitting valid documentation to the Local Content Secretariat.
            </p>
            <p>
              <strong>Key Requirements:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Valid Business Registration or Certificate of Incorporation</li>
              <li>NIS Compliance Certificate</li>
              <li>TIN Certificate</li>
              <li>Proof of Guyanese Ownership (Passports/IDs)</li>
              <li>Organizational Chart showing local employment</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
