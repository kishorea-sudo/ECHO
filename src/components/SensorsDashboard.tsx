import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { SensorCard } from "./SensorCard";
import { 
  Droplets, 
  Thermometer, 
  Zap, 
  Compass, 
  Radar,
  Navigation,
  Waves,
  Target
} from "lucide-react";

// Mock IMU data
interface IMUData {
  roll: number;
  pitch: number;
  yaw: number;
}

// Mock radar data
interface RadarContact {
  distance: number;
  angle: number;
  size: number;
  type: 'obstacle' | 'debris' | 'vegetation';
}

export function SensorsDashboard() {
  const [imuData, setIMUData] = useState<IMUData>({ roll: 5, pitch: -2, yaw: 45 });
  const [radarContacts, setRadarContacts] = useState<RadarContact[]>([
    { distance: 3.2, angle: 15, size: 0.8, type: 'vegetation' },
    { distance: 5.7, angle: -30, size: 1.2, type: 'obstacle' },
    { distance: 2.1, angle: 60, size: 0.4, type: 'debris' },
    { distance: 8.3, angle: 120, size: 2.1, type: 'vegetation' },
  ]);

  // Simulate IMU updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIMUData(prev => ({
        roll: prev.roll + (Math.random() - 0.5) * 2,
        pitch: prev.pitch + (Math.random() - 0.5) * 1,
        yaw: (prev.yaw + (Math.random() - 0.5) * 3) % 360,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const getContactColor = (type: string) => {
    switch (type) {
      case 'obstacle': return '#dc2626';
      case 'debris': return '#f59e0b';
      case 'vegetation': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Sensor Dashboard</h1>
        <Badge variant="outline" className="border-green-500 text-green-500 px-4 py-2">
          All Systems Operational
        </Badge>
      </div>

      {/* Top Row - Water Quality Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SensorCard
          title="pH Level"
          value={sensorData.ph.value}
          unit="pH"
          min={sensorData.ph.min}
          max={sensorData.ph.max}
          status={sensorData.ph.status}
          trend={sensorData.ph.trend}
          trendData={sensorData.ph.trendData}
          icon={<Droplets className="w-5 h-5 text-blue-500" />}
        />
        
        <SensorCard
          title="TDS"
          value={sensorData.tds.value}
          unit="ppm"
          min={sensorData.tds.min}
          max={sensorData.tds.max}
          status={sensorData.tds.status}
          trend={sensorData.tds.trend}
          trendData={sensorData.tds.trendData}
          icon={<Zap className="w-5 h-5 text-primary" />}
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
          icon={<Thermometer className="w-5 h-5 text-orange-500" />}
        />
      </div>

      {/* Middle Row - IMU and GPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D IMU Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-primary" />
              <span>IMU Orientation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 3D Visualization Placeholder */}
            <div className="h-48 bg-secondary rounded-lg border border-dashed border-border flex items-center justify-center relative overflow-hidden">
              {/* 3D Robot representation */}
              <div 
                className="relative w-20 h-12 bg-primary/30 border-2 border-primary rounded transition-transform duration-1000"
                style={{
                  transform: `perspective(200px) rotateX(${imuData.pitch}deg) rotateY(${imuData.yaw}deg) rotateZ(${imuData.roll}deg)`
                }}
              >
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              {/* Horizon line */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-full h-px bg-primary/50"
                  style={{ transform: `rotate(${imuData.roll}deg)` }}
                ></div>
              </div>
            </div>

            {/* IMU Values */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary/50 rounded">
                <div className="text-xs text-muted-foreground">Roll</div>
                <div className="text-sm text-primary">{imuData.roll.toFixed(1)}°</div>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded">
                <div className="text-xs text-muted-foreground">Pitch</div>
                <div className="text-sm text-primary">{imuData.pitch.toFixed(1)}°</div>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded">
                <div className="text-xs text-muted-foreground">Yaw</div>
                <div className="text-sm text-primary">{imuData.yaw.toFixed(1)}°</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-green-500" />
              <span>GPS & Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GPS Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary/50 rounded">
                <div className="text-xs text-muted-foreground">Satellites</div>
                <div className="text-sm text-green-500">12 connected</div>
              </div>
              <div className="p-3 bg-secondary/50 rounded">
                <div className="text-xs text-muted-foreground">Accuracy</div>
                <div className="text-sm text-green-500">±0.8m</div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Latitude:</span>
                <span className="text-sm text-green-500">46.771234°N</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Longitude:</span>
                <span className="text-sm text-green-500">-92.100456°W</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Altitude:</span>
                <span className="text-sm text-green-500">183.2m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <span className="text-sm text-primary">2.3 m/s</span>
              </div>
            </div>

            {/* Heading Compass */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24 border-2 border-primary/30 rounded-full">
                <div 
                  className="absolute top-1 left-1/2 w-1 h-8 bg-green-500 transform -translate-x-1/2 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${imuData.yaw}deg)` }}
                ></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary">N</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Obstacle Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radar className="w-5 h-5 text-red-500" />
              <span>Obstacle Detection Radar</span>
            </div>
            <Badge variant="outline" className="border-red-500 text-red-500">
              {radarContacts.length} Contacts
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Display */}
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-square max-w-md mx-auto bg-secondary/30 rounded-full border-2 border-primary/30">
                {/* Radar Circles */}
                {[1, 2, 3, 4].map((ring) => (
                  <div
                    key={ring}
                    className="absolute border border-primary/20 rounded-full"
                    style={{
                      width: `${ring * 25}%`,
                      height: `${ring * 25}%`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
                
                {/* Radar Sweep */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-green-500 to-transparent origin-left animate-spin"
                    style={{ animationDuration: '3s' }}
                  />
                </div>
                
                {/* Center point */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Radar Contacts */}
                {radarContacts.map((contact, index) => {
                  const x = 50 + (contact.distance / 10) * 40 * Math.cos((contact.angle - 90) * Math.PI / 180);
                  const y = 50 + (contact.distance / 10) * 40 * Math.sin((contact.angle - 90) * Math.PI / 180);
                  
                  return (
                    <div
                      key={index}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        backgroundColor: getContactColor(contact.type),
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  );
                })}
                
                {/* Range rings labels */}
                <div className="absolute top-1/2 right-2 text-xs text-primary/60">10m</div>
                <div className="absolute top-1/2 right-6 text-xs text-primary/60">7.5m</div>
                <div className="absolute top-1/2 right-10 text-xs text-primary/60">5m</div>
                <div className="absolute top-1/2 right-14 text-xs text-primary/60">2.5m</div>
              </div>
            </div>
            
            {/* Contact List */}
            <div className="space-y-4">
              <h4 className="font-medium">Detected Objects</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {radarContacts.map((contact, index) => (
                  <div key={index} className="p-3 bg-secondary/50 rounded border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{contact.type}</span>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getContactColor(contact.type) }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Distance: {contact.distance.toFixed(1)}m</div>
                      <div>Bearing: {contact.angle.toFixed(0)}°</div>
                      <div>Size: {contact.size.toFixed(1)}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}