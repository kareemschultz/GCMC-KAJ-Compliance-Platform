"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const invoices = [
  {
    id: "INV-2025-001",
    client: "Demerara Distillers Ltd",
    service: "Annual Tax Filing",
    amount: 150000,
    status: "Paid",
    date: "2025-01-15",
  },
  {
    id: "INV-2025-002",
    client: "Guyana Goldfields",
    service: "Compliance Audit",
    amount: 320000,
    status: "Pending",
    date: "2025-01-20",
  },
  {
    id: "INV-2025-003",
    client: "Banks DIH",
    service: "VAT Return - Jan",
    amount: 45000,
    status: "Overdue",
    date: "2025-01-05",
  },
  {
    id: "INV-2025-004",
    client: "Local Restaurant Inc",
    service: "Business Registration",
    amount: 25000,
    status: "Paid",
    date: "2025-01-22",
  },
  {
    id: "INV-2025-005",
    client: "Tech Solutions GY",
    service: "Work Permit Processing",
    amount: 85000,
    status: "Pending",
    date: "2025-01-25",
  },
]

export function InvoiceList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount (GYD)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>{invoice.service}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    invoice.status === "Paid"
                      ? "default" // Changed from "success" to "default" or a valid variant
                      : invoice.status === "Pending"
                        ? "secondary" // Changed from "warning"
                        : "destructive"
                  }
                  className={
                    invoice.status === "Paid"
                      ? "bg-green-500 hover:bg-green-600"
                      : invoice.status === "Pending"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : ""
                  }
                >
                  {invoice.status}
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
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Send className="mr-2 h-4 w-4" />
                      Resend Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
