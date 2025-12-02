'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CandlestickChart, Link as LinkIcon, Newspaper, Rss, Twitter } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SubSource = {
    name: string;
    status: 'Operational' | 'Degraded' | 'Error';
};

type DataSource = {
    title: string;
    description: string;
    icon: React.ElementType;
    subSources: SubSource[];
};

const initialDataSources: DataSource[] = [
    {
        title: "Real-time Market Data",
        description: "Live feeds from major exchanges across all supported timeframes.",
        icon: CandlestickChart,
        subSources: [
            { name: "Binance", status: "Operational" },
            { name: "Bybit", status: "Operational" },
            { name: "Coinbase", status: "Operational" },
            { name: "Deribit", status: "Operational" },
        ]
    },
    {
        title: "On-Chain Metrics",
        description: "Deep blockchain analysis from leading on-chain intelligence providers.",
        icon: LinkIcon,
        subSources: [
            { name: "Glassnode API", status: "Operational" },
            { name: "CryptoQuant API", status: "Operational" },
            { name: "Messari API", status: "Degraded" },
        ]
    },
    {
        title: "Social Media Sentiment",
        description: "Real-time sentiment analysis from key social platforms.",
        icon: Twitter,
        subSources: [
            { name: "X (Twitter) Firehose", status: "Operational" },
            { name: "Reddit Stream", status: "Operational" },
            { name: "Telegram Channels", status: "Error" },
        ]
    },
    {
        title: "News Feeds",
        description: "Automated news ingestion from top-tier crypto publications.",
        icon: Newspaper,
        subSources: [
            { name: "CoinTelegraph", status: "Operational" },
            { name: "Decrypt", status: "Operational" },
            { name: "TheBlock", status: "Operational" },
        ]
    },
    {
        title: "Macroeconomic Data",
        description: "Key economic indicators that influence market movements.",
        icon: Banknote,
        subSources: [
            { name: "Federal Reserve (FRED)", status: "Operational" },
            { name: "VIX Central", status: "Operational" },
        ]
    },
    {
        title: "Custom RSS Feeds",
        description: "User-defined RSS feeds for niche news and blog analysis.",
        icon: Rss,
        subSources: [
            { name: "User Feed 1", status: "Operational" },
            { name: "User Feed 2", status: "Operational" },
        ]
    }
];

const statuses: SubSource['status'][] = ["Operational", "Degraded", "Error"];

export default function DataCollectionPage() {
    const [dataSources, setDataSources] = useState(initialDataSources);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataSources(currentSources =>
                currentSources.map(source => ({
                    ...source,
                    subSources: source.subSources.map(sub => {
                        // Give a higher chance to stay "Operational"
                        if (Math.random() > 0.15) {
                            return { ...sub, status: "Operational" };
                        }
                        // Otherwise, pick a random new status
                        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        return { ...sub, status: newStatus };
                    })
                }))
            );
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
          case "Operational":
            return "bg-green-500";
          case "Degraded":
            return "bg-yellow-500";
          default:
            return "bg-red-500";
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Data Collection Engine"
                description="Manage and monitor all integrated data sources in real-time."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {dataSources.map((source) => (
                    <Card key={source.title}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <source.icon className="h-7 w-7 text-muted-foreground" />
                                <CardTitle className="text-lg font-headline">{source.title}</CardTitle>
                            </div>
                            <CardDescription className="pt-1">{source.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">Monitored Sources</p>
                            {source.subSources.map(sub => (
                                <div key={sub.name} className="flex items-center justify-between text-sm">
                                    <span>{sub.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", getStatusColor(sub.status))}></div>
                                        <span className="font-mono text-xs">{sub.status}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
