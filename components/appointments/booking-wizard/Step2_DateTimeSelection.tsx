"use client";

import * as React from "react";
import { format, isWeekend, isBefore, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBookingWizard } from "./booking-wizard-context";

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

export const Step2_DateTimeSelection = () => {
  const { date, timeSlot, handleDateSelect, handleTimeSelect, setStep } = useBookingWizard();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => isWeekend(date) || isBefore(date, startOfToday())}
            initialFocus
          />
        </div>

        <div className="flex-1">
          <h3 className="mb-4 text-lg font-medium">Available Times</h3>
          {!date ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
              Select a date to see times
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => (
                <Button
                  key={slot}
                  variant={timeSlot === slot ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleTimeSelect(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
};
