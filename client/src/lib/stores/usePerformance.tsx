import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type PerformanceLevel = 'high' | 'medium' | 'low';

interface PerformanceState {
  fps: number;
  memoryUsage: number;
  drawCalls: number;
  performanceLevel: PerformanceLevel;
  shouldThrottle: boolean;
  shouldReduceParticles: boolean;
  
  // Performance history for trending
  fpsHistory: number[];
  memoryHistory: number[];
  
  // Actions
  initializePerformance: () => void;
  updatePerformance: () => void;
  setPerformanceLevel: (level: PerformanceLevel) => void;
  getPerformanceRecommendations: () => string[];
}

export const usePerformance = create<PerformanceState>()(
  subscribeWithSelector((set, get) => ({
    fps: 60,
    memoryUsage: 0,
    drawCalls: 0,
    performanceLevel: 'high',
    shouldThrottle: false,
    shouldReduceParticles: false,
    fpsHistory: [],
    memoryHistory: [],

    initializePerformance: () => {
      console.log("Initializing performance monitoring system");
      
      // Detect initial performance level based on device capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      let initialLevel: PerformanceLevel = 'medium';
      
      if (gl) {
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        
        // Simple heuristic for performance detection
        if (renderer.includes('Mali') || renderer.includes('Adreno') || vendor.includes('ARM')) {
          initialLevel = 'low';
        } else if (renderer.includes('Intel')) {
          initialLevel = 'medium';
        } else {
          initialLevel = 'high';
        }
      }
      
      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        initialLevel = initialLevel === 'high' ? 'medium' : 'low';
      }
      
      set({
        performanceLevel: initialLevel,
        shouldThrottle: initialLevel === 'low',
        shouldReduceParticles: initialLevel !== 'high',
        fpsHistory: [],
        memoryHistory: []
      });
      
      console.log(`Initial performance level set to: ${initialLevel}`);
    },

    updatePerformance: () => {
      const now = performance.now();
      const { fpsHistory, memoryHistory } = get();
      
      // Calculate FPS (simplified)
      const currentFps = Math.round(1000 / 16.67); // Approximate, real implementation would track frame times
      
      // Get memory usage if available
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      }
      
      // Update history (keep last 60 samples)
      const newFpsHistory = [...fpsHistory, currentFps].slice(-60);
      const newMemoryHistory = [...memoryHistory, memoryUsage].slice(-60);
      
      // Calculate average FPS
      const avgFps = newFpsHistory.reduce((sum, fps) => sum + fps, 0) / newFpsHistory.length;
      
      // Determine performance level based on metrics
      let newPerformanceLevel: PerformanceLevel = 'high';
      if (avgFps < 30) {
        newPerformanceLevel = 'low';
      } else if (avgFps < 45) {
        newPerformanceLevel = 'medium';
      }
      
      // Memory pressure check
      if (memoryUsage > 512) { // More than 512MB
        newPerformanceLevel = newPerformanceLevel === 'high' ? 'medium' : 'low';
      }
      
      set({
        fps: currentFps,
        memoryUsage,
        fpsHistory: newFpsHistory,
        memoryHistory: newMemoryHistory,
        performanceLevel: newPerformanceLevel,
        shouldThrottle: newPerformanceLevel === 'low',
        shouldReduceParticles: newPerformanceLevel !== 'high'
      });
    },

    setPerformanceLevel: (level) => {
      set({
        performanceLevel: level,
        shouldThrottle: level === 'low',
        shouldReduceParticles: level !== 'high'
      });
      console.log(`Performance level manually set to: ${level}`);
    },

    getPerformanceRecommendations: () => {
      const { fps, memoryUsage, performanceLevel } = get();
      const recommendations: string[] = [];
      
      if (fps < 30) {
        recommendations.push("Consider reducing graphics quality");
        recommendations.push("Close other browser tabs");
      }
      
      if (memoryUsage > 400) {
        recommendations.push("High memory usage detected");
        recommendations.push("Restart game if performance degrades");
      }
      
      if (performanceLevel === 'low') {
        recommendations.push("Enable battery saver mode");
        recommendations.push("Reduce particle effects");
      }
      
      return recommendations;
    }
  }))
);
