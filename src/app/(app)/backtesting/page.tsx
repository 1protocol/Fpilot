import { PageHeader } from "@/components/shared/page-header";
import BacktestRunner from "@/components/backtesting/backtest-runner";
import BacktestSummary from "@/components/backtesting/backtest-summary";
import PerformanceChart from "@/components/backtesting/performance-chart";
import BacktestTrades from "@/components/backtesting/backtest-trades";

export default function BacktestingPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Backtesting & Validation"
                description="Test your strategies against historical data to validate their performance."
            />
            <BacktestRunner />
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-3">
                    <BacktestSummary />
                </div>
                <div className="lg:col-span-2">
                    <PerformanceChart />
                </div>
                <div className="lg:col-span-1">
                    <BacktestTrades />
                </div>
            </div>
        </div>
    );
}
