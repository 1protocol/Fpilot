"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import DashboardCard from "./dashboard-card"

const chartData = [
  { month: "January", portfolio: 186000 },
  { month: "February", portfolio: 305000 },
  { month: "March", portfolio: 237000 },
  { month: "April", portfolio: 173000 },
  { month: "May", portfolio: 209000 },
  { month: "June", portfolio: 214000 },
  { month: "July", portfolio: 258000 },
  { month: "August", portfolio: 298000 },
]

const chartConfig = {
  portfolio: {
    label: "Portfolio Value",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export default function PortfolioChart() {
  return (
    <DashboardCard
      title="Portfolio Performance"
      description="Your portfolio value over the last 8 months"
    >
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
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
              dataKey="portfolio"
              type="monotone"
              fill="url(#colorPortfolio)"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardCard>
  )
}
