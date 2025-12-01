"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "./dashboard-card"
import { Badge } from "@/components/ui/badge"

const initialOrderData = [
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

  return (
    <DashboardCard
      title="Recent Orders"
      description="Live status of your recent trade executions"
    >
      <div className="rounded-md border h-64 overflow-y-auto">
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
    </DashboardCard>
  )
}
