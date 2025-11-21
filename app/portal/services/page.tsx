import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, CheckCircle, ArrowRight } from "lucide-react"

export default function PortalServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
        <p className="text-muted-foreground">Manage your active services and request new ones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Services</CardTitle>
            <CardDescription>Services currently being managed by our team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Tax Compliance", status: "Active", renewal: "Auto-renew", nextAction: "VAT Return (Nov)" },
              { name: "NIS Management", status: "Active", renewal: "Auto-renew", nextAction: "Monthly Schedule" },
              {
                name: "Work Permit Processing",
                status: "In Progress",
                renewal: "One-time",
                nextAction: "Awaiting Approval",
              },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Next: {service.nextAction}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={service.status === "Active" ? "default" : "secondary"}>{service.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{service.renewal}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service History</CardTitle>
            <CardDescription>Past services and completed projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Business Registration", date: "Jan 2020", status: "Completed" },
              { name: "TIN Application", date: "Feb 2020", status: "Completed" },
              { name: "Legal Consultation", date: "Mar 2023", status: "Completed" },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Completed {service.date}</p>
                  </div>
                </div>
                <Badge variant="outline">{service.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>Other ways we can help your business grow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Payroll Management", desc: "Complete payroll processing and payslip generation." },
              { name: "Immigration Consulting", desc: "Visa applications, work permits, and citizenship." },
              { name: "Legal Agreements", desc: "Drafting and review of business contracts." },
            ].map((service, i) => (
              <div key={i} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h3 className="font-medium mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
