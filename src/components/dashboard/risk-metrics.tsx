import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, Sigma } from "lucide-react"

const riskData = [
  {
    title: "Value at Risk (VaR)",
    value: "2.8%",
    change: "+0.2%",
    changeType: "negative",
    icon: AlertTriangle,
  },
  {
    title: "Expected Shortfall (CVaR)",
    value: "4.1%",
    change: "+0.4%",
    changeType: "negative",
    icon: Sigma,
  },
  {
    title: "Max Drawdown",
    value: "8.5%",
    change: "-1.1%",
    changeType: "positive",
    icon: ShieldCheck,
  },
]

export default function RiskMetrics() {
  return (
    <>
      {riskData.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{metric.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className={`mr-1 flex items-center gap-1 ${metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                {metric.changeType === 'positive' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {metric.change}
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
