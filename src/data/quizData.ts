/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Archetype, ArchetypeId, AvatarOption, BadgeTheme, QuizQuestion } from '../types';

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  dreamer: {
    id: 'dreamer',
    name: 'The Dreamer',
    title: 'The Dreamer',
    tagline: 'Architect of internal skies and quiet wonder',
    description:
      'You inhabit the borderlands of possibility and reverie. Where others see static boundaries, you perceive translucent horizons waiting to dissolve into pure intuition and boundless poetry.',
    traits: ['Introspective', 'Poetic', 'Boundless', 'Intuitive'],
    primaryColor: '#C9B8F5',
    secondaryColor: '#30243D',
    accentColor: '#F7F3FF',
    gradient: 'from-[#C9B8F5] via-[#8668B8] to-[#30243D]',
    symbolName: 'Stratos Cloud & Crescent',
    motif: 'Celestial Mists & Nebula Flow',
    defaultBadgeTheme: 'dreamy',
    quote: 'Every cloud holds a universe longing to rain starlight.',
    avatarId: 'cloud',
  },
  creator: {
    id: 'creator',
    name: 'The Creator',
    title: 'The Creator',
    tagline: 'Sculptor of tangible magic and unexpected ideas',
    description:
      'You shape form from raw curiosity and light. You cannot encounter an unmade idea without reaching for instruments to bring it breathing into the tangible, vivid world.',
    traits: ['Inventive', 'Experimental', 'Tactile', 'Radiant'],
    primaryColor: '#FFCDBD',
    secondaryColor: '#FFE9A8',
    accentColor: '#C9B8F5',
    gradient: 'from-[#FFCDBD] via-[#FFE9A8] to-[#C9B8F5]',
    symbolName: 'Mobius Prism',
    motif: 'Dynamic Geometry & Harmonic Waves',
    defaultBadgeTheme: 'creative',
    quote: 'To create is to offer the universe a shape it had not yet conceived.',
    avatarId: 'mobius',
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    title: 'The Explorer',
    tagline: 'Navigating uncharted frequencies of human discovery',
    description:
      'You are drawn toward the magnetic resonance of the distance. Every unfamiliar horizon is a living question, and every step into unmapped territory is your natural home.',
    traits: ['Pioneering', 'Resilient', 'Bold', 'Inquisitive'],
    primaryColor: '#C6E8D5',
    secondaryColor: '#28465C',
    accentColor: '#FFE9A8',
    gradient: 'from-[#C6E8D5] via-[#5A9E87] to-[#1E3040]',
    symbolName: 'Prism Spire',
    motif: 'Astrolabe Rings & Celestial Compass',
    defaultBadgeTheme: 'explorer',
    quote: 'The compass does not dictate the path; wonder does.',
    avatarId: 'crystal',
  },
  connector: {
    id: 'connector',
    name: 'The Connector',
    title: 'The Connector',
    tagline: 'Weaving the luminous threads between distinct souls',
    description:
      'You perceive the hidden harmonics between beings. You weave networks of warmth, transforming scattered stars into an illuminated, unforgettable constellation.',
    traits: ['Empathetic', 'Catalyst', 'Harmonizer', 'Magnetic'],
    primaryColor: '#FFCDBD',
    secondaryColor: '#C9B8F5',
    accentColor: '#F7F3FF',
    gradient: 'from-[#FFCDBD] via-[#C9B8F5] to-[#4A2D5E]',
    symbolName: 'Opal Core',
    motif: 'Harmonic Orbits & Interlaced Rings',
    defaultBadgeTheme: 'creative',
    quote: 'We are constellations meeting for the very first time.',
    avatarId: 'sphere',
  },
  thinker: {
    id: 'thinker',
    name: 'The Thinker',
    title: 'The Thinker',
    tagline: 'Distilling sacred clarity from the world’s quiet depths',
    description:
      'You discern order within chaos. Like light passing through optical crystal, your mind unearths the timeless principles beneath noisy surfaces with crystalline grace.',
    traits: ['Analytical', 'Perceptive', 'Deliberate', 'Profound'],
    primaryColor: '#30243D',
    secondaryColor: '#C9B8F5',
    accentColor: '#C6E8D5',
    gradient: 'from-[#30243D] via-[#483B64] to-[#C9B8F5]',
    symbolName: 'Lumina Bloom',
    motif: 'Faceted Crystals & Concentric Symmetry',
    defaultBadgeTheme: 'dreamy',
    quote: 'In stillness, the hidden architecture of truth reveals itself.',
    avatarId: 'flower',
  },
  visionary: {
    id: 'visionary',
    name: 'The Visionary',
    title: 'The Visionary',
    tagline: 'Casting constellations where tomorrow will soon land',
    description:
      'You construct realities before history catches up. You gaze far beyond immediate constraints, articulating landscapes of what will be with contagious conviction and magnetic courage.',
    traits: ['Audacious', 'Illuminating', 'Strategic', 'Inspiring'],
    primaryColor: '#FFE9A8',
    secondaryColor: '#C9B8F5',
    accentColor: '#FFCDBD',
    gradient: 'from-[#FFE9A8] via-[#E2A676] to-[#45275E]',
    symbolName: 'Solar Nova',
    motif: 'Radiant Starburst & Coronal Halos',
    defaultBadgeTheme: 'creative',
    quote: 'The future is not a place we visit; it is an identity we embody.',
    avatarId: 'nova',
  },
};

