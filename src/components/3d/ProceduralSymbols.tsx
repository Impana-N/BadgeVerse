/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarModelId, FinishStyle } from '../../types';

interface SymbolProps {
  modelId: AvatarModelId;
  accentColor?: string;
  finish?: FinishStyle;
  scale?: number;
  interactive?: boolean;
}

export function ProceduralSymbol({
  modelId,
  accentColor = '#C9B8F5',
  finish = 'iridescent',
  scale = 1,
  interactive = true,
}: SymbolProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle gentle floating & rotation
    groupRef.current.rotation.y += delta * 0.45;
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;

    if (interactive) {
      // Subtle responsiveness to mouse
      const targetRotX = (state.pointer.y * Math.PI) / 10;
      const targetRotZ = -(state.pointer.x * Math.PI) / 14;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        4,
        delta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        targetRotZ,
        4,
        delta
      );
    }
  });

  // Calculate material properties based on FinishStyle
  const materialProps = React.useMemo(() => {
    switch (finish) {
      case 'iridescent':
        return {
          color: new THREE.Color(accentColor),
          metalness: 0.2,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          transparent: true,
          opacity: 0.95,
        };
      case 'hologram':
        return {
          color: new THREE.Color(accentColor),
          metalness: 0.8,
          roughness: 0.2,
          wireframe: false,
          transparent: true,
          opacity: 0.82,
          emissive: new THREE.Color(accentColor).multiplyScalar(0.25),
        };
      case 'clay':
        return {
          color: new THREE.Color(accentColor),
          metalness: 0.05,
          roughness: 0.65,
          clearcoat: 0.1,
          transparent: false,
          opacity: 1.0,
        };
      case 'metallic':
        return {
          color: new THREE.Color(accentColor),
          metalness: 0.92,
          roughness: 0.22,
          clearcoat: 0.8,
          transparent: false,
          opacity: 1.0,
        };
      default:
        return {
          color: new THREE.Color(accentColor),
          metalness: 0.3,
          roughness: 0.2,
        };
    }
  }, [accentColor, finish]);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {modelId === 'nova' && <NovaMesh materialProps={materialProps} accentColor={accentColor} />}
      {modelId === 'flower' && <FlowerMesh materialProps={materialProps} accentColor={accentColor} />}
      {modelId === 'sphere' && <SphereMesh materialProps={materialProps} accentColor={accentColor} />}
      {modelId === 'mobius' && <MobiusMesh materialProps={materialProps} accentColor={accentColor} />}
      {modelId === 'crystal' && <CrystalMesh materialProps={materialProps} accentColor={accentColor} />}
      {modelId === 'cloud' && <CloudMesh materialProps={materialProps} accentColor={accentColor} />}
    </group>
  );
}

