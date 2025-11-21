"use client"

import * as React from "react"
import { format, isWeekend, isBefore, startOfToday } from "date-fns"
import { CalendarIcon, Clock, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Schema for client details
const clientDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  reason: z.string().min(10, "Please provide a reason for your visit"),
})

type ClientDetails = z.infer<typeof clientDetailsSchema>

// Mock Services
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
}

// Mock Time Slots
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"]

export function BookingWizard() {
  const [step, setStep] = React.useState(1)
  const [brand, setBrand] = React.useState<"GCMC" | "KAJ" | null>(null)
  const [service, setService] = React.useState<string | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<ClientDetails>({
    resolver: zodResolver(clientDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "",
    },
  })

  const handleBrandSelect = (selectedBrand: "GCMC" | "KAJ") => {
    setBrand(selectedBrand)
    setService(null) // Reset service when brand changes
  }

  const handleServiceSelect = (serviceId: string) => {
    setService(serviceId)
    setStep(2)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setTimeSlot(null) // Reset time slot when date changes
  }

  const handleTimeSelect = (slot: string) => {
    setTimeSlot(slot)
    setStep(3)
  }

  const onSubmit = async (data: ClientDetails) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Booking Confirmed:", {
      brand,
      service,
      date,
      timeSlot,
      client: data,
    })

    setIsSubmitting(false)
    setStep(4)
    toast({
      title: "Booking Confirmed!",
      description: "We've sent a confirmation email with the details.",
    })
  }

  const getSelectedServiceDetails = () => {
    if (!brand || !service) return null
    return SERVICES[brand].find((s) => s.id === service)
  }

  const serviceDetails = getSelectedServiceDetails()

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {["Service", "Date & Time", "Details", "Confirmation"].map((label, index) => {
            const stepNum = index + 1
            const isActive = step === stepNum
            const isCompleted = step > stepNum

            return (
              <div key={label} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span className={cn("mt-2 text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
            )
          })}

          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 h-[2px] w-full -translate-y-1/2 bg-muted px-10 -z-0 hidden md:block">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-green-500 hover:shadow-md",
                    brand === "GCMC" ? "border-green-500 ring-1 ring-green-500 bg-green-50/30" : "",
                  )}
                  onClick={() => handleBrandSelect("GCMC")}
                >
                  <CardHeader>
                    <CardTitle className="text-green-700">GCMC Consultancy</CardTitle>
                    <CardDescription>Immigration, Legal, and Business Services</CardDescription>
                  </CardHeader>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-blue-500 hover:shadow-md",
                    brand === "KAJ" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30" : "",
                  )}
                  onClick={() => handleBrandSelect("KAJ")}
                >
                  <CardHeader>
                    <CardTitle className="text-blue-700">KAJ Financial</CardTitle>
                    <CardDescription>Tax, Compliance, and Payroll Services</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {brand && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="mb-4 text-lg font-medium">Select a Service</h3>
                  <div className="grid gap-3">
                    {SERVICES[brand].map((s) => (
                      <div
                        key={s.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50",
                          service === s.id ? "border-primary bg-muted/50" : "",
                        )}
                        onClick={() => handleServiceSelect(s.id)}
                      >
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-sm text-muted-foreground">{s.duration} minutes</div>
                        </div>
                        <div className="font-semibold">${s.price.toLocaleString()} GYD</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
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
          )}

          {/* Step 3: Client Details */}
          {step === 3 && (
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+592 600-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please briefly describe what you need help with..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                        </>
                      ) : (
                        <>
                          Confirm Booking <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
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
                  setStep(1)
                  setBrand(null)
                  setService(null)
                  setDate(undefined)
                  setTimeSlot(null)
                  form.reset()
                }}
              >
                Book Another Appointment
              </Button>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
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
    </div>
  )
}
