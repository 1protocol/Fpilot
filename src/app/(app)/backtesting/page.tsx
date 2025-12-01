'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import BacktestRunner from '@/components/backtesting/backtest-runner';
import BacktestSummary from '@/components/backtesting/backtest-summary';
import PerformanceChart from '@/components/backtesting/performance-chart';
import BacktestTrades from '@/components/backtesting/backtest-trades';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { BacktestSimulationOutput } from '@/services/backtestingService';
import { runBacktestSimulation } from '@/services/backtestingService';
import { useToast } from '@/hooks/use-toast';

export type BacktestRunnerParams = {
    strategyId: string;
    strategyCode: string;
    asset: string;
    dateRange: string;
}

export default function BacktestingPage() {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [results, setResults] = useState<BacktestSimulationOutput | null>(null);
  const { toast } = useToast();

  const handleRunBacktest = async (params: BacktestRunnerParams) => {
    setIsBacktesting(true);
    setResults(null);
    
    try {
        const simulationResults = await runBacktestSimulation({
            strategyCode: params.strategyCode,
            asset: params.asset,
            dateRange: params.dateRange,
        });

        // Transform AI output to match component props
        const transformedResults = {
          summaryMetrics: [
            { title: 'Net Profit', value: `$${simulationResults.netProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, icon: 'DollarSign' as const, change: '', changeType: 'neutral' as const },
            { title: 'Sharpe Ratio', value: simulationResults.sharpeRatio.toFixed(2), icon: 'TrendingUp' as const, change: '', changeType: 'neutral' as const },
            { title: 'Max Drawdown', value: `${simulationResults.maxDrawdown.toFixed(1)}%`, icon: 'ArrowDown' as const, change: '', changeType: 'neutral' as const },
            { title: 'Win Rate', value: `${simulationResults.winRate.toFixed(1)}%`, icon: 'Percent' as const, change: '', changeType: 'neutral' as const },
            { title: 'Profit Factor', value: simulationResults.profitFactor.toFixed(1), icon: 'Shield' as const, change: '', changeType: 'neutral' as const },
            { title: 'Total Trades', value: String(simulationResults.totalTrades), icon: 'BarChart' as const, change: '', changeType: 'neutral' as const },
          ],
          performanceData: simulationResults.equityCurveData,
          tradeData: simulationResults.trades.map((t, i) => ({
              id: String(i + 1),
              side: t.side as 'Buy' | 'Sell',
              price: t.price.toFixed(2),
              size: t.size.toFixed(3),
              pnl: `${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(0)}`,
          })),
        };

        setResults(transformedResults as any); // Cast because of icon string literal type issue

    } catch (error) {
        console.error("Backtest simulation failed:", error);
        toast({
            variant: "destructive",
            title: "Backtest Failed",
            description: "The AI simulation failed to run. Please try again.",
        });
    } finally {
        setIsBacktesting(false);
    }
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
            <p className="text-lg">Running AI-powered backtest simulation...</p>
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
