'use client';

import React from 'react';
import { PRESET_MESSAGES } from '@/lib/presets';
import { PresetMessage } from '@/types/analyzer';
import { AlertTriangle, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

interface PresetSelectorProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: PresetMessage) => void;
}

export function PresetSelector({ selectedPresetId, onSelectPreset }: PresetSelectorProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Scam Phishing':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'Suspicious Bonus':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>⚡ Quick 1-Click Test Presets</span>
        </label>
        <span className="text-[11px] text-slate-400">
          Click any preset to simulate real-world messages
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_MESSAGES.slice(0, 3).map((preset, index) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'border-[#ff444f] bg-[#ff444f]/5 dark:bg-[#ff444f]/10 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141923] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {getIcon(preset.category)}
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Preset {index + 1}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-[#ff444f]">
                <span>Load & Inspect</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
