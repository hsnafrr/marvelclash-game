import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import type { LaserBeam as LaserBeamType } from "@/lib/stores/useTowerDefense";

interface LaserBeamProps {
  laser: LaserBeamType;
}

export function LaserBeam({ laser }: LaserBeamProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Animate laser beam intensity
    const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 20) * 0.3;
    materialRef.current.opacity = intensity;
    
    // Scale animation
    const scale = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  // Calculate laser beam geometry
  const start = new THREE.Vector3(laser.start.x, laser.start.y, laser.start.z);
  const end = new THREE.Vector3(laser.end.x, laser.end.y, laser.end.z);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const midPoint = start.clone().add(direction.multiplyScalar(0.5));

  // Calculate rotation to align with direction
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(up, direction.clone().normalize());

  return (
    <group position={[midPoint.x, midPoint.y, midPoint.z]} quaternion={quaternion}>
      {/* Main Laser Beam */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.05, 0.05, length, 8]} />
        <meshBasicMaterial 
          ref={materialRef}
          color={laser.color || "#ff0000"} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Laser Core (brighter center) */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, length, 8]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Impact Effect at End */}
      <group position={[0, length / 2, 0]}>
        <mesh>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial 
            color={laser.color || "#ff0000"} 
            transparent 
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}
