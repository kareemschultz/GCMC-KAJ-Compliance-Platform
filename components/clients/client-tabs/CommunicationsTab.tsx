"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MessageSquare } from "lucide-react";

export const CommunicationsTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Communication Log</h3>
          <p className="text-sm text-muted-foreground">Track emails, calls, and meetings with this client.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="mailto:contact@abccorp.gy">
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </a>
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" /> Log Communication
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {[
          {
            type: "Email",
            subject: "VAT Return Confirmation",
            date: "Today, 10:23 AM",
            user: "Sarah Smith",
            content: "Sent confirmation of Q1 VAT return filing.",
          },
          {
            type: "Call",
            subject: "Compliance Review",
            date: "Yesterday, 2:15 PM",
            user: "John Doe",
            content: "Discussed missing NIS documents. Client promised to send by Friday.",
          },
          {
            type: "Meeting",
            subject: "Annual Strategy",
            date: "Jan 15, 2024",
            user: "Sarah Smith",
            content: "In-person meeting to discuss 2024 business goals and tax strategy.",
          },
        ].map((comm, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      comm.type === "Email"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : comm.type === "Call"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }
                  >
                    {comm.type}
                  </Badge>
                  <span className="font-medium text-sm">{comm.subject}</span>
                </div>
                <span className="text-xs text-muted-foreground">{comm.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{comm.content}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarFallback>
                    {comm.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>Logged by {comm.user}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
