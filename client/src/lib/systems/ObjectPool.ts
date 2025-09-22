/**
 * Generic Object Pool for efficient memory management
 * Prevents garbage collection spikes by reusing objects
 */
export class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private factory: () => T;
  private reset?: (obj: T) => void;
  private maxSize: number;

  constructor(
    factory: () => T,
    maxSize: number = 100,
    reset?: (obj: T) => void
  ) {
    this.factory = factory;
    this.maxSize = maxSize;
    this.reset = reset;
    
    // Pre-populate pool with initial objects
    for (let i = 0; i < Math.min(10, maxSize); i++) {
      this.available.push(this.factory());
    }
    
    console.log(`Object pool initialized with capacity: ${maxSize}`);
  }

  /**
   * Acquire an object from the pool
   */
  acquire(): T {
    let obj: T;
    
    if (this.available.length > 0) {
      obj = this.available.pop()!;
    } else {
      obj = this.factory();
      console.log("Object pool created new object (pool was empty)");
    }
    
    this.inUse.add(obj);
    return obj;
  }

  /**
   * Release an object back to the pool
   */
  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      console.warn("Attempting to release object not in use");
      return;
    }
    
    this.inUse.delete(obj);
    
    // Reset object state if reset function provided
    if (this.reset) {
      this.reset(obj);
    }
    
    // Only keep objects if under max size
    if (this.available.length < this.maxSize) {
      this.available.push(obj);
    }
  }

  /**
   * Release all objects back to the pool
   */
  releaseAll(): void {
    this.inUse.forEach(obj => {
      if (this.reset) {
        this.reset(obj);
      }
      
      if (this.available.length < this.maxSize) {
        this.available.push(obj);
      }
    });
    
    this.inUse.clear();
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
      maxSize: this.maxSize
    };
  }

  /**
   * Clear the entire pool
   */
  clear(): void {
    this.available.length = 0;
    this.inUse.clear();
  }
}

// Specialized pools for common game objects
export class LaserPool extends ObjectPool<any> {
  constructor(maxSize: number = 50) {
    super(
      () => ({
        id: '',
        start: { x: 0, y: 0, z: 0 },
        end: { x: 0, y: 0, z: 0 },
        color: '#ff0000',
        damage: 0,
        lifetime: 0,
        active: false
      }),
      maxSize,
      (laser) => {
        laser.id = '';
        laser.start.x = laser.start.y = laser.start.z = 0;
        laser.end.x = laser.end.y = laser.end.z = 0;
        laser.damage = 0;
        laser.lifetime = 0;
        laser.active = false;
      }
    );
  }
}

export class ParticlePool extends ObjectPool<any> {
  constructor(maxSize: number = 200) {
    super(
      () => ({
        id: '',
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        color: '#ffffff',
        size: 1,
        lifetime: 0,
        maxLifetime: 1,
        active: false
      }),
      maxSize,
      (particle) => {
        particle.id = '';
        particle.position.x = particle.position.y = particle.position.z = 0;
        particle.velocity.x = particle.velocity.y = particle.velocity.z = 0;
        particle.color = '#ffffff';
        particle.size = 1;
        particle.lifetime = 0;
        particle.maxLifetime = 1;
        particle.active = false;
      }
    );
  }
}
