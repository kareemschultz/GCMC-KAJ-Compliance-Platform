"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, FileText } from "lucide-react";

export const FilingsTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Tax & Compliance Filings</h3>
          <p className="text-sm text-muted-foreground">History of submissions to GRA and NIS.</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> New Filing
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {[
              {
                name: "VAT Return - Oct 2023",
                type: "VAT",
                date: "Nov 15, 2023",
                status: "Submitted",
                amount: "$45,200",
              },
              {
                name: "NIS Schedule - Oct 2023",
                type: "NIS",
                date: "Nov 10, 2023",
                status: "Submitted",
                amount: "$12,500",
              },
              {
                name: "PAYE Return - Oct 2023",
                type: "PAYE",
                date: "Nov 15, 2023",
                status: "Processing",
                amount: "$8,900",
              },
              {
                name: "VAT Return - Sep 2023",
                type: "VAT",
                date: "Oct 14, 2023",
                status: "Approved",
                amount: "$42,100",
              },
              {
                name: "NIS Schedule - Sep 2023",
                type: "NIS",
                date: "Oct 10, 2023",
                status: "Approved",
                amount: "$12,500",
              },
            ].map((filing, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{filing.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{filing.date}</span>
                      <span>•</span>
                      <span>{filing.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-medium text-sm">{filing.amount}</p>
                    <Badge
                      variant={filing.status === "Approved" ? "default" : "secondary"}
                      className="mt-1 text-[10px] h-5"
                    >
                      {filing.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
