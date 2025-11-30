import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CandlestickChart } from 'lucide-react';

export default function BacktestingPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Backtesting & Validation"
                description="Test your strategies against historical data."
            />
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="w-full max-w-lg text-center shadow-lg">
                    <CardHeader>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <CandlestickChart className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Advanced Backtesting Framework</CardTitle>
                        <CardDescription>Coming Soon</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Our institutional-grade backtesting engine is currently under development. Soon, you'll be able to perform walk-forward optimizations, Monte Carlo simulations, robustness testing, and more to rigorously validate your strategies.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
