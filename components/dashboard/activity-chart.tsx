"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 550 },
  { name: "Apr", value: 450 },
  { name: "May", value: 600 },
  { name: "Jun", value: 750 },
  { name: "Jul", value: 800 },
  { name: "Aug", value: 700 },
  { name: "Sep", value: 900 },
  { name: "Oct", value: 1000 },
  { name: "Nov", value: 1100 },
  { name: "Dec", value: 1200 },
]

export function ActivityChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Activity</CardTitle>
        <CardDescription>Documents uploaded and filings submitted over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
