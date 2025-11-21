"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import type { TaxReturn } from "@/types"
import { format, parseISO } from "date-fns"

export function TaxFilingStatus() {
  const [filings, setFilings] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilings = async () => {
      try {
        const data = await api.taxReturns.list()
        setFilings(data)
      } catch (error) {
        console.error("Failed to fetch tax filings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20"
      case "SUBMITTED":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Tax Filings</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Amount Due</TableHead>
              <TableHead>Filing Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filings.map((filing) => (
              <TableRow key={filing.id}>
                <TableCell className="font-medium">{filing.filingType.replace("_", " ")}</TableCell>
                <TableCell>{filing.period}</TableCell>
                <TableCell className="text-right">${filing.amountDue.toLocaleString()}</TableCell>
                <TableCell>{filing.filingDate ? format(parseISO(filing.filingDate), "MMM d, yyyy") : "-"}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(filing.status)}>
                    {filing.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tax filings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
