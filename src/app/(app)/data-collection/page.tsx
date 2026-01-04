'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CandlestickChart, Link as LinkIcon, Newspaper, Rss, Twitter, Sigma } from "lucide-react";
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

type DataSourceConfig = {
    id: string;
    enabled: boolean;
    subSourceStatuses: { [key: string]: 'Operational' | 'Degraded' | 'Error' };
};

type DataSourceTemplate = {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    subSources: { id: string, name: string }[];
};

const dataSourceTemplates: DataSourceTemplate[] = [
    {
        id: 'market-data',
        title: "Real-time Market Data",
        description: "Live feeds from major exchanges across all supported timeframes.",
        icon: CandlestickChart,
        subSources: [
            { id: 'binance', name: "Binance" },
            { id: 'bybit', name: "Bybit" },
            { id: 'coinbase', name: "Coinbase" },
        ]
    },
    {
        id: 'derivatives',
        title: "Derivatives Intelligence",
        description: "Funding rates, open interest, and long/short ratios from derivatives exchanges.",
        icon: Sigma,
        subSources: [
            { id: 'deribit', name: "Deribit" },
            { id: 'binance-futures', name: "Binance Futures" },
            { id: 'bybit-perp', name: "Bybit Perpetuals" },
        ]
    },
    {
        id: 'on-chain',
        title: "On-Chain Metrics",
        description: "Deep blockchain analysis from leading on-chain intelligence providers.",
        icon: LinkIcon,
        subSources: [
            { id: 'glassnode', name: "Glassnode API" },
            { id: 'cryptoquant', name: "CryptoQuant API" },
            { id: 'messari', name: "Messari API" },
        ]
    },
    {
        id: 'social-media',
        title: "Social Media Sentiment",
        description: "Real-time sentiment analysis from key social platforms.",
        icon: Twitter,
        subSources: [
            { id: 'twitter', name: "X (Twitter) Firehose" },
            { id: 'reddit', name: "Reddit Stream" },
            { id: 'telegram', name: "Telegram Channels" },
        ]
    },
    {
        id: 'news-feeds',
        title: "News Feeds",
        description: "Automated news ingestion from top-tier crypto publications.",
        icon: Newspaper,
        subSources: [
            { id: 'cointetelegraph', name: "CoinTelegraph" },
            { id: 'decrypt', name: "Decrypt" },
            { id: 'theblock', name: "TheBlock" },
        ]
    },
    {
        id: 'macroeconomic',
        title: "Macroeconomic Data",
        description: "Key economic indicators that influence market movements.",
        icon: Banknote,
        subSources: [
            { id: 'fred', name: "Federal Reserve (FRED)" },
            { id: 'vix', name: "VIX Central" },
        ]
    },
    {
        id: 'custom-rss',
        title: "Custom RSS Feeds",
        description: "User-defined RSS feeds for niche news and blog analysis.",
        icon: Rss,
        subSources: [
            { id: 'user-feed-1', name: "User Feed 1" },
            { id: 'user-feed-2', name: "User Feed 2" },
        ]
    }
];

const statuses: ('Operational' | 'Degraded' | 'Error')[] = ["Operational", "Degraded", "Error"];

export default function DataCollectionPage() {
    const { firestore, user } = useFirebase();

    const configCollectionRef = useMemoFirebase(() =>
        user ? collection(firestore, 'users', user.uid, 'data_source_configs') : null
    , [user, firestore]);

    const { data: configs, isLoading: areConfigsLoading } = useCollection<DataSourceConfig>(configCollectionRef);

    // Simulate live status updates for sub-sources
    useEffect(() => {
        const interval = setInterval(() => {
            if (!configs || !user || !firestore) return;

            configs.forEach(config => {
                const newSubSourceStatuses = { ...config.subSourceStatuses };
                let changed = false;

                Object.keys(newSubSourceStatuses).forEach(subSourceId => {
                    if (Math.random() < 0.1) { // 10% chance to change status
                        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        if (newSubSourceStatuses[subSourceId] !== newStatus) {
                            newSubSourceStatuses[subSourceId] = newStatus;
                            changed = true;
                        }
                    } else if (newSubSourceStatuses[subSourceId] !== 'Operational') {
                        // Higher chance to go back to operational
                        if (Math.random() < 0.4) {
                             newSubSourceStatuses[subSourceId] = 'Operational';
                             changed = true;
                        }
                    }
                });

                if (changed) {
                    const configDocRef = doc(firestore, 'users', user.uid, 'data_source_configs', config.id);
                    setDocumentNonBlocking(configDocRef, { subSourceStatuses: newSubSourceStatuses }, { merge: true });
                }
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [configs, user, firestore]);

    // Create default configs if they don't exist
    useEffect(() => {
        if (!areConfigsLoading && configs && user && firestore) {
            dataSourceTemplates.forEach(template => {
                if (!configs.find(c => c.id === template.id)) {
                    const newConfig = {
                        id: template.id,
                        enabled: true,
                        subSourceStatuses: template.subSources.reduce((acc, sub) => {
                            acc[sub.id] = 'Operational';
                            return acc;
                        }, {} as { [key: string]: 'Operational' | 'Degraded' | 'Error' })
                    };
                    const configDocRef = doc(firestore, 'users', user.uid, 'data_source_configs', template.id);
                    setDocumentNonBlocking(configDocRef, newConfig, { merge: true });
                }
            });
        }
    }, [areConfigsLoading, configs, user, firestore]);

    const handleToggleSource = (configId: string, isEnabled: boolean) => {
        if (!user || !firestore) return;
        const configDocRef = doc(firestore, 'users', user.uid, 'data_source_configs', configId);
        setDocumentNonBlocking(configDocRef, { enabled: isEnabled }, { merge: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
          case "Operational": return "bg-green-500";
          case "Degraded": return "bg-yellow-500";
          default: return "bg-red-500";
        }
    };
    
    if (areConfigsLoading) {
        return (
             <div className="space-y-8">
                <PageHeader
                    title="Data Collection Engine"
                    description="Manage and monitor all integrated data sources in real-time."
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                    {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-60" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Data Collection Engine"
                description="Manage and monitor all integrated data sources in real-time."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {dataSourceTemplates.map((source) => {
                    const config = configs?.find(c => c.id === source.id);
                    
                    return (
                        <Card key={source.id} className={cn(!config?.enabled && 'bg-muted/30')}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <source.icon className={cn("h-7 w-7 text-muted-foreground", !config?.enabled && "opacity-50")} />
                                        <CardTitle className={cn("text-lg font-headline", !config?.enabled && "text-muted-foreground")}>{source.title}</CardTitle>
                                    </div>
                                    <Switch
                                        checked={config?.enabled ?? false}
                                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                                        aria-label={`Toggle ${source.title}`}
                                    />
                                </div>
                                <CardDescription className="pt-1">{source.description}</CardDescription>
                            </CardHeader>
                            <CardContent className={cn("space-y-3 transition-opacity", !config?.enabled && "opacity-50")}>
                                <p className="text-sm font-medium text-muted-foreground">Monitored Sources</p>
                                {source.subSources.map(sub => (
                                    <div key={sub.id} className="flex items-center justify-between text-sm">
                                        <span>{sub.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full", getStatusColor(config?.subSourceStatuses[sub.id] ?? 'Error'))}></div>
                                            <span className="font-mono text-xs">{config?.subSourceStatuses[sub.id] ?? '...'}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
