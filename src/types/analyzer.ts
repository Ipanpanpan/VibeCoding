export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'SCAM';

export interface RedFlag {
  id: string;
  label: string;
  category: 'urgency' | 'credential' | 'domain' | 'redirect' | 'financial' | 'impersonation';
  severity: 'high' | 'medium' | 'low';
  description: string;
  matchedSnippets: string[];
}

export interface VerificationStep {
  id: string;
  title: string;
  description: string;
  officialGuidance: string;
  completed: boolean;
}

export interface AnalysisResult {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  badgeText: string;
  summary: string;
  detailedAnalysis: string[];
  redFlags: RedFlag[];
  safeIndicators: string[];
  officialAdvice: string[];
  detectedLinks: string[];
  engineUsed: 'heuristic' | 'gemini-ai' | 'hybrid';
  analyzedAt: string;
}

export interface PresetMessage {
  id: string;
  name: string;
  category: 'Scam Phishing' | 'Suspicious Bonus' | 'Official Safe';
  badge: 'HIGH RISK' | 'SUSPICIOUS' | 'NO FLAGS FOUND';
  badgeColor: string;
  description: string;
  text: string;
}
