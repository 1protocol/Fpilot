"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, PlayCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

type BacktestRunnerProps = {
    onRunBacktest: () => void;
    isRunning: boolean;
};

export default function BacktestRunner({ onRunBacktest, isRunning }: BacktestRunnerProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
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
                        <Select defaultValue="strat1">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a strategy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="strat1">RSI Mean Reversion</SelectItem>
                                <SelectItem value="strat2">EMA Crossover Momentum</SelectItem>
                                <SelectItem value="strat3">Volatility Breakout</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Asset</label>
                        <Select defaultValue="btc-usdt">
                            <SelectTrigger>
                                <SelectValue placeholder="Select an asset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="btc-usdt">BTC/USDT</SelectItem>
                                <SelectItem value="eth-usdt">ETH/USDT</SelectItem>
                                <SelectItem value="sol-usdt">SOL/USDT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Date Range</label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button className="w-full" onClick={onRunBacktest} disabled={isRunning}>
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
