import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  currentCustomText: string;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentCustomText,
}) => {
  const [text, setText] = useState(
    currentCustomText ||
      'Type your own custom story, code excerpt, or practice sequence here. The typewriter will transcribe every keystroke with authentic mechanical precision.'
  );

  if (!isOpen) return null;

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleApply = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0f1420] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Custom Practice Text</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Paste or write any custom text, quotes, or code you wish to practice on the vintage typewriter.
        </p>

        {/* Text Area */}
        <div className="relative mb-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Enter custom text..."
            className="w-full bg-[#141b2b] border border-slate-700 rounded-xl p-3 text-sm font-typewriter text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono mt-1 px-1">
            <span>{charCount} characters · {wordCount} words</span>
            <span>Supported: letters, numbers, punctuation</span>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-5">
          <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
            Quick Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() =>
                setText(
                  'The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela'
                )
              }
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              Inspirational Quote
            </button>
            <button
              onClick={() =>
                setText(
                  'function quicksort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; return [...quicksort(arr.filter(x => x < pivot)), pivot, ...quicksort(arr.filter(x => x > pivot))]; }'
                )
              }
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              JavaScript Code
            </button>
            <button
              onClick={() =>
                setText(
                  'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.'
                )
              }
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              Historic Speech
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!text.trim()}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Load into Typewriter</span>
          </button>
        </div>

      </div>
    </div>
  );
};
