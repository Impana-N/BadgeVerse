/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, QrCode } from 'lucide-react';
import { SceneCanvas } from '../3d/SceneCanvas';
import { DreamySkyScene } from '../3d/DreamySkyScene';
import { HeroSculpture } from '../3d/HeroSculpture';

interface LandingViewProps {
  onEnter: () => void;
}

export function LandingView({ onEnter }: LandingViewProps) {
  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden">
      {/* 3D Canvas Background & Hero Sculpture */}
      <div className="absolute inset-0 z-0">
        <SceneCanvas cameraPosition={[0, 0, 7.5]} fov={44}>
          <DreamySkyScene interactive={true} />
          <HeroSculpture />
        </SceneCanvas>
      </div>

      {/* Atmospheric Vignette & Radial Light Scrim */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#160E24] via-transparent to-[#160E24]/40" />

      {/* Central Content Overlay */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Eyebrow kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C9B8F5]/30 backdrop-blur-md shadow-lg shadow-[#C9B8F5]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE9A8]" />
            <span className="text-xs font-mono tracking-wider text-[#C9B8F5] uppercase">
              BADGEVERSE · 2026 IDENTITY EXPERIMENT
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display text-white text-wrap-balance leading-[1.1]">
            Every person is a{' '}
            <span className="text-gradient-dream">universe.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-[#F7F3FF]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Discover your personality. Create your identity. Make your
            introduction unforgettable.
          </p>

          {/* Primary CTA & Secondary prompt */}
          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={onEnter}
              type="button"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9B8F5] via-[#FFCDBD] to-[#FFE9A8] text-[#1D122B] font-bold text-base shadow-xl shadow-[#C9B8F5]/25 hover:shadow-2xl hover:shadow-[#C9B8F5]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span className="tracking-wide font-display text-lg">ENTER MY WORLD</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-xs font-mono text-[#C9B8F5]/80 tracking-wide">
              A little journey of self-discovery awaits.
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Features Strip (Clean unboxed metadata) */}
      <div className="relative z-20 pb-8 px-6 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#C9B8F5]/15 text-center text-xs text-[#F7F3FF]/70">
          <div className="flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 text-[#C9B8F5]" />
            <span>Interactive 5-question archetype quiz</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4 text-[#FFCDBD]" />
            <span>vCard smartphone-ready QR generation</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFE9A8]" />
            <span>Client-side private pass & high-res PNG export</span>
          </div>
        </div>
      </div>
    </div>
  );
}
