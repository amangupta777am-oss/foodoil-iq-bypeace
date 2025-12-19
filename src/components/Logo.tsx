import logo from "@/assets/foodoil-iq-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

const sizeMap = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
  xl: "h-20",
};

export function Logo({ size = "md", className, showTagline = false }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logo} 
        alt="FoodOil IQ - Smart Oil Quality Testing" 
        className={cn(sizeMap[size], "w-auto object-contain")}
      />
    </div>
  );
}
