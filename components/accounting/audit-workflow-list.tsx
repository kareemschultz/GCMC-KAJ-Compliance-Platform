"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileCheck, ArrowRight } from "lucide-react"
import type { AuditCase } from "@/types"
import { format } from "date-fns"

interface AuditWorkflowListProps {
  data: AuditCase[]
  isLoading: boolean
}

export function AuditWorkflowList({ data, isLoading }: AuditWorkflowListProps) {
  if (isLoading) {
    return <div>Loading audit cases...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Workflow</CardTitle>
        <CardDescription>Track ongoing audits for NGOs and Co-operative Societies</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                    {audit.entityName}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{audit.entityType.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      audit.status === "CLOSED" ? "default" : audit.status === "REVIEW" ? "secondary" : "outline"
                    }
                  >
                    {audit.status}
                  </Badge>
                </TableCell>
                <TableCell className="w-[200px]">
                  <div className="flex items-center gap-2">
                    <Progress value={audit.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{audit.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(audit.dueDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No active audit cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
