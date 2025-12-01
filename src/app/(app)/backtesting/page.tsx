'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import BacktestRunner from '@/components/backtesting/backtest-runner';
import BacktestSummary from '@/components/backtesting/backtest-summary';
import PerformanceChart from '@/components/backtesting/performance-chart';
import BacktestTrades from '@/components/backtesting/backtest-trades';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Helper function to generate mock data
const generateMockResults = () => {
  const netProfit = Math.random() * 50000;
  const sharpeRatio = (Math.random() * 2 + 0.5).toFixed(2);
  const maxDrawdown = (Math.random() * 10 + 5).toFixed(1);
  const winRate = (Math.random() * 40 + 50).toFixed(1);
  const profitFactor = (Math.random() * 2 + 1).toFixed(1);
  const totalTrades = Math.floor(Math.random() * 150 + 50);

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2023, i, 1);
    const equity = 100000 * (1 + (Math.random() - 0.2) * 0.05 * (i + 1));
    return {
      date: date.toISOString().split('T')[0],
      equity: Math.floor(equity),
    };
  });

  const tradeData = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    side: Math.random() > 0.5 ? 'Buy' : 'Sell',
    price: (Math.random() * 10000 + 60000).toFixed(2),
    size: (Math.random() * 1 + 0.1).toFixed(2),
    pnl: `${Math.random() > 0.5 ? '+' : '-'}$${(Math.random() * 500).toFixed(0)}`,
  }));

  return {
    summaryMetrics: [
      { title: 'Net Profit', value: `$${netProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, icon: 'DollarSign', change: `${(Math.random() > 0.5 ? '+' : '-')}15.2%`, changeType: Math.random() > 0.5 ? 'positive' : 'negative' },
      { title: 'Sharpe Ratio', value: sharpeRatio, icon: 'TrendingUp', change: `${(Math.random() > 0.5 ? '+' : '-')}0.12`, changeType: Math.random() > 0.5 ? 'positive' : 'negative' },
      { title: 'Max Drawdown', value: `${maxDrawdown}%`, icon: 'ArrowDown', change: `${(Math.random() > 0.5 ? '+' : '-')}1.1%`, changeType: Math.random() > 0.5 ? 'positive' : 'negative' },
      { title: 'Win Rate', value: `${winRate}%`, icon: 'Percent', change: `${(Math.random() > 0.5 ? '+' : '-')}3.1%`, changeType: Math.random() > 0.5 ? 'positive' : 'negative' },
      { title: 'Profit Factor', value: profitFactor, icon: 'Shield', change: `${(Math.random() > 0.5 ? '+' : '-')}0.25`, changeType: Math.random() > 0.5 ? 'positive' : 'negative' },
      { title: 'Total Trades', value: String(totalTrades), icon: 'BarChart', change: '', changeType: 'neutral' },
    ],
    performanceData: chartData,
    tradeData: tradeData,
  };
};

export default function BacktestingPage() {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunBacktest = () => {
    setIsBacktesting(true);
    setResults(null);
    setTimeout(() => {
      setResults(generateMockResults());
      setIsBacktesting(false);
    }, 2500); // Simulate a 2.5 second backtest
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Backtesting & Validation"
        description="Test your strategies against historical data to validate their performance."
      />
      <BacktestRunner onRunBacktest={handleRunBacktest} isRunning={isBacktesting} />

      {isBacktesting && (
        <Card className="flex items-center justify-center p-16">
          <div className="text-center space-y-2 text-muted-foreground">
            <Loader2 className="mx-auto h-10 w-10 animate-spin" />
            <p className="text-lg">Running backtest against historical data...</p>
          </div>
        </Card>
      )}

      {results && (
        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8 animate-in fade-in-50 duration-500">
          <div className="lg:col-span-3">
            <BacktestSummary summaryMetrics={results.summaryMetrics} />
          </div>
          <div className="lg:col-span-2">
            <PerformanceChart chartData={results.performanceData} />
          </div>
          <div className="lg:col-span-1">
            <BacktestTrades tradeData={results.tradeData} />
          </div>
        </div>
      )}
    </div>
  );
}
