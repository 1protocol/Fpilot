import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Rss, CandlestickChart, BarChart, Users, Newspaper, Landmark } from 'lucide-react';

const dataSources = [
    {
        category: "Real-time Market Data",
        icon: CandlestickChart,
        items: ["Binance", "Bybit", "Coinbase", "Deribit"]
    },
    {
        category: "All Timeframes",
        icon: BarChart,
        items: ["1m", "5m", "15m", "1h", "4h", "1d", "1w"]
    },
    {
        category: "On-chain Metrics",
        icon: Rss,
        items: ["Glassnode", "CryptoQuant", "Messari"]
    },
    {
        category: "Social Media Sentiment",
        icon: Users,
        items: ["Twitter", "Reddit", "Telegram"]
    },
    {
        category: "News Feeds",
        icon: Newspaper,
        items: ["CoinTelegraph", "Decrypt", "TheBlock"]
    },
    {
        category: "Macroeconomic Data",
        icon: Landmark,
        items: ["Fed", "Inflation", "VIX"]
    }
];

export default function DataCollectionPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Data Collection"
                description="Comprehensive data sources powering our analytics engine."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dataSources.map((source) => (
                    <Card key={source.category}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <source.icon className="h-6 w-6 text-accent" />
                                <CardTitle className="font-headline text-lg">{source.category}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {source.items.map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
