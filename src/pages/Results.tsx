import { useEffect, useState } from "react";
import { OilHealthScore } from "@/components/dashboard/OilHealthScore";
import { ComplianceBadge } from "@/components/dashboard/ComplianceBadge";
import { Button } from "@/components/ui/button";
import { Download, Share2, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { downloadPdfReport, type ReportData } from "@/services/pdfReport";
import { toast } from "sonner";

type ComplianceStatus = "pass" | "borderline" | "reject";

interface TestResultsData {
  id: string;
  timestamp: string;
  batchId: string;
  score: number;
  compliance: ComplianceStatus;
  aiConfidence: number;
  parameters: Array<{
    name: string;
    value: number;
    unit: string;
    limit: number;
    status: ComplianceStatus;
    description: string;
  }>;
  recommendations: string[];
  batch?: {
    stationName: string;
    location: string;
    equipment: string;
    oilType: string;
  };
}

// Default simulated results
const defaultResults: TestResultsData = {
  id: "TEST-2024-0115-001",
  timestamp: new Date().toISOString(),
  batchId: "BATCH-2024-0115-A",
  score: 84,
  compliance: "pass",
  aiConfidence: 96.8,
  parameters: [
    { 
      name: "Free Fatty Acid (FFA)", 
      value: 0.18, 
      unit: "%", 
      limit: 0.3, 
      status: "pass",
      description: "Indicates oil degradation from hydrolysis"
    },
    { 
      name: "Total Polar Compounds (TPC)", 
      value: 18.5, 
      unit: "%", 
      limit: 25, 
      status: "pass",
      description: "Key indicator of oil quality deterioration"
    },
    { 
      name: "Peroxide Value (PV)", 
      value: 8.2, 
      unit: "meq/kg", 
      limit: 10, 
      status: "borderline",
      description: "Measures primary oxidation products"
    },
  ],
  recommendations: [
    "Oil quality is within acceptable limits for continued use",
    "Monitor Peroxide Value - approaching threshold",
    "Recommended re-test in 4 hours of continuous use",
  ],
};

function getStatusIcon(status: ComplianceStatus) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-success" />;
  if (status === "borderline") return <AlertTriangle className="h-5 w-5 text-warning" />;
  return <AlertTriangle className="h-5 w-5 text-destructive" />;
}

