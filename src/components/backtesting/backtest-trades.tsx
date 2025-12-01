import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "../dashboard/dashboard-card"
import { Badge } from "@/components/ui/badge"
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

type Trade = {
  id: string;
  side: "Buy" | "Sell";
  price: string;
  size: string;
  pnl: string;
}

type BacktestTradesProps = {
  tradeData: Trade[];
};

export default function BacktestTrades({ tradeData }: BacktestTradesProps) {

  function cn(...inputs: import("clsx").ClassValue[]) {
    return twMerge(clsx(inputs));
  }

  return (
    <DashboardCard
      title="Trade Log"
      description="A log of all trades executed during the backtest."
    >
      <div className="rounded-md border h-80 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">PnL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeData.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                    <Badge variant={trade.side === 'Buy' ? 'default' : 'destructive'} className={cn(trade.side === 'Buy' ? 'bg-green-600/80' : 'bg-red-600/80', 'border-transparent text-white')}>{trade.side}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">${trade.price}</TableCell>
                <TableCell className="text-right font-mono">{trade.size}</TableCell>
                <TableCell className={`text-right font-mono ${trade.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnl}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  )
}