// 1. Solar Nova: Stellated geometry with radiant core & orbital sparks
function NovaMesh({ materialProps, accentColor }: { materialProps: Record<string, unknown>; accentColor: string }) {
  const points = React.useMemo(() => {
    const pts: [number, number, number, number, number, number][] = [
      [0, 1.2, 0, 0, 0, 0],
      [0, -1.2, 0, 0, 0, 0],
      [1.2, 0, 0, 0, 0, 0],
      [-1.2, 0, 0, 0, 0, 0],
      [0, 0, 1.2, 0, 0, 0],
      [0, 0, -1.2, 0, 0, 0],
      [0.85, 0.85, 0, 0, 0, -Math.PI / 4],
      [-0.85, 0.85, 0, 0, 0, Math.PI / 4],
      [0.85, -0.85, 0, 0, 0, Math.PI / 4],
      [-0.85, -0.85, 0, 0, 0, -Math.PI / 4],
    ];
    return pts;
  }, []);

  return (
    <group>
      {/* Central faceted nucleus */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Internal warm glow core */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#FFF7DE" />
      </mesh>

      {/* Spikes / rays radiating outwards */}
      {points.map((pt, i) => (
        <mesh key={i} position={[pt[0], pt[1], pt[2]]} rotation={[pt[3], pt[4], pt[5]]}>
          <coneGeometry args={[0.18, 0.7, 5]} />
          <meshPhysicalMaterial
            {...materialProps}
            roughness={0.25}
            color={new THREE.Color(accentColor).offsetHSL(0.04, 0, 0.08)}
          />
        </mesh>
      ))}

      {/* Outer halo ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.35, 0.025, 16, 64]} />
        <meshStandardMaterial color="#FFE9A8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 2. Lumina Bloom: Glass-like curved layered petals and central crystal stamen
function FlowerMesh({ materialProps, accentColor }: { materialProps: Record<string, unknown>; accentColor: string }) {
  const petals = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2;
      return {
        rotation: [Math.PI / 4, 0, angle] as [number, number, number],
        pos: [Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <group rotation={[Math.PI / 6, 0, 0]}>
      {/* Petals */}
      {petals.map((petal, i) => (
        <group key={i} rotation={petal.rotation} position={petal.pos}>
          <mesh castShadow>
            <coneGeometry args={[0.38, 0.95, 4, 1]} />
            <meshPhysicalMaterial
              {...materialProps}
              clearcoat={1.0}
              transmission={0.4}
              roughness={0.12}
            />
          </mesh>
        </group>
      ))}

      {/* Central crystalline pistil/stamen */}
      <mesh position={[0, 0, 0.15]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#FFF"
          metalness={0.6}
          roughness={0.1}
          emissive={new THREE.Color(accentColor)}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Base stem nodule */}
      <mesh position={[0, 0, -0.4]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#30243D" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3. Opal Core: Pearlescent sphere with dual concentric rings & micro-satellites
function SphereMesh({ materialProps, accentColor }: { materialProps: Record<string, unknown>; accentColor: string }) {
  return (
    <group>
      {/* Central pearl orb */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.75, 48, 48]} />
        <meshPhysicalMaterial
          {...materialProps}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.9}
        />
      </mesh>

      {/* Primary Equatorial Ring */}
      <mesh rotation={[Math.PI / 2.8, Math.PI / 6, 0]}>
        <torusGeometry args={[1.25, 0.04, 16, 72]} />
        <meshStandardMaterial
          color={new THREE.Color(accentColor).offsetHSL(0.05, 0.1, 0.1)}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Secondary Tilted Delicate Ring */}
      <mesh rotation={[-Math.PI / 3, -Math.PI / 8, 0]}>
        <torusGeometry args={[1.42, 0.02, 16, 72]} />
        <meshStandardMaterial color="#FFF5EB" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Orbital Micro-Satellites */}
      <mesh position={[1.1, 0.4, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFE9A8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.2, -0.3, -0.4]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#C6E8D5" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 4. Mobius Prism: Seamless endless loop with geometric prism facets
function MobiusMesh({ materialProps, accentColor }: { materialProps: Record<string, unknown>; accentColor: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.62, 0.22, 128, 16, 2, 3]} />
        <meshPhysicalMaterial
          {...materialProps}
          clearcoat={0.9}
          roughness={0.18}
          metalness={0.65}
        />
      </mesh>

      {/* Concentric floating orientation guide rings */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[1.2, 1.25, 48]} />
        <meshBasicMaterial
          color={new THREE.Color(accentColor)}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 5. Prism Spire: Double-terminated crystal monolith with floating crystal shards
function CrystalMesh({ materialProps, accentColor }: { materialProps: Record<string, unknown>; accentColor: string }) {
  return (
    <group>
      {/* Main crystalline monolith */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.55, 1.45, 6]} />
        <meshPhysicalMaterial
          {...materialProps}
          roughness={0.08}
          metalness={0.3}
          clearcoat={1.0}
        />
      </mesh>

      {/* Top pyramidal crystal cap */}
      <mesh position={[0, 1.05, 0]}>
        <coneGeometry args={[0.42, 0.65, 6]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.08} clearcoat={1.0} />
      </mesh>

      {/* Bottom faceted termination */}
      <mesh position={[0, -1.0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.55, 0.55, 6]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.12} />
      </mesh>

      {/* Orbiting crystal shards */}
      <mesh position={[0.78, 0.2, 0.4]} rotation={[0.4, 0.5, 0.2]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#C6E8D5" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[-0.82, -0.3, -0.3]} rotation={[-0.3, 0.8, -0.4]}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color="#FFE9A8" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 6. Stratos Cloud: Buoyant sculpted vapor puffs with crescent moon
function CloudMesh({
  materialProps,
  accentColor = '#C9B8F5',
}: {
  materialProps: Record<string, unknown>;
  accentColor?: string;
}) {
  return (
    <group>
      {/* Overlapping soft volumetric spheres for cloud body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.45} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.48, -0.05, 0.1]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.45} clearcoat={0.3} />
      </mesh>
      <mesh position={[-0.45, -0.08, 0.05]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.45} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.18, 0.35, -0.08]} castShadow>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.45} clearcoat={0.3} />
      </mesh>
      <mesh position={[-0.22, 0.28, 0.12]} castShadow>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshPhysicalMaterial {...materialProps} roughness={0.45} clearcoat={0.3} />
      </mesh>

      {/* Golden crescent moon perched beside the cloud */}
      <group position={[0.55, 0.55, -0.2]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[0.26, 0.065, 16, 32, Math.PI * 1.4]} />
          <meshStandardMaterial
            color="#FFE9A8"
            metalness={0.85}
            roughness={0.2}
            emissive="#FFE9A8"
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>

      {/* Tiny shimmering stardust pearls */}
      <mesh position={[-0.65, 0.5, 0.3]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#FFF" />
      </mesh>
      <mesh position={[0.7, -0.4, 0.2]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#FFE9A8" />
      </mesh>
    </group>
  );
}