export default function Results() {
  const [testResults, setTestResults] = useState<TestResultsData>(defaultResults);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check for results from last test
    const stored = sessionStorage.getItem('lastTestResult');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTestResults({
          id: `TEST-${Date.now()}`,
          timestamp: parsed.timestamp,
          batchId: parsed.batchId,
          score: parsed.score,
          compliance: parsed.classification,
          aiConfidence: parsed.confidence,
          parameters: [
            { 
              name: "Free Fatty Acid (FFA)", 
              value: parsed.ffa, 
              unit: "%", 
              limit: 0.3, 
              status: parsed.ffa <= 0.21 ? "pass" : parsed.ffa <= 0.27 ? "borderline" : "reject",
              description: "Indicates oil degradation from hydrolysis"
            },
            { 
              name: "Total Polar Compounds (TPC)", 
              value: parsed.tpc, 
              unit: "%", 
              limit: 25, 
              status: parsed.tpc <= 17.5 ? "pass" : parsed.tpc <= 22.5 ? "borderline" : "reject",
              description: "Key indicator of oil quality deterioration"
            },
            { 
              name: "Peroxide Value (PV)", 
              value: parsed.pv, 
              unit: "meq/kg", 
              limit: 10, 
              status: parsed.pv <= 7 ? "pass" : parsed.pv <= 9 ? "borderline" : "reject",
              description: "Measures primary oxidation products"
            },
          ],
          recommendations: parsed.recommendations || defaultResults.recommendations,
          batch: parsed.batch,
        });
      } catch (e) {
        console.error("Error parsing stored results:", e);
      }
    }
  }, []);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const reportData: ReportData = {
        batchId: testResults.batchId,
        testDate: testResults.timestamp,
        stationName: testResults.batch?.stationName || "Station A1",
        location: testResults.batch?.location || "Kitchen Zone A",
        equipment: testResults.batch?.equipment || "Industrial Fryer 50L",
        oilType: testResults.batch?.oilType || "Refined Sunflower Oil",
        results: {
          ffa: testResults.parameters[0].value,
          tpc: testResults.parameters[1].value,
          pv: testResults.parameters[2].value,
          score: testResults.score,
          classification: testResults.compliance,
          confidence: testResults.aiConfidence,
        },
        limits: {
          ffa: 0.3,
          tpc: 25,
          pv: 10,
        },
        companyName: "FoodOil IQ Test Facility",
        companyAddress: "Quality Testing Division",
      };
      
      await downloadPdfReport(reportData);
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Oil Quality Test - ${testResults.batchId}`,
      text: `Test Result: ${testResults.compliance.toUpperCase()} (Score: ${testResults.score})`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      toast.success("Report link copied to clipboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Decision */}
      <div className="data-card text-center py-8">
        <ComplianceBadge status={testResults.compliance} size="lg" />
        <h1 className="text-3xl font-bold mt-4">
          {testResults.compliance === "pass" 
            ? "Oil Quality Approved" 
            : testResults.compliance === "borderline"
            ? "Borderline - Monitor Closely"
            : "Oil Rejected - Replace Immediately"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Test ID: {testResults.id} | {new Date(testResults.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Score and Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="data-card flex flex-col items-center justify-center py-6">
          <OilHealthScore score={testResults.score} size="md" />
        </div>
        <div className="data-card flex flex-col justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">AI Confidence Score</p>
            <p className="text-5xl font-bold text-secondary">{testResults.aiConfidence.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              Based on 50,000+ validated lab samples
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Batch ID</span>
              <span className="font-mono font-medium">{testResults.batchId}</span>
            </div>
            {testResults.batch && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Station</span>
                <span className="font-medium">{testResults.batch.stationName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Parameters */}
      <div className="data-card">
        <h2 className="text-lg font-semibold mb-4">Predicted Parameters</h2>
        <div className="space-y-4">
          {testResults.parameters.map((param, index) => (
            <div 
              key={index}
              className={cn(
                "p-4 rounded-lg border",
                param.status === "pass" && "bg-success/5 border-success/20",
                param.status === "borderline" && "bg-warning/5 border-warning/20",
                param.status === "reject" && "bg-destructive/5 border-destructive/20"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(param.status)}
                  <div>
                    <p className="font-medium">{param.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{param.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums">
                    {param.value.toFixed(param.unit === "%" && param.value < 1 ? 2 : 1)} <span className="text-sm font-normal text-muted-foreground">{param.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Limit: {param.limit} {param.unit}
                  </p>
                </div>
              </div>
              {/* Progress indicator */}
              <div className="mt-3">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      param.status === "pass" && "bg-success",
                      param.status === "borderline" && "bg-warning",
                      param.status === "reject" && "bg-destructive"
                    )}
                    style={{ width: `${Math.min((param.value / param.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="data-card">
        <h2 className="text-lg font-semibold mb-4">AI Recommendations</h2>
        <ul className="space-y-2">
          {testResults.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Regulatory Disclaimer */}
      <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
        <p className="text-xs text-muted-foreground italic text-center">
          <strong>Disclaimer:</strong> This is an AI-assisted screening tool. For borderline or rejected samples, 
          laboratory confirmation is recommended. Results should be interpreted by qualified food safety personnel.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" onClick={handleDownloadPdf} disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating..." : "Export PDF"}
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Report
        </Button>
        <Button asChild>
          <Link to="/test">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Test
          </Link>
        </Button>
      </div>
    </div>
  );
}
