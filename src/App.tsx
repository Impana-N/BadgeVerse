/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  AppStep,
  ArchetypeId,
  AttendeeInfo,
  CustomizationSettings,
} from './types';
import {
  ARCHETYPES,
  BADGE_THEMES,
  calculateArchetype,
} from './data/quizData';
import { buildVCardPayload, generateQrDataUrl } from './utils/qrcode';
import { soundFx } from './utils/audio';

// Components
import { Header } from './components/ui/Header';
import { LandingView } from './components/ui/LandingView';
import { QuizView } from './components/ui/QuizView';
import { ArchetypeRevealModal } from './components/ui/ArchetypeRevealModal';
import { CustomizationView } from './components/ui/CustomizationView';
import { RegistrationFormView } from './components/ui/RegistrationFormView';
import { RevealBadgeView } from './components/ui/RevealBadgeView';

export default function App() {
  // Navigation Step State
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');

  // Audio mute/unmute state (disabled by default per instructions)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Quiz Answers (Question ID -> Option ID)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  // Determined Personality Archetype
  const [archetypeId, setArchetypeId] = useState<ArchetypeId>('dreamer');

  // Customization Settings
  const [customization, setCustomization] = useState<CustomizationSettings>({
    avatarId: 'cloud',
    accentColor: '#C9B8F5',
    finish: 'iridescent',
    badgeTheme: 'dreamy',
  });

  // Attendee Contact Information
  const [attendee, setAttendee] = useState<AttendeeInfo>({
    firstName: '',
    lastName: '',
    email: '',
    twitter: '',
    github: '',
  });

  // Unique local attendee pass number
  const [attendeeNumber, setAttendeeNumber] = useState<string>(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `BV-2026-${randomSuffix}`;
  });

  // Toggle generative procedural audio
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
    if (next) {
      soundFx.playTap();
    }
  };

  // Reset all state back to initial fresh start
  const handleResetAll = () => {
    soundFx.playTap();
    setCurrentStep('landing');
    setQuizAnswers({});
    setArchetypeId('dreamer');
    setCustomization({
      avatarId: 'cloud',
      accentColor: '#C9B8F5',
      finish: 'iridescent',
      badgeTheme: 'dreamy',
    });
    setAttendee({
      firstName: '',
      lastName: '',
      email: '',
      twitter: '',
      github: '',
    });
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setAttendeeNumber(`BV-2026-${randomSuffix}`);
  };

  // Record an answer during the quiz
  const handleSelectQuizOption = (questionId: number, optionId: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Complete the quiz: score answers deterministically and initialize archetype defaults
  const handleCompleteQuiz = () => {
    const selectedIds = Object.values(quizAnswers);
    const calculated = calculateArchetype(selectedIds);
    setArchetypeId(calculated);

    const arch = ARCHETYPES[calculated];
    // Sync initial customization to match the discovered archetype
    setCustomization({
      avatarId: arch.avatarId,
      accentColor: arch.primaryColor,
      finish: 'iridescent',
      badgeTheme: arch.defaultBadgeTheme,
    });

    setCurrentStep('archetype_reveal');
  };

  // Active Archetype and Theme objects
  const currentArchetype = ARCHETYPES[archetypeId];
  const currentTheme = BADGE_THEMES[customization.badgeTheme];

  // Build Real vCard Payload
  const vCardString = useMemo(() => {
    return buildVCardPayload(attendee, currentArchetype.name);
  }, [attendee, currentArchetype]);

  // Generate Real QR Code Data URL using qrcode-generator
  const qrDataUrl = useMemo(() => {
    if (!vCardString) return '';
    return generateQrDataUrl(vCardString, 8, 4);
  }, [vCardString]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#160E24] text-[#F7F3FF]">
      {/* Top Header bar with Top Bar Contract compliance */}
      <Header
        currentStep={currentStep}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onReset={handleResetAll}
        onNavigateStep={(step) => setCurrentStep(step)}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col relative z-10">
        {currentStep === 'landing' && (
          <LandingView
            onEnter={() => {
              soundFx.playTap();
              setCurrentStep('quiz');
            }}
          />
        )}

        {currentStep === 'quiz' && (
          <QuizView
            answers={quizAnswers}
            onSelectOption={handleSelectQuizOption}
            onCompleteQuiz={handleCompleteQuiz}
            onBackToLanding={() => {
              soundFx.playTap();
              setCurrentStep('landing');
            }}
          />
        )}

        {currentStep === 'archetype_reveal' && (
          <ArchetypeRevealModal
            archetype={currentArchetype}
            onProceedToCustomize={() => {
              soundFx.playTap();
              setCurrentStep('customize');
            }}
            onRetakeQuiz={() => {
              soundFx.playTap();
              setCurrentStep('quiz');
            }}
          />
        )}

        {currentStep === 'customize' && (
          <CustomizationView
            archetype={currentArchetype}
            settings={customization}
            onChangeSettings={(updated) => setCustomization(updated)}
            onProceedToRegister={() => {
              soundFx.playTap();
              setCurrentStep('register');
            }}
            onBackToArchetype={() => {
              soundFx.playTap();
              setCurrentStep('archetype_reveal');
            }}
          />
        )}

        {currentStep === 'register' && (
          <RegistrationFormView
            attendee={attendee}
            onChangeAttendee={(updated) => setAttendee(updated)}
            onGenerateBadge={() => {
              soundFx.playBadgeGenerated();
              setCurrentStep('badge_reveal');
            }}
            onBackToCustomization={() => {
              soundFx.playTap();
              setCurrentStep('customize');
            }}
            onCancelForm={() => {
              setAttendee({
                firstName: '',
                lastName: '',
                email: '',
                twitter: '',
                github: '',
              });
            }}
          />
        )}

        {currentStep === 'badge_reveal' && (
          <RevealBadgeView
            attendee={attendee}
            archetype={currentArchetype}
            theme={currentTheme}
            customization={customization}
            qrDataUrl={qrDataUrl}
            vCardString={vCardString}
            attendeeNumber={attendeeNumber}
            onEditDetails={() => {
              soundFx.playTap();
              setCurrentStep('register');
            }}
            onRestart={handleResetAll}
          />
        )}
      </main>
    </div>
  );
}
