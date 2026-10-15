import React from 'react';
import { DurationOption, TypingDifficulty, TypingMode } from '../types';

interface ModeSelectorProps {
  currentMode: TypingMode;
  onSelectMode: (mode: TypingMode) => void;
  difficulty: TypingDifficulty;
  onSelectDifficulty: (diff: TypingDifficulty) => void;
  selectedDuration: DurationOption;
  onSelectDuration: (dur: DurationOption) => void;
  onOpenCustomModal: () => void;
}

const MODES: { id: TypingMode; label: string; desc: string }[] = [
  { id: 'alphabet', label: 'Alphabet', desc: 'Letter drills & pangrams' },
  { id: 'alphanumeric', label: 'Alphanumeric', desc: 'Letters & numbers' },
  { id: 'special', label: 'Special Chars', desc: 'Punctuation & symbols' },
  { id: 'mixed', label: 'Mixed Challenge', desc: 'Code & rich text' },
  { id: 'sentences', label: 'Sentences', desc: 'Literary prose' },
  { id: 'custom', label: 'Custom Text', desc: 'Your own passages' },
];

const DURATIONS: { value: DurationOption; label: string }[] = [
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 120, label: '120s' },
  { value: 0, label: 'Unlimited' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  difficulty,
  onSelectDifficulty,
  selectedDuration,
  onSelectDuration,
  onOpenCustomModal,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 mb-3">
      <div className="glass-panel-subtle rounded-xl p-2.5 sm:p-3 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        
        {/* Mode Selector Segmented Group */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {MODES.map((mode) => {
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  if (mode.id === 'custom') {
                    onOpenCustomModal();
                  } else {
                    onSelectMode(mode.id);
                  }
                }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer
                  ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
                title={mode.desc}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Difficulty (if sentences) + Durations */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Difficulty tabs for Sentences mode */}
          {currentMode === 'sentences' && (
            <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800 text-[11px]">
              {(['beginner', 'intermediate', 'advanced'] as TypingDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onSelectDifficulty(diff)}
                  className={`
                    px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors cursor-pointer
                    ${
                      difficulty === diff
                        ? 'bg-slate-700 text-slate-100 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}

          {/* Duration Selector */}
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800 text-[11px]">
            {DURATIONS.map((dur) => (
              <button
                key={dur.value}
                onClick={() => onSelectDuration(dur.value)}
                className={`
                  px-2 py-0.5 rounded whitespace-nowrap transition-colors cursor-pointer font-mono
                  ${
                    selectedDuration === dur.value
                      ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
