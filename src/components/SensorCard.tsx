import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  trendData: number[];
  icon: React.ReactNode;
}

export function SensorCard({ 
  title, 
  value, 
  unit, 
  min, 
  max, 
  status, 
  trend, 
  trendData, 
  icon 
}: SensorCardProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const statusColors = {
    good: "text-[#00ff41] border-[#00ff41]",
    warning: "text-yellow-500 border-yellow-500",
    critical: "text-red-500 border-red-500"
  };
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <Card className="border-glow-green">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm">{title}</span>
          </div>
          <Badge variant="outline" className={statusColors[status]}>
            {status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Value Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#00ff41] text-glow-green">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        
        {/* Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min}</span>
            <span>{max}</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-3"
          />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Min: {min}</span>
            <span className="text-muted-foreground">Max: {max}</span>
          </div>
        </div>
        
        {/* Trend Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <TrendIcon className={`w-4 h-4 ${
              trend === "up" ? "text-[#00ff41]" : 
              trend === "down" ? "text-red-500" : 
              "text-muted-foreground"
            }`} />
            <span className="text-xs text-muted-foreground">
              {trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last hour
          </div>
        </div>
        
        {/* Mini trend chart */}
        <div className="h-8 flex items-end space-x-1">
          {trendData.map((point, index) => (
            <div
              key={index}
              className="flex-1 bg-[#00ff41]/30 rounded-sm min-h-[2px]"
              style={{ height: `${(point / Math.max(...trendData)) * 100}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}