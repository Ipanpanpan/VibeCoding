'use client';

import React from 'react';
import { AnalysisResult, RiskLevel } from '@/types/analyzer';
import { AlertOctagon, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface RiskScoreGaugeProps {
  result: AnalysisResult;
}

export function RiskScoreGauge({ result }: RiskScoreGaugeProps) {
  const { score, riskLevel, badgeText, engineUsed } = result;

  // Determine styling based on risk level
  const getTheme = (level: RiskLevel) => {
    switch (level) {
      case 'SCAM':
        return {
          color: '#ff444f',
          textColor: 'text-[#ff444f]',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          badgeBg: 'bg-[#ff444f] text-white',
          glowClass: 'glow-red',
          icon: <AlertOctagon className="w-6 h-6 text-[#ff444f]" />,
          recommendation: 'DO NOT ENGAGE: High probability of account credential compromise or wallet fraud.',
        };
      case 'SUSPICIOUS':
        return {
          color: '#f59e0b',
          textColor: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          badgeBg: 'bg-amber-500 text-white',
          glowClass: 'glow-amber',
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
          recommendation: 'EXERCISE CAUTION: Inspect links and verify with official live chat before responding.',
        };
      default:
        return {
          color: '#10b981',
          textColor: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-500 text-white',
          glowClass: 'glow-emerald',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
          recommendation: 'SAFE PATTERN: Matches authentic communication protocols and official Deriv guidelines.',
        };
    }
  };

  const theme = getTheme(riskLevel);

  // SVG Gauge calculations
  const radius = 64;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Use semi-circle gauge (180 deg) or full circle with dashoffset
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`rounded-2xl border ${theme.borderColor} ${theme.bgColor} p-6 shadow-sm transition-all duration-300 relative overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Gauge Circle */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="text-slate-200 dark:text-slate-800"
              />
              <circle
                stroke={theme.color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{
                  strokeDashoffset,
                  transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold tracking-tight ${theme.textColor}`}>
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Risk Score
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${theme.badgeBg}`}
              >
                {theme.icon}
                {badgeText}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-md">
              {theme.recommendation}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Engine: {engineUsed === 'hybrid' ? 'Gemini 1.5 Flash + Heuristics' : 'Real-Time Heuristic Pattern Scanner'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Metric Pills */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-white/80 dark:bg-[#141923]/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Red Flags</span>
            <span className={`text-xl font-bold ${result.redFlags.length > 0 ? 'text-[#ff444f]' : 'text-emerald-500'}`}>
              {result.redFlags.length}
            </span>
          </div>

          <div className="bg-white/80 dark:bg-[#141923]/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Safe Signals</span>
            <span className="text-xl font-bold text-emerald-500">
              {result.safeIndicators.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
