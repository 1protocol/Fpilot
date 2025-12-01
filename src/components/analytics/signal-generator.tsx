"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateTradingSignal, type GenerateTradingSignalOutput } from '@/ai/flows/generate-trading-signal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Target, TrendingUp, TrendingDown, Pause } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  strategyType: z.string().min(1, "Please select a strategy."),
  riskLevel: z.string().min(1, "Please select a risk level."),
  cryptocurrency: z.string().min(1, "Please select a cryptocurrency."),
});

const cryptocurrencies = ['Bitcoin', 'Ethereum', 'Solana'];
const strategies = ['Momentum', 'Mean Reversion', 'Arbitrage'];
const riskLevels = ['Low', 'Medium', 'High'];

const SignalIcon = ({ signal }: { signal: GenerateTradingSignalOutput['signal'] }) => {
    switch (signal) {
        case 'Buy':
            return <TrendingUp className="w-8 h-8 text-green-400" />;
        case 'Sell':
            return <TrendingDown className="w-8 h-8 text-red-400" />;
        case 'Hold':
            return <Pause className="w-8 h-8 text-yellow-400" />;
    }
}

export default function SignalGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateTradingSignalOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategyType: "Momentum",
      riskLevel: "Medium",
      cryptocurrency: "Bitcoin",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setResult(null);
      const res = await generateTradingSignal({ 
        strategyType: values.strategyType as any,
        riskLevel: values.riskLevel as any,
        cryptocurrency: values.cryptocurrency
      });
      setResult(res);
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">AI Signal Generation</CardTitle>
        <CardDescription>Generate dynamic, risk-adjusted trading signals.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="cryptocurrency" render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Crypto" /></SelectTrigger>
                            <SelectContent>{cryptocurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    )} />
                    <FormField control={form.control} name="strategyType" render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Strategy" /></SelectTrigger>
                            <SelectContent>{strategies.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    )} />
                    <FormField control={form.control} name="riskLevel" render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Risk Level" /></SelectTrigger>
                            <SelectContent>{riskLevels.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                        </Select>
                    )} />
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Signal...</>
                ) : (
                  <><Bot className="mr-2 h-4 w-4" />Generate Signal</>
                )}
              </Button>
            </form>
        </Form>
        
        <div className="flex-1 flex items-center justify-center">
        {isPending ? (
            <div className="text-center space-y-2 text-muted-foreground">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p>Generating trading signal...</p>
            </div>
          ) : result ? (
            <div className="w-full space-y-4 text-center">
                <div className="flex items-center justify-center gap-4">
                    <SignalIcon signal={result.signal} />
                    <h3 className="text-3xl font-bold font-headline">{result.signal.toUpperCase()} SIGNAL</h3>
                </div>
                <div className="flex items-center justify-center gap-2 text-xl font-mono">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    <span>Target: ${result.targetPrice.toLocaleString()}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm text-left">Rationale</h4>
                  <p className="text-sm text-muted-foreground text-left">{result.rationale}</p>
                </div>
                <div className="flex gap-2 justify-center">
                    <Badge variant="outline">{form.getValues("cryptocurrency")}</Badge>
                    <Badge variant="secondary">{form.getValues("strategyType")}</Badge>
                    <Badge variant="secondary">{form.getValues("riskLevel")} Risk</Badge>
                </div>
            </div>
          ) : (
            <div className="text-center space-y-2 text-muted-foreground">
              <Bot className="mx-auto h-8 w-8" />
              <p>Select parameters to generate a signal.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
