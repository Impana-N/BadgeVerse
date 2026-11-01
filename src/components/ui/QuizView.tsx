/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { soundFx } from '../../utils/audio';

interface QuizViewProps {
  answers: Record<number, string>;
  onSelectOption: (questionId: number, optionId: string) => void;
  onCompleteQuiz: () => void;
  onBackToLanding: () => void;
}

export function QuizView({
  answers,
  onSelectOption,
  onCompleteQuiz,
  onBackToLanding,
}: QuizViewProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentAnswer = answers[currentQ.id];
  const progressPercent = ((currentQuestionIdx + 1) / totalQuestions) * 100;

  const handleOptionClick = (optionId: string) => {
    soundFx.playSelectChime();
    onSelectOption(currentQ.id, optionId);

    // Smooth auto-advance after 300ms
    setTimeout(() => {
      if (currentQuestionIdx < totalQuestions - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
      } else {
        onCompleteQuiz();
      }
    }, 320);
  };

  const handlePrev = () => {
    soundFx.playTap();
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    } else {
      onBackToLanding();
    }
  };

  const handleNext = () => {
    soundFx.playTap();
    if (currentAnswer) {
      if (currentQuestionIdx < totalQuestions - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
      } else {
        onCompleteQuiz();
      }
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between p-6 max-w-4xl mx-auto">
      {/* Top Question Progress Header */}
      <div className="w-full space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#C9B8F5]/80">
          <button
            onClick={handlePrev}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[#F7F3FF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentQuestionIdx === 0 ? 'Gateway' : 'Previous'}</span>
          </button>

          <span className="tracking-wider">
            QUESTION {currentQuestionIdx + 1} OF {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C9B8F5] via-[#FFCDBD] to-[#FFE9A8]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Question & Options Area */}
      <div className="my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Question Text */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white text-wrap-balance">
                {currentQ.question}
              </h2>
              <p className="text-sm text-[#F7F3FF]/70 font-light">
                {currentQ.subtitle}
              </p>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {currentQ.options.map((option, idx) => {
                const isSelected = currentAnswer === option.id;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionClick(option.id)}
                    type="button"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#3D2554] to-[#25173B] border-[#FFE9A8] shadow-lg shadow-[#C9B8F5]/20 ring-1 ring-[#FFE9A8]/40'
                        : 'bg-[#221533]/60 hover:bg-[#2C1C42]/80 border-white/10 hover:border-[#C9B8F5]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      {/* Option visual indicator swatch */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full border border-white/30 shadow-sm flex items-center justify-center shrink-0"
                          style={{ backgroundColor: option.previewColor }}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#160E24]" />}
                        </div>
                        <span className="text-xs font-mono text-white/50 group-hover:text-white/80">
                          Option 0{idx + 1}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-[#FFE9A8] text-[#160E24] flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#F7F3FF] leading-snug">
                        {option.label}
                      </h3>
                      <p className="text-xs text-[#F7F3FF]/70 mt-1.5 leading-relaxed">
                        {option.detail}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation controls */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-[#C9B8F5]/10 text-xs font-mono text-[#F7F3FF]/60">
        <span>Select an answer to advance automatically</span>

        {currentAnswer && (
          <button
            onClick={handleNext}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans font-medium transition-colors"
          >
            <span>{currentQuestionIdx < totalQuestions - 1 ? 'Next' : 'Reveal Archetype'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
