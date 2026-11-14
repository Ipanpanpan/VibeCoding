'use client';

import React, { useState } from 'react';
import { Search, Trash2, Clipboard, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  hasCustomKey: boolean;
}

export function MessageInput({
  value,
  onChange,
  onAnalyze,
  isLoading,
  hasCustomKey,
}: MessageInputProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 1500);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#ff444f]" />
          <span>Suspicious Message Content</span>
        </label>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">
            {wordCount} words • {characterCount} chars
          </span>
          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
          <button
            type="button"
            onClick={handlePaste}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>
          {characterCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-red-500 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste SMS, WhatsApp, Telegram message, or email body to evaluate warning signs..."
          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0f17] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff444f] focus:border-transparent text-sm leading-relaxed font-mono resize-y min-h-[140px]"
        />

        {copiedNotification && (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-black/80 text-white text-xs font-semibold animate-fade-in">
            Pasted from clipboard!
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {hasCustomKey ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini 1.5 Flash AI Engine Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-[#ff444f]" />
              Client Heuristics & Pattern Engine (Offline-Safe)
            </span>
          )}
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !value.trim()}
          className="px-6 py-2.5 rounded-xl bg-[#ff444f] hover:bg-[#d43640] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#ff444f]/25 transition-all transform active:scale-98"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Scanning Message...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analyze Message</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
