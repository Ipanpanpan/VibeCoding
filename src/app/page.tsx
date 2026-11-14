'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PresetSelector } from '@/components/PresetSelector';
import { MessageInput } from '@/components/MessageInput';
import { RiskScoreGauge } from '@/components/RiskScoreGauge';
import { AnalysisBreakdown } from '@/components/AnalysisBreakdown';
import { VerificationChecklist } from '@/components/VerificationChecklist';
import { ActionToolkit } from '@/components/ActionToolkit';
import { EducationalGuide } from '@/components/EducationalGuide';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { Footer } from '@/components/Footer';
import { PRESET_MESSAGES } from '@/lib/presets';
import { analyzeMessageLocally } from '@/lib/detector';
import { AnalysisResult, PresetMessage } from '@/types/analyzer';
import { Shield, Sparkles, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function Home() {
  const [message, setMessage] = useState<string>(PRESET_MESSAGES[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(PRESET_MESSAGES[0].id);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Initialize with Preset 1 analyzed on initial render
  useEffect(() => {
    // Run immediate local analysis
    const initialResult = analyzeMessageLocally(PRESET_MESSAGES[0].text);
    setResult(initialResult);

    // Retrieve saved Gemini key if any from localStorage
    try {
      const savedKey = localStorage.getItem('deriv_guard_gemini_key');
      if (savedKey) {
        setGeminiApiKey(savedKey);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectPreset = (preset: PresetMessage) => {
    setMessage(preset.text);
    setSelectedPresetId(preset.id);
    const localRes = analyzeMessageLocally(preset.text);
    setResult(localRes);
  };

  const handleMessageChange = (val: string) => {
    setMessage(val);
    setSelectedPresetId(null);
  };

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    try {
      if (key) {
        localStorage.setItem('deriv_guard_gemini_key', key);
      } else {
        localStorage.removeItem('deriv_guard_gemini_key');
      }
    } catch {
      // ignore
    }
  };

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      // Attempt API call (hybrid with Gemini if key is provided)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          customApiKey: geminiApiKey || undefined,
        }),
      });

      if (res.ok) {
        const data: AnalysisResult = await res.json();
        setResult(data);
      } else {
        // Fallback to instant local analysis
        const local = analyzeMessageLocally(message);
        setResult(local);
      }
    } catch (err) {
      console.warn('API request failed, falling back to local heuristic analysis:', err);
      const local = analyzeMessageLocally(message);
      setResult(local);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0e14] text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(geminiApiKey)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-[#141926] to-[#0e121b] text-white p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#ff444f]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff444f]/20 border border-[#ff444f]/30 text-xs font-bold text-[#ff444f]">
              <Shield className="w-3.5 h-3.5" />
              <span>Deriv Partner Challenge 03 • Trader Protection Shield</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Spot Phishing & Scam Messages <br className="hidden sm:block" />
              <span className="text-[#ff444f]">Before You Click or Share an OTP</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Scammers frequently impersonate Deriv security officers or bonus giveaways to steal login tokens and funds.
              Paste any suspicious SMS, Telegram alert, WhatsApp DM, or email to inspect warning signs instantly.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Latency Regex Heuristics
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Optional Gemini 1.5 Flash AI
              </span>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ff444f]/20 hover:bg-[#ff444f]/30 border border-[#ff444f]/40 text-[#ff444f] transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                View Deriv Security Rules
              </button>
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <PresetSelector
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Input & Action Section */}
        <MessageInput
          value={message}
          onChange={handleMessageChange}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          hasCustomKey={Boolean(geminiApiKey)}
        />

        {/* Dynamic Analysis Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Risk Score Gauge */}
            <RiskScoreGauge result={result} />

            {/* Two Column Layout for Breakdown & Verification Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Red Flags, Explanations & Links (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <AnalysisBreakdown result={result} />
              </div>

              {/* Right Column: Verification Checklist & Toolkit (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <VerificationChecklist />
                <ActionToolkit result={result} rawMessage={message} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Educational Guide Modal */}
      <EducationalGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Gemini Settings Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={geminiApiKey}
        onSave={handleSaveApiKey}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
