"use client"

import { useState, useEffect } from "react"
import { Calendar, AlertCircle, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import type { Property } from "@/types"
import { AddPropertyDialog } from "./add-property-dialog"

export function PropertyManager() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.property.list()
      .then(response => {
        setProperties(response.properties || [])
      })
      .catch(err => {
        console.error("Failed to fetch properties:", err)
        setProperties([])
      })
      .finally(() => setLoading(false))
  }, [])

  const isLeaseExpiringSoon = (endDate: string | null) => {
    if (!endDate) return false
    const daysUntilExpiry = Math.floor((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry < 30 && daysUntilExpiry > 0
  }

  const isLeaseExpired = (endDate: string | null) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Portfolio</CardTitle>
            <CardDescription>Manage rental properties and tenant information</CardDescription>
          </div>
          <AddPropertyDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Management Fee</TableHead>
                <TableHead>Lease Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id} className={property.financials.arrearsGyd > 0 ? "bg-destructive/5" : ""}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{property.address}</span>
                      {property.financials.arrearsGyd > 0 && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          Arrears: ${property.financials.arrearsGyd.toLocaleString()} GYD
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {property.tenant ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{property.tenant.name}</span>
                        <span className="text-xs text-muted-foreground">{property.tenant.contactPhone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {property.leaseDetails ? (
                      <span className="font-medium">${property.leaseDetails.monthlyRentGyd.toLocaleString()} GYD</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      $
                      {property.leaseDetails
                        ? (
                            (property.leaseDetails.monthlyRentGyd * property.managementFeePercentage) /
                            100
                          ).toLocaleString()
                        : "0"}{" "}
                      GYD ({property.managementFeePercentage}%)
                    </span>
                  </TableCell>
                  <TableCell>
                    {property.leaseDetails ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(property.leaseDetails.endDate).toLocaleDateString()}</span>
                        {isLeaseExpired(property.leaseDetails.endDate) && <Badge variant="destructive">Expired</Badge>}
                        {isLeaseExpiringSoon(property.leaseDetails.endDate) && (
                          <Badge variant="destructive">Expiring Soon</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.status === "Occupied" ? "default" : "secondary"}>{property.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      {property.leaseDetails && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
