"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "./dashboard-card"
import { Badge } from "@/components/ui/badge"
import { Card } from "../ui/card";

type Order = {
  id: string;
  pair: string;
  type: string;
  side: string;
  amount: string;
  price: string;
  status: string;
};

const initialOrderData: Order[] = [
  { id: 'ORD001', pair: "BTC/USDT", type: "Limit", side: "Buy", amount: "0.5", price: "68,000", status: "Filled" },
  { id: 'ORD002', pair: "ETH/USDT", type: "Market", side: "Sell", amount: "10", price: "3,550", status: "Filled" },
  { id: 'ORD003', pair: "SOL/USDT", type: "Limit", side: "Buy", amount: "100", price: "150", status: "Working" },
  { id: 'ORD004', pair: "BTC-PERP", type: "TWAP", side: "Buy", amount: "2.0", price: "N/A", status: "Working" },
  { id: 'ORD005', pair: "ETH-PERP", type: "Stop Loss", side: "Sell", amount: "5.0", price: "3,400", status: "Working" },
];

const samplePairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT", "ADA/USDT"];
const sampleTypes = ["Limit", "Market", "Stop Loss", "TWAP"];
const sampleSides = ["Buy", "Sell"];

let orderCounter = 6;

export default function OrderStatus() {
  const [orders, setOrders] = useState(initialOrderData);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(currentOrders => {
        let newOrders = [...currentOrders];
        const action = Math.random();

        // ~30% chance to add a new order
        if (action < 0.3 && newOrders.length < 8) {
          const newOrder = {
            id: `ORD${String(orderCounter++).padStart(3, '0')}`,
            pair: samplePairs[Math.floor(Math.random() * samplePairs.length)],
            type: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
            side: sampleSides[Math.floor(Math.random() * sampleSides.length)],
            amount: (Math.random() * 10).toFixed(1),
            price: (Math.random() * 70000).toLocaleString(undefined, {maximumFractionDigits: 0}),
            status: "Working",
          };
          newOrders.unshift(newOrder);
        } else { // ~70% chance to update an existing order
          const workingOrders = newOrders.filter(o => o.status === "Working" || o.status === "Partial Fill");
          if (workingOrders.length > 0) {
            const orderToUpdate = workingOrders[Math.floor(Math.random() * workingOrders.length)];
            const orderIndex = newOrders.findIndex(o => o.id === orderToUpdate.id);
            
            if (orderIndex !== -1) {
              const currentStatus = newOrders[orderIndex].status;
              if (currentStatus === "Working") {
                newOrders[orderIndex].status = Math.random() < 0.7 ? "Filled" : "Partial Fill";
              } else if (currentStatus === "Partial Fill") {
                newOrders[orderIndex].status = "Filled";
              }
            }
          }
        }

        // Keep the list from growing too large
        if (newOrders.length > 10) {
          newOrders = newOrders.slice(0, 10);
        }
        
        return newOrders;
      });
    }, 3500); // Update every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

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

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold">{order.pair}</p>
          <p className="text-xs text-muted-foreground">{order.type}</p>
        </div>
        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
      </div>
      <div className="grid grid-cols-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Side</p>
          <p className={order.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>{order.side}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Amount</p>
          <p>{order.amount}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="font-mono">{order.price}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardCard
      title="Recent Orders"
      description="Live status of your recent trade executions"
    >
      {/* Desktop Table View */}
      <div className="rounded-md border h-64 overflow-y-auto hidden md:block">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
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
            {orders.map((order) => (
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

       {/* Mobile Card View */}
       <div className="space-y-3 md:hidden max-h-64 overflow-y-auto">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </DashboardCard>
  )
}
