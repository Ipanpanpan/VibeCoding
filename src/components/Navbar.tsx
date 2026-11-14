'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Moon, Sun, Key, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  hasCustomKey: boolean;
  onOpenGuide: () => void;
}

export function Navbar({ onOpenSettings, hasCustomKey, onOpenGuide }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0e121b]/80 backdrop-blur-md">
      {/* DevFest 2026 Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#ff444f] via-rose-600 to-indigo-600 px-4 py-1.5 text-xs text-white font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase">
              DevFest 2026
            </span>
            <span>Vibing Lounge • Deriv Challenge 03: Recognize Suspicious Messages</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://me.developers.google.com/benefits/claim/gdg-kl-devfest-2026-vibing-2"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/80 inline-flex items-center gap-1 font-semibold"
            >
              Claim $5 Credits <ExternalLink className="w-3 h-3" />
            </a>
            <span className="opacity-50">|</span>
            <a
              href="https://forms.gle/SvuHXBUnJ3JV1HNa6"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/80 inline-flex items-center gap-1 font-semibold"
            >
              Submit Project <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff444f] flex items-center justify-center text-white shadow-lg shadow-[#ff444f]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Deriv <span className="text-[#ff444f]">TrustGuard</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Anti-Phishing & Suspicious Message Intelligence for Traders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-[#ff444f]" />
            <span className="hidden md:inline">Safety Guide</span>
          </button>

          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              hasCustomKey
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
            title="Configure Gemini API Key"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">
              {hasCustomKey ? 'Gemini AI Active' : 'Gemini AI (Optional)'}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
