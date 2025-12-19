import { Wifi, WifiOff, Battery, Thermometer, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceStatusProps {
  isConnected: boolean;
  batteryLevel?: number;
  temperature?: number;
  signalStrength?: number;
}

export function DeviceStatus({ 
  isConnected, 
  batteryLevel = 85, 
  temperature = 25,
  signalStrength = 92 
}: DeviceStatusProps) {
  return (
    <div className="data-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Device Status</h3>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
          isConnected ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        )}>
          {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {isConnected ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Battery className="h-5 w-5 text-success" />
            </div>
            <p className="text-lg font-semibold">{batteryLevel}%</p>
            <p className="text-xs text-muted-foreground">Battery</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="h-5 w-5 text-primary" />
            </div>
            <p className="text-lg font-semibold">{temperature}°C</p>
            <p className="text-xs text-muted-foreground">Temp</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-lg font-semibold">{signalStrength}%</p>
            <p className="text-xs text-muted-foreground">Signal</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <WifiOff className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No device connected</p>
          <p className="text-xs text-muted-foreground mt-1">
            Connect your FoodOil IQ sensor to begin testing
          </p>
        </div>
      )}
    </div>
  );
}
