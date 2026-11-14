'use client';

import React, { useState } from 'react';
import { ShieldCheck, Moon, Sun, Sparkles, ArrowUpRight, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  hasCustomKey: boolean;
  onOpenGuide: () => void;
}

export function Navbar({ onOpenSettings, hasCustomKey, onOpenGuide }: NavbarProps) {
  const [isDark, setIsDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#101014]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff444f] flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                deriv<span className="text-[#ff444f]">.</span> <span className="font-medium">trustguard</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Suspicious message checker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#ff444f]" />
            <span className="hidden md:inline">Safety Guide</span>
          </button>

          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-colors border ${
              hasCustomKey
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
            title="Configure Gemini API Key"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">
              {hasCustomKey ? 'Gemini key ready' : 'Gemini AI (Optional)'}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a href="#scanner" className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[#ff444f] hover:bg-[#df3641] px-5 py-2.5 text-sm font-semibold text-white transition-colors">Check a message <ArrowUpRight className="w-4 h-4" /></a>
        </div>
      </div>
    </header>
  );
}
