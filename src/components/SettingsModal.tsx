import React from 'react';
import { AppSettings } from '../types';
import { audioEngine } from '../audio/AudioEngine';
import { X, Volume2, VolumeX, Sliders, Bell, Sparkles, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearRecords: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearRecords,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f1420] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Typewriter Settings</h3>
        </div>

        <div className="space-y-5">
          {/* Sound Toggle & Volume */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-sm font-medium">Mechanical Audio</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`
                  w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer
                  ${settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'}
                `}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            {settings.soundEnabled && (
              <div className="space-y-1 pl-6">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Volume</span>
                  <span>{Math.round(settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSettings({ volume: val });
                    audioEngine.setVolume(val);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />

                {/* Sound Test Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => audioEngine.playKeyStrike()}
                    className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 cursor-pointer"
                  >
                    Test Key Clack
                  </button>
                  <button
                    onClick={() => audioEngine.playMarginBell()}
                    className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 cursor-pointer"
                  >
                    Test Bell Ding
                  </button>
                  <button
                    onClick={() => audioEngine.playCarriageReturn()}
                    className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 cursor-pointer"
                  >
                    Test Carriage Return
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Virtual Keyboard Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-sm font-medium block">Virtual Keyboard Display</span>
              <span className="text-xs text-slate-400">
                Show visual mechanical keycap matrix
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ keyboardVisible: !settings.keyboardVisible })}
              className={`
                w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer
                ${settings.keyboardVisible ? 'bg-cyan-500' : 'bg-slate-700'}
              `}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.keyboardVisible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-sm font-medium block">Reduced Motion</span>
              <span className="text-xs text-slate-400">
                Minimizes carriage shifts and visual strikes
              </span>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`
                w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer
                ${settings.reducedMotion ? 'bg-cyan-500' : 'bg-slate-700'}
              `}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Clear Best Records */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-sm font-medium text-rose-300 block">Personal Bests</span>
              <span className="text-xs text-slate-400">
                Clear all saved best scores from local storage
              </span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Clear all your saved personal records?')) {
                  onClearRecords();
                }
              }}
              className="text-xs font-mono text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
