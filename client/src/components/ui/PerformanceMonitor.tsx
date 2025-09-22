import { useState, useEffect } from "react";
import { usePerformance } from "@/lib/stores/usePerformance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Cpu, HardDrive, Zap } from "lucide-react";

export function PerformanceMonitor() {
  const { 
    fps, 
    memoryUsage, 
    drawCalls, 
    shouldThrottle,
    shouldReduceParticles,
    performanceLevel 
  } = usePerformance();
  
  const [showMonitor, setShowMonitor] = useState(false);
  const [detailedView, setDetailedView] = useState(false);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'F3') {
        event.preventDefault();
        setShowMonitor(!showMonitor);
      }
      if (event.key === 'F4' && showMonitor) {
        event.preventDefault();
        setDetailedView(!detailedView);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showMonitor, detailedView]);

  if (!showMonitor) {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Badge 
          variant="outline" 
          className="bg-black/50 text-white border-gray-600 cursor-pointer hover:bg-black/70"
          onClick={() => setShowMonitor(true)}
        >
          <BarChart3 className="h-3 w-3 mr-1" />
          Press F3 for Performance
        </Badge>
      </div>
    );
  }

  const getFPSColor = () => {
    if (fps >= 50) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  const getPerformanceLevelColor = () => {
    switch (performanceLevel) {
      case 'high': return "bg-green-600";
      case 'medium': return "bg-yellow-600";
      case 'low': return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="absolute top-20 left-4 pointer-events-auto">
      <Card className="bg-black/90 text-white border-gray-600 w-80">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Monitor
            </h3>
            <div className="flex gap-1">
              <Badge 
                className={getPerformanceLevelColor()}
                onClick={() => setDetailedView(!detailedView)}
              >
                {performanceLevel.toUpperCase()}
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer border-gray-600"
                onClick={() => setShowMonitor(false)}
              >
                ✕
              </Badge>
            </div>
          </div>

          {/* Basic Performance Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                FPS:
              </span>
              <span className={`font-bold ${getFPSColor()}`}>
                {fps.toFixed(1)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Memory:
              </span>
              <span>{memoryUsage.toFixed(1)} MB</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Draw Calls:
              </span>
              <span>{drawCalls}</span>
            </div>
          </div>

          {/* Performance Optimizations */}
          <div className="mt-4 pt-3 border-t border-gray-600">
            <h4 className="font-semibold mb-2">Active Optimizations:</h4>
            <div className="space-y-1 text-sm">
              {shouldThrottle && (
                <Badge variant="outline" className="mr-1 mb-1 border-yellow-600 text-yellow-400">
                  Frame Throttling
                </Badge>
              )}
              {shouldReduceParticles && (
                <Badge variant="outline" className="mr-1 mb-1 border-orange-600 text-orange-400">
                  Reduced Particles
                </Badge>
              )}
              {!shouldThrottle && !shouldReduceParticles && (
                <span className="text-green-400">Full Performance</span>
              )}
            </div>
          </div>

          {/* Detailed View */}
          {detailedView && (
            <div className="mt-4 pt-3 border-t border-gray-600">
              <h4 className="font-semibold mb-2">Detailed Metrics:</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Frame Time:</span>
                    <span>{(1000 / fps).toFixed(2)}ms</span>
                  </div>
                  <Progress 
                    value={Math.min((1000 / fps) / 16.67 * 100, 100)} 
                    className="h-1"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Memory Usage:</span>
                    <span>{((memoryUsage / 512) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={(memoryUsage / 512) * 100} 
                    className="h-1"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-gray-400">
            Press F3 to hide • F4 for details
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
