import { useState, useEffect, useCallback } from "react";
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
  Scissors,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Keyboard,
  Radio
} from "lucide-react";
import { cn } from "./ui/utils";

interface JoystickPosition {
  x: number;
  y: number;
}

interface GamepadState {
  connected: boolean;
  axes: number[];
  buttons: boolean[];
}

export function EnhancedControlPanel() {
  const [leftMotor, setLeftMotor] = useState([45]);
  const [rightMotor, setRightMotor] = useState([50]);
  const [cutterActive, setCutterActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [gamepadState, setGamepadState] = useState<GamepadState>({ connected: false, axes: [], buttons: [] });
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [failsafeMode, setFailsafeMode] = useState(false);

  // Keyboard control mapping
  const keyMappings = {
    'KeyW': 'forward',
    'KeyS': 'backward', 
    'KeyA': 'left',
    'KeyD': 'right',
    'Space': 'stop',
    'KeyC': 'cutter',
    'KeyE': 'emergency'
  };

  // Gamepad polling
  useEffect(() => {
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      
      if (gamepad) {
        setGamepadState({
          connected: true,
          axes: Array.from(gamepad.axes),
          buttons: Array.from(gamepad.buttons).map(button => button.pressed)
        });
        
        // Use gamepad axes for movement (if not in emergency stop)
        if (!isEmergencyStop && !isAutonomous) {
          const leftStickX = gamepad.axes[0] || 0;
          const leftStickY = -(gamepad.axes[1] || 0); // Invert Y axis
          
          if (Math.abs(leftStickX) > 0.1 || Math.abs(leftStickY) > 0.1) {
            handleJoystickMove({ x: leftStickX, y: leftStickY });
          }
        }
        
        // Emergency stop on gamepad button (button 9 - start button)
        if (gamepad.buttons[9]?.pressed) {
          handleEmergencyStop();
        }
      } else {
        setGamepadState({ connected: false, axes: [], buttons: [] });
      }
    };

    const interval = setInterval(pollGamepad, 16); // ~60fps
    return () => clearInterval(interval);
  }, [isEmergencyStop, isAutonomous]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyMappings[e.code as keyof typeof keyMappings];
      if (!action || isEmergencyStop || isAutonomous) return;

      setPressedKeys(prev => new Set(prev).add(e.code));

      switch (action) {
        case 'forward':
          setLeftMotor([80]);
          setRightMotor([80]);
          break;
        case 'backward':
          setLeftMotor([20]);
          setRightMotor([20]);
          break;
        case 'left':
          setLeftMotor([30]);
          setRightMotor([70]);
          break;
        case 'right':
          setLeftMotor([70]);
          setRightMotor([30]);
          break;
        case 'stop':
          setLeftMotor([0]);
          setRightMotor([0]);
          break;
        case 'cutter':
          setCutterActive(prev => !prev);
          break;
        case 'emergency':
          handleEmergencyStop();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const action = keyMappings[e.code as keyof typeof keyMappings];
      if (!action || isEmergencyStop || isAutonomous) return;

      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });

      // Return to neutral when movement keys are released
      if (['forward', 'backward', 'left', 'right'].includes(action)) {
        const stillPressed = Array.from(pressedKeys).some(key => 
          ['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(key) && key !== e.code
        );
        
        if (!stillPressed) {
          setLeftMotor([50]);
          setRightMotor([50]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys, isEmergencyStop, isAutonomous]);

  const handleJoystickMove = (position: JoystickPosition) => {
    setJoystickPosition(position);
    
    // Convert joystick input to motor speeds
    if (!isEmergencyStop && !isAutonomous) {
      const forward = position.y * 50;
      const turn = position.x * 30;
      
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
    setIsAutonomous(false);
  };

  const handleReset = () => {
    setIsEmergencyStop(false);
    setLeftMotor([0]);
    setRightMotor([0]);
  };

  const handleDirectionalControl = (direction: string) => {
    if (isEmergencyStop || isAutonomous) return;
    
    switch (direction) {
      case 'forward':
        setLeftMotor([80]);
        setRightMotor([80]);
        break;
      case 'backward':
        setLeftMotor([20]);
        setRightMotor([20]);
        break;
      case 'left':
        setLeftMotor([30]);
        setRightMotor([70]);
        break;
      case 'right':
        setLeftMotor([70]);
        setRightMotor([30]);
        break;
      case 'stop':
        setLeftMotor([0]);
        setRightMotor([0]);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#00ffff] text-glow-cyan">Robot Control Center</h1>
        <div className="flex items-center space-x-4">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Manual</span>
            <Switch
              checked={isAutonomous}
              onCheckedChange={setIsAutonomous}
              disabled={isEmergencyStop}
            />
            <span className="text-sm text-muted-foreground">Auto</span>
          </div>
          
          {/* Connection Status */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConnected(!isConnected)}
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

          {/* Failsafe Mode */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFailsafeMode(!failsafeMode)}
            className={cn(
              "transition-all duration-200",
              failsafeMode
                ? "border-orange-500 text-orange-500 hover:bg-orange-500/10"
                : "border-muted text-muted-foreground"
            )}
          >
            <Radio className="w-4 h-4 mr-1" />
            RF {failsafeMode ? "ACTIVE" : "STANDBY"}
          </Button>
        </div>
      </div>

      {/* Emergency Stop */}
      <div className="flex justify-center">
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEmergencyStop}
          disabled={isEmergencyStop}
          className={cn(
            "w-40 h-40 rounded-full transition-all duration-200 transform",
            isEmergencyStop 
              ? "bg-red-600 border-4 border-red-400 scale-95" 
              : "bg-red-500 border-4 border-red-400 hover:scale-105 animate-pulse border-glow-red shadow-lg",
            "hover:bg-red-600 active:scale-95"
          )}
        >
          <div className="flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 mb-2" />
            <span className="text-lg font-bold">EMERGENCY</span>
            <span className="text-lg font-bold">STOP</span>
            <span className="text-xs mt-1">[E] or [START]</span>
          </div>
        </Button>
      </div>

      {/* Mode Status */}
      {isAutonomous && (
        <div className="p-4 bg-[#00ff41]/20 border border-[#00ff41] rounded-lg text-center">
          <div className="text-[#00ff41] font-medium">AUTONOMOUS MODE ACTIVE</div>
          <div className="text-sm text-muted-foreground">Robot is operating independently</div>
        </div>
      )}

      {isEmergencyStop && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Control Inputs */}
        <div className="space-y-6">
          {/* Directional Controls */}
          <Card className="border-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5 text-[#00ffff]" />
                <span>Directional Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div></div>
                <Button
                  variant="outline"
                  size="lg"
                  onMouseDown={() => handleDirectionalControl('forward')}
                  onMouseUp={() => handleDirectionalControl('stop')}
                  disabled={isEmergencyStop || isAutonomous}
                  className={cn(
                    "h-16 transition-all duration-200",
                    pressedKeys.has('KeyW') && "bg-[#00ff41]/20 border-[#00ff41] scale-95"
                  )}
                >
                  <ArrowUp className="w-6 h-6" />
                </Button>
                <div></div>
                
                <Button
                  variant="outline"
                  size="lg"
                  onMouseDown={() => handleDirectionalControl('left')}
                  onMouseUp={() => handleDirectionalControl('stop')}
                  disabled={isEmergencyStop || isAutonomous}
                  className={cn(
                    "h-16 transition-all duration-200",
                    pressedKeys.has('KeyA') && "bg-[#00ff41]/20 border-[#00ff41] scale-95"
                  )}
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleDirectionalControl('stop')}
                  disabled={isEmergencyStop || isAutonomous}
                  className="h-16 transition-all duration-200 hover:bg-red-500/20"
                >
                  <Square className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onMouseDown={() => handleDirectionalControl('right')}
                  onMouseUp={() => handleDirectionalControl('stop')}
                  disabled={isEmergencyStop || isAutonomous}
                  className={cn(
                    "h-16 transition-all duration-200",
                    pressedKeys.has('KeyD') && "bg-[#00ff41]/20 border-[#00ff41] scale-95"
                  )}
                >
                  <ArrowRight className="w-6 h-6" />
                </Button>
                
                <div></div>
                <Button
                  variant="outline"
                  size="lg"
                  onMouseDown={() => handleDirectionalControl('backward')}
                  onMouseUp={() => handleDirectionalControl('stop')}
                  disabled={isEmergencyStop || isAutonomous}
                  className={cn(
                    "h-16 transition-all duration-200",
                    pressedKeys.has('KeyS') && "bg-[#00ff41]/20 border-[#00ff41] scale-95"
                  )}
                >
                  <ArrowDown className="w-6 h-6" />
                </Button>
                <div></div>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                Use WASD keys or click buttons
              </div>
            </CardContent>
          </Card>

          {/* Input Status */}
          <Card className="border-glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-[#00ff41]" />
                <span>Input Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/50 rounded">
                  <div className="text-xs text-muted-foreground">Keyboard</div>
                  <div className="text-sm text-[#00ff41]">
                    {pressedKeys.size > 0 ? `${pressedKeys.size} keys active` : "Ready"}
                  </div>
                </div>
                <div className="p-3 bg-secondary/50 rounded">
                  <div className="text-xs text-muted-foreground">Gamepad</div>
                  <div className={cn(
                    "text-sm",
                    gamepadState.connected ? "text-[#00ff41]" : "text-muted-foreground"
                  )}>
                    {gamepadState.connected ? "Connected" : "Not found"}
                  </div>
                </div>
              </div>
              
              {gamepadState.connected && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Left Stick:</div>
                  <div className="text-xs text-[#00ffff]">
                    X: {gamepadState.axes[0]?.toFixed(2) || "0.00"} | 
                    Y: {gamepadState.axes[1]?.toFixed(2) || "0.00"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Virtual Joystick */}
        <div className="space-y-6">
          <Card className="border-glow-cyan">
            <CardHeader>
              <CardTitle className="text-center">Virtual Joystick</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <VirtualJoystick
                onMove={handleJoystickMove}
                disabled={isEmergencyStop || isAutonomous}
                size={160}
              />
            </CardContent>
          </Card>

          {/* Cutter Control */}
          <Card className="border-glow-red">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-orange-400" />
                <span>Harvester Cutter</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={cutterActive} 
                    onCheckedChange={setCutterActive}
                    disabled={isEmergencyStop}
                    className="data-[state=checked]:bg-red-500"
                  />
                  <span className="text-sm">Cutter Active</span>
                </div>
                {cutterActive && !isEmergencyStop && (
                  <Badge variant="destructive" className="animate-pulse">
                    CUTTING
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-4 h-4 rounded-full transition-all duration-200",
                  cutterActive && !isEmergencyStop 
                    ? "bg-red-500 glow-red animate-pulse" 
                    : "bg-muted"
                )}></div>
                <span className="text-xs text-muted-foreground">
                  {cutterActive && !isEmergencyStop ? "HIGH VOLTAGE - DANGER" : "Safe Mode"}
                </span>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                Press [C] to toggle
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motor Control */}
        <div className="space-y-6">
          <Card className="border-glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#00ff41]" />
                <span>Motor Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Left Motor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Left Thruster</label>
                  <span className="text-sm text-[#00ffff]">{leftMotor[0].toFixed(0)}%</span>
                </div>
                <Slider
                  value={leftMotor}
                  onValueChange={setLeftMotor}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isEmergencyStop || isAutonomous}
                />
              </div>

              {/* Right Motor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Right Thruster</label>
                  <span className="text-sm text-[#00ffff]">{rightMotor[0].toFixed(0)}%</span>
                </div>
                <Slider
                  value={rightMotor}
                  onValueChange={setRightMotor}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isEmergencyStop || isAutonomous}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-glow-cyan">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/50 rounded text-center">
                  <div className="text-xs text-muted-foreground">Total Power</div>
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
                    {isConnected ? "12ms" : "TIMEOUT"}
                  </div>
                </div>
                <div className="p-3 bg-secondary/50 rounded text-center">
                  <div className="text-xs text-muted-foreground">Mode</div>
                  <div className="text-sm text-[#00ff41]">
                    {isEmergencyStop ? "E-STOP" : isAutonomous ? "AUTO" : "MANUAL"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}