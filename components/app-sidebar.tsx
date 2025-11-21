"use client"

import type * as React from "react"
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Settings,
  LogOut,
  Building2,
  PieChart,
  FileStack,
  Shield,
  History,
  BarChart3,
  Book,
  CreditCard,
  GraduationCap,
  Network,
  Plane,
  Scale,
} from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import { useBrand } from "@/components/brand-context"
import { cn } from "@/lib/utils"

const kajNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Filings",
    url: "/filings",
    icon: FileStack,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge-base",
    icon: Book,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: PieChart,
  },
]

const gcmcNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Immigration & Visas",
    url: "/immigration",
    icon: Plane,
  },
  {
    title: "Paralegal & Docs",
    url: "/paralegal",
    icon: Scale,
  },
  {
    title: "Training & Workshops",
    url: "/training",
    icon: GraduationCap,
  },
  {
    title: "Network Hub",
    url: "/network",
    icon: Network,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
]

const commonNavItems = [
  {
    title: "User Management",
    url: "/users",
    icon: Shield,
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: History,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { brand, setBrand } = useBrand()

  const navItems = brand === "KAJ" ? kajNavItems : gcmcNavItems

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">GCMC & KAJ</span>
                  <span className="truncate text-xs">Compliance Suite</span>
                </div>
              </div>
              <div className="flex rounded-md bg-muted p-1">
                <button
                  onClick={() => setBrand("KAJ")}
                  className={cn(
                    "flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors",
                    brand === "KAJ" ? "bg-background shadow-sm" : "hover:bg-background/50",
                  )}
                >
                  KAJ (Financial)
                </button>
                <button
                  onClick={() => setBrand("GCMC")}
                  className={cn(
                    "flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors",
                    brand === "GCMC" ? "bg-background shadow-sm" : "hover:bg-background/50",
                  )}
                >
                  GCMC (Consult)
                </button>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{brand === "KAJ" ? "Financial Services" : "Management Consultancy"}</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {commonNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfileDialog>
              <SidebarMenuButton size="lg" className="cursor-pointer">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/avatars/user.jpg" alt="User" />
                  <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">John Doe</span>
                  <span className="truncate text-xs">john@gcmc.gy</span>
                </div>
              </SidebarMenuButton>
            </UserProfileDialog>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Log Out">
              <Link href="/login">
                <LogOut />
                <span>Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
