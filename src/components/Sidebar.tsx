import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { 
  LayoutDashboard, 
  Map, 
  Activity, 
  Camera, 
  Gamepad2,
  Settings,
  BarChart3,
  AlertTriangle
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sensors", label: "Sensors", icon: Activity },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "controls", label: "Controls", icon: Gamepad2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "map", label: "Map", icon: Map },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-medium text-sidebar-foreground mb-4">ECHO Navigation</h2>
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-3 py-2 h-auto transition-all duration-200 hover:bg-sidebar-accent group",
                  isActive && "bg-sidebar-accent text-primary"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn(
                  "w-5 h-5 mr-3 transition-colors duration-200",
                  isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary"
                )} />
                <span className={cn(
                  "transition-all duration-200",
                  isActive ? "text-primary font-medium" : "text-sidebar-foreground group-hover:text-primary"
                )}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </nav>
      </div>
      
      {/* Robot Status */}
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sidebar-foreground">System Status</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="text-primary">Lake Superior</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-green-500">Autonomous</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="text-primary">2h 34m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}