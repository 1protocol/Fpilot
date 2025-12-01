'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CandlestickChart, Link as LinkIcon, Newspaper, Twitter } from "lucide-react";

const initialDataSources = [
    {
        title: "Real-time Market Data",
        description: "Live feeds from Binance, Bybit, Coinbase, and Deribit across all timeframes.",
        icon: CandlestickChart,
        status: "Connected"
    },
    {
        title: "On-Chain Metrics",
        description: "Data from Glassnode, CryptoQuant, and Messari for deep blockchain analysis.",
        icon: LinkIcon,
        status: "Connected"
    },
    {
        title: "Social Media Sentiment",
        description: "Real-time sentiment analysis from Twitter, Reddit, and Telegram.",
        icon: Twitter,
        status: "Connected"
    },
    {
        title: "News Feeds",
        description: "Automated news ingestion from CoinTelegraph, Decrypt, and TheBlock.",
        icon: Newspaper,
        status: "Connected"
    },
    {
        title: "Macroeconomic Data",
        description: "Key economic indicators including Fed announcements, inflation data, and VIX.",
        icon: Banknote,
        status: "Degraded"
    }
];

const statuses = ["Connected", "Degraded", "Error"];

export default function DataCollectionPage() {
    const [dataSources, setDataSources] = useState(initialDataSources);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataSources(currentSources =>
                currentSources.map(source => {
                    // Give a higher chance to stay "Connected"
                    if (Math.random() > 0.1) {
                         // ~30% chance to change status
                        const newStatus = Math.random() < 0.3 ? statuses[Math.floor(Math.random() * statuses.length)] : source.status;
                        return { ...source, status: newStatus };
                    }
                    return { ...source, status: "Connected" };
                })
            );
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
          case "Connected":
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
                title="Data Collection"
                description="Manage and monitor all integrated data sources."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataSources.map((source) => (
                    <Card key={source.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <div className="flex items-center gap-4">
                                <source.icon className="h-6 w-6 text-muted-foreground" />
                                <CardTitle className="text-lg font-headline">{source.title}</CardTitle>
                            </div>
                             <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${getStatusColor(source.status)}`}></span>
                                <span className="text-xs font-medium text-muted-foreground">{source.status}</span>
                            </div>
                        </CardHeader>
                        <CardDescription className="px-6 pb-6 pt-2">{source.description}</CardDescription>
                    </Card>
                ))}
            </div>
        </div>
    );
}
