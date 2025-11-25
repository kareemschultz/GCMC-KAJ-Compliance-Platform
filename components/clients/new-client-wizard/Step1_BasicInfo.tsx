"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DROPDOWN_DATA } from "@/lib/dropdown-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useNewClientWizard } from "./wizard-context";

export const Step1_BasicInfo = () => {
  const { formData, setFormData } = useNewClientWizard();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Client Type</Label>
        <SearchableSelect
          options={DROPDOWN_DATA.clientTypes}
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          placeholder="Select client type"
          showDescriptions={true}
          className="w-full"
        />
      </div>

      {formData.type === "INDIVIDUAL" ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                placeholder="A."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <SearchableSelect
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                  { value: "Prefer not to say", label: "Prefer not to say" },
                ]}
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                placeholder="Select Gender"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pob">Place of Birth (Region/City)</Label>
            <Input
              id="pob"
              value={formData.placeOfBirth}
              onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
              placeholder="Georgetown, Region 4"
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="localContent"
              checked={formData.isLocalContentQualified}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isLocalContentQualified: checked as boolean })
              }
            />
            <Label htmlFor="localContent" className="font-medium">
              Local Content Qualified (Guyanese National)
            </Label>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            name="name"
            data-testid="business-name-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ABC Corp Ltd"
          />
        </div>
      )}
    </div>
  );
};
