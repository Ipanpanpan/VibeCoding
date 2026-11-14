'use client';

import React, { useState } from 'react';
import { AnalysisResult } from '@/types/analyzer';
import { Mail, Copy, Check, Download, Share2, ShieldAlert } from 'lucide-react';

interface ActionToolkitProps {
  result: AnalysisResult;
  rawMessage: string;
}

export function ActionToolkit({ result, rawMessage }: ActionToolkitProps) {
  const [copiedAdvice, setCopiedAdvice] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const generateReportText = () => {
    return `[SUSPICIOUS MESSAGE INCIDENT REPORT]
Timestamp: ${result.analyzedAt}
Risk Level: ${result.badgeText} (Score: ${result.score}/100)
Engine: ${result.engineUsed}

SUSPICIOUS MESSAGE CONTENT:
----------------------------------------
${rawMessage}
----------------------------------------

DETECTED RED FLAGS (${result.redFlags.length}):
${result.redFlags.map(rf => `- [${rf.severity.toUpperCase()}] ${rf.label}: ${rf.description} (Snippets: ${rf.matchedSnippets.join(', ')})`).join('\n')}

DETECTED LINKS:
${result.detectedLinks.length > 0 ? result.detectedLinks.map(l => `- ${l}`).join('\n') : 'None'}

DERIV OFFICIAL SECURITY ADVICE:
${result.officialAdvice.map(a => `- ${a}`).join('\n')}
`;
  };

  const handleCopyAdvice = async () => {
    const textToCopy = `🛡️ Deriv Security Alert Advice:\n\n${result.summary}\n\nOfficial Deriv Advice:\n${result.officialAdvice.map(a => `• ${a}`).join('\n')}\n\nRemember: Deriv staff NEVER ask for your OTP or password, and never handle support via unofficial Telegram bots!`;
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

  const handleMailtoReport = () => {
    const subject = encodeURIComponent(`[Phishing Alert Report] Suspicious Deriv Message Detected (${result.badgeText})`);
    const body = encodeURIComponent(generateReportText());
    window.location.href = `mailto:security@deriv.com?subject=${subject}&body=${body}`;
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
        <span>Incident Action & Reporting Toolkit</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Report to Deriv Security */}
        <button
          onClick={handleMailtoReport}
          className="p-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Email security@deriv.com</span>
        </button>

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
          <span>Download Incident Audit</span>
        </button>
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>Need to copy raw report for support tickets?</span>
        <button
          onClick={handleCopyReport}
          className="text-[#ff444f] hover:underline font-medium"
        >
          {copiedReport ? '✓ Report text copied' : 'Copy Full Audit Text'}
        </button>
      </div>
    </div>
  );
}
