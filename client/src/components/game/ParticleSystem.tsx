import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import { usePerformance } from "@/lib/stores/usePerformance";

export function ParticleSystem() {
  const particleSystemRef = useRef<THREE.Points>(null);
  const { particleEffects } = useTowerDefense();
  const { shouldReduceParticles } = usePerformance();
  
  // Create particle geometry and material
  const { geometry, material } = useMemo(() => {
    const maxParticles = shouldReduceParticles ? 500 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const velocities = new Float32Array(maxParticles * 3);
    const lifetimes = new Float32Array(maxParticles);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    return { geometry, material };
  }, [shouldReduceParticles]);

  useFrame((state, delta) => {
    if (!particleSystemRef.current) return;
    
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const velocities = geometry.attributes.velocity.array as Float32Array;
    const lifetimes = geometry.attributes.lifetime.array as Float32Array;
    
    // Update existing particles
    for (let i = 0; i < positions.length / 3; i++) {
      const index = i * 3;
      
      if (lifetimes[i] > 0) {
        // Update position
        positions[index] += velocities[index] * delta;
        positions[index + 1] += velocities[index + 1] * delta;
        positions[index + 2] += velocities[index + 2] * delta;
        
        // Update lifetime
        lifetimes[i] -= delta;
        
        // Fade out based on lifetime
        const alpha = Math.max(0, lifetimes[i] / 2);
        colors[index] *= alpha;
        colors[index + 1] *= alpha;
        colors[index + 2] *= alpha;
      }
    }
    
    // Add new particles from effects
    particleEffects.forEach((effect, effectIndex) => {
      if (effectIndex < positions.length / 3) {
        const index = effectIndex * 3;
        
        // Set position
        positions[index] = effect.position.x + (Math.random() - 0.5) * 2;
        positions[index + 1] = effect.position.y + (Math.random() - 0.5) * 2;
        positions[index + 2] = effect.position.z + (Math.random() - 0.5) * 2;
        
        // Set color based on effect type
        const color = new THREE.Color(effect.color || '#ff4444');
        colors[index] = color.r;
        colors[index + 1] = color.g;
        colors[index + 2] = color.b;
        
        // Set velocity
        velocities[index] = (Math.random() - 0.5) * 10;
        velocities[index + 1] = Math.random() * 5;
        velocities[index + 2] = (Math.random() - 0.5) * 10;
        
        // Set lifetime
        lifetimes[effectIndex] = 2;
      }
    });
    
    // Mark attributes as needing update
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.velocity.needsUpdate = true;
    geometry.attributes.lifetime.needsUpdate = true;
  });

  return (
    <points ref={particleSystemRef} geometry={geometry} material={material} />
  );
}
