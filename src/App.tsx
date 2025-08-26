import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { SensorsDashboard } from "./components/SensorsDashboard";
import { CameraPanel } from "./components/CameraPanel";
import { EnhancedControlPanel } from "./components/EnhancedControlPanel";
import { AnalyticsPanel } from "./components/AnalyticsPanel";
import { AlertsPanel } from "./components/AlertsPanel";
import { MapPanel } from "./components/MapPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "sensors":
        return <SensorsDashboard />;
      case "camera":
        return (
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-foreground mb-6">Camera Management</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CameraPanel />
                <div className="space-y-4">
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Camera Settings</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>Resolution: 1920x1080 @ 30fps</div>
                      <div>AI Detection: Active</div>
                      <div>Night Vision: Auto</div>
                      <div>Recording: Continuous</div>
                      <div>Storage: 78% (2.3TB used)</div>
                    </div>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Detection Statistics</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hyacinth Detected:</span>
                        <span className="text-green-500">247 patches</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Obstacles Avoided:</span>
                        <span className="text-orange-500">12 objects</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Detection Accuracy:</span>
                        <span className="text-primary">94.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "controls":
        return <EnhancedControlPanel />;
      case "analytics":
        return <AnalyticsPanel />;
      case "alerts":
        return <AlertsPanel />;
      case "map":
        return (
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-foreground mb-6">Navigation & Mapping</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MapPanel />
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Waypoint Management</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>Next Waypoint: Alpha-8</div>
                      <div>Distance: 127.3m</div>
                      <div>ETA: 2 min 45s</div>
                      <div>Route Efficiency: 96%</div>
                    </div>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Coverage Stats</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area Covered:</span>
                        <span className="text-green-500">2.3 hectares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="text-primary">67%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span className="text-orange-500">1.1 hectares</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground max-w-2xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">System Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Robot Configuration</h3>
                  <div className="space-y-2 text-sm text-left">
                    <div>• Motor calibration</div>
                    <div>• Sensor thresholds</div>
                    <div>• Navigation parameters</div>
                    <div>• Safety limits</div>
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Network & Communication</h3>
                  <div className="space-y-2 text-sm text-left">
                    <div>• WiFi/LTE settings</div>
                    <div>• API endpoints</div>
                    <div>• Data sync frequency</div>
                    <div>• Failsafe protocols</div>
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">User Preferences</h3>
                  <div className="space-y-2 text-sm text-left">
                    <div>• Dashboard layout</div>
                    <div>• Alert preferences</div>
                    <div>• Units & formats</div>
                    <div>• Theme customization</div>
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">System Maintenance</h3>
                  <div className="space-y-2 text-sm text-left">
                    <div>• Firmware updates</div>
                    <div>• Diagnostic tools</div>
                    <div>• Log management</div>
                    <div>• Backup & restore</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Top Navigation */}
      <Navigation />
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}