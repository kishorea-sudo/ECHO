import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Battery, Thermometer, Radio, HardDrive, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import EchoLogo from "../assets/echo-logo.svg";

interface NavigationProps {
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export function Navigation({ onLogout, onToggleSidebar }: NavigationProps) {
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHamburgerHovered, setIsHamburgerHovered] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = () => {
    if (signalStrength >= 4) return "text-green-500";
    if (signalStrength >= 2) return "text-yellow-500";
    return "text-red-500";
  };

  const getBatteryColor = () => {
    if (batteryLevel >= 50) return "text-green-500";
    if (batteryLevel >= 25) return "text-yellow-500";
    return "text-red-500";
  };

  
  return (
    <header className="w-full h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left Section: Hamburger Menu + Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu Button */}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onToggleSidebar}
            onMouseEnter={() => setIsHamburgerHovered(true)}
            onMouseLeave={() => setIsHamburgerHovered(false)}
            className="p-4 hover:bg-sidebar-accent transition-colors duration-200"
            style={{ color: isHamburgerHovered ? '#3b82f6' : 'white' }}
          >
            <Menu className="w-8 h-8" style={{ width: '32px', height: '32px' }} />
          </Button>
        )}
        
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 flex items-center justify-center relative">
            <img src={EchoLogo} alt="ECHO Logo" className="w-10 h-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <span className="text-xl font-bold text-foreground">
              ECHO
            </span>
            <div className="text-xs text-muted-foreground">
              Smart Harvester Control System
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center space-x-6">
        {/* Current Time */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-xs text-muted-foreground">System Time</span>
          <span className="text-sm text-foreground font-mono">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>

        {/* Battery Status */}
        <div className="flex items-center space-x-2">
          <Battery className={`w-5 h-5 ${getBatteryColor()}`} />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Battery</span>
            <div className="flex items-center space-x-2">
              <Progress value={batteryLevel} className="w-16 h-2" />
              <span className={`text-sm ${getBatteryColor()}`}>
                {batteryLevel.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* LTE Signal */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                className={`w-1 bg-current transition-colors duration-300 ${
                  bar <= signalStrength ? getSignalColor() : "text-muted"
                }`}
                style={{ height: `${bar * 3 + 4}px` }}
              />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">LTE Signal</span>
            <span className={`text-sm ${getSignalColor()}`}>
              {signalStrength >= 4 ? "Excellent" : signalStrength >= 2 ? "Good" : "Poor"}
            </span>
          </div>
        </div>
        {/* Emergency RF Mode */}
        <Button
          variant="outline"
          size="sm"
          className="border-orange-500 text-orange-500 hover:bg-orange-500/10 relative"
        >
          <Radio className="w-4 h-4 mr-1" />
          RF STANDBY
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </Button>

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-sm text-green-500 font-medium">ONLINE</span>
            <span className="text-xs text-muted-foreground">
              12ms RTT
            </span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-red-500 text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}