import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Play, 
  FileText, 
  History, 
  Settings,
  Wifi,
  WifiOff,
  Bell,
  Layers,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { alertService } from "@/services/alerts";

interface AppLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Start Test", href: "/test", icon: Play },
  { name: "Results", href: "/results", icon: FileText },
  { name: "Batches", href: "/batches", icon: Layers },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Knowledge", href: "/knowledge", icon: BookOpen },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isDeviceConnected = true;
  const unacknowledgedAlerts = alertService.getUnacknowledgedCount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <NavLink to="/" className="flex items-center">
            <Logo size="md" />
          </NavLink>

          {/* Device Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {isDeviceConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">Device Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No Device</span>
                </>
              )}
            </div>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-border/50 bg-card/50 p-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const showBadge = item.name === "Alerts" && unacknowledgedAlerts > 0;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "nav-link relative",
                    isActive && "nav-link-active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {showBadge && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unacknowledgedAlerts}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 rounded-xl bg-accent/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">TODAY'S SUMMARY</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tests Run</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pass Rate</span>
                <span className="font-semibold text-success">91.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Score</span>
                <span className="font-semibold">84</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
