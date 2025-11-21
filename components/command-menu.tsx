"use client"

import * as React from "react"
import { Settings, User, FileText, LayoutDashboard, Users, FileStack, Shield, FilePlus } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search platform...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/clients"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Clients</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/filings"))}>
              <FileStack className="mr-2 h-4 w-4" />
              <span>Filings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push("/clients?new=true"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Add New Client</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/documents?upload=true"))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Upload Document</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="New Filing">
            <CommandItem onSelect={() => runCommand(() => router.push("/filings/vat-return"))}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>VAT Return (Form VAT-3)</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/filings/nis-compliance"))}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>NIS Compliance Certificate</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/filings/create?type=income-tax"))}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Income Tax Return</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/filings/create?type=corp-tax"))}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Corporation Tax Return</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/filings/create?type=property-tax"))}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Property Tax Return</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/filings/create?type=paye"))}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>PAYE Return (Form 5)</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push("/users"))}>
              <Shield className="mr-2 h-4 w-4" />
              <span>User Management</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
