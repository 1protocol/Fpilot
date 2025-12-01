import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { Loader2, SlidersHorizontal } from "lucide-react"
import StrategyTuner from "./strategy-tuner"
import { Skeleton } from "../ui/skeleton"

export type Strategy = {
  id: string;
  name: string;
  asset: string;
  timeframe: string;
  status: string;
  code?: string;
};

type StrategyListProps = {
  strategies: Strategy[];
  isLoading: boolean;
};

export default function StrategyList({ strategies, isLoading }: StrategyListProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Paused":
        return "secondary";
      default:
        return "destructive";
    }
  };

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardFooter>
                        <Skeleton className="h-9 w-24" />
                    </CardFooter>
                </Card>
            ))}
      </div>
    )
  }

  if (strategies.length === 0) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="text-center text-muted-foreground py-16">
                    <p>You haven&apos;t created any strategies yet.</p>
                    <p className="text-sm">Use the &quot;Generate with AI&quot; tab to create your first one.</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
            <Card key={strategy.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-lg">{strategy.name}</CardTitle>
                         <Badge variant={getStatusBadgeVariant(strategy.status)}>{strategy.status}</Badge>
                    </div>
                    <CardDescription>{strategy.asset} &middot; {strategy.timeframe}</CardDescription>
                </CardHeader>
                <div className="flex-grow" />
                <CardFooter>
                     <StrategyTuner strategy={strategy}>
                        <Button variant="outline" size="sm" disabled={!strategy.code}>
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Tune with AI
                        </Button>
                      </StrategyTuner>
                </CardFooter>
            </Card>
        ))}
    </div>
  )
}
