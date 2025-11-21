import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Manage login security and session preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="2fa" className="flex flex-col space-y-1">
              <span>Two-Factor Authentication (2FA)</span>
              <span className="font-normal text-muted-foreground">Require 2FA for all admin accounts</span>
            </Label>
            <Switch id="2fa" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="session-timeout">Session Timeout</Label>
            <Select defaultValue="30">
              <SelectTrigger id="session-timeout">
                <SelectValue placeholder="Select timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Policy</CardTitle>
          <CardDescription>Set requirements for user passwords.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="require-special" className="flex flex-col space-y-1">
              <span>Require Special Characters</span>
              <span className="font-normal text-muted-foreground">Passwords must contain at least one symbol</span>
            </Label>
            <Switch id="require-special" defaultChecked />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="min-length">Minimum Length</Label>
            <Input id="min-length" type="number" defaultValue="12" min="8" max="32" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry">Password Expiry (Days)</Label>
            <Input id="expiry" type="number" defaultValue="90" min="0" />
            <p className="text-xs text-muted-foreground">Set to 0 to disable expiry.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Security Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
