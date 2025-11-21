import { ExpediteTracker } from "@/components/expediting/expedite-tracker"

export default function ExpeditingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Expediting Service</h1>
        <p className="text-muted-foreground">
          Track physical documents moving through government agencies (GRA, Deeds Registry, Passport Office).
        </p>
      </div>
      <ExpediteTracker />
    </div>
  )
}