export const BADGE_THEMES: Record<'dreamy' | 'creative' | 'explorer', BadgeTheme> = {
  dreamy: {
    id: 'dreamy',
    name: 'Dreamy Atmosphere',
    tagline: 'Lavender mists, drifting clouds & iridescent starlight',
    primaryColor: '#C9B8F5',
    secondaryColor: '#30243D',
    bgGradient: 'from-[#2B1B40] via-[#1F1730] to-[#120B1E]',
    cardGlassBg: 'rgba(48, 36, 61, 0.72)',
    accentGlow: 'rgba(201, 184, 245, 0.35)',
    borderTone: 'rgba(201, 184, 245, 0.38)',
    badgeTextColor: '#F7F3FF',
  },
  creative: {
    id: 'creative',
    name: 'Creative Solar',
    tagline: 'Soft dawn peach, butter yellow & tactile prisms',
    primaryColor: '#FFCDBD',
    secondaryColor: '#FFE9A8',
    bgGradient: 'from-[#3D2526] via-[#2D1B28] to-[#170E1A]',
    cardGlassBg: 'rgba(56, 33, 40, 0.72)',
    accentGlow: 'rgba(255, 205, 189, 0.35)',
    borderTone: 'rgba(255, 205, 189, 0.38)',
    badgeTextColor: '#FFF5F0',
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer Aurora',
    tagline: 'Mint glaciers, cosmic cobalt & celestial compass lines',
    primaryColor: '#C6E8D5',
    secondaryColor: '#28465C',
    bgGradient: 'from-[#143134] via-[#10232B] to-[#0A141A]',
    cardGlassBg: 'rgba(20, 49, 52, 0.72)',
    accentGlow: 'rgba(198, 232, 213, 0.35)',
    borderTone: 'rgba(198, 232, 213, 0.38)',
    badgeTextColor: '#F0FFF7',
  },
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'nova',
    name: 'Solar Nova',
    archetypeHint: 'visionary',
    description: 'A multi-faceted starburst radiating starlight and gravitational presence.',
    shapeHint: 'Faceted Starburst',
  },
  {
    id: 'flower',
    name: 'Lumina Bloom',
    archetypeHint: 'thinker',
    description: 'Sculpted translucent glass petals opening toward enlightenment.',
    shapeHint: 'Curved Glass Petals',
  },
  {
    id: 'sphere',
    name: 'Opal Core',
    archetypeHint: 'connector',
    description: 'A pearlescent floating sphere encircled by golden planetary orbital rings.',
    shapeHint: 'Ringed Pearl Sphere',
  },
  {
    id: 'mobius',
    name: 'Mobius Prism',
    archetypeHint: 'creator',
    description: 'An endless looping geometric sculpture bridging imagination and form.',
    shapeHint: 'Torus Knot Prism',
  },
  {
    id: 'crystal',
    name: 'Prism Spire',
    archetypeHint: 'explorer',
    description: 'A sharp, double-terminated crystal cluster capturing prismatic reflections.',
    shapeHint: 'Faceted Crystal Spire',
  },
  {
    id: 'cloud',
    name: 'Stratos Cloud',
    archetypeHint: 'dreamer',
    description: 'A dreamy, buoyant vapor cloud holding iridescent drops of reverie.',
    shapeHint: 'Floating Vapor Cloud',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'If your personality were a place, what would it look like?',
    subtitle: 'Close your eyes for a moment. Where does your spirit feel instantly at ease?',
    options: [
      {
        id: 'place_cloud',
        label: 'A glass observatory perched among pastel clouds',
        detail: 'Quiet telescope domes, endless sunsets, and floating skyways.',
        archetypeWeights: { dreamer: 3, thinker: 1 },
        previewColor: '#C9B8F5',
        iconType: 'place',
      },
      {
        id: 'place_workshop',
        label: 'A sun-drenched architectural workshop on a cliffside',
        detail: 'Drafting tables, raw clay, wooden gears, and panoramic ocean wind.',
        archetypeWeights: { creator: 3, visionary: 1 },
        previewColor: '#FFCDBD',
        iconType: 'place',
      },
      {
        id: 'place_archipelago',
        label: 'An untracked archipelago under aurora borealis',
        detail: 'Emerald fjords, uncharted sea passages, and magnetic lanterns.',
        archetypeWeights: { explorer: 3, thinker: 1 },
        previewColor: '#C6E8D5',
        iconType: 'place',
      },
      {
        id: 'place_terrace',
        label: 'A warm lantern-lit courtyard garden welcoming all travelers',
        detail: 'Shared tea tables, laughter vibrating through jasmine, endless warmth.',
        archetypeWeights: { connector: 3, dreamer: 1 },
        previewColor: '#FFE9A8',
        iconType: 'place',
      },
    ],
  },
  {
    id: 2,
    question: 'Choose an object that represents your energy.',
    subtitle: 'Which artifact calls out to you when you enter the cosmic chamber?',
    options: [
      {
        id: 'obj_star',
        label: 'A levitating solar starburst capturing cosmic fire',
        detail: 'Radiates self-renewing warmth and projects guiding beams into the dark.',
        archetypeWeights: { visionary: 3, creator: 1 },
        previewColor: '#FFE9A8',
        iconType: 'object',
      },
      {
        id: 'obj_glass',
        label: 'An iridescent glass flower that blooms with morning light',
        detail: 'Delicate yet unbreakable, refracting pure light into a spectrum.',
        archetypeWeights: { dreamer: 2, thinker: 2 },
        previewColor: '#C9B8F5',
        iconType: 'object',
      },
      {
        id: 'obj_compass',
        label: 'An ancient brass astrolabe tuned to curiosity',
        detail: 'Its needle points not to north, but toward whatever is most unknown.',
        archetypeWeights: { explorer: 3, creator: 1 },
        previewColor: '#C6E8D5',
        iconType: 'object',
      },
      {
        id: 'obj_rings',
        label: 'Two interwoven pearlescent rings singing in resonance',
        detail: 'When one moves, the other responds with melodic resonance across space.',
        archetypeWeights: { connector: 3, visionary: 1 },
        previewColor: '#FFCDBD',
        iconType: 'object',
      },
    ],
  },
  {
    id: 3,
    question: 'How do you approach something unfamiliar?',
    subtitle: 'You arrive at a doorway with symbols nobody has ever recorded.',
    options: [
      {
        id: 'appr_listen',
        label: 'I pause, listen deeply, and feel its atmosphere first',
        detail: 'Letting intuition and poetic wonder decipher the hidden rhythm.',
        archetypeWeights: { dreamer: 3, connector: 1 },
        previewColor: '#C9B8F5',
        iconType: 'approach',
      },
      {
        id: 'appr_build',
        label: 'I sketch it, touch its textures, and build a prototype',
        detail: 'Understanding begins when my hands test what it wants to become.',
        archetypeWeights: { creator: 3, explorer: 1 },
        previewColor: '#FFCDBD',
        iconType: 'approach',
      },
      {
        id: 'appr_venture',
        label: 'I step through immediately to see how deep it goes',
        detail: 'Hesitation is the enemy of discovery; the map forms beneath our feet.',
        archetypeWeights: { explorer: 3, visionary: 1 },
        previewColor: '#C6E8D5',
        iconType: 'approach',
      },
      {
        id: 'appr_deconstruct',
        label: 'I study the grammar of its symbols and deduce its logic',
        detail: 'Every mystery yields to patience, structural analysis, and clear thought.',
        archetypeWeights: { thinker: 3, creator: 1 },
        previewColor: '#FFE9A8',
        iconType: 'approach',
      },
    ],
  },
  {
    id: 4,
    question: 'Select a color frequency that feels most like you.',
    subtitle: 'Which shade mirrors the current vibration of your life?',
    options: [
      {
        id: 'color_lavender',
        label: 'Celestial Lavender & Twilight Mist',
        detail: '#C9B8F5 · Calm depth, mystic clarity, and reflective serenity.',
        archetypeWeights: { dreamer: 3, thinker: 2 },
        previewColor: '#C9B8F5',
        iconType: 'color',
      },
      {
        id: 'color_peach',
        label: 'Dawn Peach & Warm Amber Coral',
        detail: '#FFCDBD · Tactile kindness, blossoming energy, and spontaneous joy.',
        archetypeWeights: { creator: 2, connector: 3 },
        previewColor: '#FFCDBD',
        iconType: 'color',
      },
      {
        id: 'color_mint',
        label: 'Aurora Mint & Glacial Sage',
        detail: '#C6E8D5 · Fresh wilderness, resilient vitality, and uncharted horizons.',
        archetypeWeights: { explorer: 3, thinker: 1 },
        previewColor: '#C6E8D5',
        iconType: 'color',
      },
      {
        id: 'color_yellow',
        label: 'Solar Butter Yellow & Radiant Gold',
        detail: '#FFE9A8 · Illuminating vision, bold optimism, and generative power.',
        archetypeWeights: { visionary: 3, creator: 2 },
        previewColor: '#FFE9A8',
        iconType: 'color',
      },
    ],
  },
  {
    id: 5,
    question: 'What are you hoping to discover at this event?',
    subtitle: 'When the day concludes and you hold your badge, what made it extraordinary?',
    options: [
      {
        id: 'disc_kindred',
        label: 'Kindred creators to build impossible experiments with',
        detail: 'Sparking collaborative magic that none of us could manifest alone.',
        archetypeWeights: { creator: 3, visionary: 2 },
        previewColor: '#FFCDBD',
        iconType: 'discovery',
      },
      {
        id: 'disc_perspective',
        label: 'A sudden paradigm shift that expands how I view reality',
        detail: 'The single talk or late-night debate that rewires my mental models.',
        archetypeWeights: { thinker: 3, explorer: 1 },
        previewColor: '#C9B8F5',
        iconType: 'discovery',
      },
      {
        id: 'disc_belonging',
        label: 'Deep, honest connections that turn strangers into companions',
        detail: 'Conversation that moves past polite surface into genuine resonance.',
        archetypeWeights: { connector: 3, dreamer: 1 },
        previewColor: '#FFE9A8',
        iconType: 'discovery',
      },
      {
        id: 'disc_frontier',
        label: 'The first glimpse of an unexplored technological frontier',
        detail: 'Spotting the future before the rest of the world wakes up to it.',
        archetypeWeights: { visionary: 3, explorer: 2 },
        previewColor: '#C6E8D5',
        iconType: 'discovery',
      },
    ],
  },
];

/**
 * Deterministically calculates the personality archetype from quiz answers
 */
export function calculateArchetype(selectedOptionIds: string[]): ArchetypeId {
  const scores: Record<ArchetypeId, number> = {
    dreamer: 0,
    creator: 0,
    explorer: 0,
    connector: 0,
    thinker: 0,
    visionary: 0,
  };

  // Find corresponding options and aggregate weights
  for (const q of QUIZ_QUESTIONS) {
    for (const opt of q.options) {
      if (selectedOptionIds.includes(opt.id)) {
        for (const [archetype, weight] of Object.entries(opt.archetypeWeights)) {
          scores[archetype as ArchetypeId] += weight || 0;
        }
      }
    }
  }

  // Find the highest scoring archetype, with deterministic tie-breaking
  let highestScore = -1;
  let chosenArchetype: ArchetypeId = 'dreamer';

  const orderPriority: ArchetypeId[] = [
    'dreamer',
    'creator',
    'explorer',
    'connector',
    'thinker',
    'visionary',
  ];

  for (const arch of orderPriority) {
    if (scores[arch] > highestScore) {
      highestScore = scores[arch];
      chosenArchetype = arch;
    }
  }

  return chosenArchetype;
}
