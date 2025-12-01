'use client';

import { useState, useEffect } from 'react';
import DashboardCard from "./dashboard-card";

const initialHealthMetrics = [
  { name: "API Connectivity", status: "Operational" },
  { name: "Data Feed (Real-time)", status: "Operational" },
  { name: "Execution Engine", status: "Operational" },
  { name: "Risk Management Module", status: "Operational" },
  { name: "Database Service", status: "Degraded Performance" },
  { name: "AI Model Server", status: "Operational" },
];

const statuses = ["Operational", "Degraded Performance", "Error"];

export default function SystemHealth() {
  const [healthMetrics, setHealthMetrics] = useState(initialHealthMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
        setHealthMetrics(currentMetrics =>
            currentMetrics.map(metric => {
                // Give a higher chance to stay "Operational"
                if (Math.random() > 0.1) {
                    return { ...metric, status: "Operational" };
                }
                // Otherwise, pick a random status
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                return { ...metric, status: newStatus };
            })
        );
    }, 7000); // Update every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
        return "bg-green-500";
      case "Degraded Performance":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <DashboardCard
      title="System Health"
      description="Status of all system components"
    >
      <div className="space-y-4">
        {healthMetrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{metric.name}</p>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(metric.status)}`}></span>
              <span className="text-sm font-medium">{metric.status}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
