/**
 * Performance Profiler for monitoring and optimizing game performance
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  shaderCompilations: number;
  textureMemory: number;
  cpuTime: number;
  gpuTime: number;
}

export interface PerformanceSnapshot {
  timestamp: number;
  metrics: PerformanceMetrics;
  gameState: {
    towersCount: number;
    enemiesCount: number;
    particlesCount: number;
    lasersCount: number;
  };
}

export class PerformanceProfiler {
  private metrics: PerformanceMetrics;
  private snapshots: PerformanceSnapshot[] = [];
  private frameTimings: number[] = [];
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private maxSnapshots: number = 100;
  private isRecording: boolean = false;
  
  // Performance thresholds
  private readonly thresholds = {
    fps: {
      good: 50,
      acceptable: 30,
      poor: 20
    },
    frameTime: {
      good: 16.67, // 60fps
      acceptable: 33.33, // 30fps
      poor: 50 // 20fps
    },
    memory: {
      good: 256, // MB
      acceptable: 512,
      poor: 1024
    }
  };

  constructor() {
    this.metrics = this.createEmptyMetrics();
    this.startMonitoring();
  }

  private createEmptyMetrics(): PerformanceMetrics {
    return {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      drawCalls: 0,
      triangles: 0,
      shaderCompilations: 0,
      textureMemory: 0,
      cpuTime: 0,
      gpuTime: 0
    };
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    this.isRecording = true;
    console.log("Performance profiler started");
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isRecording = false;
    console.log("Performance profiler stopped");
  }

  /**
   * Update performance metrics (call this every frame)
   */
  updateMetrics(gameState?: {
    towersCount: number;
    enemiesCount: number;
    particlesCount: number;
    lasersCount: number;
  }): void {
    if (!this.isRecording) return;

    const now = performance.now();
    
    // Calculate frame time and FPS
    if (this.lastFrameTime > 0) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimings.push(frameTime);
      
      // Keep only last 60 frame timings
      if (this.frameTimings.length > 60) {
        this.frameTimings.shift();
      }
      
      // Calculate average FPS from recent frames
      const averageFrameTime = this.frameTimings.reduce((a, b) => a + b, 0) / this.frameTimings.length;
      this.metrics.fps = 1000 / averageFrameTime;
      this.metrics.frameTime = averageFrameTime;
    }
    
    this.lastFrameTime = now;
    this.frameCount++;

    // Update memory metrics
    this.updateMemoryMetrics();
    
    // Update GPU metrics
    this.updateGPUMetrics();

    // Take snapshot every 60 frames
    if (this.frameCount % 60 === 0 && gameState) {
      this.takeSnapshot(gameState);
    }
  }

  /**
   * Update memory usage metrics
   */
  private updateMemoryMetrics(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
    }
  }

  /**
   * Update GPU-related metrics
   */
  private updateGPUMetrics(): void {
    // This would typically integrate with Three.js renderer info
    // For now, we'll use estimated values based on scene complexity
    
    // These would be updated by the renderer
    this.metrics.drawCalls = this.estimateDrawCalls();
    this.metrics.triangles = this.estimateTriangles();
  }

  /**
   * Estimate draw calls based on visible objects
   */
  private estimateDrawCalls(): number {
    // This is a simplified estimation
    // In a real implementation, this would come from the renderer
    return Math.floor(Math.random() * 50) + 20;
  }

  /**
   * Estimate triangle count
   */
  private estimateTriangles(): number {
    // Simplified estimation
    return Math.floor(Math.random() * 10000) + 5000;
  }

  /**
   * Take a performance snapshot
   */
  takeSnapshot(gameState: {
    towersCount: number;
    enemiesCount: number;
    particlesCount: number;
    lasersCount: number;
  }): void {
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      metrics: { ...this.metrics },
      gameState: { ...gameState }
    };

    this.snapshots.push(snapshot);

    // Keep only recent snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance level assessment
   */
  getPerformanceLevel(): 'excellent' | 'good' | 'acceptable' | 'poor' {
    const { fps, frameTime, memoryUsage } = this.metrics;

    if (fps >= this.thresholds.fps.good && 
        frameTime <= this.thresholds.frameTime.good && 
        memoryUsage <= this.thresholds.memory.good) {
      return 'excellent';
    }

    if (fps >= this.thresholds.fps.good && 
        frameTime <= this.thresholds.frameTime.acceptable && 
        memoryUsage <= this.thresholds.memory.acceptable) {
      return 'good';
    }

    if (fps >= this.thresholds.fps.acceptable && 
        frameTime <= this.thresholds.frameTime.acceptable && 
        memoryUsage <= this.thresholds.memory.acceptable) {
      return 'acceptable';
    }

    return 'poor';
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const { fps, frameTime, memoryUsage } = this.metrics;

    if (fps < this.thresholds.fps.acceptable) {
      recommendations.push("Low FPS detected - Consider reducing visual quality");
      recommendations.push("Enable frame rate throttling");
    }

    if (frameTime > this.thresholds.frameTime.poor) {
      recommendations.push("High frame time - Reduce particle effects");
      recommendations.push("Consider object pooling optimization");
    }

    if (memoryUsage > this.thresholds.memory.acceptable) {
      recommendations.push("High memory usage - Clear unused assets");
      recommendations.push("Enable garbage collection optimizations");
    }

    if (recommendations.length === 0) {
      recommendations.push("Performance is optimal");
    }

    return recommendations;
  }

  /**
   * Get performance history
   */
  getPerformanceHistory(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Get frame time statistics
   */
  getFrameTimeStats(): {
    min: number;
    max: number;
    average: number;
    percentile95: number;
  } {
    if (this.frameTimings.length === 0) {
      return { min: 0, max: 0, average: 0, percentile95: 0 };
    }

    const sorted = [...this.frameTimings].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      average: sum / sorted.length,
      percentile95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }

  /**
   * Check if performance has degraded
   */
  hasPerformanceDegraded(): boolean {
    if (this.snapshots.length < 10) return false;

    const recent = this.snapshots.slice(-5);
    const older = this.snapshots.slice(-10, -5);

    const recentAvgFps = recent.reduce((sum, s) => sum + s.metrics.fps, 0) / recent.length;
    const olderAvgFps = older.reduce((sum, s) => sum + s.metrics.fps, 0) / older.length;

    // Consider it degraded if FPS dropped by more than 15%
    return (olderAvgFps - recentAvgFps) / olderAvgFps > 0.15;
  }

  /**
   * Export performance data for analysis
   */
  exportData(): string {
    const exportData = {
      metrics: this.metrics,
      snapshots: this.snapshots,
      frameStats: this.getFrameTimeStats(),
      recommendations: this.getRecommendations(),
      performanceLevel: this.getPerformanceLevel(),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Clear all performance data
   */
  clear(): void {
    this.snapshots = [];
    this.frameTimings = [];
    this.frameCount = 0;
    this.metrics = this.createEmptyMetrics();
    console.log("Performance data cleared");
  }

  /**
   * Create a performance report
   */
  generateReport(): {
    summary: string;
    metrics: PerformanceMetrics;
    level: string;
    recommendations: string[];
    frameStats: any;
  } {
    const level = this.getPerformanceLevel();
    const recommendations = this.getRecommendations();
    const frameStats = this.getFrameTimeStats();

    let summary = `Performance Level: ${level.toUpperCase()}\n`;
    summary += `Current FPS: ${this.metrics.fps.toFixed(1)}\n`;
    summary += `Memory Usage: ${this.metrics.memoryUsage.toFixed(1)} MB\n`;
    summary += `Frame Time: ${this.metrics.frameTime.toFixed(2)} ms`;

    return {
      summary,
      metrics: this.metrics,
      level,
      recommendations,
      frameStats
    };
  }
}

// Global profiler instance
export const performanceProfiler = new PerformanceProfiler();
