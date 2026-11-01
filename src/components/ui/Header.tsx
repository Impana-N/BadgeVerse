/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { AppStep } from '../../types';

interface HeaderProps {
  currentStep: AppStep;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
  onNavigateStep?: (step: AppStep) => void;
}

export function Header({
  currentStep,
  soundEnabled,
  onToggleSound,
  onReset,
}: HeaderProps) {
  const stepsList: { key: AppStep; label: string }[] = [
    { key: 'landing', label: 'Gateway' },
    { key: 'quiz', label: 'Discovery' },
    { key: 'archetype_reveal', label: 'Archetype' },
    { key: 'customize', label: 'Identity' },
    { key: 'register', label: 'Details' },
    { key: 'badge_reveal', label: 'Universe Pass' },
  ];

  const currentIdx = stepsList.findIndex((s) => s.key === currentStep);

  return (
    <header className="no-print relative z-40 w-full px-6 py-4 flex items-center justify-between border-b border-[#C9B8F5]/15 backdrop-blur-md bg-[#160E24]/60">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentStep !== 'landing') {
              if (window.confirm('Return to the gateway? Your current badge will be preserved unless reset.')) {
                onReset();
              }
            }
          }}
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#F7F3FF] hover:text-[#C9B8F5] transition-colors whitespace-nowrap"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C9B8F5] to-[#FFCDBD] flex items-center justify-center text-[#160E24] shadow-md shadow-[#C9B8F5]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-extrabold tracking-wide">BADGEVERSE</span>
        </a>

        <div className="hidden lg:block text-xs text-[#C9B8F5]/70 font-mono pl-3 border-l border-[#C9B8F5]/20">
          A little world. A whole identity.
        </div>
      </div>

      {/* Zone 2: Progress indicator */}
      {currentStep !== 'landing' && (
        <div className="hidden md:flex items-center gap-2 text-xs font-mono">
          {stepsList.slice(1).map((step, idx) => {
            const stepIdx = idx + 1;
            const isCurrent = step.key === currentStep;
            const isCompleted = currentIdx > stepIdx;

            return (
              <React.Fragment key={step.key}>
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    isCurrent
                      ? 'text-[#FFE9A8] font-bold'
                      : isCompleted
                      ? 'text-[#C9B8F5]'
                      : 'text-white/30'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent
                        ? 'bg-[#FFE9A8] text-[#160E24]'
                        : isCompleted
                        ? 'bg-[#C9B8F5]/20 text-[#C9B8F5]'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {isCompleted ? '✓' : stepIdx}
                  </span>
                  <span>{step.label}</span>
                </div>
                {idx < stepsList.slice(1).length - 1 && (
                  <span className="text-white/20">·</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Zone 3: Interactive Utilities */}
      <div className="flex items-center gap-2.5">
        {/* Sound Toggle (Muted by default) */}
        <button
          onClick={onToggleSound}
          type="button"
          aria-label={soundEnabled ? 'Mute generative audio' : 'Enable generative celestial audio'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C9B8F5]/25 bg-white/5 hover:bg-white/10 text-xs text-[#F7F3FF] transition-colors"
          title={soundEnabled ? 'Sound is on' : 'Sound is muted (click to enable)'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#FFE9A8]" />
              <span className="hidden sm:inline font-mono text-[11px]">Audio On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/50" />
              <span className="hidden sm:inline font-mono text-[11px] text-white/60">Audio Off</span>
            </>
          )}
        </button>

        {/* Reset / New Journey */}
        {currentStep !== 'landing' && (
          <button
            onClick={() => {
              if (window.confirm('Reset your badge progress and restart the journey?')) {
                onReset();
              }
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300/20 bg-red-500/10 hover:bg-red-500/20 text-xs text-red-200 transition-colors"
            title="Reset and clear all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Restart</span>
          </button>
        )}
      </div>
    </header>
  );
}
