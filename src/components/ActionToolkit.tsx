'use client';

import React, { useState } from 'react';
import { AnalysisResult } from '@/types/analyzer';
import { ExternalLink, Copy, Check, Download, Share2 } from 'lucide-react';

interface ActionToolkitProps {
  result: AnalysisResult;
  rawMessage: string;
  compact?: boolean;
}

export function ActionToolkit({ result, rawMessage, compact = false }: ActionToolkitProps) {
  const [copiedAdvice, setCopiedAdvice] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const generateReportText = () => {
    return `[MESSAGE CHECK REPORT]
Timestamp: ${result.analyzedAt}
Risk Level: ${result.badgeText} (Score: ${result.score}/100)
Engine: ${result.engineUsed}

MESSAGE ANALYZED:
----------------------------------------
${rawMessage}
----------------------------------------

DETECTED RED FLAGS (${result.redFlags.length}):
${result.redFlags.map(rf => `- [${rf.severity.toUpperCase()}] ${rf.label}: ${rf.description} (Snippets: ${rf.matchedSnippets.join(', ')})`).join('\n')}

DETECTED LINKS:
${result.detectedLinks.length > 0 ? result.detectedLinks.map(l => `- ${l}`).join('\n') : 'None'}

SUGGESTED NEXT STEPS:
${result.officialAdvice.map(a => `- ${a}`).join('\n')}
`;
  };

  const handleCopyAdvice = async () => {
    const textToCopy = `🛡️ Message check:\n\n${result.summary}\n\nSuggested next steps:\n${result.officialAdvice.map(a => `• ${a}`).join('\n')}\n\nNever share a password or one-time code. Verify requests through contact options reached from deriv.com/contact-us.`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAdvice(true);
      setTimeout(() => setCopiedAdvice(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateReportText());
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadReport = () => {
    const report = generateReportText();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deriv-security-audit-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        <Share2 className="w-4 h-4 text-[#ff444f]" />
        <span>What you can do next</span>
      </div>

      <div className={`grid grid-cols-1 gap-2.5 ${compact ? '' : 'sm:grid-cols-3'}`}>
        <a
          href="https://deriv.com/contact-us"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Contact Deriv on its website</span>
        </a>

        {/* Copy Safety Advice */}
        <button
          onClick={handleCopyAdvice}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          {copiedAdvice ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">Advice Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Safety Advice</span>
            </>
          )}
        </button>

        {/* Download Audit Report */}
        <button
          onClick={handleDownloadReport}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download check report</span>
        </button>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>Review the message before sharing it with support.</span>
        <button
          onClick={handleCopyReport}
          className="text-[#ff444f] hover:underline font-medium"
        >
          {copiedReport ? '✓ Report text copied' : 'Copy full report'}
        </button>
      </div>
    </div>
  );
}
