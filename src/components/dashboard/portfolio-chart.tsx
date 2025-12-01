"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import DashboardCard from "./dashboard-card"

const initialChartData = [
  { time: "10:00", portfolio: 186000 },
  { time: "10:05", portfolio: 186200 },
  { time: "10:10", portfolio: 186150 },
  { time: "10:15", portfolio: 186300 },
  { time: "10:20", portfolio: 186500 },
  { time: "10:25", portfolio: 186450 },
  { time: "10:30", portfolio: 186600 },
]

const chartConfig = {
  portfolio: {
    label: "Portfolio Value",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export default function PortfolioChart() {
  const [chartData, setChartData] = useState(initialChartData)

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(currentData => {
        const lastDataPoint = currentData[currentData.length - 1];
        const newTime = new Date(new Date(`1970-01-01T${lastDataPoint.time}:00Z`).getTime() + 5 * 60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        const newPortfolioValue = lastDataPoint.portfolio * (1 + (Math.random() - 0.495) * 0.005);
        
        const newData = [...currentData.slice(1), {
          time: newTime,
          portfolio: Math.floor(newPortfolioValue)
        }];

        return newData;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <DashboardCard
      title="Portfolio Performance"
      description="Live portfolio value over time"
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
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              domain={['dataMin - 500', 'dataMax + 500']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
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
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardCard>
  )
}
