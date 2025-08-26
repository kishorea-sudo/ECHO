import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Navigation } from "lucide-react";

export function MapPanel() {
  // Mock GPS coordinates and trail data
  const currentLocation = { lat: 46.7712, lng: -92.1004 };
  const trailPoints = [
    { lat: 46.7710, lng: -92.1000, timestamp: "14:30" },
    { lat: 46.7711, lng: -92.1002, timestamp: "14:31" },
    { lat: 46.7712, lng: -92.1004, timestamp: "14:32" },
  ];

  return (
    <Card className="h-full border-glow-cyan">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#00ffff]" />
            <span>GPS Location & Trail</span>
          </div>
          <Badge variant="outline" className="border-[#00ffff] text-[#00ffff]">
            Tracking Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location */}
        <div className="p-4 bg-secondary rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Position</span>
            <Navigation className="w-4 h-4 text-[#00ffff]" />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              Lat: <span className="text-[#00ffff]">{currentLocation.lat.toFixed(6)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Lng: <span className="text-[#00ffff]">{currentLocation.lng.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-48 bg-secondary rounded-lg border border-dashed border-border flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
          
          {/* Mock map grid */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-[#00ffff]" 
                   style={{ top: `${i * 10}%` }} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-[#00ffff]" 
                   style={{ left: `${i * 10}%` }} />
            ))}
          </div>
          
          {/* Robot position */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-[#00ff41] rounded-full glow-green animate-pulse"></div>
          </div>
          
          {/* Trail */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 20 80 Q 50 60, 80 40 Q 110 30, 140 50 Q 170 70, 200 60"
              stroke="#00ffff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="opacity-60"
            />
          </svg>
          
          <div className="text-center text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-[#00ffff]" />
            <span>Interactive Map View</span>
          </div>
        </div>

        {/* Trail History */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Trail Points</h4>
          <div className="space-y-1">
            {trailPoints.reverse().map((point, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-2 bg-secondary/50 rounded">
                <span className="text-muted-foreground">{point.timestamp}</span>
                <span className="text-[#00ffff]">
                  {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}