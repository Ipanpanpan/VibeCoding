import { NextRequest, NextResponse } from 'next/server';
import { analyzeMessageLocally } from '@/lib/detector';
import { AnalysisResult } from '@/types/analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, customApiKey } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const localResult = analyzeMessageLocally(message);
    const apiKey = (typeof customApiKey === 'string' && customApiKey.trim().length > 0)
      ? customApiKey.trim()
      : process.env.GEMINI_API_KEY;

    // If no Gemini key, return instant high-precision local regex/heuristic result
    if (!apiKey) {
      return NextResponse.json(localResult);
    }

    // Call Google Gemini API
    try {
      const prompt = `You are a cybersecurity expert specializing in Deriv trading platform security, anti-phishing, and customer protection.
Analyze this message allegedly received by a Deriv user:

---
${message}
---

Examine urgency tricks, fake account freeze threats, OTP/password harvesting, unofficial domains (Deriv only uses deriv.com), Telegram/WhatsApp redirection lures, and fake bonus offers.
Output STRICTLY valid JSON conforming to this schema without markdown fences:
{
  "score": number (0 to 100),
  "riskLevel": "SAFE" | "SUSPICIOUS" | "SCAM",
  "badgeText": "HIGH RISK SCAM" | "CAUTION / SUSPICIOUS" | "VERIFIED SAFE PATTERN",
  "summary": string,
  "detailedAnalysis": string[],
  "redFlags": [
    {
      "id": string,
      "label": string,
      "category": "urgency" | "credential" | "domain" | "redirect" | "financial" | "impersonation",
      "severity": "high" | "medium" | "low",
      "description": string,
      "matchedSnippets": string[]
    }
  ],
  "safeIndicators": string[],
  "officialAdvice": string[]
}`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          }),
        }
      );

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          const hybridResult: AnalysisResult = {
            ...localResult,
            ...parsed,
            detectedLinks: localResult.detectedLinks,
            engineUsed: 'hybrid',
            analyzedAt: new Date().toISOString(),
          };
          return NextResponse.json(hybridResult);
        }
      }
    } catch (aiError) {
      console.warn('Gemini analysis failed, falling back to local heuristic engine:', aiError);
    }

    return NextResponse.json(localResult);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze message' },
      { status: 500 }
    );
  }
}
