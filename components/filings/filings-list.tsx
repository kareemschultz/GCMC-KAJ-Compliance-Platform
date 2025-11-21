"use client"

import type { Filing } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FilingsListProps {
  data: Filing[]
}

export function FilingsList({ data }: FilingsListProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Filing Type</TableHead>
            <TableHead>Agency</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((filing) => (
            <TableRow key={filing.id}>
              <TableCell className="font-medium">{filing.clientName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {filing.type}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{filing.agency}</Badge>
              </TableCell>
              <TableCell>{filing.period}</TableCell>
              <TableCell>
                <span
                  className={
                    filing.status === "Overdue"
                      ? "text-red-600 font-medium"
                      : filing.status === "Draft"
                        ? "text-amber-600"
                        : ""
                  }
                >
                  {filing.dueDate}
                </span>
              </TableCell>
              <TableCell>{filing.amount ? `$${filing.amount.toLocaleString()}` : "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    filing.status === "Submitted" || filing.status === "Accepted"
                      ? "default"
                      : filing.status === "Overdue" || filing.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                  }
                  className={
                    filing.status === "Submitted" || filing.status === "Accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {filing.status}
                </Badge>
              </TableCell>
              <TableCell>
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
