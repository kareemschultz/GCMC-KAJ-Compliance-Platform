"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    month: "Jan",
    actual: 4000,
    projected: 4200,
  },
  {
    month: "Feb",
    actual: 3000,
    projected: 3800,
  },
  {
    month: "Mar",
    actual: 2000,
    projected: 4500,
  },
  {
    month: "Apr",
    actual: 2780,
    projected: 3908,
  },
  {
    month: "May",
    actual: 1890,
    projected: 4800,
  },
  {
    month: "Jun",
    actual: 2390,
    projected: 3800,
  },
  {
    month: "Jul",
    actual: 3490,
    projected: 4300,
  },
]

export function CashFlowChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="projected" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  )
}
