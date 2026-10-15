import React from 'react';
import { Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';
import { AppSettings } from '../types';

interface ControlsHeaderProps {
  settings: AppSettings;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onNewTest: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const ControlsHeader: React.FC<ControlsHeaderProps> = ({
  settings,
  onToggleSound,
  onOpenSettings,
  onNewTest,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
        {/* Custom Vintage Typewriter Icon */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-serif font-bold text-base shadow-sm">
          ⌨
        </div>
        <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100 font-serif">
          Typewriter Typing Tutor
        </span>
      </div>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onScrollToSection('typewriter-stage')}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Practice
        </button>
        <button
          onClick={() => onScrollToSection('mode-selector')}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Typing Modes
        </button>
        <button
          onClick={() => onScrollToSection('stats-deck')}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Statistics
        </button>
        <button
          onClick={onOpenSettings}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Settings
        </button>
      </nav>

      {/* Zone 3: Quick Action & Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Sound toggle button */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title={settings.soundEnabled ? 'Mute Mechanical Audio' : 'Enable Mechanical Audio'}
          aria-label="Sound Toggle"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Typewriter Settings"
          aria-label="Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Primary CTA */}
        <button
          onClick={onNewTest}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(89,225,255,0.3)] flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Prompt</span>
        </button>
      </div>
    </header>
  );
};
