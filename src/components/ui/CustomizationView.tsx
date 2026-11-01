/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight, Palette, Sparkles, Layers } from 'lucide-react';
import {
  Archetype,
  AvatarModelId,
  BadgeThemeId,
  CustomizationSettings,
  FinishStyle,
} from '../../types';
import { AVATAR_OPTIONS, BADGE_THEMES } from '../../data/quizData';
import { SceneCanvas } from '../3d/SceneCanvas';
import { ProceduralSymbol } from '../3d/ProceduralSymbols';
import { soundFx } from '../../utils/audio';

interface CustomizationViewProps {
  archetype: Archetype;
  settings: CustomizationSettings;
  onChangeSettings: (settings: CustomizationSettings) => void;
  onProceedToRegister: () => void;
  onBackToArchetype: () => void;
}

export function CustomizationView({
  archetype,
  settings,
  onChangeSettings,
  onProceedToRegister,
  onBackToArchetype,
}: CustomizationViewProps) {
  const COLOR_PALETTES = [
    { label: 'Lavender', hex: '#C9B8F5' },
    { label: 'Dawn Peach', hex: '#FFCDBD' },
    { label: 'Butter Yellow', hex: '#FFE9A8' },
    { label: 'Aurora Mint', hex: '#C6E8D5' },
    { label: 'Violet Astral', hex: '#B794F4' },
    { label: 'Coral Flame', hex: '#F6AD55' },
  ];

  const FINISH_STYLES: { id: FinishStyle; name: string; desc: string }[] = [
    { id: 'iridescent', name: 'Iridescent Glass', desc: 'Refractive clearcoat & soft gloss' },
    { id: 'hologram', name: 'Ethereal Hologram', desc: 'Semi-translucent with inner glow' },
    { id: 'clay', name: 'Velvet Soft Clay', desc: 'Matte tactile surface' },
    { id: 'metallic', name: 'Starlit Metallic', desc: 'High luster specular metal' },
  ];

  const handleAvatarChange = (avatarId: AvatarModelId) => {
    soundFx.playTap();
    onChangeSettings({ ...settings, avatarId });
  };

  const handleColorChange = (accentColor: string) => {
    soundFx.playTap();
    onChangeSettings({ ...settings, accentColor });
  };

  const handleFinishChange = (finish: FinishStyle) => {
    soundFx.playTap();
    onChangeSettings({ ...settings, finish });
  };

  const handleThemeChange = (badgeTheme: BadgeThemeId) => {
    soundFx.playTap();
    onChangeSettings({ ...settings, badgeTheme });
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between p-6 max-w-6xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="w-full flex items-center justify-between pt-2">
        <button
          onClick={onBackToArchetype}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#F7F3FF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Archetype</span>
        </button>

        <span className="text-xs font-mono text-[#C9B8F5]/80">
          STEP 02 OF 04 · IDENTITY FORGE
        </span>
      </div>

      {/* Main 2-Column Layout */}
      <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive 3D Real-time Emblem Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-square rounded-3xl bg-gradient-to-b from-[#221334] to-[#140B20] border border-[#C9B8F5]/30 shadow-2xl flex items-center justify-center overflow-hidden">
              <SceneCanvas cameraPosition={[0, 0, 4.2]} fov={42}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[4, 5, 4]} intensity={2.0} color="#FFF8F0" />
                <pointLight position={[-4, -3, -2]} intensity={1.2} color={settings.accentColor} />
                <ProceduralSymbol
                  modelId={settings.avatarId}
                  accentColor={settings.accentColor}
                  finish={settings.finish}
                  scale={1.3}
                  interactive={true}
                />
              </SceneCanvas>

              {/* Badges / Overlay Info */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-white/80 border border-white/10">
                LIVE 3D EMBLEM
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-[#FFE9A8] border border-white/10">
                DRAG OR MOVE TO TILT
              </div>
            </div>

            {/* Emblem caption */}
            <div className="mt-3 text-center">
              <p className="text-sm font-bold text-white">
                {AVATAR_OPTIONS.find((a) => a.id === settings.avatarId)?.name}
              </p>
              <p className="text-xs text-[#C9B8F5] font-light max-w-xs mt-0.5">
                {AVATAR_OPTIONS.find((a) => a.id === settings.avatarId)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Customization Controls Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Customize Your Digital Identity
            </h2>
            <p className="text-xs sm:text-sm text-[#F7F3FF]/70 mt-1">
              Select your 3D avatar emblem, visual finish, accent vibration, and event badge theme.
            </p>
          </div>

          {/* 1. Avatar Model Selector (6 choices) */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#C9B8F5] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE9A8]" />
              <span>1. Choose 3D Emblem Symbol</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = settings.avatarId === opt.id;
                const isDefault = opt.id === archetype.avatarId;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAvatarChange(opt.id)}
                    type="button"
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-[#37234E] border-[#FFE9A8] text-white shadow-md shadow-[#C9B8F5]/20 ring-1 ring-[#FFE9A8]/50'
                        : 'bg-[#201330]/70 hover:bg-[#2A193F] border-white/10 text-white/80'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{opt.name}</span>
                      {isDefault && (
                        <span className="text-[9px] font-mono text-[#FFE9A8] px-1 bg-white/10 rounded">
                          Archetype
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/50 block mt-1">
                      {opt.shapeHint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Accent Color Palette */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#C9B8F5] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#FFCDBD]" />
              <span>2. Select Cosmic Accent Color</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLOR_PALETTES.map((color) => {
                const isSelected = settings.accentColor.toLowerCase() === color.hex.toLowerCase();

                return (
                  <button
                    key={color.hex}
                    onClick={() => handleColorChange(color.hex)}
                    type="button"
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#37234E] border-white shadow-md ring-1 ring-white/50'
                        : 'bg-[#201330]/70 hover:bg-[#2A193F] border-white/10'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-white/30 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#160E24]" />}
                    </div>
                    <span className="text-[10px] font-medium text-white/90 truncate max-w-[65px]">
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Surface Finish Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#C9B8F5] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C6E8D5]" />
              <span>3. Surface Finish & Texture</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {FINISH_STYLES.map((finish) => {
                const isSelected = settings.finish === finish.id;

                return (
                  <button
                    key={finish.id}
                    onClick={() => handleFinishChange(finish.id)}
                    type="button"
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-[#37234E] border-[#FFE9A8] text-white shadow-md'
                        : 'bg-[#201330]/70 hover:bg-[#2A193F] border-white/10 text-white/70'
                    }`}
                  >
                    <div className="font-semibold text-white">{finish.name}</div>
                    <div className="text-[10px] text-white/50 mt-0.5">{finish.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Badge Theme Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#C9B8F5]">
              4. Event Badge Theme
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['dreamy', 'creative', 'explorer'] as BadgeThemeId[]).map((themeKey) => {
                const themeObj = BADGE_THEMES[themeKey];
                const isSelected = settings.badgeTheme === themeKey;

                return (
                  <button
                    key={themeKey}
                    onClick={() => handleThemeChange(themeKey)}
                    type="button"
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-[#37234E] border-[#FFE9A8] text-white ring-1 ring-[#FFE9A8]/40'
                        : 'bg-[#201330]/70 hover:bg-[#2A193F] border-white/10 text-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: themeObj.primaryColor }}
                      />
                      <span>{themeObj.name}</span>
                    </div>
                    <div className="text-[10px] text-white/50 mt-1 leading-snug">
                      {themeObj.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA to Attendee Info */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-[#C9B8F5]/10">
        <span className="text-xs font-mono text-[#F7F3FF]/50 hidden sm:inline">
          Emblem and theme will be encoded into your final pass
        </span>

        <button
          onClick={onProceedToRegister}
          type="button"
          className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9B8F5] via-[#FFCDBD] to-[#FFE9A8] text-[#160E24] font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>PUT A NAME TO YOUR UNIVERSE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
