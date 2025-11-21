"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: 'Excellent', value: 45, color: '#22c55e' }, // Green
  { name: 'Good', value: 60, color: '#3b82f6' },     // Blue
  { name: 'Fair', value: 30, color: '#eab308' },     // Yellow
  { name: 'Poor', value: 21, color: '#ef4444' },     // Red
]

export function ComplianceChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Compliance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
