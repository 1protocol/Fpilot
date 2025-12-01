"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { automatedStrategyParameterTuning, extractStrategyParameters, type AutomatedStrategyParameterTuningOutput } from '@/services/strategyService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import type { Strategy } from './strategy-list';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  marketConditions: z.string().min(1, { message: "Market conditions are required." }),
  performanceMetric: z.string().min(1, { message: "Performance metric is required." }),
});

type StrategyTunerProps = {
  strategy: Strategy;
  children: React.ReactNode;
};

export default function StrategyTuner({ strategy, children }: StrategyTunerProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AutomatedStrategyParameterTuningOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketConditions: "High volatility, bearish trend",
      performanceMetric: "Sharpe Ratio",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!strategy.code) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Strategy code is not available for tuning.",
        });
        return;
    }

    startTransition(async () => {
      setResult(null);
      try {
        // Step 1: Extract parameters dynamically from the code
        const { parameters: extractedParams } = await extractStrategyParameters({ strategyCode: strategy.code! });

        if (Object.keys(extractedParams).length === 0) {
            toast({
                variant: "destructive",
                title: "Tuning Failed",
                description: "AI could not identify any tunable parameters in this strategy's code.",
            });
            return;
        }

        // Convert the min/max structure to a string representation for the next flow
        const parameterConstraints = Object.entries(extractedParams).reduce((acc, [key, value]) => {
            acc[key] = `${value.min}-${value.max}`;
            return acc;
        }, {} as Record<string, any>);


        // Step 2: Run the optimization with the extracted parameters
        const tuningResult = await automatedStrategyParameterTuning({
          strategyName: strategy.name,
          marketConditions: values.marketConditions,
          performanceMetric: values.performanceMetric,
          parameterConstraints: parameterConstraints,
        });
        setResult(tuningResult);
      } catch (error) {
          console.error("Tuning failed:", error);
          toast({
              variant: "destructive",
              title: "AI Tuning Failed",
              description: "An unexpected error occurred while the AI was tuning the strategy.",
          });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Parameter Tuning: {strategy.name}</DialogTitle>
          <DialogDescription>Let AI optimize your strategy parameters for current market conditions.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mt-4">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Market Conditions</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select market condition" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="High volatility, bearish trend">High Volatility, Bearish</SelectItem>
                          <SelectItem value="Low volatility, bullish trend">Low Volatility, Bullish</SelectItem>
                          <SelectItem value="Sideways market">Sideways Market</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="performanceMetric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optimization Metric</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select metric" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sharpe Ratio">Sharpe Ratio</SelectItem>
                          <SelectItem value="Sortino Ratio">Sortino Ratio</SelectItem>
                          <SelectItem value="Profit Factor">Profit Factor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</> : <><Bot className="mr-2 h-4 w-4" /> Tune Parameters</>}
                </Button>
              </form>
            </Form>
          </div>
          <Card>
            <CardContent className="pt-6 h-full">
            {isPending ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2"><Loader2 className="mx-auto h-8 w-8 animate-spin" /><p>Finding optimal parameters...</p></div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">Optimal Parameters</h4>
                  <pre className="mt-1 bg-muted p-3 rounded-md text-xs font-mono">{JSON.stringify(result.optimalParameters, null, 2)}</pre>
                </div>
                 <div>
                  <h4 className="font-semibold text-sm">Tuning Rationale</h4>
                  <p className="text-xs text-muted-foreground mt-1">{result.tuningRationale}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Expected Performance Gain</h4>
                  <p className="text-xs text-muted-foreground mt-1">AI projects an uplift of {result.expectedPerformance.toFixed(2)} in {form.getValues("performanceMetric")}.</p>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2"><Bot className="mx-auto h-8 w-8" /><p>Optimal parameters will appear here.</p></div>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
