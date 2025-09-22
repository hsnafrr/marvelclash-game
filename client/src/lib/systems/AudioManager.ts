/**
 * Advanced Audio Manager with pooling and performance optimizations
 */
export class AudioManager {
  private soundPools: Map<string, HTMLAudioElement[]> = new Map();
  private backgroundMusic: HTMLAudioElement | null = null;
  private volume: number = 0.7;
  private muted: boolean = false;
  private maxPoolSize: number = 5;
  private audioContext: AudioContext | null = null;
  
  async initialize(): Promise<void> {
    try {
      // Initialize Web Audio API context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Load and prepare sound effects
      await this.loadSounds();
      
      console.log("Audio Manager initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Audio Manager:", error);
      throw error;
    }
  }

  private async loadSounds(): Promise<void> {
    const soundFiles = [
      { name: 'background', url: '/sounds/background.mp3' },
      { name: 'hit', url: '/sounds/hit.mp3' },
      { name: 'success', url: '/sounds/success.mp3' }
    ];

    const loadPromises = soundFiles.map(async ({ name, url }) => {
      try {
        const pool: HTMLAudioElement[] = [];
        
        // Create multiple instances for pooling
        for (let i = 0; i < this.maxPoolSize; i++) {
          const audio = new Audio(url);
          audio.preload = 'auto';
          audio.volume = this.volume;
          
          // Wait for audio to be ready
          await new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', resolve);
            audio.addEventListener('error', reject);
            audio.load();
          });
          
          pool.push(audio);
        }
        
        this.soundPools.set(name, pool);
        console.log(`Loaded sound: ${name} with ${pool.length} instances`);
        
        // Set background music reference
        if (name === 'background') {
          this.backgroundMusic = pool[0];
          this.backgroundMusic.loop = true;
        }
        
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    });

    await Promise.allSettled(loadPromises);
  }

  playSound(soundName: string, volume: number = 1): void {
    if (this.muted) return;
    
    const pool = this.soundPools.get(soundName);
    if (!pool || pool.length === 0) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }
    
    // Find an available audio instance
    let availableAudio = pool.find(audio => audio.paused || audio.ended);
    
    if (!availableAudio) {
      // If all instances are playing, use the first one
      availableAudio = pool[0];
      availableAudio.currentTime = 0;
    }
    
    try {
      availableAudio.volume = Math.min(1, this.volume * volume);
      availableAudio.currentTime = 0;
      availableAudio.play().catch(error => {
        console.warn(`Failed to play sound: ${soundName}`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${soundName}`, error);
    }
  }

  playBackgroundMusic(): void {
    if (this.muted || !this.backgroundMusic) return;
    
    try {
      this.backgroundMusic.volume = this.volume * 0.3; // Lower volume for background
      this.backgroundMusic.play().catch(error => {
        console.warn("Failed to play background music:", error);
      });
    } catch (error) {
      console.warn("Error playing background music:", error);
    }
  }

  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update volume for all audio instances
    this.soundPools.forEach(pool => {
      pool.forEach(audio => {
        audio.volume = this.volume;
      });
    });
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.3;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    
    if (muted) {
      // Stop all currently playing sounds
      this.soundPools.forEach(pool => {
        pool.forEach(audio => {
          if (!audio.paused) {
            audio.pause();
          }
        });
      });
      
      this.stopBackgroundMusic();
    }
  }

  // Cleanup method for memory management
  dispose(): void {
    this.stopBackgroundMusic();
    
    this.soundPools.forEach(pool => {
      pool.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    });
    
    this.soundPools.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    console.log("Audio Manager disposed");
  }

  // Get audio system statistics
  getStats() {
    const stats = {
      totalPools: this.soundPools.size,
      totalInstances: 0,
      playingInstances: 0,
      volume: this.volume,
      muted: this.muted
    };
    
    this.soundPools.forEach(pool => {
      stats.totalInstances += pool.length;
      stats.playingInstances += pool.filter(audio => !audio.paused).length;
    });
    
    return stats;
  }
}
