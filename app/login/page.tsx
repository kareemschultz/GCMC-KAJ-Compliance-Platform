import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-6 w-6" />
        </div>
        GCMC & KAJ Platform
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@gcmc.gy" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href="/">Sign In</Link>
          </Button>
          <div className="flex flex-col gap-2 text-center text-sm">
            <Link href="#" className="text-muted-foreground hover:text-primary underline underline-offset-4">
              Forgot password?
            </Link>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Link
              href="/portal/login"
              className="flex items-center justify-center gap-1 text-primary hover:underline underline-offset-4 font-medium"
            >
              Go to Client Portal Login <ArrowRight className="h-3 w-3" />
            </Link>
            <Link href="/invite/accept" className="text-xs text-muted-foreground hover:text-primary mt-4">
              (Demo: Simulate Accept Invite)
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
