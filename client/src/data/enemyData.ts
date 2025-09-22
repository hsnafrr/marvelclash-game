import * as THREE from "three";

/**
 * Enemy type definitions and configurations
 */
export interface EnemyTemplate {
  name: string;
  health: number;
  maxHealth: number;
  speed: number;
  reward: number;
  size: number;
  color: string;
  armor: number;
  resistances?: {
    physical?: number;
    magical?: number;
    freeze?: number;
  };
  abilities?: string[];
  description: string;
}

export const enemyTemplates: Record<string, EnemyTemplate> = {
  normal: {
    name: "Scout",
    health: 100,
    maxHealth: 100,
    speed: 0.02,
    reward: 10,
    size: 1,
    color: "#ff4444",
    armor: 0,
    description: "Basic enemy unit. Fast and weak, but comes in large numbers."
  },

  fast: {
    name: "Runner", 
    health: 60,
    maxHealth: 60,
    speed: 0.04,
    reward: 15,
    size: 0.8,
    color: "#ff8800",
    armor: 0,
    resistances: {
      freeze: 0.5 // 50% resistance to freeze effects
    },
    description: "Quick enemy that rushes past defenses. Hard to hit but fragile."
  },

  heavy: {
    name: "Tank",
    health: 200,
    maxHealth: 200,
    speed: 0.01,
    reward: 25,
    size: 1.5,
    color: "#004400",
    armor: 5,
    resistances: {
      physical: 0.2 // 20% physical damage reduction
    },
    description: "Heavily armored unit. Slow but can absorb massive amounts of damage."
  },

  armored: {
    name: "Knight",
    health: 150,
    maxHealth: 150,
    speed: 0.015,
    reward: 30,
    size: 1.2,
    color: "#666666",
    armor: 10,
    resistances: {
      physical: 0.3,
      magical: 0.1
    },
    description: "Well-balanced enemy with good armor and reasonable speed."
  },

  flying: {
    name: "Drone",
    health: 80,
    maxHealth: 80,
    speed: 0.025,
    reward: 20,
    size: 0.9,
    color: "#0088ff",
    armor: 0,
    abilities: ["flying"],
    description: "Aerial unit that can only be targeted by anti-air towers."
  },

  stealth: {
    name: "Shadow",
    health: 90,
    maxHealth: 90,
    speed: 0.022,
    reward: 35,
    size: 1,
    color: "#330066",
    armor: 0,
    abilities: ["stealth"],
    description: "Cloaked enemy that becomes invisible periodically."
  },

  regenerating: {
    name: "Healer",
    health: 120,
    maxHealth: 120,
    speed: 0.018,
    reward: 40,
    size: 1.1,
    color: "#00aa44",
    armor: 2,
    abilities: ["regeneration"],
    description: "Slowly regenerates health over time. Must be killed quickly."
  },

  explosive: {
    name: "Bomber",
    health: 70,
    maxHealth: 70,
    speed: 0.03,
    reward: 25,
    size: 1,
    color: "#aa4400",
    armor: 0,
    abilities: ["explosive_death"],
    description: "Explodes when killed, damaging nearby towers."
  },

  spawner: {
    name: "Mother",
    health: 180,
    maxHealth: 180,
    speed: 0.012,
    reward: 50,
    size: 1.6,
    color: "#880088",
    armor: 3,
    abilities: ["spawn_minions"],
    description: "Spawns smaller enemies as it takes damage."
  },

  boss: {
    name: "Overlord",
    health: 500,
    maxHealth: 500,
    speed: 0.015,
    reward: 100,
    size: 2,
    color: "#800080",
    armor: 15,
    resistances: {
      physical: 0.4,
      magical: 0.3,
      freeze: 0.8
    },
    abilities: ["shield", "regeneration", "area_damage"],
    description: "Massive boss enemy with multiple abilities and high resistance to damage."
  },

  berserker: {
    name: "Berserker",
    health: 140,
    maxHealth: 140,
    speed: 0.016,
    reward: 45,
    size: 1.3,
    color: "#cc0000",
    armor: 3,
    abilities: ["rage"],
    description: "Gets faster and stronger as it takes damage."
  },

  shielded: {
    name: "Guardian",
    health: 100,
    maxHealth: 100,
    speed: 0.02,
    reward: 35,
    size: 1.1,
    color: "#0066cc",
    armor: 0,
    abilities: ["energy_shield"],
    description: "Protected by an energy shield that must be depleted first."
  },

  ghost: {
    name: "Phantom",
    health: 85,
    maxHealth: 85,
    speed: 0.024,
    reward: 40,
    size: 1,
    color: "#cccccc",
    armor: 0,
    abilities: ["phase_through"],
    description: "Can phase through towers, ignoring some defenses."
  },

  elite: {
    name: "Elite Warrior",
    health: 300,
    maxHealth: 300,
    speed: 0.018,
    reward: 75,
    size: 1.4,
    color: "#ffaa00",
    armor: 8,
    resistances: {
      physical: 0.25,
      magical: 0.15
    },
    abilities: ["leadership"],
    description: "Veteran enemy that boosts nearby allies."
  },

  swarm: {
    name: "Swarmling",
    health: 30,
    maxHealth: 30,
    speed: 0.035,
    reward: 5,
    size: 0.6,
    color: "#444444",
    armor: 0,
    abilities: ["swarm_behavior"],
    description: "Weak individual unit but appears in large groups."
  }
};

/**
 * Wave composition templates
 */
