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
    <header className="w-full h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left Section: Hamburger Menu + Logo */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Hamburger Menu Button */}
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="lg"
            onClick={onToggleSidebar}
            onMouseEnter={() => setIsHamburgerHovered(true)}
            onMouseLeave={() => setIsHamburgerHovered(false)}
            className="p-2 lg:p-4 hover:bg-sidebar-accent transition-colors duration-200"
            style={{ color: isHamburgerHovered ? '#3b82f6' : 'white' }}
          >
            <Menu className="w-6 h-6 lg:w-8 lg:h-8" style={{ width: '24px', height: '24px' }} />
          </Button>
        )}
        
        {/* Logo */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center relative">
            <img src={EchoLogo} alt="ECHO Logo" className="w-8 h-8 lg:w-10 lg:h-10" />
            <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg lg:text-xl font-bold text-foreground">
              ECHO
            </span>
            <div className="text-xs text-muted-foreground">
              Smart Harvester Control System
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center space-x-2 lg:space-x-6">
        {/* Current Time */}
        <div className="hidden lg:flex flex-col items-center">
          <span className="text-xs text-muted-foreground">System Time</span>
          <span className="text-sm text-foreground font-mono">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>

        {/* Battery Status */}
        <div className="hidden md:flex items-center space-x-2">
          <Battery className={`w-4 h-4 lg:w-5 lg:h-5 ${getBatteryColor()}`} />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Battery</span>
            <div className="flex items-center space-x-2">
              <Progress value={batteryLevel} className="w-12 lg:w-16 h-2" />
              <span className={`text-sm ${getBatteryColor()}`}>
                {batteryLevel.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* LTE Signal */}
        <div className="hidden md:flex items-center space-x-2">
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
          className="border-orange-500 text-orange-500 hover:bg-orange-500/10 relative hidden lg:flex"
        >
          <Radio className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
          <span className="hidden lg:inline">RF STANDBY</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </Button>

        {/* Connection Status */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-sm text-green-500 font-medium">ONLINE</span>
            <span className="text-xs text-muted-foreground">
              12ms RTT
            </span>
          </div>
        </div>

        {/* Mobile Status Indicator */}
        <div className="flex lg:hidden items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-500">ONLINE</span>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-red-500 text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}