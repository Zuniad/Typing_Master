import React, { useEffect } from 'react';
import { DurationOption, PersonalBest, TestStats, TypingMode } from '../types';
import { Trophy, RotateCcw, Target, Sparkles, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TestStats;
  mode: TypingMode;
  duration: DurationOption;
  personalBest?: PersonalBest;
  isNewPersonalBest: boolean;
  onRetry: () => void;
  onPracticeMistakes: () => void;
  hasMistakes: boolean;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  stats,
  mode,
  duration,
  personalBest,
  isNewPersonalBest,
  onRetry,
  onPracticeMistakes,
  hasMistakes,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: isNewPersonalBest ? 90 : 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#59E1FF', '#A78BFA', '#F4E9D4', '#10B981'],
        });
      } catch {
        // Safe fallback if canvas not available
      }
    }
  }, [isOpen, isNewPersonalBest]);

  if (!isOpen) return null;

  // Determine typist rank
  let rank = 'Apprentice Typist';
  let rankDesc = 'Building mechanical muscle memory';
  if (stats.netWpm >= 85 && stats.accuracy >= 96) {
    rank = 'Master Typographer';
    rankDesc = 'Exceptional speed and precision on vintage keys';
  } else if (stats.netWpm >= 65 && stats.accuracy >= 94) {
    rank = 'Mechanical Maestro';
    rankDesc = 'Fast, rhythmic cadence with high accuracy';
  } else if (stats.netWpm >= 45 && stats.accuracy >= 90) {
    rank = 'Proficient Touch Typist';
    rankDesc = 'Smooth typing flow with dependable accuracy';
  }

  // Mistakes analysis: top 4 mistyped characters
  const mistypedChars = Object.entries(stats.mistakesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0f1420] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(89,225,255,0.15)] text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close Results"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          {isNewPersonalBest ? (
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>NEW PERSONAL RECORD!</span>
            </div>
          ) : (
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
              SESSION COMPLETED
            </span>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {rank}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{rankDesc}</p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Gross WPM */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              GROSS WPM
            </span>
            <span className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">
              {stats.wpm}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Speed</span>
          </div>

          {/* Net WPM */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              NET WPM
            </span>
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {stats.netWpm}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Adjusted</span>
          </div>

          {/* Accuracy */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              ACCURACY
            </span>
            <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {stats.accuracy}%
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Precision</span>
          </div>

          {/* Time Elapsed */}
          <div className="bg-[#141b2b] border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              DURATION
            </span>
            <span className="text-3xl font-bold font-mono text-slate-200 tabular-nums">
              {Math.round(stats.elapsedSeconds)}s
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {duration === 0 ? 'Unlimited' : `${duration}s target`}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Strip */}
        <div className="bg-[#121724] border border-slate-800/80 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Characters:</span>
            <span className="font-mono font-semibold text-emerald-400">{stats.correctChars} correct</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-rose-400">{stats.incorrectChars} errors</span>
          </div>

          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            <span className="text-slate-400">Mode:</span>
            <span className="font-mono text-cyan-300 uppercase">{mode}</span>
          </div>

          {personalBest && (
            <div className="w-full flex items-center justify-between pt-2 mt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>Personal Best for this mode:</span>
              <span className="text-amber-300 font-bold">
                {personalBest.netWpm} WPM · {personalBest.accuracy}% Acc
              </span>
            </div>
          )}
        </div>

        {/* Mistakes Section if any */}
        {mistypedChars.length > 0 && (
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 mb-6">
            <span className="text-[11px] font-mono text-rose-300 uppercase font-semibold block mb-1.5">
              Weak Keys Identified:
            </span>
            <div className="flex flex-wrap gap-2">
              {mistypedChars.map(([char, count]) => (
                <span
                  key={char}
                  className="px-2 py-0.5 bg-rose-900/40 border border-rose-700/60 rounded text-xs font-mono text-rose-200"
                >
                  &lsquo;{char === ' ' ? 'SPACE' : char}&rsquo; ({count} {count === 1 ? 'error' : 'errors'})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(89,225,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          {hasMistakes && (
            <button
              onClick={onPracticeMistakes}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-violet-600/30 hover:bg-violet-600/40 text-violet-200 border border-violet-500/40 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4 text-violet-300" />
              <span>PRACTICE MISTAKES</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Back to Typewriter
          </button>
        </div>

      </div>
    </div>
  );
};
