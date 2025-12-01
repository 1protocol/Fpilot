import { PageHeader } from "@/components/shared/page-header";
import MarketRegimePredictor from "@/components/analytics/market-regime-predictor";
import SignalGenerator from "@/components/analytics/signal-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Analytics Engine"
                description="Harness the power of AI for market prediction and signal generation."
            />
            <Tabs defaultValue="regime-predictor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="regime-predictor">Market Regime</TabsTrigger>
                    <TabsTrigger value="signal-generator">Signal Generator</TabsTrigger>
                </TabsList>
                <TabsContent value="regime-predictor" className="mt-6">
                    <MarketRegimePredictor />
                </TabsContent>
                <TabsContent value="signal-generator" className="mt-6">
                    <SignalGenerator />
                </TabsContent>
            </Tabs>
        </div>
    );
}
