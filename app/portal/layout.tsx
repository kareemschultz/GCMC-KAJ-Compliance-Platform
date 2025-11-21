import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PortalNav } from "@/components/portal/portal-nav"
import { UserCircle } from "lucide-react"

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                G
              </div>
              <span className="hidden md:inline-block">GCMC Portal</span>
            </div>
            <PortalNav className="hidden md:flex" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span className="hidden sm:inline-block">John Doe</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/login">Log Out</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  )
}
