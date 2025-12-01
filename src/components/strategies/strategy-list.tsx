import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { SlidersHorizontal } from "lucide-react"
import StrategyTuner from "./strategy-tuner"

type Strategy = {
  id: string;
  name: string;
  asset: string;
  timeframe: string;
  pnl: string;
  status: string;
};

type StrategyListProps = {
  strategies: Strategy[];
};

export default function StrategyList({ strategies }: StrategyListProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Strategy Portfolio</CardTitle>
        <CardDescription>An overview of your deployed and managed trading strategies.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Strategy Name</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead>7-Day PnL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell className="font-medium">{strategy.name}</TableCell>
                  <TableCell>{strategy.asset}</TableCell>
                  <TableCell>{strategy.timeframe}</TableCell>
                  <TableCell className={strategy.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                    {strategy.pnl}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(strategy.status)}>{strategy.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <StrategyTuner strategy={strategy}>
                      <Button variant="ghost" size="sm">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Tune
                      </Button>
                    </StrategyTuner>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
