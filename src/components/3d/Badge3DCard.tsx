/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Archetype, AttendeeInfo, BadgeTheme, CustomizationSettings } from '../../types';
import { getSafeQrInstance } from '../../utils/qrcode';

interface Badge3DCardProps {
  attendee: AttendeeInfo;
  archetype: Archetype;
  theme: BadgeTheme;
  customization: CustomizationSettings;
  isFlipped: boolean;
  onToggleFlip?: () => void;
  qrDataUrl?: string;
  vCardString: string;
}

// Safe rounded rectangle drawer that works in all browsers
function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

export function Badge3DCard({
  attendee,
  archetype,
  theme,
  customization,
  isFlipped,
  onToggleFlip,
  vCardString,
}: Badge3DCardProps) {
  const cardGroup = useRef<THREE.Group>(null);
  const lanyardGroup = useRef<THREE.Group>(null);

  // Generate canvas texture for front and back faces synchronously
  const [frontTexture, backTexture] = useMemo(() => {
    // 1. FRONT FACE CANVAS
    const canvasFront = document.createElement('canvas');
    canvasFront.width = 600;
    canvasFront.height = 900;
    const ctxF = canvasFront.getContext('2d');

    if (ctxF) {
      // Background gradient
      const grad = ctxF.createLinearGradient(0, 0, 600, 900);
      grad.addColorStop(
        0,
        theme.id === 'creative' ? '#3B242C' : theme.id === 'explorer' ? '#152C32' : '#2D1B40'
      );
      grad.addColorStop(
        0.5,
        theme.id === 'creative' ? '#251620' : theme.id === 'explorer' ? '#0F1D23' : '#1A1128'
      );
      grad.addColorStop(1, '#0F0918');
      ctxF.fillStyle = grad;
      ctxF.fillRect(0, 0, 600, 900);

      // Atmospheric glow circles
      const glowGrad = ctxF.createRadialGradient(300, 240, 20, 300, 240, 300);
      glowGrad.addColorStop(0, customization.accentColor + '55');
      glowGrad.addColorStop(1, 'transparent');
      ctxF.fillStyle = glowGrad;
      ctxF.fillRect(0, 0, 600, 900);

      // Top Header: Event & Branding
      ctxF.fillStyle = '#FFFFFF';
      ctxF.font = 'bold 26px Outfit, sans-serif';
      ctxF.textAlign = 'center';
      ctxF.fillText('B A D G E V E R S E', 300, 105);

      ctxF.fillStyle = customization.accentColor;
      ctxF.font = '13px "Space Mono", monospace';
      ctxF.fillText('ANNUAL IDENTITY CONVERGENCE · 2026', 300, 135);

      // Decorative divider
      ctxF.strokeStyle = customization.accentColor + '66';
      ctxF.lineWidth = 1.5;
      ctxF.beginPath();
      ctxF.moveTo(100, 155);
      ctxF.lineTo(500, 155);
      ctxF.stroke();

      // Archetype Badge
      ctxF.fillStyle = customization.accentColor + '22';
      safeRoundRect(ctxF, 140, 180, 320, 38, 19);
      ctxF.fill();
      ctxF.strokeStyle = customization.accentColor + '88';
      ctxF.stroke();

      ctxF.fillStyle = '#FFFFFF';
      ctxF.font = '600 15px Outfit, sans-serif';
      ctxF.fillText(`✦ ${archetype.name.toUpperCase()} ✦`, 300, 204);

      // Attendee Full Name (Prominent hero typography)
      const firstName = (attendee.firstName || '').trim() || 'Cosmic';
      const lastName = (attendee.lastName || '').trim() || 'Explorer';
      ctxF.fillStyle = '#FFFFFF';
      ctxF.font = 'bold 42px Outfit, sans-serif';
      ctxF.fillText(firstName, 300, 285);
      ctxF.fillText(lastName, 300, 332);

      // Handle or email preview
      ctxF.fillStyle = '#C9B8F5';
      ctxF.font = '15px "DM Sans", sans-serif';
      const handle = attendee.twitter ? attendee.twitter : attendee.email || 'universe@badgeverse.id';
      ctxF.fillText(handle, 300, 372);

      // ----------------------------------------------------
      // DRAW REAL QR CODE SYNCHRONOUSLY DIRECTLY ONTO CANVAS
      // ----------------------------------------------------
      const qrBoxOuterSize = 240;
      const qrBoxX = 180;
      const qrBoxY = 415;

      // Clean white high-contrast background card for QR
      ctxF.fillStyle = '#FFFFFF';
      safeRoundRect(ctxF, qrBoxX, qrBoxY, qrBoxOuterSize, qrBoxOuterSize, 18);
      ctxF.fill();

      // Subtle drop shadow / border around QR white box
      ctxF.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctxF.lineWidth = 2;
      ctxF.stroke();

      try {
        const qrInstance = getSafeQrInstance(vCardString || 'BADGEVERSE 2026');
        const count = qrInstance.getModuleCount();
        const padding = 14;
        const innerSize = qrBoxOuterSize - padding * 2;
        const cellSize = innerSize / count;
        const startX = qrBoxX + padding;
        const startY = qrBoxY + padding;

        ctxF.fillStyle = '#000000';
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qrInstance.isDark(r, c)) {
              ctxF.fillRect(
                Math.floor(startX + c * cellSize),
                Math.floor(startY + r * cellSize),
                Math.ceil(cellSize),
                Math.ceil(cellSize)
              );
            }
          }
        }
      } catch (err) {
        console.warn('Fallback drawing QR to 3D canvas', err);
      }

      // QR scan label
      ctxF.fillStyle = customization.accentColor;
      ctxF.font = '12px "Space Mono", monospace';
      ctxF.fillText('SCAN TO CONNECT & SAVE VCARD', 300, 695);

      // Footer: Pass details
      ctxF.fillStyle = '#9B8DB5';
      ctxF.font = '13px "Space Mono", monospace';
      ctxF.fillText('PASS ID: BV-2026-9841 · ALL-ACCESS', 300, 760);

      // Bottom golden edge line
      ctxF.strokeStyle = customization.accentColor;
      ctxF.lineWidth = 3;
      ctxF.beginPath();
      ctxF.moveTo(60, 830);
      ctxF.lineTo(540, 830);
      ctxF.stroke();
    }

    // 2. BACK FACE CANVAS
    const canvasBack = document.createElement('canvas');
    canvasBack.width = 600;
    canvasBack.height = 900;
    const ctxB = canvasBack.getContext('2d');

    if (ctxB) {
      // Dark elegant reverse
      ctxB.fillStyle = '#140C1E';
      ctxB.fillRect(0, 0, 600, 900);

      // Subtle geometric grid
      ctxB.strokeStyle = 'rgba(201, 184, 245, 0.08)';
      ctxB.lineWidth = 1;
      for (let x = 0; x < 600; x += 40) {
        ctxB.beginPath();
        ctxB.moveTo(x, 0);
        ctxB.lineTo(x, 900);
        ctxB.stroke();
      }
      for (let y = 0; y < 900; y += 40) {
        ctxB.beginPath();
        ctxB.moveTo(0, y);
        ctxB.lineTo(600, y);
        ctxB.stroke();
      }

      // Title
      ctxB.fillStyle = '#FFFFFF';
      ctxB.font = 'bold 24px Outfit, sans-serif';
      ctxB.textAlign = 'center';
      ctxB.fillText('PERSONALITY ARCHITECTURE', 300, 120);

      ctxB.fillStyle = customization.accentColor;
      ctxB.font = 'bold 32px Outfit, sans-serif';
      ctxB.fillText(archetype.name, 300, 180);

      // Quote block
      ctxB.fillStyle = '#F7F3FF';
      ctxB.font = 'italic 17px "DM Sans", sans-serif';
      ctxB.fillText(`"${archetype.quote}"`, 300, 240);

      // Traits tags
      ctxB.font = '14px "Space Mono", monospace';
      archetype.traits.forEach((trait, i) => {
        const yPos = 315 + i * 44;
        ctxB.fillStyle = 'rgba(201, 184, 245, 0.15)';
        safeRoundRect(ctxB, 160, yPos - 22, 280, 36, 18);
        ctxB.fill();
        ctxB.fillStyle = customization.accentColor;
        ctxB.fillText(`✦ ${trait}`, 300, yPos);
      });

      // Attendee details
      ctxB.fillStyle = '#FFFFFF';
      ctxB.font = 'bold 18px Outfit, sans-serif';
      ctxB.fillText('ATTENDEE VERIFICATION', 300, 560);

      ctxB.fillStyle = '#C9B8F5';
      ctxB.font = '14px "Space Mono", monospace';
      ctxB.fillText(`NAME: ${attendee.firstName} ${attendee.lastName}`, 300, 600);
      ctxB.fillText(`EMAIL: ${attendee.email}`, 300, 630);
      if (attendee.twitter) {
        ctxB.fillText(`TWITTER: ${attendee.twitter}`, 300, 660);
      }
      if (attendee.github) {
        ctxB.fillText(`GITHUB: ${attendee.github}`, 300, 690);
      }

      // Security verification line
      ctxB.fillStyle = '#776294';
      ctxB.font = '11px "Space Mono", monospace';
      ctxB.fillText('OFFICIAL EVENT BADGE · NON-TRANSFERABLE', 300, 780);
      ctxB.fillText('GENERATED SECURELY VIA BADGEVERSE CLIENT', 300, 805);
    }

    const texFront = new THREE.CanvasTexture(canvasFront);
    texFront.colorSpace = THREE.SRGBColorSpace;
    texFront.anisotropy = 4;
    texFront.needsUpdate = true;

    const texBack = new THREE.CanvasTexture(canvasBack);
    texBack.colorSpace = THREE.SRGBColorSpace;
    texBack.anisotropy = 4;
    texBack.needsUpdate = true;

    return [texFront, texBack];
  }, [attendee, archetype, theme, customization, vCardString]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (cardGroup.current) {
      // Gentle floating bob
      cardGroup.current.position.y = Math.sin(t * 1.4) * 0.12;

      // Flip rotation interpolation
      const targetRotY = (isFlipped ? Math.PI : 0) + state.pointer.x * 0.35;
      const targetRotX = state.pointer.y * 0.25;

      cardGroup.current.rotation.y = THREE.MathUtils.damp(
        cardGroup.current.rotation.y,
        targetRotY,
        4.5,
        delta
      );
      cardGroup.current.rotation.x = THREE.MathUtils.damp(
        cardGroup.current.rotation.x,
        targetRotX,
        4,
        delta
      );
    }

    // Lanyard slight sway
    if (lanyardGroup.current) {
      lanyardGroup.current.rotation.z = Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <group ref={cardGroup} position={[0, 0, 0]} onClick={onToggleFlip}>
      {/* Lanyard Clip assembly at top */}
      <group position={[0, 2.35, 0]} ref={lanyardGroup}>
        {/* Metal clip */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
          <meshStandardMaterial color="#E0D6EB" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Horizontal hook loop */}
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.035, 16, 32]} />
          <meshStandardMaterial color="#B0A2C2" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Woven Lanyard Ribbon leading upwards */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.32, 1.2, 0.02]} />
          <meshStandardMaterial
            color={new THREE.Color(customization.accentColor).multiplyScalar(0.7)}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Main Badge Card Mesh */}
      <group position={[0, 0, 0]}>
        {/* Card Body - Front Face */}
        <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
          <planeGeometry args={[2.7, 4.05]} />
          <meshStandardMaterial map={frontTexture} roughness={0.15} metalness={0.1} />
        </mesh>

        {/* Card Body - Back Face */}
        <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
          <planeGeometry args={[2.7, 4.05]} />
          <meshStandardMaterial map={backTexture} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Physical Badge Thickness & Rim */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.72, 4.07, 0.038]} />
          <meshPhysicalMaterial
            color="#281A38"
            metalness={0.5}
            roughness={0.2}
            clearcoat={0.8}
          />
        </mesh>

        {/* Lanyard punch-hole cutout guide */}
        <mesh position={[0, 1.82, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 24]} />
          <meshBasicMaterial color="#160E24" />
        </mesh>
      </group>
    </group>
  );
}
