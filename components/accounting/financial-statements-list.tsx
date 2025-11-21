"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"
import type { FinancialStatement } from "@/types"
import { format } from "date-fns"

interface FinancialStatementsListProps {
  data: FinancialStatement[]
  isLoading: boolean
}

export function FinancialStatementsList({ data, isLoading }: FinancialStatementsListProps) {
  if (isLoading) {
    return <div>Loading statements...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Statements</CardTitle>
        <CardDescription>Manage and view generated financial reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Generated Date</TableHead>
              <TableHead>Key Figures</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((statement) => (
              <TableRow key={statement.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    {statement.type.replace("_", " ")}
                  </div>
                </TableCell>
                <TableCell>{statement.period}</TableCell>
                <TableCell>{format(new Date(statement.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  {statement.type === "INCOME_STATEMENT" ? (
                    <span className="text-green-600 font-medium">
                      Net Profit: ${(statement.data.netProfit / 1000000).toFixed(1)}M
                    </span>
                  ) : (
                    <span className="text-blue-600 font-medium">Cash Flow Report</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No financial statements generated yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
