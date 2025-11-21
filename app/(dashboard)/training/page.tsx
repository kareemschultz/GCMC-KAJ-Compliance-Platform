import { TrainingCalendar } from "@/components/training/training-calendar"
import { AddWorkshopDialog } from "@/components/training/add-workshop-dialog"

export default function TrainingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training & Workshops</h1>
          <p className="text-muted-foreground">Manage training schedules, enrollments, and course catalogs.</p>
        </div>
        <AddWorkshopDialog />
      </div>
      <TrainingCalendar />
    </div>
  )
}
