import * as THREE from "three";

export interface TargetableEntity {
  id: string;
  position: THREE.Vector3;
  health?: number;
  maxHealth?: number;
}

export interface TargetingEntity {
  id: string;
  position: THREE.Vector3;
  range: number;
  currentTargetId?: string | null;
}

export type TargetingStrategy = 'closest' | 'weakest' | 'strongest' | 'first' | 'last';

/**
 * Advanced targeting system for tower defense gameplay
 */
export class TargetingSystem {
  private targetingStrategy: TargetingStrategy = 'closest';
  private targetCache: Map<string, string | null> = new Map();
  private lastUpdateTime: number = 0;
  private cacheUpdateInterval: number = 100; // Update cache every 100ms

  constructor(strategy: TargetingStrategy = 'closest') {
    this.targetingStrategy = strategy;
  }

  /**
   * Find the best target for a given entity
   */
  findBestTarget(
    entity: TargetingEntity, 
    potentialTargets: TargetableEntity[]
  ): string | null {
    const now = Date.now();
    const cacheKey = entity.id;
    
    // Check if we can use cached result
    if (now - this.lastUpdateTime < this.cacheUpdateInterval && this.targetCache.has(cacheKey)) {
      const cachedTarget = this.targetCache.get(cacheKey);
      
      // Validate cached target still exists and is in range
      if (cachedTarget) {
        const target = potentialTargets.find(t => t.id === cachedTarget);
        if (target && this.isInRange(entity, target)) {
          return cachedTarget;
        }
      }
    }

    // Find targets in range
    const targetsInRange = potentialTargets.filter(target => 
      this.isInRange(entity, target)
    );

    if (targetsInRange.length === 0) {
      this.targetCache.set(cacheKey, null);
      return null;
    }

    // Apply targeting strategy
    let bestTarget: TargetableEntity | null = null;

    switch (this.targetingStrategy) {
      case 'closest':
        bestTarget = this.findClosestTarget(entity, targetsInRange);
        break;
      case 'weakest':
        bestTarget = this.findWeakestTarget(targetsInRange);
        break;
      case 'strongest':
        bestTarget = this.findStrongestTarget(targetsInRange);
        break;
      case 'first':
        bestTarget = targetsInRange[0];
        break;
      case 'last':
        bestTarget = targetsInRange[targetsInRange.length - 1];
        break;
      default:
        bestTarget = this.findClosestTarget(entity, targetsInRange);
    }

    const result = bestTarget ? bestTarget.id : null;
    this.targetCache.set(cacheKey, result);
    
    if (now - this.lastUpdateTime >= this.cacheUpdateInterval) {
      this.lastUpdateTime = now;
    }

    return result;
  }

  /**
   * Check if target is within range
   */
  isInRange(entity: TargetingEntity, target: TargetableEntity): boolean {
    const distance = this.getDistance(entity.position, target.position);
    return distance <= entity.range;
  }

  /**
   * Calculate distance between two positions
   */
  getDistance(pos1: THREE.Vector3, pos2: THREE.Vector3): number {
    return pos1.distanceTo(pos2);
  }

  /**
   * Find the closest target
   */
  private findClosestTarget(
    entity: TargetingEntity, 
    targets: TargetableEntity[]
  ): TargetableEntity | null {
    let closest: TargetableEntity | null = null;
    let minDistance = Infinity;

    targets.forEach(target => {
      const distance = this.getDistance(entity.position, target.position);
      if (distance < minDistance) {
        minDistance = distance;
        closest = target;
      }
    });

    return closest;
  }

  /**
   * Find the target with lowest health
   */
  private findWeakestTarget(targets: TargetableEntity[]): TargetableEntity | null {
    let weakest: TargetableEntity | null = null;
    let minHealth = Infinity;

    targets.forEach(target => {
      if (target.health !== undefined && target.health < minHealth) {
        minHealth = target.health;
        weakest = target;
      }
    });

    return weakest || targets[0];
  }

  /**
   * Find the target with highest health
   */
  private findStrongestTarget(targets: TargetableEntity[]): TargetableEntity | null {
    let strongest: TargetableEntity | null = null;
    let maxHealth = 0;

    targets.forEach(target => {
      if (target.health !== undefined && target.health > maxHealth) {
        maxHealth = target.health;
        strongest = target;
      }
    });

    return strongest || targets[0];
  }

  /**
   * Validate that a target is still valid
   */
  validateTarget(
    entity: TargetingEntity, 
    targetId: string, 
    potentialTargets: TargetableEntity[]
  ): boolean {
    const target = potentialTargets.find(t => t.id === targetId);
    
    if (!target) {
      // Target no longer exists
      this.targetCache.delete(entity.id);
      return false;
    }

    if (!this.isInRange(entity, target)) {
      // Target out of range
      this.targetCache.delete(entity.id);
      return false;
    }

    return true;
  }

  /**
   * Set targeting strategy
   */
  setTargetingStrategy(strategy: TargetingStrategy): void {
    this.targetingStrategy = strategy;
    this.clearCache(); // Clear cache when strategy changes
  }

  /**
   * Get current targeting strategy
   */
  getTargetingStrategy(): TargetingStrategy {
    return this.targetingStrategy;
  }

  /**
   * Clear targeting cache
   */
  clearCache(): void {
    this.targetCache.clear();
    console.log("Targeting cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.targetCache.size,
      strategy: this.targetingStrategy,
      lastUpdate: this.lastUpdateTime
    };
  }

  /**
   * Predict where a moving target will be
   */
  predictTargetPosition(
    target: TargetableEntity & { velocity?: THREE.Vector3 }, 
    timeAhead: number
  ): THREE.Vector3 {
    if (!target.velocity) {
      return target.position.clone();
    }

    const predicted = target.position.clone();
    predicted.add(target.velocity.clone().multiplyScalar(timeAhead));
    return predicted;
  }

  /**
   * Calculate optimal firing solution for moving targets
   */
  calculateFiringSolution(
    shooterPos: THREE.Vector3,
    target: TargetableEntity & { velocity?: THREE.Vector3 },
    projectileSpeed: number
  ): THREE.Vector3 | null {
    if (!target.velocity) {
      return target.position.clone();
    }

    const targetPos = target.position.clone();
    const targetVel = target.velocity.clone();
    const relativePos = targetPos.sub(shooterPos);

    // Solve quadratic equation for interception
    const a = targetVel.lengthSq() - projectileSpeed * projectileSpeed;
    const b = 2 * targetVel.dot(relativePos);
    const c = relativePos.lengthSq();

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      // No interception possible
      return target.position.clone();
    }

    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    const t = Math.min(t1, t2);

    if (t < 0) {
      // Target moving away, use current position
      return target.position.clone();
    }

    return this.predictTargetPosition(target, t);
  }
}
