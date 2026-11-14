'use client';

import React, { useState } from 'react';
import { X, Key, Sparkles, Check, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, apiKey, onSave }: ApiKeyModalProps) {
  const [inputVal, setInputVal] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputVal('');
    onSave('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Google Gemini AI Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Optional deep natural language intelligence
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            By default, Deriv TrustGuard runs an <strong>instant client-side heuristic engine</strong> with 0ms latency and 100% privacy. 
            If you want Gemini 1.5 Flash to generate context-aware threat reasoning, enter your API key below.
          </p>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-medium text-slate-700 dark:text-slate-300">
              Need free credits or a key?
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff444f] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Get a Gemini API Key on Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff444f] focus:border-transparent transition-all"
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {inputVal && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-red-500 transition-colors"
              >
                Clear Key
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#ff444f] hover:bg-[#d43640] text-white flex items-center gap-1.5 shadow-md shadow-[#ff444f]/20 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Saved!
                  </>
                ) : (
                  'Save & Apply'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
