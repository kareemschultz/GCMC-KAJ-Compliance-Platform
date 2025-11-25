"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const OverviewTab = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">contact@abccorp.gy</div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">+592 223-4567</div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">123 Camp Street, Georgetown, Guyana</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assigned Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">John Doe</div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">Sarah Smith</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Registration #</div>
              <div className="font-medium">C-12345</div>
              <div className="text-muted-foreground">Incorporation Date</div>
              <div className="font-medium">Jan 15, 2020</div>
              <div className="text-muted-foreground">Fiscal Year End</div>
              <div className="font-medium">December 31</div>
              <div className="text-muted-foreground">Industry</div>
              <div className="font-medium">Retail & Distribution</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Document Uploaded", detail: "VAT Certificate 2024", time: "2 hours ago" },
                { action: "Filing Submitted", detail: "Q4 2024 VAT Return", time: "1 day ago" },
                { action: "Task Completed", detail: "Client Onboarding", time: "3 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 text-sm">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div className="grid gap-0.5">
                    <div className="font-medium">{item.action}</div>
                    <div className="text-muted-foreground">{item.detail}</div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
