import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Percent, BarChart, TrendingUp, Shield, LucideProps } from 'lucide-react';
import React from 'react';

const icons: { [key: string]: React.FC<LucideProps> } = {
    DollarSign,
    TrendingUp,
    ArrowDown,
    Percent,
    Shield,
    BarChart,
  };

type SummaryMetric = {
    title: string;
    value: string;
    icon: keyof typeof icons;
    change: string;
    changeType: "positive" | "negative" | "neutral";
};

type MetricCardProps = {
    metric: SummaryMetric;
};

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
    const IconComponent = icons[metric.icon];
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-headline">{metric.value}</div>
                {metric.change && (
                    <p className="text-xs text-muted-foreground flex items-center">
                    <span className={`mr-1 flex items-center gap-1 ${metric.changeType === 'positive' ? 'text-green-400' : metric.changeType === 'negative' ? 'text-red-400' : ''}`}>
                        {metric.changeType === 'positive' ? <ArrowUp className="h-3 w-3" /> : metric.changeType === 'negative' ? <ArrowDown className="h-3 w-3" /> : null}
                        {metric.change}
                    </span>
                     vs. previous
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

type BacktestSummaryProps = {
    summaryMetrics: SummaryMetric[];
};

export default function BacktestSummary({ summaryMetrics }: BacktestSummaryProps) {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
           {summaryMetrics.map(metric => <MetricCard key={metric.title} metric={metric} />)}
        </div>
    )
}
