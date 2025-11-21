"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, Clock } from "lucide-react"
import type { BankService } from "@/types"
import { format } from "date-fns"

interface BankServicesListProps {
  data: BankService[]
  isLoading: boolean
}

export function BankServicesList({ data, isLoading }: BankServicesListProps) {
  if (isLoading) {
    return <div>Loading banking services...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((service) => (
        <Card key={service.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {service.service === "ACCOUNT_OPENING" ? "Account Opening" : "Loan Application"}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 space-y-4">
              <div>
                <div className="text-2xl font-bold">{service.bankName}</div>
                <p className="text-xs text-muted-foreground">{service.clientName}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    service.status === "APPROVED"
                      ? "default"
                      : service.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {service.status.replace("_", " ")}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {format(new Date(service.lastUpdate), "MMM d")}
                </div>
              </div>

              <Button className="w-full bg-transparent" variant="outline" size="sm">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">No active banking services found.</div>
      )}
    </div>
  )
}
