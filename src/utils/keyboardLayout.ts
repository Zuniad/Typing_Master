import { KeyDefinition } from '../types';

export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Number Row
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', width: 'w-10 sm:w-11' },
    { code: 'Digit1', label: '1', shiftLabel: '!', width: 'w-10 sm:w-11' },
    { code: 'Digit2', label: '2', shiftLabel: '@', width: 'w-10 sm:w-11' },
    { code: 'Digit3', label: '3', shiftLabel: '#', width: 'w-10 sm:w-11' },
    { code: 'Digit4', label: '4', shiftLabel: '$', width: 'w-10 sm:w-11' },
    { code: 'Digit5', label: '5', shiftLabel: '%', width: 'w-10 sm:w-11' },
    { code: 'Digit6', label: '6', shiftLabel: '^', width: 'w-10 sm:w-11' },
    { code: 'Digit7', label: '7', shiftLabel: '&', width: 'w-10 sm:w-11' },
    { code: 'Digit8', label: '8', shiftLabel: '*', width: 'w-10 sm:w-11' },
    { code: 'Digit9', label: '9', shiftLabel: '(', width: 'w-10 sm:w-11' },
    { code: 'Digit0', label: '0', shiftLabel: ')', width: 'w-10 sm:w-11' },
    { code: 'Minus', label: '-', shiftLabel: '_', width: 'w-10 sm:w-11' },
    { code: 'Equal', label: '=', shiftLabel: '+', width: 'w-10 sm:w-11' },
    { code: 'Backspace', label: 'BACK', type: 'action', width: 'w-14 sm:w-16' },
  ],
  // Row 2: QWERTY
  [
    { code: 'Tab', label: 'TAB', type: 'action', width: 'w-13 sm:w-14' },
    { code: 'KeyQ', label: 'Q', shiftLabel: 'Q', width: 'w-10 sm:w-11' },
    { code: 'KeyW', label: 'W', shiftLabel: 'W', width: 'w-10 sm:w-11' },
    { code: 'KeyE', label: 'E', shiftLabel: 'E', width: 'w-10 sm:w-11' },
    { code: 'KeyR', label: 'R', shiftLabel: 'R', width: 'w-10 sm:w-11' },
    { code: 'KeyT', label: 'T', shiftLabel: 'T', width: 'w-10 sm:w-11' },
    { code: 'KeyY', label: 'Y', shiftLabel: 'Y', width: 'w-10 sm:w-11' },
    { code: 'KeyU', label: 'U', shiftLabel: 'U', width: 'w-10 sm:w-11' },
    { code: 'KeyI', label: 'I', shiftLabel: 'I', width: 'w-10 sm:w-11' },
    { code: 'KeyO', label: 'O', shiftLabel: 'O', width: 'w-10 sm:w-11' },
    { code: 'KeyP', label: 'P', shiftLabel: 'P', width: 'w-10 sm:w-11' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', width: 'w-10 sm:w-11' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', width: 'w-10 sm:w-11' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', width: 'w-11 sm:w-12' },
  ],
  // Row 3: ASDFGH
  [
    { code: 'CapsLock', label: 'LOCK', type: 'action', width: 'w-14 sm:w-16' },
    { code: 'KeyA', label: 'A', shiftLabel: 'A', width: 'w-10 sm:w-11' },
    { code: 'KeyS', label: 'S', shiftLabel: 'S', width: 'w-10 sm:w-11' },
    { code: 'KeyD', label: 'D', shiftLabel: 'D', width: 'w-10 sm:w-11' },
    { code: 'KeyF', label: 'F', shiftLabel: 'F', width: 'w-10 sm:w-11' },
    { code: 'KeyG', label: 'G', shiftLabel: 'G', width: 'w-10 sm:w-11' },
    { code: 'KeyH', label: 'H', shiftLabel: 'H', width: 'w-10 sm:w-11' },
    { code: 'KeyJ', label: 'J', shiftLabel: 'J', width: 'w-10 sm:w-11' },
    { code: 'KeyK', label: 'K', shiftLabel: 'K', width: 'w-10 sm:w-11' },
    { code: 'KeyL', label: 'L', shiftLabel: 'L', width: 'w-10 sm:w-11' },
    { code: 'Semicolon', label: ';', shiftLabel: ':', width: 'w-10 sm:w-11' },
    { code: 'Quote', label: "'", shiftLabel: '"', width: 'w-10 sm:w-11' },
    { code: 'Enter', label: 'RETURN', type: 'action', width: 'w-18 sm:w-20' },
  ],
  // Row 4: ZXCVBN
  [
    { code: 'ShiftLeft', label: 'SHIFT', type: 'modifier', width: 'w-18 sm:w-20' },
    { code: 'KeyZ', label: 'Z', shiftLabel: 'Z', width: 'w-10 sm:w-11' },
    { code: 'KeyX', label: 'X', shiftLabel: 'X', width: 'w-10 sm:w-11' },
    { code: 'KeyC', label: 'C', shiftLabel: 'C', width: 'w-10 sm:w-11' },
    { code: 'KeyV', label: 'V', shiftLabel: 'V', width: 'w-10 sm:w-11' },
    { code: 'KeyB', label: 'B', shiftLabel: 'B', width: 'w-10 sm:w-11' },
    { code: 'KeyN', label: 'N', shiftLabel: 'N', width: 'w-10 sm:w-11' },
    { code: 'KeyM', label: 'M', shiftLabel: 'M', width: 'w-10 sm:w-11' },
    { code: 'Comma', label: ',', shiftLabel: '<', width: 'w-10 sm:w-11' },
    { code: 'Period', label: '.', shiftLabel: '>', width: 'w-10 sm:w-11' },
    { code: 'Slash', label: '/', shiftLabel: '?', width: 'w-10 sm:w-11' },
    { code: 'ShiftRight', label: 'SHIFT', type: 'modifier', width: 'w-18 sm:w-20' },
  ],
  // Row 5: Spacebar & base
  [
    { code: 'ControlLeft', label: 'CTRL', type: 'modifier', width: 'w-12 sm:w-14' },
    { code: 'AltLeft', label: 'ALT', type: 'modifier', width: 'w-12 sm:w-14' },
    { code: 'Space', label: 'SPACEBAR', type: 'space', width: 'flex-1 max-w-sm sm:max-w-md' },
    { code: 'AltRight', label: 'ALT', type: 'modifier', width: 'w-12 sm:w-14' },
    { code: 'ControlRight', label: 'CTRL', type: 'modifier', width: 'w-12 sm:w-14' },
  ],
];

// Mapping from target character to required keycode + needsShift
export function getKeyMappingForChar(char: string): { code: string; needsShift: boolean } | null {
  if (char === ' ') {
    return { code: 'Space', needsShift: false };
  }
  if (char === '\n') {
    return { code: 'Enter', needsShift: false };
  }

  // Check uppercase letters
  if (/^[A-Z]$/.test(char)) {
    return { code: `Key${char}`, needsShift: true };
  }

  // Check lowercase letters
  if (/^[a-z]$/.test(char)) {
    return { code: `Key${char.toUpperCase()}`, needsShift: false };
  }

  // Check digits and symbols
  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.label === char) {
        return { code: key.code, needsShift: false };
      }
      if (key.shiftLabel === char) {
        return { code: key.code, needsShift: true };
      }
    }
  }

  return null;
}
