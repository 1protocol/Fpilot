import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "./dashboard-card"
import { Badge } from "@/components/ui/badge"

const orderData = [
  { id: 'ORD001', pair: "BTC/USDT", type: "Limit", side: "Buy", amount: "0.5", price: "68,000", status: "Filled" },
  { id: 'ORD002', pair: "ETH/USDT", type: "Market", side: "Sell", amount: "10", price: "3,550", status: "Filled" },
  { id: 'ORD003', pair: "SOL/USDT", type: "Limit", side: "Buy", amount: "100", price: "150", status: "Partial Fill" },
  { id: 'ORD004', pair: "BTC-PERP", type: "TWAP", side: "Buy", amount: "2.0", price: "N/A", status: "Working" },
  { id: 'ORD005', pair: "ETH-PERP", type: "Stop Loss", side: "Sell", amount: "5.0", price: "3,400", status: "Working" },
]

export default function OrderStatus() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Filled":
        return "default";
      case "Working":
        return "secondary";
      case "Partial Fill":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <DashboardCard
      title="Recent Orders"
      description="Live status of your recent trade executions"
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.pair}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell className={order.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>{order.side}</TableCell>
                <TableCell className="text-right">{order.amount}</TableCell>
                <TableCell className="text-right font-mono">{order.price}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  )
}
