"use client";

import * as React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useBookingWizard } from "./booking-wizard-context";

export const Step4_Confirmation = () => {
    const { date, timeSlot, getSelectedServiceDetails, setStep, setBrand, setService, setDate, setTimeSlot, form } = useBookingWizard();
    const serviceDetails = getSelectedServiceDetails();

    return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-10 w-10" />
            </div>
            <div>
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <p className="text-muted-foreground mt-2">Your appointment has been scheduled successfully.</p>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{serviceDetails?.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{date ? format(date, "MMMM d, yyyy") : ""}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">GCMC & KAJ Office</span>
                    </div>
                </CardContent>
            </Card>

            <Button
                onClick={() => {
                    setStep(1);
                    setBrand(null);
                    setService(null);
                    setDate(undefined);
                    setTimeSlot(null);
                    form.reset();
                }}
            >
                Book Another Appointment
            </Button>
        </div>
    );
};
