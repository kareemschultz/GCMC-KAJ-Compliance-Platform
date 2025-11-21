"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CommandMenu } from "@/components/command-menu"
import { Separator } from "@/components/ui/separator"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center gap-4">
        <CommandMenu />
      </div>
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <ModeToggle />
      </div>
    </header>
  )
}
