/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  className?: string;
  interactive?: boolean;
}

export function SceneCanvas({
  children,
  cameraPosition = [0, 0, 7.5],
  fov = 42,
  className = 'w-full h-full',
}: SceneCanvasProps) {
  const [hasWebGl, setHasWebGl] = useState<boolean | null>(null);

  useEffect(() => {
    // Probe WebGL support safely
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setHasWebGl(!!gl);
    } catch {
      setHasWebGl(false);
    }
  }, []);

  if (hasWebGl === false) {
    // Graceful fallback for environments with disabled WebGL
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-b from-[#2B1B40] via-[#1F1730] to-[#120B1E] relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9B8F5]/10 via-[#30243D]/40 to-transparent pointer-events-none" />
        <div className="relative text-center p-6 max-w-sm">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-[#C9B8F5]/40 flex items-center justify-center bg-[#30243D]/50 text-[#C9B8F5]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <p className="text-xs text-[#C9B8F5]/80 font-mono tracking-wider uppercase">Universe Canvas</p>
          <p className="text-xs text-[#F7F3FF]/60 mt-1">Rendering in high-compatibility mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
