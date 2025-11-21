"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Calculator } from "lucide-react"
import { api } from "@/lib/api"
import type { NISSchedule } from "@/types"

export function NISScheduleTable() {
  const [schedules, setSchedules] = useState<NISSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // Form state
  const [month, setMonth] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [totalWages, setTotalWages] = useState("")

  // Calculated values
  const wages = Number.parseFloat(totalWages) || 0
  const employeeDed = Math.round(wages * 0.056 * 100) / 100
  const employerCont = Math.round(wages * 0.084 * 100) / 100
  const totalRemit = Math.round(wages * 0.14 * 100) / 100

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await api.nisSchedules.list()
        setSchedules(data)
      } catch (error) {
        console.error("Failed to fetch NIS schedules:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const newSchedule = await api.nisSchedules.create({
        month: `${month} ${year}`,
        totalWages: wages,
        employeeDed,
        employerCont,
        totalRemit,
        clientId: "current-client-id", // In real app, get from context
      })

      setSchedules([newSchedule, ...schedules])
      setOpen(false)
      setTotalWages("")
      setMonth("")
    } catch (error) {
      console.error("Failed to create schedule:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">NIS Schedules</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create NIS Schedule</DialogTitle>
              <DialogDescription>Enter total wages to automatically calculate deductions.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={month} onValueChange={setMonth} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wages">Total Wages (GYD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="wages"
                      type="number"
                      className="pl-7"
                      placeholder="0.00"
                      value={totalWages}
                      onChange={(e) => setTotalWages(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground mb-2">
                    <Calculator className="h-4 w-4" />
                    <span>Calculated Breakdown</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Employee (5.6%)</span>
                    <span className="font-mono">
                      ${employeeDed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Employer (8.4%)</span>
                    <span className="font-mono">
                      ${employerCont.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Remittance</span>
                    <span className="font-mono text-primary">
                      ${totalRemit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Total Wages</TableHead>
              <TableHead className="text-right">Employee (5.6%)</TableHead>
              <TableHead className="text-right">Employer (8.4%)</TableHead>
              <TableHead className="text-right">Total Remit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{schedule.month}</TableCell>
                <TableCell className="text-right">${schedule.totalWages.toLocaleString()}</TableCell>
                <TableCell className="text-right">${schedule.employeeDed.toLocaleString()}</TableCell>
                <TableCell className="text-right">${schedule.employerCont.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">${schedule.totalRemit.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={schedule.status === "FILED" ? "default" : "secondary"}>{schedule.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No schedules found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
