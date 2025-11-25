"use client";

import * as React from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Check, ArrowRight, ArrowLeft, Loader2, CalendarIcon, Clock } from "lucide-react";
import { BookingWizardContext } from "./booking-wizard/booking-wizard-context";
import { Step1_ServiceSelection } from "./booking-wizard/Step1_ServiceSelection";
import { Step2_DateTimeSelection } from "./booking-wizard/Step2_DateTimeSelection";
import { Step3_ClientDetails } from "./booking-wizard/Step3_ClientDetails";
import { Step4_Confirmation } from "./booking-wizard/Step4_Confirmation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const clientDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  reason: z.string().min(10, "Please provide a reason for your visit"),
});

type ClientDetails = z.infer<typeof clientDetailsSchema>;

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

export function BookingWizard() {
  const [step, setStep] = React.useState(1);
  const [brand, setBrand] = React.useState<"GCMC" | "KAJ" | null>(null);
  const [service, setService] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ClientDetails>({
    resolver: zodResolver(clientDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "",
    },
  });

  const handleBrandSelect = (selectedBrand: "GCMC" | "KAJ") => {
    setBrand(selectedBrand);
    setService(null);
  };

  const handleServiceSelect = (serviceId: string) => {
    setService(serviceId);
    setStep(2);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setTimeSlot(null);
  };

  const handleTimeSelect = (slot: string) => {
    setTimeSlot(slot);
    setStep(3);
  };

  const onSubmit = async (data: ClientDetails) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Booking Confirmed:", { brand, service, date, timeSlot, client: data });
    setIsSubmitting(false);
    setStep(4);
    toast({
      title: "Booking Confirmed!",
      description: "We've sent a confirmation email with the details.",
    });
  };

  const getSelectedServiceDetails = () => {
    if (!brand || !service) return undefined;
    return SERVICES[brand].find((s) => s.id === service);
  };

  const serviceDetails = getSelectedServiceDetails();

  const contextValue = {
    step,
    setStep,
    brand,
    setBrand,
    service,
    setService,
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    isSubmitting,
    handleBrandSelect,
    handleServiceSelect,
    handleDateSelect,
    handleTimeSelect,
    onSubmit,
    getSelectedServiceDetails,
    form,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {["Service", "Date & Time", "Details", "Confirmation"].map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={label} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span className={cn("mt-2 text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
            );
          })}
          <div className="absolute top-5 left-0 h-[2px] w-full -translate-y-1/2 bg-muted px-10 -z-0 hidden md:block">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <BookingWizardContext.Provider value={contextValue}>
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {step === 1 && <Step1_ServiceSelection />}
            {step === 2 && <Step2_DateTimeSelection />}
            {step === 3 && <Step3_ClientDetails />}
            {step === 4 && <Step4_Confirmation />}
          </div>
          {step < 4 && (
            <div className="hidden md:block">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brand && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Department</div>
                      <div className={cn("font-medium", brand === "GCMC" ? "text-green-600" : "text-blue-600")}>
                        {brand === "GCMC" ? "GCMC Consultancy" : "KAJ Financial"}
                      </div>
                    </div>
                  )}

                  {serviceDetails && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Service</div>
                      <div className="font-medium">{serviceDetails.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {serviceDetails.duration} mins • ${serviceDetails.price.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {date && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Date</div>
                      <div className="font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {format(date, "EEE, MMM d, yyyy")}
                      </div>
                    </div>
                  )}

                  {timeSlot && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Time</div>
                      <div className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {timeSlot}
                      </div>
                    </div>
                  )}
                </CardContent>
                {serviceDetails && (
                  <CardFooter className="bg-muted/50 pt-4">
                    <div className="flex w-full justify-between items-center font-bold">
                      <span>Total</span>
                      <span>${serviceDetails.price.toLocaleString()} GYD</span>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}
        </div>
      </BookingWizardContext.Provider>
    </div>
  );
}