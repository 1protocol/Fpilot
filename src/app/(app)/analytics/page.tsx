import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Radar } from 'lucide-react';
import MarketRegimePredictor from "@/components/analytics/market-regime-predictor";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Analytics Engine"
                description="Harness the power of AI for market prediction and signal generation."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <MarketRegimePredictor />
                </div>
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Radar className="w-10 h-10 text-accent" />
                            <div>
                                <CardTitle className="font-headline text-xl">Signal Generation</CardTitle>
                                <CardDescription>Dynamic, risk-adjusted signal processing</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-muted-foreground text-sm">
                            The signal engine is under development. It will feature ensemble voting systems, dynamic confidence scoring, and market regime adaptation to generate high-quality trading signals.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
