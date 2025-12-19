import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, CheckCircle2, Wifi, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { oilQualityApi, type PredictionResult } from "@/services/api";
import { batchService } from "@/services/batches";
import { alertService } from "@/services/alerts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type TestPhase = "idle" | "preparing" | "scanning" | "analyzing" | "complete" | "error";

const phaseMessages = {
  idle: "Ready to scan",
  preparing: "Preparing sensor...",
  scanning: "Scanning oil sample...",
  analyzing: "AI analyzing results...",
  complete: "Test complete!",
  error: "Test failed",
};

export default function StartTest() {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [lastResult, setLastResult] = useState<PredictionResult | null>(null);
  const navigate = useNavigate();

  const batches = batchService.getBatches();

  const startTest = async () => {
    if (!selectedBatch) {
      toast.error("Please select a batch to test");
      return;
    }

    try {
      setPhase("preparing");
      setProgress(10);
      
      // Prepare sensor
      await new Promise(r => setTimeout(r, 1000));
      setPhase("scanning");
      setProgress(30);
      
      // Simulate sensor reading
      await new Promise(r => setTimeout(r, 1500));
      setProgress(60);
      
      // Call AI prediction API
      setPhase("analyzing");
      setProgress(75);
      
      const sensorData = {
        spectralFeatures: Array.from({ length: 10 }, () => Math.random()),
        temperature: 22 + Math.random() * 3,
        humidity: 45 + Math.random() * 15,
        sampleId: selectedBatch,
      };

      const result = await oilQualityApi.predict(sensorData);
      setLastResult(result);
      
      // Store test record
      batchService.addTestRecord({
        batchId: selectedBatch,
        timestamp: result.timestamp,
        ffa: result.ffa,
        tpc: result.tpc,
        pv: result.pv,
        score: result.score,
        classification: result.classification,
        confidence: result.confidence,
      });

      // Update batch with test results
      batchService.updateBatchFromTest(selectedBatch, result.score, result.classification);

      // Create alert if needed
      const batch = batchService.getBatch(selectedBatch);
      if (result.classification !== 'pass') {
        alertService.createTestResultAlert(
          result.classification,
          result.score,
          selectedBatch,
          batch?.stationId
        );
      }
      
      setProgress(100);
      setPhase("complete");
      
      // Store result for results page
      sessionStorage.setItem('lastTestResult', JSON.stringify({
        ...result,
        batchId: selectedBatch,
        batch,
      }));
      
      toast.success(`Test completed: ${result.classification.toUpperCase()}`);
      
      // Navigate to results after short delay
      await new Promise(r => setTimeout(r, 1000));
      navigate("/results");
    } catch (error) {
      console.error("Test error:", error);
      setPhase("error");
      toast.error("Test failed. Please try again.");
    }
  };

  const isRunning = phase !== "idle" && phase !== "complete" && phase !== "error";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Start Test</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Initiate oil quality scan and analysis
        </p>
      </div>

      {/* Batch Selection */}
      {phase === "idle" && (
        <div className="data-card mb-6">
          <Label className="mb-2 block">Select Batch to Test</Label>
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger>
              <SelectValue placeholder="Select a batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.id} - {batch.stationName} ({batch.oilType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Main Test Card */}
      <div className="data-card text-center py-12">
        {/* Status Indicator */}
        <div className="mb-8">
          <div className={cn(
            "w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-500",
            phase === "idle" && "bg-primary/10",
            isRunning && "bg-secondary/10 animate-pulse-slow",
            phase === "complete" && "bg-success/10",
            phase === "error" && "bg-destructive/10"
          )}>
            {phase === "idle" && (
              <Beaker className="h-16 w-16 text-primary" />
            )}
            {isRunning && (
              <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            )}
            {phase === "complete" && (
              <CheckCircle2 className="h-16 w-16 text-success" />
            )}
            {phase === "error" && (
              <Beaker className="h-16 w-16 text-destructive" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <p className={cn(
          "text-lg font-medium mb-2",
          phase === "complete" ? "text-success" : 
          phase === "error" ? "text-destructive" : "text-foreground"
        )}>
          {phaseMessages[phase]}
        </p>

        {/* Progress Bar */}
        {(isRunning || phase === "complete") && (
          <div className="max-w-xs mx-auto mb-8">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  phase === "complete" ? "bg-success" : "bg-secondary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
          </div>
        )}

        {/* Start Button */}
        {(phase === "idle" || phase === "error") && (
          <Button
            variant="scan"
            size="xl"
            onClick={startTest}
            className="mt-4"
            disabled={!selectedBatch}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Scan
          </Button>
        )}
      </div>

      {/* Sensor Status */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium">Sensor Status</p>
              <p className="text-xs text-success">Connected & Ready</p>
            </div>
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Beaker className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Last Calibration</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 rounded-lg bg-accent/50 border border-border/50">
        <h3 className="text-sm font-semibold mb-2">Test Instructions</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Ensure oil sample is at room temperature (20-25°C)</li>
          <li>Place sample in the sensor chamber</li>
          <li>Select the batch to test</li>
          <li>Press "Start Scan" to begin analysis</li>
          <li>Wait for AI prediction results</li>
        </ol>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-6 italic">
        AI-assisted screening tool – lab confirmation recommended for borderline cases.
      </p>
    </div>
  );
}
