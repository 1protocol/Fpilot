"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateTradingStrategy, type GenerateTradingStrategyOutput } from '@/services/strategyService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Code, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  prompt: z.string().min(10, { message: "Please describe your strategy in at least 10 characters." }),
});

type StrategyGeneratorProps = {
  onStrategyGenerated: (prompt: string, code: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function StrategyGenerator({ onStrategyGenerated, activeTab, setActiveTab }: StrategyGeneratorProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateTradingStrategyOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "Create a simple mean-reversion strategy for BTC/USDT on the 1-hour timeframe using RSI.",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setResult(null);
      const res = await generateTradingStrategy({ prompt: values.prompt });
      setResult(res);
      if (res) {
        onStrategyGenerated(values.prompt, res.strategyCode);
      }
    });
  };
  
  // This allows the parent component to control the active tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full lg:hidden">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="prompt">Prompt</TabsTrigger>
        <TabsTrigger value="generated-code">Generated Code</TabsTrigger>
      </TabsList>
      <TabsContent value="prompt" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Describe Your Strategy</CardTitle>
            <CardDescription>Use natural language to tell our AI what you want to build.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A trend-following strategy on ETH/USD using a 50 and 200 EMA crossover..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="generated-code" className="mt-6">
        {renderGeneratedContent()}
      </TabsContent>

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Describe Your Strategy</CardTitle>
            <CardDescription>Use natural language to tell our AI what you want to build.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A trend-following strategy on ETH/USD using a 50 and 200 EMA crossover..."
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {renderGeneratedContent()}
      </div>
    </Tabs>
  );

  function renderGeneratedContent() {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Strategy</CardTitle>
          <CardDescription>The AI will generate strategy code and an explanation here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {isPending ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p>Analyzing prompt and generating code...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 overflow-auto">
              <div>
                <h3 className="font-semibold mb-2">Explanation</h3>
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Code size={16}/> Strategy Code</h3>
                <pre className="bg-muted/50 p-4 rounded-md text-sm text-foreground overflow-x-auto">
                  <code>{result.strategyCode}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Bot className="mx-auto h-8 w-8" />
                <p>Your generated strategy will appear here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}
