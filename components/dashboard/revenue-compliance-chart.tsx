"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { score: 65, revenue: 120000, name: "Client A" },
  { score: 80, revenue: 250000, name: "Client B" },
  { score: 45, revenue: 80000, name: "Client C" },
  { score: 95, revenue: 450000, name: "Client D" },
  { score: 70, revenue: 180000, name: "Client E" },
  { score: 85, revenue: 320000, name: "Client F" },
  { score: 55, revenue: 95000, name: "Client G" },
  { score: 90, revenue: 380000, name: "Client H" },
  { score: 75, revenue: 210000, name: "Client I" },
  { score: 60, revenue: 110000, name: "Client J" },
  { score: 88, revenue: 340000, name: "Client K" },
  { score: 92, revenue: 410000, name: "Client L" },
]

export function RevenueComplianceChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Revenue vs. Compliance Correlation</CardTitle>
        <CardDescription>
          Analysis showing positive correlation between compliance scores and client revenue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="score" name="Compliance Score" unit="%" domain={[0, 100]} />
              <YAxis
                type="number"
                dataKey="revenue"
                name="Revenue"
                unit=" GYD"
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Client</span>
                            <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Score</span>
                            <span className="font-bold">{payload[0].value}%</span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                            <span className="font-bold">${payload[1].value.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter name="Clients" data={data} fill="hsl(var(--primary))">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score > 80 ? "#22c55e" : entry.score > 60 ? "#3b82f6" : "#ef4444"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
