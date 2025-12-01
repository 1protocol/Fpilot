'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StrategyList from '@/components/strategies/strategy-list';
import StrategyGenerator from '@/components/strategies/strategy-generator';
import { useFirebase, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export default function StrategiesPage() {
  const { toast } = useToast();
  const { firestore, user, isUserLoading } = useFirebase();
  const [activeGeneratorTab, setActiveGeneratorTab] = useState('prompt');


  const strategiesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'strategies');
  }, [firestore, user?.uid]);

  const { data: strategies, isLoading: areStrategiesLoading } = useCollection(strategiesCollectionRef);

  const handleStrategyGenerated = (prompt: string, code: string) => {
    if (!strategiesCollectionRef || !user?.uid) {
        toast({
            variant: "destructive",
            title: "Error saving strategy",
            description: "Could not save to database. User not logged in.",
        });
        return;
    }

    const newStrategy = {
      name: `AI: ${prompt.substring(0, 25)}...`,
      asset: 'Mixed',
      timeframe: 'N/A',
      status: 'Paused',
      userId: user.uid,
      createdAt: serverTimestamp(),
      code: code,
    };
    
    addDocumentNonBlocking(strategiesCollectionRef, newStrategy);

    toast({
        title: "Strategy Generated",
        description: "Your new strategy has been added to your list."
    });

    setActiveGeneratorTab('generated-code');
  };

  if (isUserLoading) {
    return (
        <div className="space-y-8">
             <PageHeader
                title="Trading Strategies"
                description="Manage, create, and optimize your automated trading strategies."
            />
            <Card>
                <CardContent className="pt-6">
                     <div className="flex items-center justify-center p-16">
                        <div className="text-center space-y-2 text-muted-foreground">
                            <Loader2 className="mx-auto h-10 w-10 animate-spin" />
                            <p className="text-lg">Loading Strategies...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trading Strategies"
        description="Manage, create, and optimize your automated trading strategies."
      />
      <Tabs defaultValue="my-strategies">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="my-strategies">My Strategies</TabsTrigger>
          <TabsTrigger value="generate">Generate with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="my-strategies" className="mt-6">
          <StrategyList strategies={strategies || []} isLoading={areStrategiesLoading} />
        </TabsContent>
        <TabsContent value="generate" className="mt-6">
          <StrategyGenerator onStrategyGenerated={handleStrategyGenerated} activeTab={activeGeneratorTab} setActiveTab={setActiveGeneratorTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
