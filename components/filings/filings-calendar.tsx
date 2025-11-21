"use client"

import type { Filing } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilingsCalendarProps {
  data: Filing[]
}

export function FilingsCalendar({ data }: FilingsCalendarProps) {
  // Mock calendar grid for March 2025
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 4 // Start from previous month
    return day
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">March 2025</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 text-center mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((day, i) => {
            const isCurrentMonth = day > 0 && day <= 31
            const hasEvent = isCurrentMonth && [14, 21].includes(day)
            const isToday = day === 15

            return (
              <div
                key={i}
                className={`
                  min-h-[80px] p-2 rounded-lg border text-left relative
                  ${isCurrentMonth ? "bg-card" : "bg-muted/20 text-muted-foreground border-transparent"}
                  ${isToday ? "ring-2 ring-primary" : ""}
                `}
              >
                <span className="text-sm font-medium">{day > 0 && day <= 31 ? day : ""}</span>

                {hasEvent && day === 14 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate">
                      NIS Due (12)
                    </div>
                    <div className="text-[10px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate">
                      PAYE Due (8)
                    </div>
                  </div>
                )}

                {hasEvent && day === 21 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-[10px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded truncate">
                      VAT Due (15)
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
