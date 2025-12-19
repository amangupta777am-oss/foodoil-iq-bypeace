import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Simulated historical data
const historicalTests = [
  { id: "TEST-001", date: "2024-01-15 14:32", batch: "BATCH-A", score: 84, ffa: 0.18, tpc: 18.5, pv: 8.2, status: "pass" },
  { id: "TEST-002", date: "2024-01-15 11:15", batch: "BATCH-B", score: 88, ffa: 0.15, tpc: 16.2, pv: 7.1, status: "pass" },
  { id: "TEST-003", date: "2024-01-14 16:45", batch: "BATCH-C", score: 62, ffa: 0.24, tpc: 22.1, pv: 9.5, status: "borderline" },
  { id: "TEST-004", date: "2024-01-14 09:30", batch: "BATCH-D", score: 91, ffa: 0.12, tpc: 14.8, pv: 6.3, status: "pass" },
  { id: "TEST-005", date: "2024-01-13 15:20", batch: "BATCH-E", score: 78, ffa: 0.20, tpc: 19.5, pv: 8.8, status: "pass" },
  { id: "TEST-006", date: "2024-01-13 10:00", batch: "BATCH-F", score: 45, ffa: 0.35, tpc: 28.2, pv: 12.1, status: "reject" },
];

const trendData = [
  { date: "Jan 10", ffa: 0.14, tpc: 15.2, pv: 6.5 },
  { date: "Jan 11", ffa: 0.16, tpc: 16.8, pv: 7.2 },
  { date: "Jan 12", ffa: 0.18, tpc: 18.1, pv: 7.8 },
  { date: "Jan 13", ffa: 0.22, tpc: 20.5, pv: 9.2 },
  { date: "Jan 14", ffa: 0.19, tpc: 18.8, pv: 8.5 },
  { date: "Jan 15", ffa: 0.17, tpc: 17.5, pv: 7.8 },
];

export default function History() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredTests = historicalTests.filter(test => {
    if (selectedFilter === "all") return true;
    return test.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View past tests and analyze trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="data-card">
        <h2 className="text-lg font-semibold mb-4">Parameter Trends (Last 7 Days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ffa" 
                name="FFA (%)" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line 
                type="monotone" 
                dataKey="tpc" 
                name="TPC (%)" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--secondary))" }}
              />
              <Line 
                type="monotone" 
                dataKey="pv" 
                name="PV (meq/kg)" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--warning))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by batch ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Results</option>
            <option value="pass">Pass Only</option>
            <option value="borderline">Borderline</option>
            <option value="reject">Rejected</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="data-card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Test ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batch</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">FFA</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">TPC</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PV</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test, index) => (
              <tr 
                key={test.id} 
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer",
                  index === filteredTests.length - 1 && "border-b-0"
                )}
              >
                <td className="py-3 px-4 text-sm font-mono">{test.id}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{test.date}</td>
                <td className="py-3 px-4 text-sm font-medium">{test.batch}</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn(
                    "font-semibold",
                    test.score >= 80 ? "text-success" :
                    test.score >= 60 ? "text-warning" : "text-destructive"
                  )}>
                    {test.score}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-sm tabular-nums">{test.ffa.toFixed(2)}%</td>
                <td className="py-3 px-4 text-center text-sm tabular-nums">{test.tpc.toFixed(1)}%</td>
                <td className="py-3 px-4 text-center text-sm tabular-nums">{test.pv.toFixed(1)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn(
                    "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                    test.status === "pass" && "bg-success/10 text-success",
                    test.status === "borderline" && "bg-warning/10 text-warning",
                    test.status === "reject" && "bg-destructive/10 text-destructive"
                  )}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTests.length} of {historicalTests.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
