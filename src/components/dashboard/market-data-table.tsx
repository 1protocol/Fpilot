import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "./dashboard-card"
import { Badge } from "@/components/ui/badge"

const marketData = [
  { pair: "BTC/USDT", price: "68,450.23", change: "+2.5%", volume: "1.2B", exchange: "Binance" },
  { pair: "ETH/USDT", price: "3,560.11", change: "+4.1%", volume: "850M", exchange: "Bybit" },
  { pair: "SOL/USDT", price: "152.89", change: "-1.8%", volume: "450M", exchange: "Coinbase" },
  { pair: "BTC-PERP", price: "68,465.50", change: "+2.6%", volume: "2.5B", exchange: "Deribit" },
  { pair: "ETH-PERP", price: "3,562.30", change: "+4.2%", volume: "1.8B", exchange: "Binance" },
]

export default function MarketDataTable() {
  return (
    <DashboardCard
      title="Live Market Data"
      description="Real-time data from integrated exchanges"
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Exchange</TableHead>
              <TableHead className="text-right">Price (USD)</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">24h Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketData.map((data) => (
              <TableRow key={data.pair + data.exchange}>
                <TableCell className="font-medium">{data.pair}</TableCell>
                <TableCell>
                  <Badge variant="outline">{data.exchange}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{data.price}</TableCell>
                <TableCell className={`text-right ${data.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {data.change}
                </TableCell>
                <TableCell className="text-right">{data.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  )
}
