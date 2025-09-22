import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Configure texture repeat
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);
  
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(10, 2);

  return (
    <group>
      {/* Main Ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>
      
      {/* Enemy Path */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.4, 0]}
        receiveShadow
      >
        <planeGeometry args={[6, 60]} />
        <meshLambertMaterial map={asphaltTexture} />
      </mesh>
      
      {/* Border Walls */}
      {[-50, 50].map((x, i) => (
        <mesh key={`wall-x-${i}`} position={[x, 2, 0]} castShadow>
          <boxGeometry args={[2, 4, 100]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
      ))}
      
      {[-50, 50].map((z, i) => (
        <mesh key={`wall-z-${i}`} position={[0, 2, z]} castShadow>
          <boxGeometry args={[100, 4, 2]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
      ))}
      
      {/* Spawn Point Indicator */}
      <mesh position={[0, 0.1, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 3, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
      </mesh>
      
      {/* Goal Point Indicator */}
      <mesh position={[0, 0.1, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 3, 16]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
