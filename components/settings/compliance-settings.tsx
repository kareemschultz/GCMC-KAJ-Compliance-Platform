import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ComplianceSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Thresholds</CardTitle>
          <CardDescription>Set automatic alerts for compliance deadlines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="vat-alert" className="flex flex-col space-y-1">
              <span>VAT Return Alerts</span>
              <span className="font-normal text-muted-foreground">Notify when VAT returns are due in 5 days</span>
            </Label>
            <Switch id="vat-alert" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="nis-alert" className="flex flex-col space-y-1">
              <span>NIS Contribution Alerts</span>
              <span className="font-normal text-muted-foreground">Notify when NIS payments are due in 3 days</span>
            </Label>
            <Switch id="nis-alert" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filing Defaults</CardTitle>
          <CardDescription>Default settings for new filings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="default-currency">Default Filing Currency</Label>
            <Select defaultValue="gyd">
              <SelectTrigger id="default-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gyd">Guyanese Dollar (GYD)</SelectItem>
                <SelectItem value="usd">US Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
