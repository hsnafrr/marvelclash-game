import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TargetingSystem } from "../systems/TargetingSystem";
import { ObjectPool } from "../systems/ObjectPool";
import * as THREE from "three";

export type GamePhase = "menu" | "playing" | "paused" | "ended";

export interface Tower {
  id: string;
  position: THREE.Vector3;
  type: string;
  level: number;
  damage: number;
  range: number;
  fireRate: number;
  lastFired: number;
  canFire: boolean;
  currentTargetId: string | null;
  showRange: boolean;
}

export interface Enemy {
  id: string;
  position: THREE.Vector3;
  type: 'normal' | 'fast' | 'heavy' | 'boss';
  health: number;
  maxHealth: number;
  speed: number;
  pathProgress: number;
  reward: number;
}

export interface LaserBeam {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  damage: number;
  lifetime: number;
}

export interface ParticleEffect {
  id: string;
  position: THREE.Vector3;
  type: 'explosion' | 'hit' | 'death';
  color: string;
  lifetime: number;
}

interface TowerDefenseState {
  // Game State
  gamePhase: GamePhase;
  currentWave: number;
  totalWaves: number;
  lives: number;
  score: number;
  money: number;
  gameTime: number;
  waveProgress: number;
  
  // Game Objects
  towers: Tower[];
  enemies: Enemy[];
  laserBeams: LaserBeam[];
  particleEffects: ParticleEffect[];
  
  // Statistics
  enemiesKilled: number;
  accuracy: number;
  totalShots: number;
  hitShots: number;
  
  // Object Pools
  laserPool: ObjectPool<LaserBeam>;
  particlePool: ObjectPool<ParticleEffect>;
  
  // Systems
  targetingSystem: TargetingSystem;
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  initializeGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  updateGame: (deltaTime: number) => void;
  nextWave: () => void;
  placeTower: (position: THREE.Vector3, type: string) => void;
  spawnEnemy: (type: Enemy['type']) => void;
  fireLaser: (towerId: string, targetId: string) => void;
  damageEnemy: (enemyId: string, damage: number) => void;
  removeEnemy: (enemyId: string) => void;
  updateTowerTarget: (towerId: string, targetId: string | null) => void;
  addParticleEffect: (effect: Omit<ParticleEffect, 'id'>) => void;
}

