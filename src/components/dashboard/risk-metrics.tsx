"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, Sigma } from "lucide-react"

const initialRiskData = [
  {
    title: "Value at Risk (VaR)",
    value: 2.8,
    change: 0.2,
    changeType: "negative",
    icon: AlertTriangle,
  },
  {
    title: "Expected Shortfall (CVaR)",
    value: 4.1,
    change: 0.4,
    changeType: "negative",
    icon: Sigma,
  },
  {
    title: "Max Drawdown",
    value: 8.5,
    change: -1.1,
    changeType: "positive",
    icon: ShieldCheck,
  },
];

type RiskMetric = typeof initialRiskData[0];

export default function RiskMetrics() {
  const [riskData, setRiskData] = useState<RiskMetric[]>(initialRiskData);
  const [lastValues, setLastValues] = useState<number[]>(initialRiskData.map(d => d.value));

  useEffect(() => {
    const interval = setInterval(() => {
      setLastValues(riskData.map(d => d.value));
      setRiskData(currentData =>
        currentData.map(metric => {
          const fluctuation = (Math.random() - 0.5) * 0.1; // small fluctuation
          const newValue = parseFloat((metric.value + fluctuation).toFixed(2));
          const change = parseFloat((newValue - metric.value).toFixed(2));

          return {
            ...metric,
            value: newValue,
            change: change,
            changeType: (metric.title === 'Max Drawdown' ? change < 0 : change > 0) ? 'negative' : 'positive'
          };
        })
      );
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [riskData]);
  

  return (
    <>
      {riskData.map((metric, index) => {
        const valueChange = metric.value - lastValues[index];
        const changeType = (metric.title === 'Max Drawdown' ? valueChange < 0 : valueChange > 0) ? 'positive' : 'negative';
        
        // For drawdown, a decrease is good (positive), an increase is bad (negative)
        const finalChangeType = metric.title === 'Max Drawdown' ? (valueChange < 0 ? 'positive' : 'negative') : (valueChange > 0 ? 'negative' : 'positive');

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{metric.value.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className={`mr-1 flex items-center gap-1 ${finalChangeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                  {valueChange !== 0 ? (finalChangeType === 'positive' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />) : null}
                  {valueChange.toFixed(2)}%
                </span>
                from last period
              </p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
