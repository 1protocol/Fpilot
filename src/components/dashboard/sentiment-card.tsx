"use client";

import { useState, useTransition } from 'react';
import { summarizeMarketSentiment } from '@/ai/flows/summarize-market-sentiment';
import DashboardCard from './dashboard-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '../ui/skeleton';
import { Bot } from 'lucide-react';

const cryptocurrencies = ['Bitcoin', 'Ethereum', 'Solana', 'Dogecoin'];

export default function SentimentCard() {
  const [selectedCrypto, setSelectedCrypto] = useState('Bitcoin');
  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSentimentAnalysis = (crypto: string) => {
    setSelectedCrypto(crypto);
    startTransition(async () => {
      setSummary(''); // Clear previous summary
      const result = await summarizeMarketSentiment({ cryptocurrency: crypto });
      setSummary(result.summary);
    });
  };

  return (
    <DashboardCard
      title="AI Market Sentiment"
      description="Summary of news and social media"
      action={
        <Select defaultValue={selectedCrypto} onValueChange={handleSentimentAnalysis}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Crypto" />
          </SelectTrigger>
          <SelectContent>
            {cryptocurrencies.map(crypto => (
              <SelectItem key={crypto} value={crypto}>{crypto}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <div className="space-y-4">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground p-4">
            <Bot className="w-10 h-10 mb-2" />
            <p>Select a cryptocurrency to get an AI-powered sentiment analysis.</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