export const useTowerDefense = create<TowerDefenseState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    gamePhase: "menu",
    currentWave: 1,
    totalWaves: 10,
    lives: 20,
    score: 0,
    money: 100,
    gameTime: 0,
    waveProgress: 0,
    
    towers: [],
    enemies: [],
    laserBeams: [],
    particleEffects: [],
    
    enemiesKilled: 0,
    accuracy: 0,
    totalShots: 0,
    hitShots: 0,
    
    // Initialize systems
    laserPool: new ObjectPool<LaserBeam>(() => ({
      id: '',
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      color: '#ff0000',
      damage: 0,
      lifetime: 0
    }), 100),
    
    particlePool: new ObjectPool<ParticleEffect>(() => ({
      id: '',
      position: new THREE.Vector3(),
      type: 'hit',
      color: '#ff0000',
      lifetime: 0
    }), 200),
    
    targetingSystem: new TargetingSystem(),

    setGamePhase: (phase) => set({ gamePhase: phase }),

    initializeGame: () => {
      console.log("Initializing tower defense game systems");
      set({
        currentWave: 1,
        lives: 20,
        score: 0,
        money: 100,
        gameTime: 0,
        waveProgress: 0,
        towers: [],
        enemies: [],
        laserBeams: [],
        particleEffects: [],
        enemiesKilled: 0,
        totalShots: 0,
        hitShots: 0,
        accuracy: 0
      });
    },

    startGame: () => {
      set({ gamePhase: "playing" });
      console.log("Game started");
    },

    pauseGame: () => {
      set({ gamePhase: "paused" });
      console.log("Game paused");
    },

    resumeGame: () => {
      set({ gamePhase: "playing" });
      console.log("Game resumed");
    },

    restartGame: () => {
      const { initializeGame } = get();
      initializeGame();
      set({ gamePhase: "playing" });
      console.log("Game restarted");
    },

    updateGame: (deltaTime) => {
      const state = get();
      if (state.gamePhase !== 'playing') return;

      // Update game time
      const newGameTime = state.gameTime + deltaTime;
      
      // Update wave progress (simplified)
      const waveTimeLimit = 30; // 30 seconds per wave
      const newWaveProgress = Math.min((newGameTime % waveTimeLimit) / waveTimeLimit, 1);
      
      // Spawn enemies based on wave progress
      if (Math.random() < 0.02 && state.enemies.length < 10) {
        get().spawnEnemy('normal');
      }

      // Update towers
      const updatedTowers = state.towers.map(tower => {
        const canFire = (newGameTime - tower.lastFired) >= (1 / tower.fireRate);
        
        // Update targeting
        let currentTargetId = tower.currentTargetId;
        if (currentTargetId) {
          const target = state.enemies.find(e => e.id === currentTargetId);
          if (!target || state.targetingSystem.getDistance(tower.position, target.position) > tower.range) {
            currentTargetId = null;
          }
        }
        
        // Find new target if needed
        if (!currentTargetId) {
          currentTargetId = state.targetingSystem.findBestTarget(tower, state.enemies);
        }
        
        // Fire at target
        if (canFire && currentTargetId) {
          get().fireLaser(tower.id, currentTargetId);
          return {
            ...tower,
            currentTargetId,
            lastFired: newGameTime,
            canFire: false
          };
        }
        
        return {
          ...tower,
          currentTargetId,
          canFire
        };
      });

      // Update enemies
      const updatedEnemies = state.enemies.map(enemy => {
        const newProgress = enemy.pathProgress + enemy.speed * deltaTime;
        
        if (newProgress >= 1) {
          // Enemy reached the end
          set(state => ({ lives: state.lives - 1 }));
          return null;
        }
        
        // Update position along path
        const z = -25 + (newProgress * 50);
        
        return {
          ...enemy,
          pathProgress: newProgress,
          position: new THREE.Vector3(enemy.position.x, enemy.position.y, z)
        };
      }).filter(Boolean) as Enemy[];

      // Update laser beams
      const updatedLasers = state.laserBeams.map(laser => ({
        ...laser,
        lifetime: laser.lifetime - deltaTime
      })).filter(laser => laser.lifetime > 0);

      // Update particle effects
      const updatedParticles = state.particleEffects.map(particle => ({
        ...particle,
        lifetime: particle.lifetime - deltaTime
      })).filter(particle => particle.lifetime > 0);

      // Check for game over
      if (state.lives <= 0) {
        set({ gamePhase: "ended" });
        console.log("Game over - no lives remaining");
      }

      // Check for wave completion
      if (newWaveProgress >= 1 && updatedEnemies.length === 0) {
        if (state.currentWave >= state.totalWaves) {
          set({ gamePhase: "ended" });
          console.log("Game completed - all waves finished");
        }
      }

      set({
        gameTime: newGameTime,
        waveProgress: newWaveProgress,
        towers: updatedTowers,
        enemies: updatedEnemies,
        laserBeams: updatedLasers,
        particleEffects: updatedParticles,
        accuracy: state.totalShots > 0 ? state.hitShots / state.totalShots : 0
      });
    },

    nextWave: () => {
      set(state => ({
        currentWave: state.currentWave + 1,
        waveProgress: 0,
        money: state.money + 50 // Bonus for completing wave
      }));
      console.log(`Starting wave ${get().currentWave}`);
    },

    placeTower: (position, type) => {
      const { money } = get();
      const cost = 50; // Base tower cost
      
      if (money >= cost) {
        const newTower: Tower = {
          id: `tower-${Date.now()}-${Math.random()}`,
          position: position.clone(),
          type,
          level: 1,
          damage: 25,
          range: 8,
          fireRate: 2,
          lastFired: 0,
          canFire: true,
          currentTargetId: null,
          showRange: false
        };
        
        set(state => ({
          towers: [...state.towers, newTower],
          money: state.money - cost
        }));
        
        console.log(`Tower placed at ${position.x}, ${position.z}`);
      }
    },

    spawnEnemy: (type) => {
      const enemyConfig = {
        normal: { health: 100, speed: 0.02, reward: 10 },
        fast: { health: 60, speed: 0.04, reward: 15 },
        heavy: { health: 200, speed: 0.01, reward: 25 },
        boss: { health: 500, speed: 0.015, reward: 100 }
      };
      
      const config = enemyConfig[type];
      const newEnemy: Enemy = {
        id: `enemy-${Date.now()}-${Math.random()}`,
        position: new THREE.Vector3(0, 1, -25),
        type,
        health: config.health,
        maxHealth: config.health,
        speed: config.speed,
        pathProgress: 0,
        reward: config.reward
      };
      
      set(state => ({
        enemies: [...state.enemies, newEnemy]
      }));
    },

    fireLaser: (towerId, targetId) => {
      const { towers, enemies, laserPool, totalShots } = get();
      const tower = towers.find(t => t.id === towerId);
      const target = enemies.find(e => e.id === targetId);
      
      if (!tower || !target) return;
      
      const laser = laserPool.acquire();
      laser.id = `laser-${Date.now()}-${Math.random()}`;
      laser.start = tower.position.clone();
      laser.start.y += 1.5; // Fire from barrel
      laser.end = target.position.clone();
      laser.color = '#ff0000';
      laser.damage = tower.damage;
      laser.lifetime = 0.1;
      
      set(state => ({
        laserBeams: [...state.laserBeams, laser],
        totalShots: state.totalShots + 1
      }));
      
      // Apply damage
      get().damageEnemy(targetId, tower.damage);
    },

    damageEnemy: (enemyId, damage) => {
      const { enemies, hitShots } = get();
      const enemy = enemies.find(e => e.id === enemyId);
      
      if (!enemy) return;
      
      const newHealth = Math.max(0, enemy.health - damage);
      
      if (newHealth <= 0) {
        get().removeEnemy(enemyId);
        get().addParticleEffect({
          position: enemy.position.clone(),
          type: 'death',
          color: '#ff4444',
          lifetime: 1
        });
        
        set(state => ({
          score: state.score + enemy.reward,
          money: state.money + enemy.reward,
          enemiesKilled: state.enemiesKilled + 1,
          hitShots: state.hitShots + 1
        }));
      } else {
        set(state => ({
          enemies: state.enemies.map(e => 
            e.id === enemyId ? { ...e, health: newHealth } : e
          ),
          hitShots: state.hitShots + 1
        }));
        
        get().addParticleEffect({
          position: enemy.position.clone(),
          type: 'hit',
          color: '#ffaa00',
          lifetime: 0.5
        });
      }
    },

    removeEnemy: (enemyId) => {
      set(state => ({
        enemies: state.enemies.filter(e => e.id !== enemyId)
      }));
    },

    updateTowerTarget: (towerId, targetId) => {
      set(state => ({
        towers: state.towers.map(tower =>
          tower.id === towerId ? { ...tower, currentTargetId: targetId } : tower
        )
      }));
    },

    addParticleEffect: (effect) => {
      const { particlePool } = get();
      const particle = particlePool.acquire();
      Object.assign(particle, {
        ...effect,
        id: `particle-${Date.now()}-${Math.random()}`
      });
      
      set(state => ({
        particleEffects: [...state.particleEffects, particle]
      }));
    }
  }))
);
