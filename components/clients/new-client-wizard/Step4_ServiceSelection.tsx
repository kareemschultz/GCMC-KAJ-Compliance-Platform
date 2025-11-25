"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SERVICE_CATALOG } from "@/lib/constants";
import { useNewClientWizard } from "./wizard-context";

export const Step4_ServiceSelection = () => {
  const { formData, toggleService } = useNewClientWizard();

  return (
    <div className="py-2">
      <Label className="mb-4 block">Select Initial Services</Label>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-6">
          {SERVICE_CATALOG.map((category, i) => (
            <div key={i} className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                {category.category} - {category.subcategory}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {category.items.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={formData.selectedServices.includes(item)}
                      onCheckedChange={() => toggleService(item)}
                    />
                    <Label
                      htmlFor={item}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
