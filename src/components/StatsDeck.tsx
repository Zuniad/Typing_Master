import React from 'react';
import { DurationOption, TestStats } from '../types';
import { RotateCcw, Play, Pause, Square } from 'lucide-react';

interface StatsDeckProps {
  stats: TestStats;
  remainingSeconds: number;
  selectedDuration: DurationOption;
  isActive: boolean;
  isPaused: boolean;
  onStartPause: () => void;
  onRestart: () => void;
  onFinish: () => void;
}

export const StatsDeck: React.FC<StatsDeckProps> = ({
  stats,
  remainingSeconds,
  selectedDuration,
  isActive,
  isPaused,
  onStartPause,
  onRestart,
  onFinish,
}) => {
  // Format timer display
  const isUnlimited = selectedDuration === 0;
  const displaySeconds = isUnlimited ? Math.floor(stats.elapsedSeconds) : remainingSeconds;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  // Progress percentage for countdown
  const progressPercent = isUnlimited
    ? 100
    : Math.max(0, Math.min(100, (remainingSeconds / selectedDuration) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto my-3 px-2 sm:px-4">
      <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Timer Display */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Circular Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-slate-800 fill-none"
                strokeWidth="3.5"
              />
              {!isUnlimited && (
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-cyan-400 fill-none transition-all duration-300"
                  strokeWidth="3.5"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              )}
            </svg>
            <span className="absolute font-mono font-bold text-sm tracking-tighter text-slate-100 tabular-nums">
              {formattedTime}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              {isUnlimited ? 'ELAPSED' : 'TIME REMAINING'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="font-semibold text-cyan-400 font-mono">
                {isUnlimited ? 'UNLIMITED' : `${selectedDuration}s TEST`}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">
                {isPaused ? 'PAUSED' : isActive ? 'ACTIVE' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Real-time Statistics Cards */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {/* Gross WPM */}
          <div className="flex flex-col items-center sm:items-start min-w-[70px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              GROSS WPM
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
              {stats.wpm}
            </span>
          </div>

          {/* Net WPM */}
          <div className="flex flex-col items-center sm:items-start min-w-[70px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              NET WPM
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 tabular-nums">
              {stats.netWpm}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center sm:items-start min-w-[70px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              ACCURACY
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {stats.accuracy}%
            </span>
          </div>

          {/* Characters (Correct / Errors) */}
          <div className="hidden md:flex flex-col items-start min-w-[90px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              KEYSTROKES
            </span>
            <div className="flex items-baseline gap-1 font-mono text-lg font-semibold tabular-nums">
              <span className="text-slate-200">{stats.correctChars}</span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-rose-400 text-sm">{stats.incorrectChars} err</span>
            </div>
          </div>
        </div>

        {/* Right: Test Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Start / Pause Button */}
          <button
            onClick={onStartPause}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer
              ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : isActive
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  : 'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 shadow-[0_0_15px_rgba(89,225,255,0.3)]'
              }
            `}
            title={isPaused ? 'Resume Test (Esc)' : isActive ? 'Pause Test (Esc)' : 'Start Test'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            ) : isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs font-medium transition-colors cursor-pointer"
            title="Restart Exercise (Tab)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Finish Early button for active or unlimited */}
          {isActive && (
            <button
              onClick={onFinish}
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-medium transition-colors cursor-pointer"
              title="Finish & View Results"
            >
              <Square className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">End</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
