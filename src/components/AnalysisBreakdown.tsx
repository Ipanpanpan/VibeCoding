'use client';

import React from 'react';
import { AnalysisResult } from '@/types/analyzer';
import { isOfficialDerivUrl } from '@/lib/detector';
import { AlertCircle, CheckCircle2, Shield, Link2, ExternalLink, Info, Flame, Eye } from 'lucide-react';

interface AnalysisBreakdownProps {
  result: AnalysisResult;
}

export function AnalysisBreakdown({ result }: AnalysisBreakdownProps) {
  const { summary, redFlags, safeIndicators, officialAdvice, detectedLinks } = result;

  return (
    <div className="space-y-6">
      {/* Plain English Summary */}
      <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-sky-500" />
          <span>Executive Security Assessment</span>
        </div>
        <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {summary}
        </p>
      </div>

      {/* Red Flags Section */}
      {redFlags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff444f]" />
              <span>Detected Red Flags & Threats ({redFlags.length})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Suspicious indicators requiring immediate caution
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {redFlags.map((flag) => {
              const isHigh = flag.severity === 'high';
              return (
                <div
                  key={flag.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isHigh
                      ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/20'
                      : 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isHigh
                            ? 'bg-[#ff444f] text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {flag.severity} risk
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {flag.label}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                      Category: {flag.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {flag.description}
                  </p>

                  {flag.matchedSnippets.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Trigger snippet in message:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {flag.matchedSnippets.map((snippet, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-800 break-all"
                          >
                            &quot;{snippet}&quot;
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detected Links Analysis */}
      {detectedLinks.length > 0 && (
        <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Link2 className="w-4 h-4 text-indigo-500" />
            <span>Destination Link Analysis ({detectedLinks.length})</span>
          </div>

          <div className="space-y-2">
            {detectedLinks.map((url, i) => {
              const isDerivOfficial = isOfficialDerivUrl(url);

              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {isDerivOfficial ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#ff444f] shrink-0" />
                    )}
                    <span className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
                      {url}
                    </span>
                  </div>

                  <div>
                    {isDerivOfficial ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 whitespace-nowrap">
                        Verified Official Deriv HTTPS Domain
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 whitespace-nowrap">
                        UNOFFICIAL / HIGH PHISHING RISK
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safe Indicators Detected */}
      {safeIndicators.length > 0 && (
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Safe Communication Indicators ({safeIndicators.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {safeIndicators.map((ind, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
              >
                ✓ &quot;{ind}&quot;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Official Deriv Security Advice */}
      {officialAdvice.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Shield className="w-4 h-4" />
            <span>Recommended Next Actions from Deriv Security</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {officialAdvice.map((advice, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#ff444f] font-bold">•</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
