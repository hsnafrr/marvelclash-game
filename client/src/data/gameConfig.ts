/**
 * Game configuration and balance settings
 */
export const gameConfig = {
  // Game flow settings
  game: {
    initialLives: 20,
    initialMoney: 100,
    totalWaves: 10,
    waveTimeLimit: 30, // seconds
    difficultyScaling: 1.2, // multiplier per wave
  },

  // Tower configurations
  towers: {
    basic: {
      name: "Basic Tower",
      cost: 50,
      damage: 25,
      range: 8,
      fireRate: 2, // shots per second
      upgradeCost: 30,
      maxLevel: 5,
      levelMultiplier: 1.5,
    },
    laser: {
      name: "Laser Tower",
      cost: 100,
      damage: 40,
      range: 10,
      fireRate: 3,
      upgradeCost: 50,
      maxLevel: 5,
      levelMultiplier: 1.4,
    },
    missile: {
      name: "Missile Tower",
      cost: 150,
      damage: 80,
      range: 12,
      fireRate: 1,
      upgradeCost: 75,
      maxLevel: 5,
      levelMultiplier: 1.6,
      splashRadius: 3,
    },
    freeze: {
      name: "Freeze Tower",
      cost: 120,
      damage: 15,
      range: 6,
      fireRate: 1.5,
      upgradeCost: 60,
      maxLevel: 5,
      levelMultiplier: 1.3,
      slowEffect: 0.5, // 50% speed reduction
      slowDuration: 2, // seconds
    }
  },

  // Enemy configurations
  enemies: {
    normal: {
      name: "Normal Enemy",
      health: 100,
      speed: 0.02,
      reward: 10,
      size: 1,
      armor: 0,
    },
    fast: {
      name: "Fast Enemy",
      health: 60,
      speed: 0.04,
      reward: 15,
      size: 0.8,
      armor: 0,
    },
    heavy: {
      name: "Heavy Enemy",
      health: 200,
      speed: 0.01,
      reward: 25,
      size: 1.5,
      armor: 5, // damage reduction
    },
    armored: {
      name: "Armored Enemy",
      health: 150,
      speed: 0.015,
      reward: 30,
      size: 1.2,
      armor: 10,
    },
    boss: {
      name: "Boss Enemy",
      health: 500,
      speed: 0.015,
      reward: 100,
      size: 2,
      armor: 15,
      abilities: ["regeneration", "shield"],
    }
  },

  // Wave configurations
  waves: [
    { // Wave 1
      enemies: [
        { type: 'normal', count: 10, interval: 1.5 }
      ],
      bonus: 50
    },
    { // Wave 2
      enemies: [
        { type: 'normal', count: 8, interval: 1.2 },
        { type: 'fast', count: 3, interval: 2 }
      ],
      bonus: 60
    },
    { // Wave 3
      enemies: [
        { type: 'normal', count: 12, interval: 1 },
        { type: 'fast', count: 5, interval: 1.5 }
      ],
      bonus: 70
    },
    { // Wave 4
      enemies: [
        { type: 'normal', count: 10, interval: 1 },
        { type: 'fast', count: 4, interval: 1.5 },
        { type: 'heavy', count: 2, interval: 3 }
      ],
      bonus: 80
    },
    { // Wave 5
      enemies: [
        { type: 'normal', count: 15, interval: 0.8 },
        { type: 'fast', count: 6, interval: 1.2 },
        { type: 'heavy', count: 3, interval: 2.5 }
      ],
      bonus: 100
    },
    { // Wave 6
      enemies: [
        { type: 'normal', count: 12, interval: 0.8 },
        { type: 'fast', count: 8, interval: 1 },
        { type: 'heavy', count: 4, interval: 2 },
        { type: 'armored', count: 2, interval: 4 }
      ],
      bonus: 120
    },
    { // Wave 7
      enemies: [
        { type: 'normal', count: 20, interval: 0.6 },
        { type: 'fast', count: 10, interval: 0.8 },
        { type: 'heavy', count: 5, interval: 1.5 },
        { type: 'armored', count: 3, interval: 3 }
      ],
      bonus: 150
    },
    { // Wave 8
      enemies: [
        { type: 'fast', count: 15, interval: 0.7 },
        { type: 'heavy', count: 8, interval: 1.2 },
        { type: 'armored', count: 5, interval: 2 }
      ],
      bonus: 180
    },
    { // Wave 9
      enemies: [
        { type: 'normal', count: 25, interval: 0.5 },
        { type: 'fast', count: 12, interval: 0.6 },
        { type: 'heavy', count: 8, interval: 1 },
        { type: 'armored', count: 6, interval: 1.5 },
        { type: 'boss', count: 1, interval: 10 }
      ],
      bonus: 220
    },
    { // Wave 10 - Final Boss
      enemies: [
        { type: 'fast', count: 20, interval: 0.4 },
        { type: 'heavy', count: 10, interval: 0.8 },
        { type: 'armored', count: 8, interval: 1 },
        { type: 'boss', count: 3, interval: 5 }
      ],
      bonus: 300
    }
  ],

  // Card system settings
  cards: {
    maxHandSize: 7,
    drawCost: 10,
    discardReward: 5,
    upgradeCardChance: 0.1, // 10% chance for upgrade cards
    rareCardChance: 0.05, // 5% chance for rare cards
  },

  // Performance settings
  performance: {
    maxParticles: {
      high: 500,
      medium: 200,
      low: 50
    },
    maxLasers: {
      high: 100,
      medium: 50,
      low: 25
    },
    shadowQuality: {
      high: 2048,
      medium: 1024,
      low: 512,
      off: 0
    },
    targetFrameRate: {
      high: 60,
      medium: 45,
      low: 30
    }
  },

  // Audio settings
  audio: {
    maxSoundInstances: 5,
    backgroundMusicVolume: 0.3,
    soundEffectVolume: 0.7,
    sounds: {
      hit: '/sounds/hit.mp3',
      success: '/sounds/success.mp3',
      background: '/sounds/background.mp3'
    }
  },

  // Visual settings
  visuals: {
    laserBeamLifetime: 0.1,
    particleLifetime: 1.5,
    explosionSize: 2,
    towerRangeOpacity: 0.3,
    enemyHealthBarHeight: 0.3,
    colors: {
      laser: '#ff0000',
      missile: '#ff8800',
      freeze: '#00aaff',
      explosion: '#ff4444',
      hit: '#ffaa00',
      healthGood: '#44ff44',
      healthBad: '#ff4444'
    }
  },

  // Targeting settings
  targeting: {
    strategies: ['closest', 'weakest', 'strongest', 'first', 'last'] as const,
    defaultStrategy: 'closest' as const,
    predictiveAiming: true,
    leadTargetTime: 0.5 // seconds ahead to aim
  },

  // Path settings
  path: {
    width: 6,
    checkpoints: [
      { x: 0, z: -25 }, // spawn
      { x: 0, z: 0 },   // middle
      { x: 0, z: 25 }   // goal
    ]
  },

  // Scoring settings
  scoring: {
    enemyKillBase: 10,
    waveCompleteBonus: 100,
    noLifeLostBonus: 50,
    speedBonus: 25, // bonus for completing wave quickly
    accuracyBonus: 10, // bonus per % accuracy above 75%
  }
};

export type GameConfig = typeof gameConfig;
export type TowerType = keyof typeof gameConfig.towers;
export type EnemyType = keyof typeof gameConfig.enemies;
export type TargetingStrategy = typeof gameConfig.targeting.strategies[number];
