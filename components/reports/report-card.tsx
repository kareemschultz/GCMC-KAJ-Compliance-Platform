"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportCardProps {
  title: string
  description: string
  icon: LucideIcon
  onGenerate: () => void
}

export function ReportCard({ title, description, icon: Icon, onGenerate }: ReportCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="pt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">{/* Filters would go here in a real implementation */}</CardContent>
      <CardFooter>
        <Button onClick={onGenerate} className="w-full">
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  )
}
