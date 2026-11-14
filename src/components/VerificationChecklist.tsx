'use client';

import React, { useState } from 'react';
import { INITIAL_CHECKLIST_STEPS } from '@/lib/checklist';
import { VerificationStep } from '@/types/analyzer';
import { CheckSquare, Square, ShieldCheck, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';

export function VerificationChecklist() {
  const [steps, setSteps] = useState<VerificationStep[]>(INITIAL_CHECKLIST_STEPS);

  const toggleStep = (id: string) => {
    setSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  const handleReset = () => {
    setSteps(INITIAL_CHECKLIST_STEPS);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const isAllCompleted = completedCount === steps.length;

  return (
    <div className="bg-white dark:bg-[#141923] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive Safe Verification Checklist
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Follow these 5 essential steps before taking ANY action on an unsolicited message
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {completedCount} of {steps.length} Verified
            </span>
            <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  isAllCompleted ? 'bg-emerald-500' : 'bg-[#ff444f]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {completedCount > 0 && (
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isAllCompleted && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Checklist Complete!</strong> You have thoroughly inspected the key threat vectors. You are empowered to make a safe, informed decision.
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              step.completed
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                aria-label={step.completed ? 'Mark unverified' : 'Mark verified'}
              >
                {step.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1">
                <h4
                  className={`text-xs sm:text-sm font-semibold transition-colors ${
                    step.completed
                      ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {step.description}
                </p>

                <div className="mt-2 text-[11px] p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Deriv Rule:</strong> {step.officialGuidance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
