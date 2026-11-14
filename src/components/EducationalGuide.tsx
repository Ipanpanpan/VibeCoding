'use client';

import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Globe, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';

interface EducationalGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EducationalGuide({ isOpen, onClose }: EducationalGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff444f]/10 text-[#ff444f] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Deriv Security & Scam Recognition Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Essential knowledge to protect your trading account and funds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 pt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* Comparison Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Official Deriv Support vs Fake Impostor
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Legitimate Deriv Team</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>• Support only via Live Chat on <strong>deriv.com</strong> or email tickets.</li>
                  <li>• <strong>NEVER</strong> asks for your OTP, password, or card CVV.</li>
                  <li>• Official domains strictly end in <strong>deriv.com</strong>.</li>
                  <li>• Formal account issues appear inside your account notifications.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#ff444f] text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>Impostors & Phishers</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>• Direct message you via Telegram bots, WhatsApp, or Instagram.</li>
                  <li>• Demand your 6-digit OTP to &quot;cancel an unauthorized withdrawal&quot;.</li>
                  <li>• Use deceptive domains like <em>deriv-verify.xyz</em> or <em>deriv-vip.top</em>.</li>
                  <li>• Create panic with arbitrary &quot;2 hours before freeze&quot; ultimatums.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Official Domain Whitelist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Official Deriv Whitelist</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'https://deriv.com',
                'https://app.deriv.com',
                'https://smarttrader.deriv.com',
                'https://community.deriv.com',
                'https://bot.deriv.com',
                'https://deriv.com/help-centre',
              ].map((domain, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate"
                >
                  ✓ {domain.replace('https://', '')}
                </div>
              ))}
            </div>
          </div>

          {/* Common Scam Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top 3 Scams Targeting Deriv Traders
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  1. The &quot;Suspicious Login / Urgent Freeze&quot; Trick
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  The scammer claims your account will be deleted unless you verify an OTP or join a fake Telegram bot. In reality, they are trying to log in and need your 2FA OTP to steal your funds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  2. Fake Deposit Bonus & Giveaway Sites
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Phishing websites hosted on cheap TLDs (.xyz, .vip) promising $250 bonus match if you deposit. Once you enter credentials or transfer crypto, the site disappears.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  3. Guaranteed Profit Trading Bots & Signal Rooms
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Impostors selling &quot;100% win rate Deriv bots&quot; requiring you to hand over account passwords or send deposits to an external crypto address.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#ff444f] hover:bg-[#d43640] text-white text-xs font-semibold shadow-md transition-all"
            >
              Understood, Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
