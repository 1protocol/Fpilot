import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Percent, BarChart, TrendingUp, Shield, HelpCircle } from 'lucide-react';

const summaryMetrics = [
    { title: "Net Profit", value: "$42,150.73", icon: DollarSign, change: "+15.2%", changeType: "positive" },
    { title: "Sharpe Ratio", value: "1.82", icon: TrendingUp, change: "+0.12", changeType: "positive" },
    { title: "Max Drawdown", value: "8.3%", icon: ArrowDown, change: "-1.1%", changeType: "positive" },
    { title: "Win Rate", value: "62.5%", icon: Percent, change: "+3.1%", changeType: "positive" },
    { title: "Profit Factor", value: "2.1", icon: Shield, change: "+0.25", changeType: "positive" },
    { title: "Total Trades", value: "128", icon: BarChart, change: "", changeType: "neutral" },
];

const MetricCard = ({ metric }: { metric: typeof summaryMetrics[0] }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-headline">{metric.value}</div>
                {metric.change && (
                    <p className="text-xs text-muted-foreground flex items-center">
                    <span className={`mr-1 flex items-center gap-1 ${metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.changeType === 'positive' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {metric.change}
                    </span>
                     vs. previous
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function BacktestSummary() {
    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
           {summaryMetrics.map(metric => <MetricCard key={metric.title} metric={metric} />)}
        </div>
    )
}