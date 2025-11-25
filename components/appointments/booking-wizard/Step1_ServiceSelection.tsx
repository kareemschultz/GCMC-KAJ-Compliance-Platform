"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBookingWizard } from "./booking-wizard-context";

const SERVICES = {
  GCMC: [
    { id: "gcmc-consult", name: "General Consultation", duration: 60, price: 10000 },
    { id: "gcmc-visa", name: "Visa Application Review", duration: 45, price: 15000 },
    { id: "gcmc-legal", name: "Legal Document Prep", duration: 90, price: 25000 },
  ],
  KAJ: [
    { id: "kaj-tax", name: "Tax Consultation", duration: 60, price: 12000 },
    { id: "kaj-compliance", name: "Compliance Audit", duration: 120, price: 30000 },
    { id: "kaj-payroll", name: "Payroll Setup", duration: 60, price: 15000 },
  ],
};

export const Step1_ServiceSelection = () => {
  const { brand, service, handleBrandSelect, handleServiceSelect } = useBookingWizard();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "cursor-pointer transition-all hover:border-green-500 hover:shadow-md",
            brand === "GCMC" ? "border-green-500 ring-1 ring-green-500 bg-green-50/30" : ""
          )}
          onClick={() => handleBrandSelect("GCMC")}
        >
          <CardHeader>
            <CardTitle className="text-green-700">GCMC Consultancy</CardTitle>
            <CardDescription>Immigration, Legal, and Business Services</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all hover:border-blue-500 hover:shadow-md",
            brand === "KAJ" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30" : ""
          )}
          onClick={() => handleBrandSelect("KAJ")}
        >
          <CardHeader>
            <CardTitle className="text-blue-700">KAJ Financial</CardTitle>
            <CardDescription>Tax, Compliance, and Payroll Services</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {brand && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="mb-4 text-lg font-medium">Select a Service</h3>
          <div className="grid gap-3">
            {SERVICES[brand].map((s) => (
              <div
                key={s.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50",
                  service === s.id ? "border-primary bg-muted/50" : ""
                )}
                onClick={() => handleServiceSelect(s.id)}
              >
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.duration} minutes</div>
                </div>
                <div className="font-semibold">${s.price.toLocaleString()} GYD</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
