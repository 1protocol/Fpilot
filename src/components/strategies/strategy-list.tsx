import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { SlidersHorizontal } from "lucide-react"
import StrategyTuner from "./strategy-tuner"

const strategies = [
  { id: 'STRAT001', name: "RSI Mean Reversion", asset: "BTC/USDT", timeframe: "1H", pnl: "+15.2%", status: "Active" },
  { id: 'STRAT002', name: "EMA Crossover Momentum", asset: "ETH/USDT", timeframe: "4H", pnl: "+8.9%", status: "Active" },
  { id: 'STRAT003', name: "On-Chain SOPR Signal", asset: "BTC/USDT", timeframe: "1D", pnl: "-2.1%", status: "Paused" },
  { id: 'STRAT004', name: "Volatility Breakout", asset: "SOL/USDT", timeframe: "15m", pnl: "+22.5%", status: "Active" },
  { id: 'STRAT005', name: "Arbitrage Bot", asset: "Multi-asset", timeframe: "1m", pnl: "+5.6%", status: "Error" },
]

export default function StrategyList() {
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
