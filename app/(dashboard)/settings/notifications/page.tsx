import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { NotificationSettings } from "@/components/settings/notification-settings"

export const metadata: Metadata = {
  title: "Notification Settings | GCMC Platform",
  description: "Manage your notification preferences.",
}

const sidebarNavItems = [
  {
    title: "General",
    href: "/settings",
  },
  {
    title: "Compliance Rules",
    href: "/settings/compliance",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
]

export default function NotificationSettingsPage() {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">Choose what you want to be notified about.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsSidebar items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <NotificationSettings />
        </div>
      </div>
    </div>
  )
}
