import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Government Services</CardTitle>
          <CardDescription>Connect to external government portals for automated filings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Guyana Revenue Authority (GRA)</Label>
                <p className="text-sm text-muted-foreground">For VAT, Income Tax, and Corporation Tax filings.</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gra-api-key">API Key</Label>
              <div className="flex gap-2">
                <Input id="gra-api-key" type="password" value="sk_live_xxxxxxxxxxxxxxxx" readOnly />
                <Button variant="outline">Rotate</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">National Insurance Scheme (NIS)</Label>
                <p className="text-sm text-muted-foreground">For monthly contribution schedules.</p>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <AlertCircle className="mr-1 h-3 w-3" />
                Action Required
              </Badge>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nis-portal-id">Portal ID</Label>
              <Input id="nis-portal-id" placeholder="Enter NIS Portal ID" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Integration Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banking & Payments</CardTitle>
          <CardDescription>Configure payment gateways and bank feeds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="stripe-key">Stripe Secret Key</Label>
            <Input id="stripe-key" type="password" placeholder="sk_test_..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank-feed">Republic Bank Feed URL</Label>
            <Input id="bank-feed" placeholder="https://api.republicguyana.com/v1/feed" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Connect Banking</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
