/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { Archetype } from '../../types';
import { SceneCanvas } from '../3d/SceneCanvas';
import { ProceduralSymbol } from '../3d/ProceduralSymbols';
import { soundFx } from '../../utils/audio';

interface ArchetypeRevealModalProps {
  archetype: Archetype;
  onProceedToCustomize: () => void;
  onRetakeQuiz: () => void;
}

export function ArchetypeRevealModal({
  archetype,
  onProceedToCustomize,
  onRetakeQuiz,
}: ArchetypeRevealModalProps) {
  useEffect(() => {
    soundFx.playRevealChord();
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-center items-center p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#C9B8F5]/30 overflow-hidden"
      >
        {/* Glow ambient circle in background */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: archetype.primaryColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Emblem Viewport */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#1A102A]/80 border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
              <SceneCanvas cameraPosition={[0, 0, 4.2]} fov={40}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[3, 5, 4]} intensity={2.0} color="#FFF5EB" />
                <pointLight position={[-3, -3, -2]} intensity={1.2} color={archetype.primaryColor} />
                <ProceduralSymbol
                  modelId={archetype.avatarId}
                  accentColor={archetype.primaryColor}
                  finish="iridescent"
                  scale={1.3}
                  interactive={true}
                />
              </SceneCanvas>

              <div className="absolute bottom-2.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-white/70 border border-white/10 pointer-events-none">
                Interactive 3D Preview
              </div>
            </div>

            <span className="text-xs font-mono text-[#C9B8F5] mt-3 tracking-wider">
              EMBLEM: {archetype.symbolName.toUpperCase()}
            </span>
          </div>

          {/* Right Column: Archetype Details */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FFE9A8] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARCHETYPE DISCOVERED</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
                {archetype.name}
              </h2>
              <p className="text-base text-[#C9B8F5] font-medium mt-1">
                {archetype.tagline}
              </p>
            </div>

            <p className="text-sm text-[#F7F3FF]/80 leading-relaxed font-light">
              {archetype.description}
            </p>

            {/* Trait tags (clean unboxed text with dots) */}
            <div className="py-2 border-y border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono text-[#FFE9A8]">
              <span className="text-white/40">TRAITS:</span>
              {archetype.traits.map((trait, i) => (
                <React.Fragment key={trait}>
                  <span>{trait}</span>
                  {i < archetype.traits.length - 1 && <span className="text-white/20">·</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Poetic quote */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs italic text-[#F7F3FF]/90 font-sans">
                &ldquo;{archetype.quote}&rdquo;
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onProceedToCustomize}
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9B8F5] via-[#FFCDBD] to-[#FFE9A8] text-[#160E24] font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>CUSTOMIZE MY IDENTITY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRetakeQuiz}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-[#F7F3FF] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
