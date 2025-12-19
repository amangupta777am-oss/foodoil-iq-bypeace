import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ParameterCardProps {
  name: string;
  value: number;
  unit: string;
  limit: number;
  trend?: "up" | "down" | "stable";
  description?: string;
}

function getStatus(value: number, limit: number): "pass" | "borderline" | "reject" {
  const ratio = value / limit;
  if (ratio <= 0.7) return "pass";
  if (ratio <= 1) return "borderline";
  return "reject";
}

export function ParameterCard({ name, value, unit, limit, trend = "stable", description }: ParameterCardProps) {
  const status = getStatus(value, limit);

  const statusStyles = {
    pass: "border-success/20 bg-success/5",
    borderline: "border-warning/20 bg-warning/5",
    reject: "border-destructive/20 bg-destructive/5",
  };

  const statusTextStyles = {
    pass: "text-success",
    borderline: "text-warning",
    reject: "text-destructive",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className={cn("data-card border-l-4", statusStyles[status])}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{name}</p>
          {description && (
            <p className="text-xs text-muted-foreground/70 mt-0.5">{description}</p>
          )}
        </div>
        <div className={cn("flex items-center gap-1 text-xs", 
          trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground"
        )}>
          <TrendIcon className="h-3 w-3" />
          <span>{trend === "stable" ? "Stable" : trend === "up" ? "Rising" : "Falling"}</span>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn("parameter-value", statusTextStyles[status])}>
          {value.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === "pass" ? "bg-success" : status === "borderline" ? "bg-warning" : "bg-destructive"
            )}
            style={{ width: `${Math.min((value / limit) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Limit: {limit} {unit}
        </span>
      </div>
    </div>
  );
}
