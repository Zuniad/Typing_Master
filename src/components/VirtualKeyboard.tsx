import React from 'react';
import { KEYBOARD_ROWS, getKeyMappingForChar } from '../utils/keyboardLayout';
import { KeyDefinition } from '../types';

interface VirtualKeyboardProps {
  activeKeys: Set<string>; // currently pressed keys (physical or virtual)
  targetChar: string | null;
  onVirtualKeyPress: (char: string, code: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKeys,
  targetChar,
  onVirtualKeyPress,
  visible,
  onToggleVisibility,
}) => {
  // Determine target key and whether shift is required for targetChar
  const targetMapping = targetChar ? getKeyMappingForChar(targetChar) : null;
  const targetCode = targetMapping?.code || null;
  const needsShift = targetMapping?.needsShift || false;

  if (!visible) {
    return (
      <div className="w-full max-w-4xl mx-auto flex justify-center py-2">
        <button
          onClick={onToggleVisibility}
          className="text-xs font-mono text-slate-400 hover:text-cyan-400 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>⌨ Show Virtual Mechanical Keyboard</span>
        </button>
      </div>
    );
  }

  const handleKeyClick = (key: KeyDefinition) => {
    // If it's a character or action key, invoke typing handler
    if (key.code === 'Space') {
      onVirtualKeyPress(' ', 'Space');
    } else if (key.code === 'Backspace') {
      onVirtualKeyPress('Backspace', 'Backspace');
    } else if (key.code === 'Enter') {
      onVirtualKeyPress('\n', 'Enter');
    } else if (key.code === 'Tab') {
      onVirtualKeyPress('\t', 'Tab');
    } else if (key.type === 'modifier' || key.type === 'action') {
      // Modifiers like Shift or Ctrl
      onVirtualKeyPress(key.label, key.code);
    } else {
      // Regular character: if shift is needed or active, send shiftLabel or upper
      const isShifted = activeKeys.has('ShiftLeft') || activeKeys.has('ShiftRight') || needsShift;
      const charToSend = isShifted && key.shiftLabel ? key.shiftLabel : key.label.toLowerCase();
      onVirtualKeyPress(charToSend, key.code);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-2 sm:px-4 select-none">
      <div className="glass-panel rounded-2xl p-3 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-slate-800/80">
        
        {/* Keyboard Header bar */}
        <div className="flex justify-between items-center px-2 mb-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono text-[11px] tracking-wider uppercase text-slate-300">
              VINTAGE MECHANICAL KEY MATRIX
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Interactive Guide & Keystroke Sensor
            </span>
          </div>

          <div className="flex items-center gap-3">
            {targetChar && (
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-md">
                <span className="text-slate-400">NEXT:</span>
                <span className="font-bold text-cyan-400">
                  {targetChar === ' ' ? 'SPACE' : targetChar === '\n' ? 'ENTER' : targetChar}
                </span>
                {needsShift && (
                  <span className="text-[10px] bg-cyan-900/80 text-cyan-200 px-1 rounded-xs">
                    + SHIFT
                  </span>
                )}
              </div>
            )}
            <button
              onClick={onToggleVisibility}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Hide
            </button>
          </div>
        </div>

        {/* Keyboard Rows */}
        <div className="flex flex-col gap-1.5 sm:gap-2 items-center">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center w-full">
              {row.map((key) => {
                const isPressed = activeKeys.has(key.code);
                const isTarget = targetCode === key.code;
                const isTargetShift =
                  needsShift && (key.code === 'ShiftLeft' || key.code === 'ShiftRight');

                const isHighlighted = isTarget || isTargetShift;

                return (
                  <button
                    key={key.code}
                    onClick={() => handleKeyClick(key)}
                    className={`
                      vintage-keycap relative flex flex-col items-center justify-center
                      rounded-lg py-2 sm:py-2.5 font-mono text-xs cursor-pointer select-none
                      ${key.width || 'w-10 sm:w-11'}
                      ${isPressed ? 'vintage-keycap-pressed' : ''}
                      ${isHighlighted ? 'vintage-keycap-target ring-1 ring-cyan-400' : ''}
                      transition-all
                    `}
                    title={`${key.label}${key.shiftLabel ? ` (${key.shiftLabel})` : ''}`}
                  >
                    {/* Shifted legend (top) */}
                    {key.shiftLabel && key.shiftLabel !== key.label && (
                      <span className={`text-[9px] sm:text-[10px] leading-tight ${isHighlighted ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                        {key.shiftLabel}
                      </span>
                    )}

                    {/* Primary key legend */}
                    <span
                      className={`
                        font-semibold tracking-wider leading-tight
                        ${key.type === 'action' || key.type === 'modifier' ? 'text-[10px] sm:text-[11px]' : 'text-xs sm:text-sm'}
                        ${isHighlighted ? 'text-cyan-300' : 'text-slate-200'}
                      `}
                    >
                      {key.label}
                    </span>

                    {/* Tactile Chrome Bezel Ring Effect */}
                    <div className="absolute inset-0 rounded-lg pointer-events-none border border-slate-600/40" />

                    {/* Target indicator subtle glow dot */}
                    {isHighlighted && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#59E1FF]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
