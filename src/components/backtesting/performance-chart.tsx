"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import DashboardCard from "../dashboard/dashboard-card"

const chartConfig = {
  equity: {
    label: "Portfolio Equity",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

type PerformanceChartProps = {
    chartData: { date: string; equity: number }[];
};

export default function PerformanceChart({ chartData }: PerformanceChartProps) {
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
              domain={['dataMin - 1000', 'dataMax + 1000']}
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
