"use client"

import * as React from "react"
import { MoreHorizontal, FileText, ArrowUpDown, RefreshCw, Users, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Client {
  id: string
  name: string
  type: string
  email: string
  phone: string
  tin: string
  status: string
  compliance: number
  documents: number
  lastActivity: string
  createdAt: string
}

interface ClientTableProps {
  clients: Client[]
  loading?: boolean
  onRefresh?: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return 'outline'
  switch (status.toLowerCase()) {
    case 'active':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'inactive':
      return 'destructive'
    default:
      return 'outline'
  }
}

function getComplianceColor(compliance: number): string {
  if (compliance >= 85) return 'text-green-600'
  if (compliance >= 70) return 'text-blue-600'
  if (compliance >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

function LoadingSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell><div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export function ClientTable({ clients, loading = false, onRefresh }: ClientTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead className="w-[250px]">
              <Button variant="ghost" className="p-0 hover:bg-transparent font-medium">
                Client Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>TIN Number</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Loading state
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </>
          ) : clients.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No clients found</h3>
                    <p className="text-muted-foreground text-sm">
                      {onRefresh ? "Try refreshing or create your first client." : "Create your first client to get started."}
                    </p>
                  </div>
                  {onRefresh && (
                    <Button variant="outline" onClick={onRefresh} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // Client rows
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Link href={`/clients/${client.id}`} className="font-medium hover:underline">
                        {client.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{client.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{client.type}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{client.tin}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={client.compliance}
                      className="w-[60px] h-2"
                      indicatorClassName={
                        client.compliance >= 90
                          ? "bg-green-500"
                          : client.compliance >= 70
                            ? "bg-blue-500"
                            : client.compliance >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }
                    />
                    <span className={`text-xs font-medium ${getComplianceColor(client.compliance)}`}>
                      {client.compliance}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span className="text-xs">{client.documents}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{client.lastActivity}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(client.status)}>
                    {client.status}
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
                      <DropdownMenuItem asChild>
                        <Link href={`/clients/${client.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Client</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Client</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {clients.length} client{clients.length !== 1 ? 's' : ''}
          </div>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh} className="gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
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
