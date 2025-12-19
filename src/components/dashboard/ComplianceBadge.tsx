import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceBadgeProps {
  status: "pass" | "borderline" | "reject";
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  pass: {
    label: "Within Limits",
    icon: CheckCircle2,
    className: "compliance-pass",
  },
  borderline: {
    label: "Borderline",
    icon: AlertTriangle,
    className: "compliance-borderline",
  },
  reject: {
    label: "Reject",
    icon: XCircle,
    className: "compliance-reject",
  },
};

export function ComplianceBadge({ status, size = "md" }: ComplianceBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("compliance-badge", config.className, sizeStyles[size])}>
      <Icon className={iconSizes[size]} />
      <span className="font-semibold">{config.label}</span>
    </div>
  );
}
