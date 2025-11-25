"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ComplianceTab = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>Current standing with regulatory bodies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { authority: "Guyana Revenue Authority (GRA)", status: "Compliant", lastCheck: "Today" },
            { authority: "National Insurance Scheme (NIS)", status: "Compliant", lastCheck: "Today" },
            { authority: "Commercial Registry", status: "Review Needed", lastCheck: "Yesterday" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">{item.authority}</p>
                <p className="text-xs text-muted-foreground">Last checked: {item.lastCheck}</p>
              </div>
              <Badge
                variant={item.status === "Compliant" ? "default" : "destructive"}
                className={
                  item.status === "Compliant"
                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                    : ""
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Critical dates for this client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { event: "VAT Return Due", date: "Nov 20, 2023", daysLeft: "5 days" },
            { event: "NIS Remittance Due", date: "Nov 15, 2023", daysLeft: "Today" },
            { event: "Annual Return Filing", date: "Dec 31, 2023", daysLeft: "45 days" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                <span className="text-xs font-bold uppercase">{item.date.split(" ")[0]}</span>
                <span className="text-sm font-bold">{item.date.split(" ")[1].replace(",", "")}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.daysLeft} remaining</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
