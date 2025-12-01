import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "../dashboard/dashboard-card"
import { Badge } from "@/components/ui/badge"

const tradeData = [
  { id: '1', side: "Buy", price: "68,000", size: "0.5", pnl: "+$500" },
  { id: '2', side: "Sell", price: "68,500", size: "0.5", pnl: "-$250" },
  { id: '3', side: "Buy", price: "67,800", size: "0.2", pnl: "+$800" },
  { id: '4', side: "Sell", price: "68,600", size: "0.2", pnl: "+$120" },
  { id: '5', side: "Buy", price: "69,000", size: "1.0", pnl: "-$1000" },
  { id: '6', side: "Sell", price: "68,000", size: "1.0", pnl: "+$150" },
  { id: '7', side: "Buy", price: "68,200", size: "0.3", pnl: "+$300" },
]

export default function BacktestTrades() {

  return (
    <DashboardCard
      title="Trade Log"
      description="A log of all trades executed during the backtest."
    >
      <div className="rounded-md border h-80 overflow-y-auto">
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

function cn(...inputs: import("clsx").ClassValue[]) {
    return import("tailwind-merge").then(m => m.twMerge(import("clsx").then(c => c.clsx(inputs))));
}
