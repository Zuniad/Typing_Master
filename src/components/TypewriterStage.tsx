import React, { useEffect, useState, useRef } from 'react';
import { AppSettings } from '../types';

interface TypewriterStageProps {
  promptText: string;
  typedText: string;
  mistakesMap: Record<string, number>;
  lastTypedChar: string | null;
  settings: AppSettings;
  isActive: boolean;
  onEnterPress?: () => void;
  cursorIndex: number;
}

export const TypewriterStage: React.FC<TypewriterStageProps> = ({
  promptText,
  typedText,
  lastTypedChar,
  settings,
  isActive,
  cursorIndex,
}) => {
  const [strikeActive, setStrikeActive] = useState(false);
  const [returnLeverActive, setReturnLeverActive] = useState(false);
  const [platenRotation, setPlatenRotation] = useState(0);
  const paperScrollRef = useRef<HTMLDivElement>(null);

  // Trigger mechanical typebar strike animation on keystroke
  useEffect(() => {
    if (lastTypedChar !== null) {
      setStrikeActive(true);
      setPlatenRotation((prev) => prev + 12);
      const timer = setTimeout(() => setStrikeActive(false), 110);
      return () => clearTimeout(timer);
    }
  }, [typedText.length, lastTypedChar]);

  // Carriage return lever animation on Enter or line wrap
  const triggerCarriageReturn = () => {
    setReturnLeverActive(true);
    setTimeout(() => setReturnLeverActive(false), 320);
  };

  // Break text into lines of ~40 characters for authentic typewriter margins
  const LINE_LENGTH = 38;
  const currentLineIndex = Math.floor(cursorIndex / LINE_LENGTH);
  const columnInLine = cursorIndex % LINE_LENGTH;

  // Carriage shift: in a manual typewriter, the carriage shifts to the left as you type
  // so the active typing position remains centered under the typebar strike point.
  // Each character shifts carriage by ~8px to the left.
  const carriageOffset = Math.min(300, columnInLine * 8.5);

  // Auto-scroll paper as lines progress
  useEffect(() => {
    if (paperScrollRef.current) {
      const targetScroll = Math.max(0, (currentLineIndex - 1) * 36);
      paperScrollRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [currentLineIndex]);

  // Is typist close to line margin (approaching bell)?
  const isNearMargin = columnInLine >= LINE_LENGTH - 6;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Ambient Spotlight & Atmospheric Glow */}
      <div 
        aria-hidden="true" 
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none rounded-full" 
      />

      {/* Outer Typewriter Shell */}
      <div className="relative w-full bg-[#12161f] border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.06)] overflow-hidden">
        
        {/* Top Mechanical Head / Paper Table & Carriage Rail */}
        <div className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-[#181d28] to-[#0e121a] rounded-2xl border border-slate-700/60 shadow-inner overflow-hidden flex flex-col items-center">
          
          {/* Chrome Carriage Rail Track & Margin Ticks */}
          <div className="absolute top-3 left-6 right-6 h-3 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-between px-4 z-10 border border-slate-300/40">
            {Array.from({ length: 39 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-[1px] ${i % 5 === 0 ? 'h-2 bg-slate-800' : 'h-1 bg-slate-600/70'}`} 
              />
            ))}
          </div>

          {/* Carriage Return Lever (Top Left) */}
          <div 
            onClick={triggerCarriageReturn}
            title="Carriage Return Lever"
            className="absolute top-1 left-4 z-30 cursor-pointer group flex items-start"
          >
            <div 
              className={`w-3.5 h-14 bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-full shadow-lg border border-slate-300 transition-transform origin-top duration-200 ${
                returnLeverActive ? 'rotate-[-35deg] translate-y-1' : 'group-hover:rotate-[-6deg]'
              }`}
            />
            <div className="w-5 h-4 -ml-1 mt-10 bg-slate-200 rounded-sm shadow-md border border-slate-400" />
          </div>

          {/* Margin Warning Bell Indicator (Top Right) */}
          <div 
            className="absolute top-2 right-5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0b0f17] border border-slate-700 text-xs font-mono"
            title="Typewriter Margin Bell"
          >
            <div 
              className={`w-2 h-2 rounded-full transition-colors ${
                isNearMargin ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-slate-600'
              }`} 
            />
            <span className="text-[10px] tracking-wider text-slate-400">
              {isNearMargin ? 'MARGIN BELL' : 'COL ' + (columnInLine + 1)}
            </span>
          </div>

          {/* Moving Carriage Assembly */}
          <div 
            className="absolute top-7 w-[92%] sm:w-[86%] transition-transform duration-100 ease-out z-10 flex flex-col items-center"
            style={{
              transform: `translateX(-${carriageOffset}px)`,
            }}
          >
            {/* Platen Knob Left */}
            <div 
              className="absolute -left-5 top-16 w-5 h-12 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-l-md shadow-md border border-slate-400 flex items-center justify-center cursor-pointer"
              style={{ transform: `rotate(${platenRotation}deg)` }}
              title="Left Platen Roller Knob"
            >
              <div className="w-full h-[2px] bg-slate-600" />
            </div>

            {/* Platen Knob Right */}
            <div 
              className="absolute -right-5 top-16 w-5 h-12 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-400 rounded-r-md shadow-md border border-slate-400 flex items-center justify-center cursor-pointer"
              style={{ transform: `rotate(${platenRotation}deg)` }}
              title="Right Platen Roller Knob"
            >
              <div className="w-full h-[2px] bg-slate-600" />
            </div>

            {/* Platen Roller (Black Hardened Rubber Cylinder) */}
            <div className="w-full h-8 bg-gradient-to-b from-[#111] via-[#222] to-[#0a0a0a] rounded-sm shadow-md border-y border-slate-800 flex items-center px-4 relative z-0">
              <div className="w-full h-[1px] bg-slate-700/40" />
            </div>

            {/* Paper Sheet Emerging from Platen */}
            <div 
              ref={paperScrollRef}
              className="typewriter-paper relative -mt-4 w-[90%] sm:w-[85%] h-52 sm:h-56 rounded-t-sm pt-5 px-6 sm:px-10 pb-16 overflow-y-auto scrollbar-none shadow-2xl border-x border-amber-900/10 z-10"
              style={{
                fontFamily: "'Courier Prime', 'Special Elite', monospace",
              }}
            >
              {/* Paper Watermark / Header */}
              <div className="flex justify-between items-center text-[10px] text-amber-900/40 font-serif border-b border-amber-900/10 pb-1 mb-3">
                <span className="tracking-widest uppercase">CORONA STANDARD NO. 4</span>
                <span className="italic">Page 1 · Line {currentLineIndex + 1}</span>
              </div>

              {/* Text Rendered on Paper */}
              <div className="text-base sm:text-lg leading-relaxed tracking-wider break-all font-typewriter min-h-[90px]">
                {promptText.split('').map((targetChar, index) => {
                  const isTyped = index < typedText.length;
                  const isCurrent = index === cursorIndex;
                  const userChar = isTyped ? typedText[index] : null;
                  const isCorrect = isTyped && userChar === targetChar;
                  const isMistake = isTyped && !isCorrect;

                  if (isCurrent) {
                    return (
                      <span key={index} className="relative inline-block">
                        <span className="text-cyan-700 bg-cyan-400/20 px-0.5 rounded-xs font-bold border-b-2 border-cyan-600">
                          {targetChar === ' ' ? '␣' : targetChar}
                        </span>
                        {/* Blinking Typewriter Carriage Caret */}
                        <span className="typewriter-caret absolute -top-1 left-0 w-full h-6 border-b-2 border-cyan-500 pointer-events-none" />
                      </span>
                    );
                  }

                  if (isCorrect) {
                    return (
                      <span key={index} className="ink-char-correct font-semibold">
                        {targetChar}
                      </span>
                    );
                  }

                  if (isMistake) {
                    return (
                      <span key={index} className="ink-char-error font-semibold">
                        {userChar === ' ' ? '␣' : userChar}
                      </span>
                    );
                  }

                  // Un-typed upcoming text (faint guide print)
                  return (
                    <span key={index} className="ink-char-pending">
                      {targetChar}
                    </span>
                  );
                })}
              </div>

              {/* Paper Bottom Shadow Feed Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Paper Bail Bar (Metal rod holding paper against roller) */}
            <div className="absolute top-16 left-2 right-2 h-1.5 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 rounded-full shadow border border-slate-300 z-20 flex justify-around items-center px-10">
              <div className="w-2 h-3 bg-slate-700 rounded-xs shadow" />
              <div className="w-2 h-3 bg-slate-700 rounded-xs shadow" />
            </div>
          </div>

          {/* Centered Mechanical Strike Guide & Ribbon Vibrator (Fixed center point) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            {/* Center Typebar Impacting Ribbon Guide */}
            <div 
              className={`w-1.5 h-14 bg-gradient-to-t from-slate-400 via-slate-200 to-slate-100 rounded-t-sm shadow-md transition-all duration-75 ${
                strikeActive ? 'animate-typebar-strike' : 'opacity-70 translate-y-1'
              }`}
            />

            {/* Bi-Color Ribbon Vibrator Fork */}
            <div 
              className={`w-8 h-4 border-2 border-slate-300 rounded-t-sm flex items-center justify-center transition-transform duration-75 ${
                strikeActive ? '-translate-y-1 bg-red-700/80' : 'bg-slate-900/90'
              }`}
            >
              <div className="w-6 h-1 bg-red-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Typebar Basket Curved Chamber & Twin Ribbon Spools */}
        <div className="relative mt-3 pt-3 pb-2 px-6 bg-gradient-to-b from-[#151a24] to-[#0a0d14] rounded-2xl border border-slate-800 flex items-center justify-between shadow-inner">
          
          {/* Left Ribbon Spool */}
          <div className="flex flex-col items-center gap-1">
            <div 
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer"
              style={{ transform: `rotate(${platenRotation * 1.5}deg)` }}
              title="Left Ink Ribbon Spool"
            >
              <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-500 shadow" />
              {/* Spool spokes */}
              <div className="absolute w-10 h-[1.5px] bg-slate-500/60" />
              <div className="absolute h-10 w-[1.5px] bg-slate-500/60" />
            </div>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">LEFT SPOOL</span>
          </div>

          {/* Radial Typebar Basket (Arc of metallic hammer arms) */}
          <div className="flex-1 flex justify-center items-end px-4 h-14 overflow-hidden relative">
            <div className="flex items-end justify-center gap-1 w-full max-w-sm">
              {[-35, -25, -18, -10, -4, 0, 4, 10, 18, 25, 35].map((angle, i) => (
                <div
                  key={i}
                  className="w-1.5 h-11 bg-gradient-to-t from-slate-600 via-slate-400 to-slate-300 rounded-t-sm shadow-sm opacity-80"
                  style={{
                    transformOrigin: 'bottom center',
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Vintage Emblem Plate */}
            <div className="absolute bottom-0 px-4 py-0.5 rounded-t-md bg-gradient-to-r from-amber-900/30 via-amber-700/20 to-amber-900/30 border border-amber-600/30 text-[10px] font-mono tracking-widest text-amber-200/90 shadow">
              HERMES 3000 · PRECISION MECHANISM
            </div>
          </div>

          {/* Right Ribbon Spool */}
          <div className="flex flex-col items-center gap-1">
            <div 
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer"
              style={{ transform: `rotate(${-platenRotation * 1.5}deg)` }}
              title="Right Ink Ribbon Spool"
            >
              <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-500 shadow" />
              {/* Spool spokes */}
              <div className="absolute w-10 h-[1.5px] bg-slate-500/60" />
              <div className="absolute h-10 w-[1.5px] bg-slate-500/60" />
            </div>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">RIGHT SPOOL</span>
          </div>
        </div>

      </div>
    </div>
  );
};
