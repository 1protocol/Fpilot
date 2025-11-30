import { PageHeader } from "@/components/shared/page-header";
import PortfolioChart from "@/components/dashboard/portfolio-chart";
import RiskMetrics from "@/components/dashboard/risk-metrics";
import MarketDataTable from "@/components/dashboard/market-data-table";
import OrderStatus from "@/components/dashboard/order-status";
import SystemHealth from "@/components/dashboard/system-health";
import SentimentCard from "@/components/dashboard/sentiment-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your trading activities and portfolio performance."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <PortfolioChart />
        </div>
        
        <RiskMetrics />

        <div className="lg:col-span-2">
          <MarketDataTable />
        </div>
        
        <div className="lg:col-span-1">
          <SentimentCard />
        </div>

        <div className="lg:col-span-2">
          <OrderStatus />
        </div>
        
        <div className="lg:col-span-1">
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}
