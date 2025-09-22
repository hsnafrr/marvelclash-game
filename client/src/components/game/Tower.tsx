import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import type { Tower as TowerType } from "@/lib/stores/useTowerDefense";

interface TowerProps {
  tower: TowerType;
}

export function Tower({ tower }: TowerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const barrelRef = useRef<THREE.Mesh>(null);
  const woodTexture = useTexture("/textures/wood.jpg");
  
  const { updateTowerTarget } = useTowerDefense();

  // Update tower targeting and rotation
  useFrame(() => {
    if (!barrelRef.current || !tower.currentTargetId) return;
    
    const { enemies } = useTowerDefense.getState();
    const target = enemies.find(e => e.id === tower.currentTargetId);
    
    if (target) {
      // Calculate angle to target
      const dx = target.position.x - tower.position.x;
      const dz = target.position.z - tower.position.z;
      const angle = Math.atan2(dx, dz);
      
      // Smoothly rotate barrel towards target
      barrelRef.current.rotation.y = THREE.MathUtils.lerp(
        barrelRef.current.rotation.y,
        angle,
        0.1
      );
    }
  });

  // Visual feedback for tower states
  const getTowerColor = () => {
    if (tower.currentTargetId) return "#ff4444"; // Red when targeting
    if (tower.canFire) return "#44ff44"; // Green when ready
    return "#ffff44"; // Yellow when cooling down
  };

  return (
    <group position={[tower.position.x, tower.position.y, tower.position.z]}>
      {/* Tower Base */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 2, 8]} />
        <meshLambertMaterial map={woodTexture} color={getTowerColor()} />
      </mesh>
      
      {/* Tower Barrel */}
      <mesh 
        ref={barrelRef} 
        position={[0, 1.5, 0]} 
        castShadow
      >
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      
      {/* Range Indicator (visible when selected) */}
      {tower.showRange && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[tower.range - 0.1, tower.range, 32]} />
          <meshBasicMaterial color="#44ff44" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Upgrade Level Indicators */}
      {Array.from({ length: tower.level }, (_, i) => (
        <mesh 
          key={i}
          position={[0, 2.5 + i * 0.3, 0]}
          scale={[0.2, 0.2, 0.2]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
    </group>
  );
}
