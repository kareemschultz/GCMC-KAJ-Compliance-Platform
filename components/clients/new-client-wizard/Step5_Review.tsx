"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COMMON_REQUIREMENTS, SERVICE_REQUIREMENTS } from "@/lib/constants";
import { Check, AlertCircle, Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNewClientWizard } from "./wizard-context";

export const Step5_Review = () => {
  const { formData, handleFileUpload, handleRemoveFile } = useNewClientWizard();

  const getRequiredDocuments = () => {
    let required = [...COMMON_REQUIREMENTS];
    formData.selectedServices.forEach(service => {
      const serviceReqs = SERVICE_REQUIREMENTS[service] || [];
      required = [...required, ...serviceReqs];
    });
    // Deduplicate
    return required.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name
      ))
    );
  };

  const requiredDocuments = getRequiredDocuments();

  return (
    <div className="py-2 space-y-6">
      <div className="rounded-md border p-4 bg-muted/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" /> Review Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs">Client Name</span>
            <span className="font-medium">{formData.name || `${formData.firstName} ${formData.surname}`}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Type</span>
            <span className="font-medium">{formData.type}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Email</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">TIN</span>
            <span className="font-medium">{formData.tin}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Account Type</span>
            <span className="font-medium">
              {formData.isLocalAccount ? "Local (No Invite)" : "Standard (Invite Sent)"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-4 text-blue-900">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5" />
          <h4 className="font-semibold">Required Documents Checklist</h4>
        </div>
        <p className="text-sm text-blue-700">
          Please upload the available documents below. You can also skip this step and upload them later in the
          client profile.
        </p>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-6">
          {/* Common Requirements */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                1
              </span>
              Standard KYC Documents
            </h4>
            <div className="grid gap-3 pl-8">
              {COMMON_REQUIREMENTS.map((req, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{req.name}</div>
                      <div className="text-xs text-muted-foreground">Required for all clients</div>
                    </div>
                  </div>

                  {formData.uploadedFiles[req.name] ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> {formData.uploadedFiles[req.name].name.substring(0, 15)}
                        ...
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveFile(req.name)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        id={`file-${req.name}`}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(req.name, e.target.files[0]);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-transparent"
                        onClick={() => document.getElementById(`file-${req.name}`)?.click()}
                      >
                        <Upload className="mr-2 h-3 w-3" /> Upload
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Service Specific Requirements */}
          {formData.selectedServices.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                  2
                </span>
                Service Specific Requirements
              </h4>
              <div className="space-y-4 pl-8">
                {formData.selectedServices.map((service) => {
                  const requirements = SERVICE_REQUIREMENTS[service] || [];
                  if (requirements.length === 0) return null;

                  return (
                    <div key={service} className="rounded-lg border p-4 bg-muted/10">
                      <div className="font-medium text-sm mb-3 text-primary flex items-center gap-2">
                        {service}
                        <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                          {requirements.length} documents
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {requirements.map((req, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-background rounded border border-dashed"
                          >
                            <div className="flex items-center gap-2">
                              {req.required ? (
                                <AlertCircle className="h-3 w-3 text-amber-600" />
                              ) : (
                                <Info className="h-3 w-3 text-blue-500" />
                              )}
                              <span
                                className={cn(
                                  "text-sm",
                                  req.required ? "font-medium" : "text-muted-foreground"
                                )}
                              >
                                {req.name}
                              </span>
                              {req.required && (
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>

                            {formData.uploadedFiles[`${service}-${req.name}`] ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Uploaded
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleRemoveFile(`${service}-${req.name}`)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`file-${service}-${req.name}`}
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0])
                                      handleFileUpload(`${service}-${req.name}`, e.target.files[0]);
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
                                  onClick={() =>
                                    document.getElementById(`file-${service}-${req.name}`)?.click()
                                  }
                                >
                                  <Upload className="mr-2 h-3 w-3" /> Upload
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
