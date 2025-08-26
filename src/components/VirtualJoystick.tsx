import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "./ui/utils";

interface JoystickPosition {
  x: number;
  y: number;
}

interface VirtualJoystickProps {
  onMove: (position: JoystickPosition) => void;
  size?: number;
  disabled?: boolean;
}

export function VirtualJoystick({ onMove, size = 120, disabled = false }: VirtualJoystickProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<JoystickPosition>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const maxDistance = size / 2 - 20; // Account for knob size

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;

    // Calculate distance from center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Limit to max distance
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxDistance;
      deltaY = Math.sin(angle) * maxDistance;
    }

    const newPosition = { x: deltaX, y: deltaY };
    setPosition(newPosition);

    // Normalize values to -1 to 1 range
    const normalizedX = deltaX / maxDistance;
    const normalizedY = -deltaY / maxDistance; // Invert Y for forward/backward

    onMove({ x: normalizedX, y: normalizedY });
  }, [isDragging, maxDistance, onMove, disabled]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  }, [onMove]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        ref={containerRef}
        className={cn(
          "relative rounded-full border-2 transition-all duration-200 select-none",
          disabled 
            ? "border-muted bg-muted/20" 
            : "border-[#00ffff] bg-secondary/30 border-glow-cyan cursor-pointer hover:border-glow-cyan"
        )}
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Directional indicators */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
          FWD
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
          REV
        </div>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
          L
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
          R
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-px bg-[#00ffff]/30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-px bg-[#00ffff]/30"></div>
        </div>

        {/* Knob */}
        <div
          ref={knobRef}
          className={cn(
            "absolute w-10 h-10 rounded-full border-2 transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2",
            disabled
              ? "border-muted bg-muted"
              : isDragging
              ? "border-[#00ff41] bg-[#00ff41]/20 glow-green scale-110"
              : "border-[#00ffff] bg-[#00ffff]/20 hover:scale-105"
          )}
          style={{
            left: `${50 + (position.x / maxDistance) * 40}%`,
            top: `${50 + (position.y / maxDistance) * 40}%`,
          }}
        >
          <div className={cn(
            "w-6 h-6 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            disabled
              ? "bg-muted-foreground"
              : isDragging
              ? "bg-[#00ff41] glow-green"
              : "bg-[#00ffff]"
          )} />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-xs text-muted-foreground">Virtual Joystick</div>
        {!disabled && (
          <div className="text-xs text-[#00ffff]">
            X: {position.x.toFixed(2)} | Y: {(-position.y).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}