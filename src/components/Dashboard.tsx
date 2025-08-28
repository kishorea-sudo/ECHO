import { MapPanel } from "./MapPanel";
import { CameraPanel } from "./CameraPanel";
import { SensorCard } from "./SensorCard";
import { ControlPanel } from "./ControlPanel";
import { Droplets, Thermometer, Zap } from "lucide-react";

export function Dashboard() {
  // Mock sensor data
  const sensorData = {
    ph: {
      value: 7.2,
      min: 6.0,
      max: 8.5,
      status: "good" as const,
      trend: "stable" as const,
      trendData: [7.1, 7.0, 7.2, 7.3, 7.1, 7.2, 7.2, 7.1]
    },
    tds: {
      value: 245,
      min: 0,
      max: 500,
      status: "good" as const,
      trend: "down" as const,
      trendData: [280, 270, 265, 260, 250, 248, 245, 243]
    },
    temperature: {
      value: 18.5,
      min: 0,
      max: 35,
      status: "good" as const,
      trend: "up" as const,
      trendData: [17.8, 17.9, 18.0, 18.2, 18.3, 18.4, 18.5, 18.6]
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Main Grid - Mobile: Stack vertically, Desktop: 2x2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-12rem)]">
        {/* Panel 1: Map */}
        <div className="order-1 lg:order-1">
          <MapPanel />
        </div>
        
        {/* Panel 2: Camera */}
        <div className="order-2 lg:order-2">
          <CameraPanel />
        </div>
        
        {/* Panel 3: Sensors (combined into one panel) */}
        <div className="order-4 lg:order-3 space-y-4">
          <h3 className="text-base lg:text-lg font-medium text-[#00ffff] text-glow-cyan">Water Quality Sensors</h3>
          <div className="grid grid-cols-1 gap-3 lg:gap-4">
            <SensorCard
              title="pH Level"
              value={sensorData.ph.value}
              unit="pH"
              min={sensorData.ph.min}
              max={sensorData.ph.max}
              status={sensorData.ph.status}
              trend={sensorData.ph.trend}
              trendData={sensorData.ph.trendData}
              icon={<Droplets className="w-5 h-5 text-blue-400" />}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <SensorCard
                title="TDS"
                value={sensorData.tds.value}
                unit="ppm"
                min={sensorData.tds.min}
                max={sensorData.tds.max}
                status={sensorData.tds.status}
                trend={sensorData.tds.trend}
                trendData={sensorData.tds.trendData}
                icon={<Zap className="w-4 h-4 text-[#00ffff]" />}
              />
              
              <SensorCard
                title="Temperature"
                value={sensorData.temperature.value}
                unit="°C"
                min={sensorData.temperature.min}
                max={sensorData.temperature.max}
                status={sensorData.temperature.status}
                trend={sensorData.temperature.trend}
                trendData={sensorData.temperature.trendData}
                icon={<Thermometer className="w-4 h-4 text-orange-400" />}
              />
            </div>
          </div>
        </div>
        
        {/* Panel 4: Controls */}
        <div className="order-3 lg:order-4">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}