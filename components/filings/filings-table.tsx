"use client"

import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const filings = [
  {
    id: "1",
    client: "ABC Corporation Ltd",
    type: "VAT Return",
    agency: "GRA",
    period: "Q4 2024",
    dueDate: "Jan 21, 2025",
    daysUntil: "in 5 days",
    amount: "$45,000",
    status: "Pending",
  },
  {
    id: "2",
    client: "Guyana Tech Solutions",
    type: "PAYE",
    agency: "GRA",
    period: "December 2024",
    dueDate: "Jan 14, 2025",
    daysUntil: "3 days overdue",
    amount: "$12,500",
    status: "Overdue",
  },
  {
    id: "3",
    client: "Georgetown Retailers",
    type: "NIS Contribution",
    agency: "NIS",
    period: "December 2024",
    dueDate: "Jan 14, 2025",
    daysUntil: "3 days overdue",
    amount: "$8,200",
    status: "Overdue",
  },
  {
    id: "4",
    client: "John Smith Trading",
    type: "VAT Return",
    agency: "GRA",
    period: "Q4 2024",
    dueDate: "Jan 21, 2025",
    daysUntil: "in 5 days",
    amount: "$6,800",
    status: "Draft",
  },
  {
    id: "5",
    client: "ABC Corporation Ltd",
    type: "Annual Return",
    agency: "DCRA",
    period: "FY 2024",
    dueDate: "Feb 12, 2025",
    daysUntil: "in 27 days",
    amount: "$500",
    status: "Submitted",
  },
]

export function FilingsTable() {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" className="p-0 hover:bg-transparent font-medium">
                Client <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Filing Type</TableHead>
            <TableHead>Agency</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount (GYD)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filings.map((filing) => (
            <TableRow key={filing.id} className={filing.status === "Overdue" ? "border-l-4 border-l-destructive" : ""}>
              <TableCell>
                <Link href={`/clients/${filing.id}`} className="font-medium hover:underline">
                  {filing.client}
                </Link>
              </TableCell>
              <TableCell>{filing.type}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    filing.agency === "GRA"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : filing.agency === "NIS"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {filing.agency}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{filing.period}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{filing.dueDate}</span>
                  <span
                    className={`text-xs ${
                      filing.status === "Overdue" ? "text-destructive font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {filing.daysUntil}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{filing.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    filing.status === "Submitted"
                      ? "default"
                      : filing.status === "Overdue"
                        ? "destructive"
                        : filing.status === "Draft"
                          ? "secondary"
                          : "outline"
                  }
                  className={
                    filing.status === "Submitted"
                      ? "bg-green-500 hover:bg-green-600"
                      : filing.status === "Pending"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : ""
                  }
                >
                  {filing.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Filing</DropdownMenuItem>
                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete Filing</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex-1 text-sm text-muted-foreground">Showing 1-5 of 234 filings</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
