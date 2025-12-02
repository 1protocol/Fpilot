'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Trash2, Bot, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import type { Strategy } from '@/components/strategies/strategy-list';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { generateTradingSignal } from '@/services/analyticsService';

export type AIBot = {
    id: string;
    name: string;
    strategyId: string;
    strategyName: string;
    asset: string;
    status: 'Active' | 'Paused' | 'Error';
    pnl: number;
    uptime: string; // This would be calculated, but for simulation we'll store it
    userId: string;
    createdAt: any;
};


export default function AiBotsPage() {
    const { firestore, user, isUserLoading } = useFirebase();
    const { toast } = useToast();
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

    // --- Data Fetching ---
    const botsCollectionRef = useMemoFirebase(() => 
        (user && firestore) ? collection(firestore, 'users', user.uid, 'ai_bots') : null
    , [user, firestore]);
    const { data: bots, isLoading: areBotsLoading } = useCollection<AIBot>(botsCollectionRef);

    const strategiesCollectionRef = useMemoFirebase(() =>
        (user && firestore) ? collection(firestore, 'users', user.uid, 'strategies') : null
    , [user, firestore]);
    const { data: strategies, isLoading: areStrategiesLoading } = useCollection<Strategy>(strategiesCollectionRef);

    const tradeOrdersCollectionRef = useMemoFirebase(() =>
        (user && firestore) ? collection(firestore, 'users', user.uid, 'trade_orders') : null
    , [user, firestore]);

    // --- State Management for Bot Creation ---
    const [newBotName, setNewBotName] = useState('');
    const [selectedStrategyId, setSelectedStrategyId] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    const [localBots, setLocalBots] = useState<AIBot[]>([]);

    useEffect(() => {
        if (bots) {
            setLocalBots(bots);
        }
    }, [bots]);


    // Simulate live P&L updates and trading signals for active bots
    useEffect(() => {
        const interval = setInterval(() => {
            localBots.forEach(async (bot) => {
                if (bot.status === 'Active' && user && firestore && tradeOrdersCollectionRef) {
                    // 1. Simulate P&L change
                    const pnlChange = (Math.random() - 0.45) * 10;
                    const newPnl = bot.pnl + pnlChange;
                    
                    // Optimistic UI update for smoother experience
                    setLocalBots((currentBots) => currentBots.map(b => b.id === bot.id ? { ...b, pnl: newPnl } : b));
                    
                    // Non-blocking Firestore update
                    const botDocRef = doc(firestore, 'users', user.uid, 'ai_bots', bot.id);
                    setDocumentNonBlocking(botDocRef, { pnl: newPnl }, { merge: true });

                    // 2. ~20% chance to generate a trading signal every interval
                    if (Math.random() < 0.2) {
                        try {
                            const signal = await generateTradingSignal({
                                cryptocurrency: bot.asset.split('/')[0], // e.g., 'BTC' from 'BTC/USDT'
                                riskLevel: 'Medium', // Placeholder
                                strategyType: 'Momentum', // Placeholder
                            });
                            
                            if (signal.signal !== 'Hold') {
                                // 3. Create a trade order in Firestore if signal is Buy or Sell
                                const newOrder = {
                                    userId: user.uid,
                                    symbol: bot.asset,
                                    orderType: 'Market',
                                    side: signal.signal,
                                    quantity: (Math.random() * 0.5 + 0.01).toFixed(3), // Random quantity
                                    price: signal.targetPrice,
                                    status: 'Working',
                                    timestamp: serverTimestamp(),
                                };
                                addDocumentNonBlocking(tradeOrdersCollectionRef, newOrder);
                                toast({
                                    title: `🤖 ${bot.name} Generated Signal!`,
                                    description: `${signal.signal} ${newOrder.quantity} ${bot.asset} @ $${signal.targetPrice.toFixed(2)}`,
                                });
                            }
                        } catch (e) {
                            console.error(`Bot ${bot.name} failed to generate a signal:`, e);
                        }
                    }
                }
            });
        }, 8000); // Run this logic every 8 seconds for active bots

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localBots, firestore, user, tradeOrdersCollectionRef]);

    // --- Handlers ---
    const handleCreateBot = async () => {
        if (!user || !firestore || !newBotName || !selectedStrategyId) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please provide a name and select a strategy." });
            return;
        }

        const selectedStrategy = strategies?.find(s => s.id === selectedStrategyId);
        if (!selectedStrategy) {
            toast({ variant: "destructive", title: "Strategy Not Found" });
            return;
        }

        setIsCreating(true);
        try {
            await addDocumentNonBlocking(botsCollectionRef!, {
                name: newBotName,
                strategyId: selectedStrategy.id,
                strategyName: selectedStrategy.name,
                asset: selectedStrategy.asset,
                status: 'Paused',
                pnl: 0,
                uptime: '0h 0m',
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Bot Created!", description: `${newBotName} is ready to be activated.` });
            setCreateDialogOpen(false);
            setNewBotName('');
            setSelectedStrategyId('');
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to create bot" });
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    const toggleBotStatus = (bot: AIBot) => {
        if (!user || !firestore || bot.status === 'Error') return;
        
        const newStatus = bot.status === 'Active' ? 'Paused' : 'Active';
        const botDocRef = doc(firestore, 'users', user.uid, 'ai_bots', bot.id);
        
        // Optimistic update
        setLocalBots(prev => prev.map(b => b.id === bot.id ? { ...b, status: newStatus } : b));
        setDocumentNonBlocking(botDocRef, { status: newStatus }, { merge: true });
    };

    const handleDeleteBot = (botId: string) => {
        if (!user || !firestore) return;
        const botDocRef = doc(firestore, 'users', user.uid, 'ai_bots', botId);
        deleteDocumentNonBlocking(botDocRef);
        toast({ title: "Bot Deleted" });
    };

    // --- Render Helpers ---
    const getStatusInfo = (status: AIBot['status']) => {
        switch (status) {
            case 'Active': return { color: 'bg-green-500', text: 'Active' };
            case 'Paused': return { color: 'bg-yellow-500', text: 'Paused' };
            case 'Error': return { color: 'bg-red-500', text: 'Error' };
            default: return { color: 'bg-gray-500', text: 'Unknown' };
        }
    };

    const isLoading = isUserLoading || areBotsLoading;

    if (isLoading) {
        return (
             <div className="space-y-8">
                <PageHeader title="AI Bots" description="Manage your active, AI-powered trading bots.">
                    <Button disabled><PlusCircle className="mr-2 h-4 w-4" /> Create New Bot</Button>
                </PageHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-64" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader title="AI Bots" description="Manage your active, AI-powered trading bots.">
                <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Bot</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-headline">Create a New AI Bot</DialogTitle>
                            <DialogDescription>Launch a new trading bot from one of your existing strategies.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="bot-name">Bot Name</label>
                                <Input id="bot-name" placeholder="e.g., My BTC Scalper" value={newBotName} onChange={(e) => setNewBotName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="strategy-select">Strategy</label>
                                <Select onValueChange={setSelectedStrategyId} value={selectedStrategyId}>
                                    <SelectTrigger id="strategy-select">
                                        <SelectValue placeholder="Select a strategy to launch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areStrategiesLoading ? (
                                            <SelectItem value="loading" disabled>Loading strategies...</SelectItem>
                                        ) : strategies && strategies.length > 0 ? (
                                            strategies.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                                        ) : (
                                            <SelectItem value="no-strategies" disabled>No strategies found. Create one first.</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateBot} disabled={isCreating || !newBotName || !selectedStrategyId || areStrategiesLoading}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Launch Bot
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {localBots.length === 0 ? (
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
                    {localBots.map((bot) => {
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
                                    <CardDescription>{bot.strategyName} on {bot.asset}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Real-time P&L</p>
                                        <p className={cn("text-2xl font-bold font-mono", isPnlPositive ? "text-green-400" : "text-red-400")}>
                                            {isPnlPositive ? '+' : ''}${bot.pnl.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Uptime</p>
                                        <p className="text-sm font-medium">{bot.uptime}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="mt-auto flex gap-2">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => toggleBotStatus(bot)} disabled={bot.status === 'Error'}>
                                        {bot.status === 'Active' ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                        {bot.status === 'Active' ? 'Pause' : 'Start'}
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete the '{bot.name}' bot. This action cannot be undone.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteBot(bot.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
