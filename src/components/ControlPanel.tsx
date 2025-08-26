import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { VirtualJoystick } from "./VirtualJoystick";
import { 
  Gamepad2, 
  Zap, 
  AlertTriangle,
  Wifi,
  WifiOff,
  Power,
  Scissors
} from "lucide-react";

interface JoystickPosition {
  x: number;
  y: number;
}

export function ControlPanel() {
  const [leftMotor, setLeftMotor] = useState([45]);
  const [rightMotor, setRightMotor] = useState([50]);
  const [cutterActive, setCutterActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState<JoystickPosition>({ x: 0, y: 0 });

  const handleJoystickMove = (position: JoystickPosition) => {
    setJoystickPosition(position);
    
    // Convert joystick input to motor speeds
    if (!isEmergencyStop) {
      const forward = position.y * 100;
      const turn = position.x * 50;
      
      const leftSpeed = Math.max(0, Math.min(100, 50 + forward + turn));
      const rightSpeed = Math.max(0, Math.min(100, 50 + forward - turn));
      
      setLeftMotor([leftSpeed]);
      setRightMotor([rightSpeed]);
    }
  };

  const handleEmergencyStop = () => {
    setIsEmergencyStop(true);
    setLeftMotor([0]);
    setRightMotor([0]);
    setCutterActive(false);
  };

  const handleReset = () => {
    setIsEmergencyStop(false);
    setLeftMotor([0]);
    setRightMotor([0]);
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <Card className="h-full border-glow-cyan">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-[#00ffff]" />
            <span>Robot Control</span>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleConnection}
              className={cn(
                "transition-all duration-200",
                isConnected
                  ? "border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10"
                  : "border-red-500 text-red-500 hover:bg-red-500/10"
              )}
            >
              {isConnected ? (
                <Wifi className="w-4 h-4 mr-1" />
              ) : (
                <WifiOff className="w-4 h-4 mr-1" />
              )}
              {isConnected ? "CONNECTED" : "DISCONNECTED"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Stop */}
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEmergencyStop}
            disabled={isEmergencyStop}
            className={cn(
              "w-32 h-32 rounded-full transition-all duration-200 transform",
              isEmergencyStop 
                ? "bg-red-600 border-4 border-red-400 scale-95" 
                : "bg-red-500 border-4 border-red-400 hover:scale-105 animate-pulse border-glow-red shadow-lg",
              "hover:bg-red-600 active:scale-95"
            )}
          >
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-8 h-8 mb-1" />
              <span className="text-sm font-bold">EMERGENCY</span>
              <span className="text-sm font-bold">STOP</span>
            </div>
          </Button>
        </div>

        {/* Status Indicator */}
        {isEmergencyStop && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-center">
            <div className="text-red-400 font-medium">EMERGENCY STOP ACTIVE</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mt-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10"
            >
              <Power className="w-4 h-4 mr-1" />
              Reset System
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Virtual Joystick */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-center">Navigation Control</h4>
            <div className="flex justify-center">
              <VirtualJoystick
                onMove={handleJoystickMove}
                disabled={isEmergencyStop || !isConnected}
              />
            </div>
          </div>

          {/* Manual Motor Control */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-center">Manual Motor Control</h4>
            
            {/* Left Motor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Left Motor</label>
                <span className="text-sm text-[#00ffff]">{leftMotor[0].toFixed(0)}%</span>
              </div>
              <Slider
                value={leftMotor}
                onValueChange={setLeftMotor}
                max={100}
                step={1}
                className="w-full"
                disabled={isEmergencyStop || !isConnected}
              />
            </div>

            {/* Right Motor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Right Motor</label>
                <span className="text-sm text-[#00ffff]">{rightMotor[0].toFixed(0)}%</span>
              </div>
              <Slider
                value={rightMotor}
                onValueChange={setRightMotor}
                max={100}
                step={1}
                className="w-full"
                disabled={isEmergencyStop || !isConnected}
              />
            </div>
          </div>
        </div>

        {/* Cutter Control */}
        <div className="p-4 bg-secondary rounded-lg border-2 border-dashed border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-orange-400" />
              <label className="text-sm font-medium">Hyacinth Cutter</label>
            </div>
            <Switch 
              checked={cutterActive} 
              onCheckedChange={setCutterActive}
              disabled={isEmergencyStop || !isConnected}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-4 h-4 rounded-full transition-all duration-200",
                cutterActive && !isEmergencyStop 
                  ? "bg-red-500 glow-red animate-pulse" 
                  : "bg-muted"
              )}></div>
              <span className="text-xs text-muted-foreground">
                {cutterActive && !isEmergencyStop ? "Cutter Active - DANGER" : "Cutter Disabled"}
              </span>
            </div>
            {cutterActive && !isEmergencyStop && (
              <Badge variant="destructive" className="animate-pulse">
                CUTTING
              </Badge>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-secondary/50 rounded text-center">
            <div className="text-xs text-muted-foreground">Power Draw</div>
            <div className="text-sm text-[#00ff41]">
              {isEmergencyStop ? "0W" : `${((leftMotor[0] + rightMotor[0]) * 0.8 + (cutterActive ? 45 : 0)).toFixed(0)}W`}
            </div>
          </div>
          <div className="p-3 bg-secondary/50 rounded text-center">
            <div className="text-xs text-muted-foreground">Motor Runtime</div>
            <div className="text-sm text-orange-400">
              {isEmergencyStop ? "--Mins" : "20 Mins"}
            </div>
          </div>
          <div className="p-3 bg-secondary/50 rounded text-center">
            <div className="text-xs text-muted-foreground">Response</div>
            <div className="text-sm text-[#00ffff]">
              {isConnected ? "25ms" : "TIMEOUT"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Fix missing cn import
import { cn } from "./ui/utils";