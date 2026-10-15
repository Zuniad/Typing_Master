import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TypingMode,
  TypingDifficulty,
  DurationOption,
  TestStats,
  AppSettings,
  PersonalBestsMap,
} from './types';
import { getPromptForMode, generateMistakePracticePrompt } from './data/prompts';
import { audioEngine } from './audio/AudioEngine';
import { ControlsHeader } from './components/ControlsHeader';
import { ModeSelector } from './components/ModeSelector';
import { TypewriterStage } from './components/TypewriterStage';
import { StatsDeck } from './components/StatsDeck';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ResultsModal } from './components/ResultsModal';
import { CustomTextModal } from './components/CustomTextModal';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  volume: 0.7,
  keyboardVisible: true,
  bellVolume: 0.8,
  chassisTheme: 'crinkle-black',
  reducedMotion: false,
};

export default function App() {
  // Application settings with LocalStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ttt_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Personal best records
  const [personalBests, setPersonalBests] = useState<PersonalBestsMap>(() => {
    try {
      const saved = localStorage.getItem('ttt_personal_bests');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Core test state
  const [mode, setMode] = useState<TypingMode>('alphabet');
  const [difficulty, setDifficulty] = useState<TypingDifficulty>('intermediate');
  const [duration, setDuration] = useState<DurationOption>(60);
  const [customText, setCustomText] = useState<string>('');

  // Active typing prompt & user input
  const [promptText, setPromptText] = useState<string>(() => getPromptForMode('alphabet'));
  const [typedText, setTypedText] = useState<string>('');
  const [lastTypedChar, setLastTypedChar] = useState<string | null>(null);

  // Test lifecycle
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);

  // Timing precision refs
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number | null>(null);
  const timerFrameRef = useRef<number | null>(null);

  // Statistics state
  const [stats, setStats] = useState<TestStats>({
    wpm: 0,
    netWpm: 0,
    accuracy: 100,
    totalTyped: 0,
    correctChars: 0,
    incorrectChars: 0,
    elapsedSeconds: 0,
    mistakesMap: {},
    charTimeline: [],
  });

  // Active keyboard keys (for mechanical depression feedback)
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // Modal dialog states
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState<boolean>(false);

  // Target character in prompt
  const cursorIndex = typedText.length;
  const targetChar = cursorIndex < promptText.length ? promptText[cursorIndex] : null;

  // Initialize audio settings on change
  useEffect(() => {
    audioEngine.setSoundEnabled(settings.soundEnabled);
    audioEngine.setVolume(settings.volume);
    try {
      localStorage.setItem('ttt_settings', JSON.stringify(settings));
    } catch {
      // Ignore local storage error
    }
  }, [settings]);

  // Reset test with a new prompt or on config change
  const resetTest = useCallback(
    (newPromptText?: string, targetMode?: TypingMode) => {
      const activeMode = targetMode || mode;
      const prompt =
        newPromptText !== undefined
          ? newPromptText
          : activeMode === 'custom' && customText
          ? customText
          : getPromptForMode(activeMode, difficulty);

      setPromptText(prompt);
      setTypedText('');
      setLastTypedChar(null);
      setIsActive(false);
      setIsPaused(false);
      setIsCompleted(false);
      setIsResultsOpen(false);
      setRemainingSeconds(duration === 0 ? 0 : duration);

      startTimeRef.current = null;
      accumulatedTimeRef.current = 0;
      lastTickTimeRef.current = null;

      if (timerFrameRef.current) {
        cancelAnimationFrame(timerFrameRef.current);
        timerFrameRef.current = null;
      }

      setStats({
        wpm: 0,
        netWpm: 0,
        accuracy: 100,
        totalTyped: 0,
        correctChars: 0,
        incorrectChars: 0,
        elapsedSeconds: 0,
        mistakesMap: {},
        charTimeline: [],
      });
    },
    [mode, difficulty, duration, customText]
  );

  // Handle mode change
  const handleSelectMode = (newMode: TypingMode) => {
    setMode(newMode);
    resetTest(undefined, newMode);
  };

  // Handle duration change
  const handleSelectDuration = (newDur: DurationOption) => {
    setDuration(newDur);
    setRemainingSeconds(newDur);
    resetTest();
  };

  // Complete test and calculate final scores
  const finishTest = useCallback(() => {
    if (timerFrameRef.current) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(true);
    setIsResultsOpen(true);

    audioEngine.playCelebration();

    // Check personal best
    const bestKey = `${mode}_${duration}`;
    const previousBest = personalBests[bestKey];

    setStats((currentStats) => {
      const isNewBest =
        !previousBest ||
        currentStats.netWpm > previousBest.netWpm ||
        (currentStats.netWpm === previousBest.netWpm && currentStats.accuracy > previousBest.accuracy);

      if (isNewBest && currentStats.totalTyped >= 10) {
        setIsNewPersonalBest(true);
        const newRecord = {
          wpm: currentStats.wpm,
          netWpm: currentStats.netWpm,
          accuracy: currentStats.accuracy,
          date: new Date().toLocaleDateString(),
        };
        const updated = { ...personalBests, [bestKey]: newRecord };
        setPersonalBests(updated);
        try {
          localStorage.setItem('ttt_personal_bests', JSON.stringify(updated));
        } catch {
          // ignore
        }
      } else {
        setIsNewPersonalBest(false);
      }
      return currentStats;
    });
  }, [mode, duration, personalBests]);

  // High-precision animation frame timer loop
  useEffect(() => {
    if (!isActive || isPaused || isCompleted) {
      if (timerFrameRef.current) {
        cancelAnimationFrame(timerFrameRef.current);
        timerFrameRef.current = null;
      }
      return;
    }

    lastTickTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = currentTime;
      }
      const delta = (currentTime - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = currentTime;

      accumulatedTimeRef.current += delta;
      const totalElapsed = accumulatedTimeRef.current;

      // Handle countdown for timed tests
      if (duration > 0) {
        const remaining = Math.max(0, duration - totalElapsed);
        setRemainingSeconds(Math.ceil(remaining));

        if (remaining <= 0) {
          finishTest();
          return;
        }
      }

      // Update statistics
      setStats((prev) => {
        const minutes = totalElapsed / 60;
        const grossWpm = minutes > 0.02 ? Math.round(prev.totalTyped / 5 / minutes) : 0;
        const netWpm =
          minutes > 0.02
            ? Math.max(0, Math.round(prev.totalTyped / 5 / minutes - prev.incorrectChars / minutes))
            : 0;

        return {
          ...prev,
          wpm: grossWpm,
          netWpm,
          elapsedSeconds: totalElapsed,
        };
      });

      timerFrameRef.current = requestAnimationFrame(loop);
    };

    timerFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (timerFrameRef.current) {
        cancelAnimationFrame(timerFrameRef.current);
        timerFrameRef.current = null;
      }
    };
  }, [isActive, isPaused, isCompleted, duration, finishTest]);

  // Process a typed character (from physical keyboard or virtual keyboard)
  const processCharacter = useCallback(
    (inputChar: string) => {
      if (isCompleted || isPaused) return;

      // Start timer on first keystroke if not already active
      if (!isActive) {
        setIsActive(true);
        lastTickTimeRef.current = performance.now();
      }

      setLastTypedChar(inputChar);

      if (inputChar === 'Backspace') {
        if (typedText.length > 0) {
          audioEngine.playBackspace();
          setTypedText((prev) => prev.slice(0, -1));
        }
        return;
      }

      const expectedChar = promptText[cursorIndex];
      const isCorrect = inputChar === expectedChar;

      // Play appropriate vintage typewriter acoustics
      if (inputChar === ' ') {
        audioEngine.playSpacebar();
      } else if (inputChar === '\n') {
        audioEngine.playCarriageReturn();
      } else {
        audioEngine.playKeyStrike();
      }

      // Margin bell warning near line boundary
      const LINE_LENGTH = 38;
      const col = (cursorIndex + 1) % LINE_LENGTH;
      if (col === LINE_LENGTH - 4) {
        audioEngine.playMarginBell();
      }

      // Update typed string
      const nextTyped = typedText + inputChar;
      setTypedText(nextTyped);

      // Record keystroke statistics
      setStats((prev) => {
        const nextTotal = prev.totalTyped + 1;
        const nextCorrect = isCorrect ? prev.correctChars + 1 : prev.correctChars;
        const nextIncorrect = !isCorrect ? prev.incorrectChars + 1 : prev.incorrectChars;
        const nextAccuracy = Math.round((nextCorrect / nextTotal) * 100);

        const newMistakes = { ...prev.mistakesMap };
        if (!isCorrect && expectedChar) {
          newMistakes[expectedChar] = (newMistakes[expectedChar] || 0) + 1;
        }

        const minutes = (accumulatedTimeRef.current || 0.1) / 60;
        const grossWpm = minutes > 0.02 ? Math.round(nextTotal / 5 / minutes) : 0;
        const netWpm =
          minutes > 0.02
            ? Math.max(0, Math.round(nextTotal / 5 / minutes - nextIncorrect / minutes))
            : 0;

        return {
          ...prev,
          totalTyped: nextTotal,
          correctChars: nextCorrect,
          incorrectChars: nextIncorrect,
          accuracy: nextAccuracy,
          wpm: grossWpm,
          netWpm,
          mistakesMap: newMistakes,
        };
      });

      // If user typed the entire prompt, finish test
      if (nextTyped.length >= promptText.length) {
        finishTest();
      }
    },
    [isCompleted, isPaused, isActive, typedText, promptText, cursorIndex, finishTest]
  );

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing in a modal textarea/input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent system shortcuts interference
      if (e.ctrlKey || e.metaKey || e.altKey) {
        // Allow copy, paste, reload, inspect
        if (['c', 'v', 'r', 'a', 'x'].includes(e.key.toLowerCase())) return;
      }

      // Quick keyboard controls
      if (e.key === 'Tab') {
        e.preventDefault();
        resetTest();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isActive) {
          setIsPaused((p) => !p);
        }
        return;
      }

      // Add to active keys set for virtual keyboard tactile depression
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      // Prevent browser space scrolling during typing
      if (e.code === 'Space') {
        e.preventDefault();
        processCharacter(' ');
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        processCharacter('Backspace');
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        processCharacter('\n');
        return;
      }

      // Regular single characters
      if (e.key.length === 1) {
        e.preventDefault();
        processCharacter(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, processCharacter, resetTest]);

  // Handle virtual keyboard clicks
  const handleVirtualKeyPress = (char: string, code: string) => {
    // Briefly depress virtual key
    setActiveKeys((prev) => new Set(prev).add(code));
    setTimeout(() => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    }, 120);

    if (char === 'Backspace' || char === ' ' || char === '\n' || char.length === 1) {
      processCharacter(char);
    }
  };

  // Practice Mistakes handler
  const handlePracticeMistakes = () => {
    const drill = generateMistakePracticePrompt(stats.mistakesMap);
    setMode('mistakes');
    setIsResultsOpen(false);
    resetTest(drill, 'mistakes');
  };

  // Scroll smooth helper for header links
  const scrollToSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-[#F2F4F8] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Floating Glass Navigation */}
      <ControlsHeader
        settings={settings}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewTest={() => resetTest()}
        onScrollToSection={scrollToSection}
      />

      {/* Hero Header */}
      <div className="pt-6 sm:pt-8 pb-3 text-center px-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          {/* Animated Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isActive && !isPaused
                  ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#59E1FF]'
                  : isPaused
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-[11px] font-semibold uppercase text-slate-300">
              {isPaused
                ? 'TEST PAUSED'
                : isActive
                ? 'TYPING ACTIVE'
                : 'TYPEWRITER READY'}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif uppercase">
          TYPEWRITER TYPING TUTOR
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Find your rhythm. Feel every keystroke.
        </p>
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-6 pb-12">
        
        {/* Mode & Duration Selector */}
        <div id="mode-selector">
          <ModeSelector
            currentMode={mode}
            onSelectMode={handleSelectMode}
            difficulty={difficulty}
            onSelectDifficulty={(diff) => {
              setDifficulty(diff);
              resetTest(undefined, mode);
            }}
            selectedDuration={duration}
            onSelectDuration={handleSelectDuration}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
          />
        </div>

        {/* Real-time Statistics Deck */}
        <div id="stats-deck">
          <StatsDeck
            stats={stats}
            remainingSeconds={remainingSeconds}
            selectedDuration={duration}
            isActive={isActive}
            isPaused={isPaused}
            onStartPause={() => {
              if (isActive) {
                setIsPaused((p) => !p);
              } else {
                setIsActive(true);
              }
            }}
            onRestart={() => resetTest()}
            onFinish={finishTest}
          />
        </div>

        {/* Vintage Mechanical Typewriter Stage */}
        <div id="typewriter-stage" className="my-2">
          <TypewriterStage
            promptText={promptText}
            typedText={typedText}
            mistakesMap={stats.mistakesMap}
            lastTypedChar={lastTypedChar}
            settings={settings}
            isActive={isActive && !isPaused}
            cursorIndex={cursorIndex}
          />
        </div>

        {/* Virtual Mechanical Keyboard */}
        <div id="virtual-keyboard">
          <VirtualKeyboard
            activeKeys={activeKeys}
            targetChar={targetChar}
            onVirtualKeyPress={handleVirtualKeyPress}
            visible={settings.keyboardVisible}
            onToggleVisibility={() =>
              setSettings((prev) => ({
                ...prev,
                keyboardVisible: !prev.keyboardVisible,
              }))
            }
          />
        </div>

        {/* Quiet Footnote Guidance */}
        <div className="mt-8 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-3">
          <span>Esc to Pause</span>
          <span>·</span>
          <span>Tab to Reset</span>
          <span>·</span>
          <span>Backspace to correct</span>
        </div>
      </main>

      {/* Modals */}
      <ResultsModal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
        stats={stats}
        mode={mode}
        duration={duration}
        personalBest={personalBests[`${mode}_${duration}`]}
        isNewPersonalBest={isNewPersonalBest}
        onRetry={() => resetTest()}
        onPracticeMistakes={handlePracticeMistakes}
        hasMistakes={Object.keys(stats.mistakesMap).length > 0}
      />

      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={(text) => {
          setCustomText(text);
          setMode('custom');
          resetTest(text, 'custom');
        }}
        currentCustomText={customText}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
        onClearRecords={() => {
          setPersonalBests({});
          try {
            localStorage.removeItem('ttt_personal_bests');
          } catch {
            // ignore
          }
        }}
      />
    </div>
  );
}
