/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DreamySkyProps {
  interactive?: boolean;
}

export function DreamySkyScene({ interactive = true }: DreamySkyProps) {
  const sceneGroup = useRef<THREE.Group>(null);
  const cloudsGroup = useRef<THREE.Group>(null);
  const islandsGroup = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Procedural Stardust particles
  const [particlePositions, particleColors] = React.useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#C9B8F5'), // Lavender
      new THREE.Color('#FFCDBD'), // Peach
      new THREE.Color('#FFE9A8'), // Butter yellow
      new THREE.Color('#C6E8D5'), // Mint
      new THREE.Color('#F7F3FF'), // Cloud white
    ];

    for (let i = 0; i < count; i++) {
      // Distribute in a spherical hollow volume around the scene
      const radius = 5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 2;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle parallax response to pointer
    if (sceneGroup.current && interactive) {
      const targetX = state.pointer.x * 0.45;
      const targetY = state.pointer.y * 0.35;
      sceneGroup.current.rotation.y = THREE.MathUtils.damp(
        sceneGroup.current.rotation.y,
        targetX,
        2.5,
        delta
      );
      sceneGroup.current.rotation.x = THREE.MathUtils.damp(
        sceneGroup.current.rotation.x,
        -targetY * 0.5,
        2.5,
        delta
      );
    }

    // Slowly moving clouds
    if (cloudsGroup.current) {
      cloudsGroup.current.rotation.y += delta * 0.02;
    }

    // Floating islands gentle bob
    if (islandsGroup.current) {
      islandsGroup.current.position.y = Math.sin(t * 0.8) * 0.12;
      islandsGroup.current.rotation.y += delta * 0.03;
    }

    // Shimmering particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.015;
    }
  });

  return (
    <group ref={sceneGroup}>
      {/* Ambient & Directional Lighting */}
      <ambientLight intensity={1.2} color="#E8DDF7" />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.8}
        color="#FFF2E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-6, -4, -3]} intensity={1.2} color="#C9B8F5" />
      <pointLight position={[5, -3, 3]} intensity={0.9} color="#FFCDBD" />

      {/* Subtle background fog to blend distance */}
      <fog attach="fog" args={['#160e24', 8, 22]} />

      {/* Floating Islands / Sculptural forms */}
      <group ref={islandsGroup}>
        {/* Left floating sculptural isle */}
        <group position={[-3.6, -0.6, -2.5]} rotation={[0.2, 0.4, -0.1]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 0.5, 0.7, 7]} />
            <meshStandardMaterial
              color="#36224A"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          {/* Top moss / crystalline surface */}
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[1.38, 1.4, 0.08, 7]} />
            <meshStandardMaterial color="#684E82" roughness={0.4} />
          </mesh>
          {/* Tiny crystal on the isle */}
          <mesh position={[0.4, 0.65, 0.2]}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshPhysicalMaterial
              color="#FFE9A8"
              emissive="#FFE9A8"
              emissiveIntensity={0.3}
              clearcoat={1}
            />
          </mesh>
        </group>

        {/* Right floating sculptural isle */}
        <group position={[3.8, 0.8, -3.2]} rotation={[-0.15, -0.6, 0.1]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.6, 0.4, 0.85, 6]} />
            <meshStandardMaterial
              color="#2E1C40"
              roughness={0.75}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.44, 0]}>
            <cylinderGeometry args={[1.58, 1.6, 0.08, 6]} />
            <meshStandardMaterial color="#55386E" roughness={0.4} />
          </mesh>
          {/* Glowing beacon */}
          <mesh position={[-0.3, 0.75, 0.1]}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshPhysicalMaterial
              color="#C6E8D5"
              emissive="#C6E8D5"
              emissiveIntensity={0.35}
              clearcoat={1}
            />
          </mesh>
        </group>

        {/* Distant background upper island */}
        <group position={[0.5, 3.2, -5.5]} rotation={[0.1, 1.2, 0]}>
          <mesh>
            <cylinderGeometry args={[1.8, 0.6, 0.8, 8]} />
            <meshStandardMaterial color="#241633" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[1.78, 1.8, 0.08, 8]} />
            <meshStandardMaterial color="#42295B" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Floating Translucent Glass Spheres */}
      <group>
        <mesh position={[-2.4, 1.8, -1.8]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshPhysicalMaterial
            color="#C9B8F5"
            transmission={0.8}
            roughness={0.1}
            ior={1.4}
            thickness={1.2}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[2.6, -1.4, -1.2]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshPhysicalMaterial
            color="#FFCDBD"
            transmission={0.75}
            roughness={0.15}
            ior={1.4}
            thickness={1.5}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[1.8, 2.2, -3.0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshPhysicalMaterial
            color="#FFE9A8"
            transmission={0.85}
            roughness={0.08}
            ior={1.4}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[-3.2, -1.8, -2.8]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial
            color="#C6E8D5"
            transmission={0.8}
            roughness={0.12}
            ior={1.4}
            clearcoat={1}
          />
        </mesh>
      </group>

      {/* Drifting Clouds cluster */}
      <group ref={cloudsGroup}>
        {/* Cloud 1 */}
        <group position={[-2.8, 2.4, -4]} scale={[1.2, 0.8, 0.9]}>
          <mesh>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial
              color="#F7F3FF"
              transparent
              opacity={0.45}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0.6, 0.1, 0]}>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial
              color="#F7F3FF"
              transparent
              opacity={0.4}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[-0.55, -0.05, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color="#F7F3FF"
              transparent
              opacity={0.4}
              roughness={0.8}
            />
          </mesh>
        </group>

        {/* Cloud 2 */}
        <group position={[3.5, -2.2, -4.5]} scale={[1.4, 0.9, 1]}>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial
              color="#F7F3FF"
              transparent
              opacity={0.4}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0.7, 0.1, 0.1]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial
              color="#F7F3FF"
              transparent
              opacity={0.35}
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>

      {/* Stardust particle constellation */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
