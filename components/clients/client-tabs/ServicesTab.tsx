"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceRequestModal } from "@/components/services/service-request-modal";

export const ServicesTab = () => {
    const activeServices = [
        { name: "Income Tax Returns", category: "KAJ - GRA", status: "Active", since: "Jan 2023" },
        { name: "Work Permits", category: "GCMC - Immigration", status: "Active", since: "Feb 2023" },
        { name: "Business Registration", category: "GCMC - Consultancy", status: "Completed", since: "Jan 2020" },
    ]
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Active Services</h3>
          <p className="text-sm text-muted-foreground">Manage services provided to this client.</p>
        </div>
        <ServiceRequestModal />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {activeServices.map((service, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">{service.category}</div>
                </div>
                <Badge variant={service.status === "Active" ? "default" : "secondary"}>{service.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Service active since {service.since}</div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" className="w-full">
                  History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
