"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { predictMarketRegime, type PredictMarketRegimeOutput } from '@/ai/flows/predict-market-regime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, TrendingUp, TrendingDown, ChevronsLeftRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  cryptocurrency: z.string().min(1, { message: "Please select a cryptocurrency." }),
});

const cryptocurrencies = ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'XRP'];

const RegimeIcon = ({ regime }: { regime: PredictMarketRegimeOutput['regime'] }) => {
    switch (regime) {
        case 'Bull':
            return <TrendingUp className="w-6 h-6 text-green-400" />;
        case 'Bear':
            return <TrendingDown className="w-6 h-6 text-red-400" />;
        case 'Sideways':
            return <ChevronsLeftRight className="w-6 h-6 text-yellow-400" />;
    }
}

export default function MarketRegimePredictor() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PredictMarketRegimeOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: "Bitcoin",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setResult(null);
      const res = await predictMarketRegime({ cryptocurrency: values.cryptocurrency });
      setResult(res);
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">AI Market Regime Prediction</CardTitle>
        <CardDescription>Predict the current market trend for a selected cryptocurrency.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-center gap-4">
                <Select name="cryptocurrency" defaultValue={form.getValues("cryptocurrency")} onValueChange={(value) => form.setValue("cryptocurrency", value)}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Select Crypto" />
                    </SelectTrigger>
                    <SelectContent>
                        {cryptocurrencies.map(crypto => (
                        <SelectItem key={crypto} value={crypto}>{crypto}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Predict Regime
                  </>
                )}
              </Button>
            </form>
        </Form>
        
        <div className="flex-1 flex items-center justify-center">
        {isPending ? (
            <div className="text-center space-y-2 text-muted-foreground">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p>Analyzing market data...</p>
            </div>
          ) : result ? (
            <div className="w-full space-y-4">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <RegimeIcon regime={result.regime} />
                        <h3 className="text-2xl font-bold font-headline">{result.regime} Market</h3>
                    </div>
                    <Badge variant="outline">{form.getValues("cryptocurrency")}</Badge>
                </div>
                <div>
                    <div className='flex justify-between items-center mb-1'>
                        <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                        <span className="text-sm font-bold font-mono">{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <Progress value={result.confidence * 100} className="h-2" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm">Rationale</h4>
                  <p className="text-sm text-muted-foreground">{result.rationale}</p>
                </div>
            </div>
          ) : (
            <div className="text-center space-y-2 text-muted-foreground">
              <Bot className="mx-auto h-8 w-8" />
              <p>Select a cryptocurrency to predict its market regime.</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
