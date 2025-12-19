import { cn } from "@/lib/utils";

interface OilHealthScoreProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-score-good";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

function getScoreStrokeColor(score: number): string {
  if (score >= 80) return "stroke-success";
  if (score >= 60) return "stroke-score-good";
  if (score >= 40) return "stroke-warning";
  return "stroke-destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Borderline";
  return "Poor";
}

export function OilHealthScore({ score, maxScore = 100, size = "lg" }: OilHealthScoreProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-36 h-36",
    lg: "w-48 h-48",
  };

  const textSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/50"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", getScoreStrokeColor(score))}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold tabular-nums", textSizes[size], getScoreColor(score))}>
            {score}
          </span>
          {size !== "sm" && (
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              / {maxScore}
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className={cn("font-semibold", getScoreColor(score))}>{getScoreLabel(score)}</p>
        <p className="text-xs text-muted-foreground">Oil Health Score</p>
      </div>
    </div>
  );
}
