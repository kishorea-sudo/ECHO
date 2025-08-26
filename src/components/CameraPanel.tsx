import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Camera, Circle, Square, RotateCcw, Eye } from "lucide-react";

export function CameraPanel() {
  return (
    <Card className="h-full border-glow-green">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#00ff41]" />
            <span>Live Camera Feed</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-red-500 text-red-500">
              <Circle className="w-3 h-3 mr-1 fill-current animate-pulse" />
              REC
            </Badge>
            <Badge variant="outline" className="border-[#00ff41] text-[#00ff41]">
              <Eye className="w-3 h-3 mr-1" />
              AI Detection
            </Badge>
            <Badge variant="outline" className="border-[#00ffff] text-[#00ffff]">
              HD 1080p
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Feed */}
        <div className="h-64 bg-secondary rounded-lg border border-dashed border-border flex items-center justify-center relative overflow-hidden">
          {/* Mock water surface */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-blue-600/30 to-blue-800/40"></div>
          
          {/* Animated water ripples */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-8 h-8 border-2 border-[#00ffff]/50 rounded-full animate-ping"></div>
            <div className="absolute top-20 right-16 w-6 h-6 border-2 border-[#00ffff]/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Hyacinth Detection Overlays */}
          <div className="absolute top-6 left-6 w-24 h-16 border-2 border-[#00ff41] rounded bg-[#00ff41]/10">
            <div className="absolute -top-6 left-0 p-1 bg-black/80 rounded text-[#00ff41] text-xs">
              <div>HYACINTH</div>
              <div>97.3%</div>
            </div>
          </div>
          
          <div className="absolute top-16 right-8 w-20 h-12 border-2 border-[#00ff41] rounded bg-[#00ff41]/10">
            <div className="absolute -top-6 right-0 p-1 bg-black/80 rounded text-[#00ff41] text-xs">
              <div>HYACINTH</div>
              <div>89.1%</div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-12 w-16 h-10 border-2 border-yellow-500 rounded bg-yellow-500/10">
            <div className="absolute -top-6 left-0 p-1 bg-black/80 rounded text-yellow-500 text-xs">
              <div>DEBRIS</div>
              <div>76.8%</div>
            </div>
          </div>
          
          {/* Water quality overlay */}
          <div className="absolute bottom-4 right-4 p-2 bg-black/80 rounded border border-[#00ffff] text-[#00ffff] text-xs">
            <div>WATER CLARITY: GOOD</div>
            <div>Visibility: 2.3m</div>
          </div>
          
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-px bg-[#00ff41] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="h-8 w-px bg-[#00ff41] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-1 h-1 bg-[#00ff41] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          <div className="text-center text-muted-foreground">
            <Camera className="w-8 h-8 mx-auto mb-2 text-[#00ff41]" />
            <span>Live Feed Active</span>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 transition-all duration-200">
              <Circle className="w-4 h-4 mr-1 fill-current" />
              Record
            </Button>
            <Button size="sm" variant="outline" className="hover:bg-accent transition-all duration-200">
              <Square className="w-4 h-4 mr-1" />
              Snapshot
            </Button>
          </div>
          <Button size="sm" variant="outline" className="hover:bg-accent transition-all duration-200">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset View
          </Button>
        </div>

        {/* Detection Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Detection Status</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-secondary/50 rounded">
              <div className="text-muted-foreground">Hyacinth Patches</div>
              <div className="text-[#00ff41]">2 detected</div>
            </div>
            <div className="p-2 bg-secondary/50 rounded">
              <div className="text-muted-foreground">Water Clarity</div>
              <div className="text-[#00ffff]">Good (2.3m)</div>
            </div>
            <div className="p-2 bg-secondary/50 rounded">
              <div className="text-muted-foreground">Processing FPS</div>
              <div className="text-[#00ffff]">24.3 fps</div>
            </div>
            <div className="p-2 bg-secondary/50 rounded">
              <div className="text-muted-foreground">Detection Confidence</div>
              <div className="text-[#00ff41]">93.2%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}