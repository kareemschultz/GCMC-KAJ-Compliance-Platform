import { PropertyManager } from "@/components/property/property-manager"

export default function PropertiesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
        <p className="text-muted-foreground">
          Manage rental properties, track lease agreements, and monitor rental income.
        </p>
      </div>
      <PropertyManager />
    </div>
  )
}
