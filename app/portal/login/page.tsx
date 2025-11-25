import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function PortalLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center" data-testid="portal-login-title">Client Portal</CardTitle>
          <CardDescription className="text-center" data-testid="portal-login-description">Enter your TIN and password to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
            <Input
              id="tin"
              name="tin"
              placeholder="123456789"
              data-testid="portal-tin-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              data-testid="portal-password-input"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild data-testid="portal-login-button">
            <Link href="/portal">Sign In</Link>
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
