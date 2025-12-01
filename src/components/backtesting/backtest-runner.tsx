"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import type { BacktestRunnerParams } from "@/app/(app)/backtesting/page";

type BacktestRunnerProps = {
    onRunBacktest: (params: BacktestRunnerParams) => void;
    isRunning: boolean;
};

export default function BacktestRunner({ onRunBacktest, isRunning }: BacktestRunnerProps) {
    const { firestore, user } = useFirebase();
    
    const [selectedStrategyId, setSelectedStrategyId] = useState<string>('');
    const [selectedAsset, setSelectedAsset] = useState<string>('BTC/USDT');
    const [selectedDateRange, setSelectedDateRange] = useState<string>('last-12-months');

    const strategiesCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'strategies');
      }, [firestore, user?.uid]);
    
    const { data: strategies, isLoading: areStrategiesLoading } = useCollection(strategiesCollectionRef);

    useEffect(() => {
        if (!areStrategiesLoading && strategies && strategies.length > 0 && !selectedStrategyId) {
            setSelectedStrategyId(strategies[0].id);
        }
    }, [areStrategiesLoading, strategies, selectedStrategyId]);
    
    const handleRunClick = () => {
        const selectedStrategy = strategies?.find(s => s.id === selectedStrategyId);
        if (selectedStrategy && selectedStrategy.code) {
            onRunBacktest({
                strategyId: selectedStrategy.id,
                strategyCode: selectedStrategy.code,
                asset: selectedAsset,
                dateRange: selectedDateRange,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Run Backtest</CardTitle>
                <CardDescription>Select a strategy and a date range to run a historical simulation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Strategy</label>
                        {areStrategiesLoading ? (
                             <Skeleton className="h-10 w-full" />
                        ) : (
                            <Select 
                                value={selectedStrategyId} 
                                onValueChange={setSelectedStrategyId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a strategy" />
                                </SelectTrigger>
                                <SelectContent>
                                    {strategies && strategies.length > 0 ? (
                                        strategies.map(strategy => (
                                            <SelectItem key={strategy.id} value={strategy.id}>{strategy.name}</SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-muted-foreground">No strategies found.</div>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Asset</label>
                        <Select value={selectedAsset} onValueChange={setSelectedAsset} defaultValue="BTC/USDT">
                            <SelectTrigger>
                                <SelectValue placeholder="Select an asset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                                <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                                <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Date Range</label>
                         <Select value={selectedDateRange} onValueChange={setSelectedDateRange} defaultValue="last-12-months">
                            <SelectTrigger>
                                <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                                <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                                <SelectItem value="last-24-months">Last 24 Months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button 
                        className="w-full" 
                        onClick={handleRunClick} 
                        disabled={isRunning || areStrategiesLoading || !strategies || strategies.length === 0 || !selectedStrategyId}
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Run Backtest
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
