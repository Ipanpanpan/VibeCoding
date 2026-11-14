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
import { ArrowDownRight, ArrowUpRight, LockKeyhole, SearchCheck, ShieldCheck } from 'lucide-react';

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
    <div className="site-shell min-h-screen flex flex-col text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(geminiApiKey)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1 w-full">
        <section className="hero-section border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="max-w-2xl">
              <div className="eyebrow mb-5"><span className="eyebrow-dot" /> A safer way to check</div>
              <h1 className="hero-title">Pause before you <span>trust that message.</span></h1>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                Someone claiming to be Deriv support? Check their message for warning signs before you click a link, send money, or share a code.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#scanner" className="primary-cta">Check a message <ArrowUpRight className="w-5 h-5" /></a>
                <button onClick={() => setIsGuideOpen(true)} className="secondary-cta">Read the safety guide <ArrowUpRight className="w-4 h-4" /></button>
              </div>
              <p className="mt-7 text-xs text-slate-500 dark:text-slate-400">Built for the GDG KL DevFest 2026 Deriv challenge. Never enter your password or OTP here.</p>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
              <div className="hero-shield"><ShieldCheck strokeWidth={1.25} /></div>
              <div className="hero-float hero-float-top"><LockKeyhole className="w-5 h-5" /><span>Keep your account secure</span></div>
              <div className="hero-float hero-float-bottom"><SearchCheck className="w-5 h-5" /><span>Check before you act</span><ArrowDownRight className="w-4 h-4 ml-3" /></div>
            </div>
          </div>
        </section>

        <section id="scanner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 scroll-mt-24">
          <div className="section-heading">
            <div><div className="eyebrow mb-3"><span className="eyebrow-dot" /> Message checker</div><h2>Check the signs. Take the next step.</h2></div>
            <p>Choose an example or paste a message you received. Your result appears below with practical steps to verify it.</p>
          </div>
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
            <PresetSelector selectedPresetId={selectedPresetId} onSelectPreset={handleSelectPreset} />
            <MessageInput value={message} onChange={handleMessageChange} onAnalyze={handleAnalyze} isLoading={isLoading} hasCustomKey={Boolean(geminiApiKey)} />
          </div>

        {/* Dynamic Analysis Results */}
        {result && (
          <div className="space-y-6 animate-fade-in pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="section-heading"><div><div className="eyebrow mb-3"><span className="eyebrow-dot" /> Analysis result</div><h2>What this message tells us</h2></div><p>Use these signals as a guide. Always confirm through Deriv&apos;s official website or support.</p></div>
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
        </section>
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
