"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateTradingSignal, type GenerateTradingSignalOutput } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Target, TrendingUp, TrendingDown, Pause } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  cryptocurrency: z.string().min(1, "Please select a cryptocurrency."),
});

const cryptocurrencies = ['Bitcoin', 'Ethereum', 'Solana'];

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

const exampleStrategyCode = `// Simple RSI Mean-Reversion Strategy
const rsi = RSI(close, 14);
const rsiUpper = 70;
const rsiLower = 30;

if (crossesOver(rsi, rsiUpper)) {
    return 'Sell';
}

if (crossesUnder(rsi, rsiLower)) {
    return 'Buy';
}

return 'Hold';
`;

export default function SignalGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateTradingSignalOutput | null>(null);
  const { toast } = useToast();
  const { user, firestore, isUserLoading } = useFirebase();

  const riskProfileDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'risk_profiles', 'default');
  }, [user, firestore]);
  const { data: riskProfileData, isLoading: isRiskProfileLoading } = useDoc(riskProfileDocRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptocurrency: "Bitcoin",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setResult(null);
      
      const userRiskProfile = riskProfileData || { valueAtRisk: 5, maxPositionSize: 25 };

      try {
        const res = await generateTradingSignal({ 
          cryptocurrency: values.cryptocurrency,
          strategyCode: exampleStrategyCode, // Using example code for this component
          riskProfile: {
            valueAtRisk: userRiskProfile.valueAtRisk,
            maxPositionSize: userRiskProfile.maxPositionSize,
          }
        });
        setResult(res);
      } catch (error) {
        console.error("Failed to generate trading signal:", error);
        toast({
            variant: "destructive",
            title: "Signal Generation Failed",
            description: "An error occurred while trying to generate a trading signal. Please try again.",
        });
      }
    });
  };

  const isLoading = isUserLoading || isRiskProfileLoading;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">AI Signal Generation</CardTitle>
        <CardDescription>Generate dynamic, context-aware trading signals based on a strategy and your risk profile.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField control={form.control} name="cryptocurrency" render={({ field }) => (
                         <FormItem>
                            <FormLabel>Cryptocurrency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Crypto" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{cryptocurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                         </FormItem>
                    )} />
                     <FormItem>
                        <FormLabel>Your Risk Profile</FormLabel>
                        {isLoading ? <Skeleton className="h-10 w-full"/> : (
                        <div className="flex items-center justify-between h-10 px-3 py-2 text-sm border rounded-md text-muted-foreground">
                            <span>VaR: {riskProfileData?.valueAtRisk ?? 'N/A'}%</span>
                            <span>Max Size: {riskProfileData?.maxPositionSize ?? 'N/A'}%</span>
                        </div>
                        )}
                    </FormItem>
                </div>
                 <div>
                    <FormLabel>Strategy Logic (Example)</FormLabel>
                    <Textarea readOnly value={exampleStrategyCode} className="mt-2 font-mono text-xs h-36 resize-none bg-muted/50" />
                </div>
                <Button type="submit" disabled={isPending || isLoading} className="w-full">
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
                    <Badge variant="secondary">RSI Mean Reversion</Badge>
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
