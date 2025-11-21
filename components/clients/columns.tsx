"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Client } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
            <AvatarFallback>{client.initials}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{client.name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("type")}</Badge>
    },
  },
  {
    accessorKey: "tin",
    header: "TIN",
  },
  {
    accessorKey: "complianceScore",
    header: "Compliance",
    cell: ({ row }) => {
      const score = row.getValue("complianceScore") as number
      let colorClass = "bg-red-500"
      if (score >= 90) colorClass = "bg-green-500"
      else if (score >= 70) colorClass = "bg-blue-500"
      else if (score >= 50) colorClass = "bg-yellow-500"

      return (
        <div className="flex items-center gap-2 w-[100px]">
          <Progress value={score} className="h-2" indicatorClassName={colorClass} />
          <span className="text-xs text-muted-foreground">{score}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "documentsCount",
    header: "Docs",
    cell: ({ row }) => <div className="text-center">{row.getValue("documentsCount")}</div>,
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("lastActivity")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id)}>Copy Client ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Client</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete Client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
