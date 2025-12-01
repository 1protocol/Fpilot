"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import DashboardCard from "../dashboard/dashboard-card"

const chartData = [
  { date: "2023-01-01", equity: 100000 },
  { date: "2023-02-01", equity: 105200 },
  { date: "2023-03-01", equity: 110800 },
  { date: "2023-04-01", equity: 108500 },
  { date: "2023-05-01", equity: 115600 },
  { date: "2023-06-01", equity: 121300 },
  { date: "2023-07-01", equity: 128900 },
  { date: "2023-08-01", equity: 135400 },
  { date: "2023-09-01", equity: 140100 },
  { date: "2023-10-01", equity: 138000 },
  { date: "2023-11-01", equity: 145500 },
  { date: "2023-12-01", equity: 142150 },
]

const chartConfig = {
  equity: {
    label: "Portfolio Equity",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export default function PerformanceChart() {
  return (
    <DashboardCard
      title="Performance Curve"
      description="Strategy equity curve over the backtesting period"
    >
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={<ChartTooltipContent
                indicator="dot"
                labelClassName="text-sm"
                formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value as number)}
              />}
            />
            <Area
              dataKey="equity"
              type="monotone"
              fill="url(#colorEquity)"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardCard>
  )
}
