import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage what emails you receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="new-client" className="flex flex-col space-y-1">
              <span>New Client Assigned</span>
              <span className="font-normal text-muted-foreground">
                Receive an email when a new client is assigned to you
              </span>
            </Label>
            <Switch id="new-client" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="filing-due" className="flex flex-col space-y-1">
              <span>Filing Due Dates</span>
              <span className="font-normal text-muted-foreground">Receive reminders for upcoming filing deadlines</span>
            </Label>
            <Switch id="filing-due" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="doc-expiry" className="flex flex-col space-y-1">
              <span>Document Expiry</span>
              <span className="font-normal text-muted-foreground">
                Receive alerts when client documents are about to expire
              </span>
            </Label>
            <Switch id="doc-expiry" defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
