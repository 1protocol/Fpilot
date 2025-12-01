"use client"

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardCard from "./dashboard-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";

type MarketData = {
  pair: string;
  price: number;
  change: number;
  volume: number;
  exchange: string;
  priceState?: 'up' | 'down' | 'neutral';
};

const initialMarketData: MarketData[] = [
  { pair: "BTC/USDT", price: 68450.23, change: 2.5, volume: 1200000000, exchange: "Binance" },
  { pair: "ETH/USDT", price: 3560.11, change: 4.1, volume: 850000000, exchange: "Bybit" },
  { pair: "SOL/USDT", price: 152.89, change: -1.8, volume: 450000000, exchange: "Coinbase" },
  { pair: "BTC-PERP", price: 68465.50, change: 2.6, volume: 2500000000, exchange: "Deribit" },
  { pair: "ETH-PERP", price: 3562.30, change: 4.2, volume: 1800000000, exchange: "Binance" },
];

export default function MarketDataTable() {
  const [marketData, setMarketData] = useState<MarketData[]>(initialMarketData);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(currentData =>
        currentData.map(data => {
          const changePercent = (Math.random() - 0.5) * 0.01; // Tiny change +/- 0.5%
          const newPrice = data.price * (1 + changePercent);
          const priceState = newPrice > data.price ? 'up' : 'down';
          
          return {
            ...data,
            price: newPrice,
            change: data.change + (Math.random() - 0.5) * 0.2,
            volume: data.volume * (1 + (Math.random() - 0.5) * 0.05),
            priceState,
          };
        })
      );
      
      // Reset priceState after animation
      setTimeout(() => {
        setMarketData(currentData => currentData.map(d => ({ ...d, priceState: 'neutral' })))
      }, 500);

    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`
    }
    return `${(value / 1_000).toFixed(2)}K`
  }

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
                <TableCell className={cn("text-right font-mono transition-colors duration-500", {
                  'text-green-400 bg-green-500/10': data.priceState === 'up',
                  'text-red-400 bg-red-500/10': data.priceState === 'down'
                })}>
                  {formatCurrency(data.price)}
                </TableCell>
                <TableCell className={cn("text-right", data.change >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {data.change.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">{formatVolume(data.volume)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardCard>
  )
}
