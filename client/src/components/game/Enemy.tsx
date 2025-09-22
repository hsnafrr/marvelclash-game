import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import type { Enemy as EnemyType } from "@/lib/stores/useTowerDefense";

interface EnemyProps {
  enemy: EnemyType;
}

export function Enemy({ enemy }: EnemyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const healthBarRef = useRef<THREE.Mesh>(null);
  
  // Animation state
  const animationRef = useRef({ 
    bobOffset: Math.random() * Math.PI * 2,
    moveSpeed: 0.02 
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Floating animation
    const bobbing = Math.sin(state.clock.elapsedTime * 3 + animationRef.current.bobOffset) * 0.1;
    meshRef.current.position.y = enemy.position.y + bobbing;
    
    // Rotation animation
    meshRef.current.rotation.y += animationRef.current.moveSpeed;
  });

  // Get enemy color based on type and health
  const getEnemyColor = () => {
    const healthPercent = enemy.health / enemy.maxHealth;
    if (enemy.type === 'boss') return '#800080'; // Purple for boss
    if (enemy.type === 'fast') return '#ff8800'; // Orange for fast
    if (enemy.type === 'heavy') return '#004400'; // Dark green for heavy
    
    // Normal enemy - color changes with health
    if (healthPercent > 0.7) return '#ff4444'; // Red
    if (healthPercent > 0.3) return '#ffaa44'; // Orange
    return '#ffff44'; // Yellow when low health
  };

  const getEnemySize = () => {
    switch (enemy.type) {
      case 'boss': return [2, 2, 2];
      case 'heavy': return [1.5, 1.5, 1.5];
      case 'fast': return [0.8, 0.8, 0.8];
      default: return [1, 1, 1];
    }
  };

  return (
    <group position={[enemy.position.x, enemy.position.y, enemy.position.z]}>
      {/* Enemy Body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={getEnemySize() as [number, number, number]} />
        <meshLambertMaterial color={getEnemyColor()} />
      </mesh>
      
      {/* Health Bar */}
      <group position={[0, 2, 0]}>
        {/* Health Bar Background */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2, 0.3]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        
        {/* Health Bar Fill */}
        <mesh 
          ref={healthBarRef}
          position={[-(1 - (enemy.health / enemy.maxHealth)), 0, 0]}
          scale={[enemy.health / enemy.maxHealth, 1, 1]}
        >
          <planeGeometry args={[2, 0.25]} />
          <meshBasicMaterial 
            color={enemy.health / enemy.maxHealth > 0.5 ? "#44ff44" : "#ff4444"} 
          />
        </mesh>
      </group>
      
      {/* Enemy Type Indicator */}
      {enemy.type !== 'normal' && (
        <mesh position={[0, 2.5, 0]} scale={[0.3, 0.3, 0.3]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color={
              enemy.type === 'boss' ? '#ffff00' : 
              enemy.type === 'fast' ? '#00ffff' : '#ff00ff'
            } 
          />
        </mesh>
      )}
      
      {/* Movement Trail Effect */}
      <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1, 8]} />
        <meshBasicMaterial 
          color={getEnemyColor()} 
          transparent 
          opacity={0.2} 
        />
      </mesh>
    </group>
  );
}
