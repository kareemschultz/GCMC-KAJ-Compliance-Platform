"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { name: "Tax Filings", value: 45, color: "#3b82f6" },
  { name: "Business Reg", value: 25, color: "#0d9488" },
  { name: "Consultancy", value: 15, color: "#8b5cf6" },
  { name: "Immigration", value: 10, color: "#f59e0b" },
  { name: "Paralegal", value: 5, color: "#64748b" },
]

export function ServicesChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Service Distribution</CardTitle>
        <CardDescription>Breakdown of active services across all clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
