import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { 
  Zap, 
  RotateCcw, 
  Play, 
  Pause, 
  AlertTriangle,
  Settings
} from "lucide-react";

export function MotorControlPanel() {
  const [leftMotor, setLeftMotor] = useState([45]);
  const [rightMotor, setRightMotor] = useState([50]);
  const [cutterActive, setCutterActive] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  const handleEmergencyStop = () => {
    setLeftMotor([0]);
    setRightMotor([0]);
    setCutterActive(false);
    setIsRunning(false);
  };

  const handleReset = () => {
    setLeftMotor([50]);
    setRightMotor([50]);
    setIsRunning(true);
  };

  return (
    <Card className="h-full border-glow-cyan">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#00ffff]" />
            <span>Motor Control</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={
              isRunning 
                ? "border-[#00ff41] text-[#00ff41]" 
                : "border-red-500 text-red-500"
            }>
              {isRunning ? "ACTIVE" : "STOPPED"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Motor Controls */}
        <div className="space-y-4">
          {/* Left Motor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Left Motor</label>
              <span className="text-sm text-[#00ffff]">{leftMotor[0]}%</span>
            </div>
            <Slider
              value={leftMotor}
              onValueChange={setLeftMotor}
              max={100}
              step={1}
              className="w-full"
              disabled={!isRunning}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Right Motor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Right Motor</label>
              <span className="text-sm text-[#00ffff]">{rightMotor[0]}%</span>
            </div>
            <Slider
              value={rightMotor}
              onValueChange={setRightMotor}
              max={100}
              step={1}
              className="w-full"
              disabled={!isRunning}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Cutter Control */}
        <div className="p-4 bg-secondary rounded-lg border border-dashed border-border">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Debris Cutter</label>
            <Switch 
              checked={cutterActive} 
              onCheckedChange={setCutterActive}
              disabled={!isRunning}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              cutterActive ? "bg-[#00ff41] glow-green" : "bg-muted"
            }`}></div>
            <span className="text-xs text-muted-foreground">
              {cutterActive ? "Cutter Active" : "Cutter Disabled"}
            </span>
          </div>
        </div>

        {/* Motor Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary/50 rounded">
            <div className="text-xs text-muted-foreground">Power Draw</div>
            <div className="text-sm text-[#00ff41]">
              {((leftMotor[0] + rightMotor[0]) * 0.8 + (cutterActive ? 25 : 0)).toFixed(1)}W
            </div>
          </div>
          <div className="p-3 bg-secondary/50 rounded">
            <div className="text-xs text-muted-foreground">Motor Runtime</div>
            <div className="text-sm text-orange-400">20 Mins</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleEmergencyStop}
            className="flex-1"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            E-STOP
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <Pause className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}