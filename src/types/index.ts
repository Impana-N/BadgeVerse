/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ArchetypeId =
  | 'dreamer'
  | 'creator'
  | 'explorer'
  | 'connector'
  | 'thinker'
  | 'visionary';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  title: string;
  tagline: string;
  description: string;
  traits: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradient: string;
  symbolName: string;
  motif: string;
  defaultBadgeTheme: BadgeThemeId;
  quote: string;
  avatarId: AvatarModelId;
}

export interface QuizOption {
  id: string;
  label: string;
  detail: string;
  archetypeWeights: Partial<Record<ArchetypeId, number>>;
  previewColor: string;
  iconType: 'place' | 'object' | 'approach' | 'color' | 'discovery';
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

export type BadgeThemeId = 'dreamy' | 'creative' | 'explorer';

export interface BadgeTheme {
  id: BadgeThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  bgGradient: string;
  cardGlassBg: string;
  accentGlow: string;
  borderTone: string;
  badgeTextColor: string;
}

export type AvatarModelId =
  | 'nova'
  | 'flower'
  | 'sphere'
  | 'mobius'
  | 'crystal'
  | 'cloud';

export interface AvatarOption {
  id: AvatarModelId;
  name: string;
  archetypeHint: ArchetypeId;
  description: string;
  shapeHint: string;
}

export type FinishStyle = 'iridescent' | 'hologram' | 'clay' | 'metallic';

export interface CustomizationSettings {
  avatarId: AvatarModelId;
  accentColor: string;
  finish: FinishStyle;
  badgeTheme: BadgeThemeId;
}

export interface AttendeeInfo {
  firstName: string;
  lastName: string;
  email: string;
  twitter: string;
  github: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  twitter?: string;
  github?: string;
}

export type AppStep =
  | 'landing'
  | 'quiz'
  | 'archetype_reveal'
  | 'customize'
  | 'register'
  | 'badge_reveal';
