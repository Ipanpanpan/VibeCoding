'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] text-slate-600 dark:text-slate-400 text-xs">
      {/* DevFest 2026 Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#161b26] to-slate-900 text-white py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff444f] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#ff444f]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                DevFest 2026 Vibing Lounge • Deriv Challenge 03
              </h4>
              <p className="text-xs text-slate-400">
                Helping customers recognize suspicious messages and verify safely before acting
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://me.developers.google.com/benefits/claim/gdg-kl-devfest-2026-vibing-2"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              Claim USD$5.00 Credits <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://forms.gle/SvuHXBUnJ3JV1HNa6"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#ff444f] hover:bg-[#d43640] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#ff444f]/25 transition-all"
            >
              Submit Project Form <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Deriv TrustGuard — Anti-Phishing Security Scanner
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Built with Next.js, Tailwind CSS, Lucide React, and Google Gemini AI.
          </p>
        </div>

        <div className="text-[11px] text-slate-400 text-center sm:text-right">
          <p>DevFest 2026 Kuala Lumpur Vibing Lounge</p>
          <p className="mt-0.5 flex items-center justify-center sm:justify-end gap-1">
            Engineered for security with <Heart className="w-3 h-3 text-[#ff444f] inline fill-[#ff444f]" /> for Deriv traders
          </p>
        </div>
      </div>
    </footer>
  );
}
