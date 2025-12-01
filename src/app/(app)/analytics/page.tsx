import { PageHeader } from "@/components/shared/page-header";
import MarketRegimePredictor from "@/components/analytics/market-regime-predictor";
import SignalGenerator from "@/components/analytics/signal-generator";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Analytics Engine"
                description="Harness the power of AI for market prediction and signal generation."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <MarketRegimePredictor />
                <SignalGenerator />
            </div>
        </div>
    );
}
