import DashboardCard from "./dashboard-card"

const healthMetrics = [
  { name: "API Connectivity", status: "Operational" },
  { name: "Data Feed (Real-time)", status: "Operational" },
  { name: "Execution Engine", status: "Operational" },
  { name: "Risk Management Module", status: "Operational" },
  { name: "Database Service", status: "Degraded Performance" },
  { name: "AI Model Server", status: "Operational" },
]

export default function SystemHealth() {
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