export const waveTemplates = {
  early: {
    enemyTypes: ['normal', 'fast'],
    difficulty: 1,
    specialChance: 0.1
  },
  
  mid: {
    enemyTypes: ['normal', 'fast', 'heavy', 'armored'],
    difficulty: 1.5,
    specialChance: 0.2
  },
  
  late: {
    enemyTypes: ['heavy', 'armored', 'flying', 'regenerating'],
    difficulty: 2,
    specialChance: 0.3
  },
  
  boss: {
    enemyTypes: ['boss', 'elite', 'shielded'],
    difficulty: 3,
    specialChance: 0.5
  },
  
  swarm: {
    enemyTypes: ['swarm', 'normal', 'fast'],
    difficulty: 1.2,
    specialChance: 0.15
  },
  
  mixed: {
    enemyTypes: ['normal', 'fast', 'heavy', 'armored', 'flying'],
    difficulty: 1.8,
    specialChance: 0.25
  }
};

/**
 * Enemy behavior patterns
 */
export const enemyBehaviors = {
  // Basic linear movement
  linear: {
    calculatePosition: (progress: number) => {
      const z = -25 + (progress * 50);
      return new THREE.Vector3(0, 1, z);
    }
  },
  
  // Zigzag movement pattern
  zigzag: {
    calculatePosition: (progress: number) => {
      const z = -25 + (progress * 50);
      const x = Math.sin(progress * Math.PI * 4) * 3;
      return new THREE.Vector3(x, 1, z);
    }
  },
  
  // Circular movement pattern
  circular: {
    calculatePosition: (progress: number) => {
      const angle = progress * Math.PI * 2;
      const radius = 5;
      const z = -25 + (progress * 50);
      const x = Math.cos(angle) * radius;
      return new THREE.Vector3(x, 1, z);
    }
  },
  
  // Random walk pattern
  random: {
    calculatePosition: (progress: number, randomSeed: number = 0) => {
      const z = -25 + (progress * 50);
      const noise = (Math.sin(randomSeed + progress * 10) + Math.cos(randomSeed * 2 + progress * 8)) * 2;
      const x = Math.max(-4, Math.min(4, noise));
      return new THREE.Vector3(x, 1, z);
    }
  }
};

/**
 * Create enemy with scaling based on wave number
 */
export function createScaledEnemy(
  type: keyof typeof enemyTemplates, 
  waveNumber: number,
  difficultyMultiplier: number = 1.2
): EnemyTemplate {
  const template = enemyTemplates[type];
  const scaling = Math.pow(difficultyMultiplier, waveNumber - 1);
  
  return {
    ...template,
    health: Math.round(template.health * scaling),
    maxHealth: Math.round(template.maxHealth * scaling),
    reward: Math.round(template.reward * Math.sqrt(scaling)), // Reward scales slower
    armor: template.armor + Math.floor((waveNumber - 1) / 3) // Armor increases every 3 waves
  };
}

/**
 * Generate wave composition based on wave number
 */
export function generateWaveComposition(waveNumber: number): {
  enemies: Array<{
    type: keyof typeof enemyTemplates;
    count: number;
    interval: number;
  }>;
  template: keyof typeof waveTemplates;
} {
  let template: keyof typeof waveTemplates;
  
  // Determine wave template based on wave number
  if (waveNumber <= 3) {
    template = 'early';
  } else if (waveNumber <= 6) {
    template = 'mid';
  } else if (waveNumber === 10 || waveNumber % 5 === 0) {
    template = 'boss';
  } else if (waveNumber % 4 === 0) {
    template = 'swarm';
  } else if (waveNumber <= 8) {
    template = 'late';
  } else {
    template = 'mixed';
  }
  
  const waveTemplate = waveTemplates[template];
  const enemies: Array<{
    type: keyof typeof enemyTemplates;
    count: number;
    interval: number;
  }> = [];
  
  // Generate enemy composition
  const enemyCount = Math.floor(8 + waveNumber * 1.5);
  const remainingEnemies = enemyCount;
  
  waveTemplate.enemyTypes.forEach((enemyType, index) => {
    const isLast = index === waveTemplate.enemyTypes.length - 1;
    const baseCount = isLast ? remainingEnemies : Math.floor(enemyCount / waveTemplate.enemyTypes.length);
    const count = Math.max(1, Math.floor(baseCount * (0.8 + Math.random() * 0.4)));
    
    enemies.push({
      type: enemyType as keyof typeof enemyTemplates,
      count,
      interval: 1 + Math.random() * 2 // Random interval between 1-3 seconds
    });
  });
  
  return { enemies, template };
}

/**
 * Get enemy color based on health percentage
 */
export function getEnemyHealthColor(healthPercent: number): string {
  if (healthPercent > 0.7) return '#44ff44';
  if (healthPercent > 0.4) return '#ffff44';
  if (healthPercent > 0.2) return '#ff8844';
  return '#ff4444';
}

/**
 * Calculate damage reduction from armor
 */
export function calculateArmorReduction(damage: number, armor: number): number {
  // Armor reduces damage by a percentage, with diminishing returns
  const reduction = armor / (armor + 100);
  return Math.max(1, damage * (1 - reduction));
}

/**
 * Apply resistance to damage
 */
export function applyResistance(
  damage: number, 
  damageType: 'physical' | 'magical' | 'freeze',
  resistances?: Record<string, number>
): number {
  if (!resistances || !resistances[damageType]) {
    return damage;
  }
  
  return damage * (1 - resistances[damageType]);
}
