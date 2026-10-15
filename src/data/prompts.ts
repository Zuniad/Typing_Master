import { TypingDifficulty, TypingMode } from '../types';

export const ALPHABET_PROMPTS = [
  // Pangrams & classic runs
  'the quick brown fox jumps over the lazy dog',
  'pack my box with five dozen liquor jugs',
  'how vexingly quick daft zebras jump',
  'sphinx of black quartz judge my vow',
  'the five boxing wizards jump quickly',
  'jackdaws love my big sphinx of quartz',
  'bright vixens jump dozy fowl quack',
  'quick zephyrs blow vexing daft jim',
  // Uppercase & mixed
  'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
  'PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS',
  'Sphinx Of Black Quartz Judge My Vow Every Morning',
  'The Five Boxing Wizards Jump Quickly Across The Field',
  // Home row & finger coordination
  'asdf jkl; asdf jkl; aassddff jjkkll;; aallsskkddjj ffjjddkkssll',
  'qwerty uiop zxcv bnm asdfgh jkl qwertyuiop zxcvbnm',
  'quick pack zeal victor flux blaze jump wave kayak',
];

export const ALPHANUMERIC_PROMPTS = [
  'A7B2 C9D4 2026 Q5R8 X3M9 W1K6 78Z4 90P1',
  'Flight Apollo 11 launched July 16 1969 with 3 crew members',
  'Model Remington 1928 Serial 48290 Patent US849201',
  'Room 404 Error Code 500 at Port 3000 on IP 192.168.1.1',
  'Order 83921 Total $250.00 Discount 15% Net $212.50 in 2026',
  'Key 992-FX-401 Code 1882-MK-991 Station 7 Alpha 88',
  '1984 George Orwell Published June 8 1949 Chapter 1 Page 32',
  'Latitude 40.7128 Longitude 74.0060 Altitude 10 meters',
  'Batch 98402 Processed 1000 items with 0 failures in 12 seconds',
];

export const SPECIAL_CHAR_PROMPTS = [
  'price=$49.99; total=(12+8)*3! tax=0.08;',
  'if (score >= 90 && grade !== "F") { return [true, "PASS"]; }',
  'const { id, title } = item ?? { id: 0, title: "Untitled" };',
  'Contact: info@typewriter.org | Phone: (555) 019-2834 #402',
  'Formula: E = mc^2; Force = m * a; Delta = b^2 - (4 * a * c);',
  'Array: [ "alpha", "beta", "gamma" ] -> { count: 3, valid: true }',
  'Query: SELECT * FROM archive WHERE year >= 1930 AND status = "READY";',
  'Symbols: !@#$%^&*()_+-=[]{}|;:,.<>?/~`',
  'Path: /usr/local/bin/typewriter --config="./settings.json" --verbose',
];

export const MIXED_PROMPTS = [
  'Build_2026(); score += 95% - errors! if (rate >= 100) { win(); }',
  'Report #849: Total 128 machines restored @ $1,450.00 each (tax incl.)',
  'Dispatch: Train #42 departed at 08:30:15 with 14 passenger cars.',
  'System.out.println("Hello, World! Value: " + (count * 2.5) + "%");',
  'Draft 4: "We hold these truths to be self-evident, that all men are created equal."',
  'Coordinates (45.109, -93.265) at 14:00 GMT: wind speed 18.5 km/h @ 270 deg.',
];

export const SENTENCE_PROMPTS: Record<TypingDifficulty, string[]> = {
  beginner: [
    'The morning sun was warm on the wooden desk.',
    'She sat down and rolled a fresh sheet of paper into the machine.',
    'Every letter left a crisp black mark on the page.',
    'He loved the rhythmic sound of mechanical keys striking in cadence.',
    'A good typist keeps their eyes on the copy and fingers on home row.',
    'The bell chimed softly to announce the end of the line.',
    'Practice each day builds accuracy before pure speed.',
    'Words flowed like water once his hands found their natural pace.',
  ],
  intermediate: [
    'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, but a comfortable hobbit hole.',
    'It was a bright cold day in April, and the clocks were striking thirteen.',
    'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    'There is nothing to writing. All you do is sit down at a typewriter and bleed.',
    'To be, or not to be, that is the question: whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune.',
    'The only way to do great work is to love what you do. If you have not found it yet, keep looking.',
    'No living thing can continue sane for long under conditions of absolute reality, even larks and katydids are supposed to dream.',
  ],
  advanced: [
    'Whether I shall turn out to be the hero of my own life, or whether that station will be held by anybody else, these pages must show.',
    'Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun.',
    'All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this.',
    'The past is a foreign country; they do things differently there. Between memory and desire, the typed record remains immutable.',
    'Ships at a distance have every mans wish on board. For some they come in with the tide; for others they sail forever on the horizon.',
  ],
};

/**
 * Get random prompt for given mode and difficulty.
 */
export function getPromptForMode(
  mode: TypingMode,
  difficulty: TypingDifficulty = 'intermediate'
): string {
  switch (mode) {
    case 'alphabet':
      return ALPHABET_PROMPTS[Math.floor(Math.random() * ALPHABET_PROMPTS.length)];
    case 'alphanumeric':
      return ALPHANUMERIC_PROMPTS[Math.floor(Math.random() * ALPHANUMERIC_PROMPTS.length)];
    case 'special':
      return SPECIAL_CHAR_PROMPTS[Math.floor(Math.random() * SPECIAL_CHAR_PROMPTS.length)];
    case 'mixed':
      return MIXED_PROMPTS[Math.floor(Math.random() * MIXED_PROMPTS.length)];
    case 'sentences':
    default: {
      const list = SENTENCE_PROMPTS[difficulty] || SENTENCE_PROMPTS.intermediate;
      return list[Math.floor(Math.random() * list.length)];
    }
  }
}

/**
 * Dynamically generate a drill targeting user's specific mistyped characters!
 */
export function generateMistakePracticePrompt(mistakesMap: Record<string, number>): string {
  const mistakes = Object.entries(mistakesMap)
    .sort((a, b) => b[1] - a[1])
    .map(([char]) => char);

  if (mistakes.length === 0) {
    return 'great job! no mistakes recorded. try typing this flawless sentence again with speed!';
  }

  // Pick top weak characters (up to 5)
  const weakKeys = mistakes.slice(0, 5);
  const wordsWithWeakKeys: string[] = [];

  // Generate synthetic focused drill pattern
  weakKeys.forEach((char) => {
    const isLetter = /^[a-zA-Z]$/.test(char);
    if (isLetter) {
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
      wordsWithWeakKeys.push(
        `${lower}${lower} ${upper}${lower} ${lower}a${lower} ${lower}e${lower} ${upper}${lower}${lower}`
      );
    } else {
      wordsWithWeakKeys.push(`${char} ${char}${char} word${char} text${char}`);
    }
  });

  return `Mistake Drill: ${wordsWithWeakKeys.join(' ')}`;
}
