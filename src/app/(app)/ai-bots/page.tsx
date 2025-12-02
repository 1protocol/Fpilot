'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Trash2, Bot, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// This would typically come from Firestore, including linking to a strategyId
const initialBots = [
  {
    id: 'bot_1',
    name: 'Momentum Master',
    strategy: 'RSI Crossover',
    asset: 'BTC/USDT',
    status: 'Active',
    pnl: 125.43,
    uptime: '2d 4h 15m',
  },
  {
    id: 'bot_2',
    name: 'Mean Reversion ETH',
    strategy: 'Bollinger Bands',
    asset: 'ETH/USDT',
    status: 'Paused',
    pnl: -34.12,
    uptime: '5d 1h 30m',
  },
  {
    id: 'bot_3',
    name: 'SOL Scalper',
    strategy: 'EMA Ribbon',
    asset: 'SOL/USDT',
    status: 'Error',
    pnl: 0,
    uptime: '0h 5m',
  },
];

type Bot = typeof initialBots[0];

export default function AiBotsPage() {
  const [bots, setBots] = useState<Bot[]>(initialBots);

  // Simulate live P&L updates for active bots
  useEffect(() => {
    const interval = setInterval(() => {
      setBots((currentBots) =>
        currentBots.map((bot) => {
          if (bot.status === 'Active') {
            const pnlChange = (Math.random() - 0.45) * 10;
            return { ...bot, pnl: bot.pnl + pnlChange };
          }
          return bot;
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Active':
        return { variant: 'default', color: 'bg-green-500', text: 'Active' };
      case 'Paused':
        return { variant: 'secondary', color: 'bg-yellow-500', text: 'Paused' };
      case 'Error':
        return { variant: 'destructive', color: 'bg-red-500', text: 'Error' };
      default:
        return { variant: 'outline', color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  const toggleBotStatus = (botId: string) => {
    setBots(bots.map(bot => {
        if (bot.id === botId && bot.status !== 'Error') {
            return { ...bot, status: bot.status === 'Active' ? 'Paused' : 'Active' };
        }
        return bot;
    }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Bots"
        description="Manage your active, AI-powered trading bots."
      >
          <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Bot
          </Button>
      </PageHeader>

      {bots.length === 0 ? (
        <Card>
            <CardContent className="pt-6">
                <div className="text-center text-muted-foreground py-16 space-y-2">
                    <Bot className="mx-auto h-12 w-12" />
                    <h3 className="text-lg font-semibold">No Active Bots Found</h3>
                    <p className="text-sm">Create a new bot from one of your strategies to get started.</p>
                </div>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => {
            const statusInfo = getStatusInfo(bot.status);
            const isPnlPositive = bot.pnl >= 0;

            return (
              <Card key={bot.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-lg">{bot.name}</CardTitle>
                    <div className="flex items-center gap-2">
                       <div className={cn("h-2 w-2 rounded-full", statusInfo.color)}></div>
                       <span className="text-sm font-medium">{statusInfo.text}</span>
                    </div>
                  </div>
                  <CardDescription>{bot.strategy} on {bot.asset}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Real-time P&L</p>
                        <p className={cn(
                            "text-2xl font-bold font-mono",
                            isPnlPositive ? "text-green-400" : "text-red-400"
                        )}>
                            {isPnlPositive ? '+' : ''}${bot.pnl.toFixed(2)}
                        </p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="text-sm font-medium">{bot.uptime}</p>
                    </div>
                </CardContent>
                <CardFooter className="mt-auto flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toggleBotStatus(bot.id)} disabled={bot.status === 'Error'}>
                    {bot.status === 'Active' ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {bot.status === 'Active' ? 'Pause' : 'Start'}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
