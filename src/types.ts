export type TypingMode =
  | 'alphabet'
  | 'alphanumeric'
  | 'special'
  | 'mixed'
  | 'sentences'
  | 'custom'
  | 'mistakes';

export type TypingDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type DurationOption = 30 | 60 | 120 | 0; // 0 = unlimited

export interface TestStats {
  wpm: number;
  netWpm: number;
  accuracy: number;
  totalTyped: number;
  correctChars: number;
  incorrectChars: number;
  elapsedSeconds: number;
  mistakesMap: Record<string, number>;
  charTimeline: { time: number; wpm: number; errors: number }[];
}

export interface PersonalBest {
  wpm: number;
  netWpm: number;
  accuracy: number;
  date: string;
}

export type PersonalBestsMap = Record<string, PersonalBest>;

export interface AppSettings {
  soundEnabled: boolean;
  volume: number; // 0 to 1
  keyboardVisible: boolean;
  bellVolume: number;
  chassisTheme: 'crinkle-black' | 'vintage-gunmetal' | 'royal-ivory';
  reducedMotion: boolean;
}

export interface KeyDefinition {
  code: string;
  label: string;
  shiftLabel?: string;
  width?: string; // e.g. 'w-12', 'flex-1', etc.
  type?: 'char' | 'modifier' | 'space' | 'action';
}
