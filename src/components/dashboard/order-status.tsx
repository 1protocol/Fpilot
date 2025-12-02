"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "./dashboard-card"
import { Badge } from "@/components/ui/badge"
import { Card } from "../ui/card";
import { useFirebase, useCollection, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { collection, doc, orderBy, query, limit } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";
import { format } from 'date-fns';

type Order = {
  id: string;
  symbol: string;
  orderType: string;
  side: "Buy" | "Sell";
  quantity: string;
  price: number;
  status: "Working" | "Filled" | "Canceled" | "Partial Fill";
  timestamp: {
    seconds: number;
    nanoseconds: number;
  }
};


export default function OrderStatus() {
  const { firestore, user } = useFirebase();

  const ordersQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, 'users', user.uid, 'trade_orders'), 
        orderBy('timestamp', 'desc'),
        limit(10)
    );
  }, [user, firestore]);
  
  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  // Effect to simulate order status changes from "Working" to "Filled"
  useEffect(() => {
    if (!orders || !user || !firestore) return;

    const interval = setInterval(() => {
        const workingOrders = orders.filter(o => o.status === 'Working');
        if (workingOrders.length > 0) {
            // Pick a random working order to update
            const orderToUpdate = workingOrders[Math.floor(Math.random() * workingOrders.length)];
            
            // 80% chance to fill it
            if (Math.random() < 0.8) {
                const orderDocRef = doc(firestore, 'users', user.uid, 'trade_orders', orderToUpdate.id);
                setDocumentNonBlocking(orderDocRef, { status: 'Filled' }, { merge: true });
            }
        }
    }, 4000); // Check to update an order every 4 seconds

    return () => clearInterval(interval);
  }, [orders, user, firestore]);


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
          <p className="font-semibold">{order.symbol}</p>
          <p className="text-xs text-muted-foreground">{order.orderType}</p>
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
          <p>{order.quantity}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="font-mono">${order.price.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      );
    }
    
    if (!orders || orders.length === 0) {
        return <div className="text-center text-muted-foreground p-8">No recent orders found.</div>;
    }

    return (
      <>
        {/* Desktop Table View */}
        <div className="rounded-md border h-64 overflow-y-auto hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-xs text-muted-foreground">{order.timestamp ? format(new Date(order.timestamp.seconds * 1000), 'HH:mm:ss') : 'N/A'}</TableCell>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell className={order.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>{order.side}</TableCell>
                  <TableCell className="text-right">{order.quantity}</TableCell>
                  <TableCell className="text-right font-mono">${order.price.toLocaleString()}</TableCell>
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
      </>
    );
  }

  return (
    <DashboardCard
      title="Recent Orders"
      description="Live status of your recent trade executions"
    >
        {renderContent()}
    </DashboardCard>
  )
}
