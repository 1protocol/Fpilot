'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StrategyList from '@/components/strategies/strategy-list';
import StrategyGenerator from '@/components/strategies/strategy-generator';

const initialStrategies = [
  { id: 'STRAT001', name: "RSI Mean Reversion", asset: "BTC/USDT", timeframe: "1H", pnl: "+15.2%", status: "Active" },
  { id: 'STRAT002', name: "EMA Crossover Momentum", asset: "ETH/USDT", timeframe: "4H", pnl: "+8.9%", status: "Active" },
  { id: 'STRAT003', name: "On-Chain SOPR Signal", asset: "BTC/USDT", timeframe: "1D", pnl: "-2.1%", status: "Paused" },
  { id: 'STRAT004', name: "Volatility Breakout", asset: "SOL/USDT", timeframe: "15m", pnl: "+22.5%", status: "Active" },
  { id: 'STRAT005', name: "Arbitrage Bot", asset: "Multi-asset", timeframe: "1m", pnl: "+5.6%", status: "Error" },
];

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState(initialStrategies);

  const handleStrategyGenerated = (prompt: string, code: string) => {
    const newStrategy = {
      id: `STRAT${String(strategies.length + 1).padStart(3, '0')}`,
      name: `AI: ${prompt.substring(0, 25)}...`,
      asset: 'Mixed', // Or parse from prompt/code
      timeframe: 'N/A',
      pnl: 'N/A',
      status: 'Paused',
    };
    setStrategies(prev => [newStrategy, ...prev]);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trading Strategies"
        description="Manage, create, and optimize your automated trading strategies."
      />
      <Tabs defaultValue="my-strategies">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="my-strategies">My Strategies</TabsTrigger>
          <TabsTrigger value="generate">Generate with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="my-strategies" className="mt-6">
          <StrategyList strategies={strategies} />
        </TabsContent>
        <TabsContent value="generate" className="mt-6">
          <StrategyGenerator onStrategyGenerated={handleStrategyGenerated} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
