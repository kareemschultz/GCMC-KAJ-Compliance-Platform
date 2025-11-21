import { BookingWizard } from "@/components/appointments/booking-wizard"
import { BrandProvider } from "@/components/brand-context"

export default function BookingPage() {
  return (
    <BrandProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
            <p className="text-muted-foreground mt-2">Schedule a consultation with our experts</p>
          </div>
          <BookingWizard />
        </div>
      </div>
    </BrandProvider>
  )
}
