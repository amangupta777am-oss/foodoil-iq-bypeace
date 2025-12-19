import { OilHealthScore } from "@/components/dashboard/OilHealthScore";
import { ParameterCard } from "@/components/dashboard/ParameterCard";
import { ComplianceBadge } from "@/components/dashboard/ComplianceBadge";
import { DeviceStatus } from "@/components/dashboard/DeviceStatus";
import { Button } from "@/components/ui/button";
import { Play, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Simulated latest test data
const latestTestData = {
  score: 84,
  compliance: "pass" as const,
  timestamp: "2024-01-15 14:32",
  batchId: "BATCH-2024-0115-A",
  parameters: {
    ffa: { value: 0.18, limit: 0.3, unit: "%" },
    tpc: { value: 18.5, limit: 25, unit: "%" },
    pv: { value: 8.2, limit: 10, unit: "meq/kg" },
  },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Latest test results and oil quality overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/history">
              <FileText className="h-4 w-4 mr-2" />
              View History
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/test">
              <Play className="h-4 w-4 mr-2" />
              New Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Oil Health Score - Large Card */}
        <div className="lg:col-span-1 data-card flex flex-col items-center justify-center py-8">
          <OilHealthScore score={latestTestData.score} />
          <div className="mt-6">
            <ComplianceBadge status={latestTestData.compliance} size="lg" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last updated: {latestTestData.timestamp}</span>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ParameterCard
            name="FFA"
            description="Free Fatty Acid"
            value={latestTestData.parameters.ffa.value}
            unit={latestTestData.parameters.ffa.unit}
            limit={latestTestData.parameters.ffa.limit}
            trend="stable"
          />
          <ParameterCard
            name="TPC"
            description="Total Polar Compounds"
            value={latestTestData.parameters.tpc.value}
            unit={latestTestData.parameters.tpc.unit}
            limit={latestTestData.parameters.tpc.limit}
            trend="up"
          />
          <ParameterCard
            name="PV"
            description="Peroxide Value"
            value={latestTestData.parameters.pv.value}
            unit={latestTestData.parameters.pv.unit}
            limit={latestTestData.parameters.pv.limit}
            trend="down"
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Status */}
        <DeviceStatus isConnected={true} />

        {/* Recent Activity */}
        <div className="data-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: "14:32", action: "Test completed", batch: "BATCH-2024-0115-A", status: "pass" },
              { time: "11:15", action: "Test completed", batch: "BATCH-2024-0115-B", status: "pass" },
              { time: "09:45", action: "Test completed", batch: "BATCH-2024-0114-C", status: "borderline" },
              { time: "Yesterday", action: "Device calibrated", batch: "-", status: "info" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">{item.time}</span>
                  <span className="text-sm">{item.action}</span>
                </div>
                {item.batch !== "-" && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.batch}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === "pass" ? "bg-success" : 
                      item.status === "borderline" ? "bg-warning" : "bg-muted"
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Batch Info */}
      <div className="data-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Batch ID</p>
            <p className="text-lg font-mono font-semibold">{latestTestData.batchId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
            <p className="text-lg font-semibold text-secondary">96.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
