"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DROPDOWN_DATA } from "@/lib/dropdown-data";
import { formatNationalId } from "@/lib/input-formatters";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useNewClientWizard } from "./wizard-context";

export const Step3_Identification = () => {
  const { formData, setFormData } = useNewClientWizard();

  return (
    <div className="grid gap-4 py-4">
      <div className="rounded-md border p-4 bg-blue-50/50">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          Flexible Identification Requirements
        </h4>
        <p className="text-sm text-blue-700">
          Provide at least one primary form of identification. Additional documents can be added later.
        </p>
      </div>

      {formData.type === "INDIVIDUAL" && (
        <div className="rounded-md border p-3 bg-gray-50">
          <h5 className="font-medium mb-2 text-sm">Required Information Status:</h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              {formData.dateOfBirth ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-600" />
              )}
              <span className={formData.dateOfBirth ? "text-green-700" : "text-amber-700"}>
                Date of Birth {formData.dateOfBirth ? "(✓ provided in Step 1)" : "(⚠ missing from Step 1)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {formData.primaryIdType && formData.primaryIdNumber.length > 3 ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-600" />
              )}
              <span className={formData.primaryIdType && formData.primaryIdNumber.length > 3 ? "text-green-700" : "text-amber-700"}>
                Primary ID {formData.primaryIdType && formData.primaryIdNumber.length > 3 ? `(✓ ${formData.primaryIdType})` : "(⚠ select type and enter number)"}
              </span>
            </div>
            {!formData.dateOfBirth && (
              <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                <strong>Tip:</strong> Please go back to Step 1 and fill in the Date of Birth field to continue.
              </p>
            )}
          </div>
        </div>
      )}

      {formData.type === "INDIVIDUAL" ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="primaryIdType">Primary ID Type *</Label>
              <SearchableSelect
                options={DROPDOWN_DATA.idTypes}
                value={formData.primaryIdType}
                onValueChange={(value) => setFormData({ ...formData, primaryIdType: value })}
                placeholder="Select ID type"
                showDescriptions={true}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="primaryIdNumber">Primary ID Number *</Label>
              <Input
                id="primaryIdNumber"
                value={formData.primaryIdNumber}
                onChange={(e) => {
                  const formatted = formData.primaryIdType === "National ID"
                    ? formatNationalId(e.target.value)
                    : { formatted: e.target.value, isValid: true };
                  setFormData({ ...formData, primaryIdNumber: formatted.formatted });
                }}
                placeholder={
                  formData.primaryIdType === "National ID"
                    ? "144123456"
                    : formData.primaryIdType === "Passport"
                    ? "R0712345"
                    : formData.primaryIdType === "Driver's License"
                    ? "DL123456"
                    : "ID Number"
                }
              />
              {formData.primaryIdType && (
                <p className="text-xs text-muted-foreground">
                  Format will be validated based on selected ID type
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="secondaryIdType">Secondary ID Type (Optional)</Label>
              <SearchableSelect
                options={[
                  { value: "", label: "None", description: "No additional ID required" },
                  ...DROPDOWN_DATA.idTypes,
                ]}
                value={formData.secondaryIdType}
                onValueChange={(value) => setFormData({ ...formData, secondaryIdType: value })}
                placeholder="Select additional ID"
                showDescriptions={true}
                className="w-full"
                clearable={true}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secondaryIdNumber">Secondary ID Number</Label>
              <Input
                id="secondaryIdNumber"
                value={formData.secondaryIdNumber}
                onChange={(e) => setFormData({ ...formData, secondaryIdNumber: e.target.value })}
                placeholder="Optional"
                disabled={!formData.secondaryIdType}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="idIssue">ID Issue Date (Optional)</Label>
            <Input
              id="idIssue"
              type="date"
              value={formData.idIssueDate}
              onChange={(e) => setFormData({ ...formData, idIssueDate: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600" />
          Government Registration Numbers (Optional)
        </h5>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {formData.type === "COMPANY" ? (
              <div className="grid gap-2">
                <Label htmlFor="tin">TIN (Taxpayer ID)</Label>
                <Input
                  id="tin"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                  placeholder="123-456-789 (if available)"
                />
                <p className="text-xs text-muted-foreground">Required for tax filings</p>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="tin">TIN (Optional for individuals)</Label>
                <Input
                  id="tin"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                  placeholder="123-456-789"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="nis">NIS Number</Label>
              <Input
                id="nis"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                placeholder="A-123456 (if available)"
              />
              <p className="text-xs text-muted-foreground">
                {formData.type === "INDIVIDUAL" ? "For employment/benefits" : "For company NIS"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vat">VAT Number (Optional)</Label>
              <Input
                id="vat"
                value={formData.vat}
                onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                placeholder="V-123456"
              />
              <p className="text-xs text-muted-foreground">Only if VAT registered</p>
            </div>
            {formData.type !== "INDIVIDUAL" && (
              <div className="grid gap-2">
                <Label htmlFor="reg">Business Registration (DCRA)</Label>
                <Input
                  id="reg"
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  placeholder="C-12345 (if incorporated)"
                />
                <p className="text-xs text-muted-foreground">For incorporated companies</p>
              </div>
            )}
          </div>

          <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Required:</strong> Primary ID and Date of Birth are sufficient to proceed.
              TIN/NIS numbers are optional and can be added later in the client profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
