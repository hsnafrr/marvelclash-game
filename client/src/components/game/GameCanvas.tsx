import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import { usePerformance } from "@/lib/stores/usePerformance";
import { Tower } from "./Tower";
import { Enemy } from "./Enemy";
import { LaserBeam } from "./LaserBeam";
import { Terrain } from "./Terrain";
import { ParticleSystem } from "./ParticleSystem";

export function GameCanvas() {
  const gameLoopRef = useRef(0);
  const { 
    towers, 
    enemies, 
    laserBeams, 
    updateGame, 
    gamePhase 
  } = useTowerDefense();
  const { updatePerformance, shouldThrottle } = usePerformance();

  useFrame((state, delta) => {
    // Performance optimization: throttle updates on lower-end devices
    const throttledDelta = shouldThrottle ? Math.min(delta, 1/30) : delta;
    
    // Only update game logic if playing
    if (gamePhase === 'playing') {
      updateGame(throttledDelta);
    }
    
    // Update performance metrics every 60 frames
    gameLoopRef.current++;
    if (gameLoopRef.current % 60 === 0) {
      updatePerformance();
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#4a90e2" />

      {/* Game World */}
      <Terrain />
      
      {/* Game Objects */}
      {towers.map((tower) => (
        <Tower key={tower.id} tower={tower} />
      ))}
      
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
      
      {laserBeams.map((laser) => (
        <LaserBeam key={laser.id} laser={laser} />
      ))}
      
      {/* Particle Effects */}
      <ParticleSystem />
    </>
  );
}
