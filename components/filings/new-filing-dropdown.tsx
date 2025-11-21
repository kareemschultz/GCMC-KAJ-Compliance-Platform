"use client"
import { ChevronDown, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NewFilingDropdownProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function NewFilingDropdown({
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}: NewFilingDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {showIcon && <Plus className="mr-2 h-4 w-4" />}
          New Filing
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Filing Type</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">GRA - Tax Returns</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/filings/vat-return">VAT Return (Form VAT-3)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=income-tax">Income Tax (Form 2)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=corp-tax">Corporation Tax</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=property-tax">Property Tax</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=paye">PAYE Return (Form 5)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=capital-gains">Capital Gains Tax</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=excise-tax">Excise Tax Return</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Legal Documents</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/documents?tab=wizard">Create Legal Document</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/documents?tab=templates">Browse Templates</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">GRA - Compliance</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=compliance-tender">Tender Compliance</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=compliance-land">Land Transfer Compliance</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=compliance-liability">Liability Compliance</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            National Insurance Scheme
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/filings/nis-compliance">NIS Compliance Certificate</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=nis-contribution">NIS Contribution Schedule</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">DCRA</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/filings/create?type=business-reg">Business Registration</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
