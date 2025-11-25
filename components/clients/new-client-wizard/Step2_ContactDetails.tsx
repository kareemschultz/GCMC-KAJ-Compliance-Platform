"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/lib/input-formatters";
import { useNewClientWizard } from "./wizard-context";

export const Step2_ContactDetails = () => {
  const { formData, setFormData } = useNewClientWizard();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="contact@example.com"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="localAccount"
          checked={formData.isLocalAccount}
          onCheckedChange={(checked) => setFormData({ ...formData, isLocalAccount: checked as boolean })}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="localAccount" className="font-medium">
            Create as Local Account
          </Label>
          <p className="text-sm text-muted-foreground">
            Do not send an email invitation. The account will be managed internally.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            setFormData({ ...formData, phone: formatted.formatted });
          }}
          placeholder="+592-123-4567"
        />
        <p className="text-xs text-muted-foreground">
          Enter Guyanese phone number (will auto-format)
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Lot 123..."
        />
      </div>
    </div>
  );
};
