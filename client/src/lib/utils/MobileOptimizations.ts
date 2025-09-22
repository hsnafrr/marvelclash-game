/**
 * Mobile optimization utilities for performance improvements
 */
export class MobileOptimizations {
  private static isMobile: boolean | null = null;
  private static isLowEndDeviceCache: boolean | null = null;
  private static batteryLevel: number | null = null;
  private static isCharging: boolean | null = null;

  /**
   * Detect if running on mobile device
   */
  static isMobileDevice(): boolean {
    if (this.isMobile !== null) {
      return this.isMobile;
    }

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    this.isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) ||
                    ('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    window.innerWidth <= 768;

    return this.isMobile;
  }

  /**
   * Detect if device has limited resources
   */
  static async isLowEndDevice(): Promise<boolean> {
    if (this.isLowEndDeviceCache !== null) {
      return this.isLowEndDeviceCache;
    }

    try {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 1;
      
      // Check memory if available
      const memory = (navigator as any).deviceMemory || 4;
      
      // Check GPU info
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      let isLowEndGPU = false;
      
      if (gl) {
        const renderer = gl.getParameter(gl.RENDERER).toLowerCase();
        const vendor = gl.getParameter(gl.VENDOR).toLowerCase();
        
        // Check for known low-end GPU indicators
        isLowEndGPU = renderer.includes('mali-400') ||
                      renderer.includes('adreno 3') ||
                      renderer.includes('adreno 4') ||
                      renderer.includes('powervr sgx') ||
                      (vendor.includes('arm') && !renderer.includes('mali-g'));
      }

      // Determine if low-end based on multiple factors
      this.isLowEndDeviceCache = cores <= 2 || memory <= 3 || isLowEndGPU || this.isMobileDevice();
      
      console.log(`Device classification: ${this.isLowEndDeviceCache ? 'Low-end' : 'High-end'}`);
      console.log(`Cores: ${cores}, Memory: ${memory}GB, Mobile: ${this.isMobileDevice()}`);
      
      return this.isLowEndDeviceCache;
      
    } catch (error) {
      console.warn("Could not determine device capabilities:", error);
      this.isLowEndDeviceCache = this.isMobileDevice(); // Fallback to mobile detection
      return this.isLowEndDeviceCache;
    }
  }

  /**
   * Get battery information if available
   */
  static async getBatteryInfo(): Promise<{ level: number; charging: boolean } | null> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        this.batteryLevel = battery.level;
        this.isCharging = battery.charging;
        
        return {
          level: battery.level,
          charging: battery.charging
        };
      }
    } catch (error) {
      console.warn("Battery API not available:", error);
    }
    
    return null;
  }

  /**
   * Check if device is in power save mode
   */
  static shouldUsePowerSaveMode(): boolean {
    // Battery level below 20% and not charging
    if (this.batteryLevel !== null && this.isCharging !== null) {
      return this.batteryLevel < 0.2 && !this.isCharging;
    }
    
    // Check for reduced motion preference (often indicates power saving)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return prefersReducedMotion;
  }

  /**
   * Get optimal frame rate for device
   */
  static getOptimalFrameRate(): number {
    if (this.shouldUsePowerSaveMode()) {
      return 30;
    }
    
    if (this.isLowEndDeviceCache) {
      return 45;
    }
    
    return 60;
  }

  /**
   * Get optimal particle count for device
   */
  static getOptimalParticleCount(): number {
    if (this.shouldUsePowerSaveMode()) {
      return 50;
    }
    
    if (this.isLowEndDeviceCache) {
      return 200;
    }
    
    return 500;
  }

  /**
   * Get optimal shadow quality
   */
  static getOptimalShadowQuality(): 'high' | 'medium' | 'low' | 'off' {
    if (this.shouldUsePowerSaveMode()) {
      return 'off';
    }
    
    if (this.isLowEndDeviceCache) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Check if should use reduced visual effects
   */
  static shouldReduceVisualEffects(): boolean {
    return this.shouldUsePowerSaveMode() || this.isLowEndDeviceCache === true;
  }

  /**
   * Throttle function calls based on device performance
   */
  static createThrottledFunction<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return ((...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    }) as T;
  }

  /**
   * Debounce function calls for mobile optimization
   */
  static createDebouncedFunction<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  }

  /**
   * Monitor performance and adjust settings dynamically
   */
  static createPerformanceMonitor() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    return {
      update: () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
          
          // Auto-adjust quality based on FPS
          if (fps < 30) {
            console.log("Low FPS detected, reducing quality");
            return 'reduce_quality';
          } else if (fps > 55) {
            console.log("High FPS detected, can increase quality");
            return 'increase_quality';
          }
        }
        
        return 'maintain_quality';
      },
      getFPS: () => fps
    };
  }

  /**
   * Create touch-optimized controls for mobile
   */
  static createTouchControls(canvas: HTMLCanvasElement) {
    const touchData = {
      isPressed: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    };

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchData.isPressed = true;
      touchData.startX = touch.clientX;
      touchData.startY = touch.clientY;
      touchData.currentX = touch.clientX;
      touchData.currentY = touch.clientY;
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (touchData.isPressed) {
        const touch = e.touches[0];
        touchData.currentX = touch.clientX;
        touchData.currentY = touch.clientY;
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      touchData.isPressed = false;
    }, { passive: false });

    return touchData;
  }
}
