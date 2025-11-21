"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewImmigrationCaseDialog } from "@/components/immigration/new-case-dialog"
import { AddWorkshopDialog } from "@/components/training/add-workshop-dialog"
import { AddPartnerDialog } from "@/components/network/add-partner-dialog"
import { DocumentGeneratorModal } from "@/components/documents/document-generator-modal"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and operations.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Immigration</span>
          <NewImmigrationCaseDialog />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Training</span>
          <AddWorkshopDialog />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Network</span>
          <AddPartnerDialog />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Paralegal</span>
          <DocumentGeneratorModal />
        </div>
      </CardContent>
    </Card>
  )
}
