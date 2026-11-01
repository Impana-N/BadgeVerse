/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HeroSculpture() {
  const masterGroup = useRef<THREE.Group>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const midRing = useRef<THREE.Mesh>(null);
  const innerCore = useRef<THREE.Mesh>(null);
  const satellitesGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (masterGroup.current) {
      // Gentle floating bob
      masterGroup.current.position.y = Math.sin(t * 1.2) * 0.12;

      // Subtle tilt responsive to cursor
      const targetRotX = state.pointer.y * 0.25;
      const targetRotY = state.pointer.x * 0.45;

      masterGroup.current.rotation.x = THREE.MathUtils.damp(
        masterGroup.current.rotation.x,
        targetRotX,
        3.5,
        delta
      );
      masterGroup.current.rotation.y = THREE.MathUtils.damp(
        masterGroup.current.rotation.y,
        targetRotY,
        3.5,
        delta
      );
    }

    if (outerRing.current) {
      outerRing.current.rotation.z += delta * 0.3;
      outerRing.current.rotation.x += delta * 0.15;
    }

    if (midRing.current) {
      midRing.current.rotation.y -= delta * 0.4;
      midRing.current.rotation.z += delta * 0.2;
    }

    if (innerCore.current) {
      innerCore.current.rotation.y += delta * 0.6;
      innerCore.current.rotation.x -= delta * 0.3;
    }

    if (satellitesGroup.current) {
      satellitesGroup.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={masterGroup} position={[0, 0, 0]}>
      {/* Central Icosahedral Radiant Nucleus */}
      <mesh ref={innerCore} castShadow>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshPhysicalMaterial
          color="#FFE9A8"
          roughness={0.12}
          metalness={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive="#FFE9A8"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Internal Core Light */}
      <mesh>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Mid Harmonic Torus Ring */}
      <mesh ref={midRing} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.35, 0.05, 24, 80]} />
        <meshPhysicalMaterial
          color="#FFCDBD"
          roughness={0.15}
          metalness={0.85}
          clearcoat={0.9}
        />
      </mesh>

      {/* Outer Gyroscopic Celestial Ring */}
      <mesh ref={outerRing} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[1.85, 0.04, 24, 96]} />
        <meshPhysicalMaterial
          color="#C9B8F5"
          roughness={0.18}
          metalness={0.7}
          clearcoat={1.0}
        />
      </mesh>

      {/* Subtle Iridescent Lens / Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.3, 64]} />
        <meshPhysicalMaterial
          color="#C9B8F5"
          transparent
          opacity={0.3}
          roughness={0.1}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Tiny Satellite Moons */}
      <group ref={satellitesGroup}>
        <mesh position={[1.9, 0.4, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#C6E8D5" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-1.7, -0.5, 0.8]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#FFE9A8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, 1.6, -1.2]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color="#FFCDBD" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
