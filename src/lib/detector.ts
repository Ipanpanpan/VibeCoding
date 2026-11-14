import { AnalysisResult, RedFlag, RiskLevel } from '../types/analyzer';

const OFFICIAL_DERIV_DOMAINS = [
  'deriv.com',
  'app.deriv.com',
  'smarttrader.deriv.com',
  'community.deriv.com',
  'bot.deriv.com',
  'deriv.me',
  'deriv.be',
];

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.vip', '.club', '.buzz', '.work',
  '.rest', '.cam', '.cfd', '.click', '.monster', '.live',
  '.online', '.site', '.tk', '.ml', '.ga', '.cf', '.gq'
];

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'rb.gy', 'ow.ly'
];

export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|vip|club|buzz|work|online|site|com|net|org|io|ly|co|me|be|app)[^\s]*)/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches.map(u => u.replace(/[.,;!?)]+$/, ''))));
}

export function analyzeMessageLocally(rawText: string): AnalysisResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const redFlags: RedFlag[] = [];
  const safeIndicators: string[] = [];
  const detailedAnalysis: string[] = [];
  const officialAdvice: string[] = [];

  if (!text) {
    return {
      score: 0,
      riskLevel: 'SAFE',
      badgeText: 'NO INPUT',
      summary: 'Please enter a message or select a preset to analyze.',
      detailedAnalysis: [],
      redFlags: [],
      safeIndicators: [],
      officialAdvice: [],
      detectedLinks: [],
      engineUsed: 'heuristic',
      analyzedAt: new Date().toISOString(),
    };
  }

  const urls = extractUrls(text);
  let riskScore = 0;

  // 1. Check for Urgency & Coercive Language
  const urgencyPatterns = [
    { regex: /(frozen|suspended|terminated|disabled|restricted)\s+within\s+(\d+|one|two|24|48)?\s*(hours?|hrs?|minutes?|days?)/i, label: 'Suspension / Freeze Deadline' },
    { regex: /\[?(urgent|immediate action required|final notice|account alert|security alert)\]?/i, label: 'Urgent Threat Header' },
    { regex: /(act now|without delay|before it'?s too late|prevent permanent (suspension|closure|deletion)|to avoid (suspension|termination)|(verify|reply|contact|send|click)\s+immediately|immediately\s+(verify|reply|contact|send|click|transfer))/i, label: 'High-Pressure Coercion' },
    { regex: /(unusual withdrawal|unauthorized (login|activity)|security breach|suspicious transaction)\s+(on|attempt|detected)/i, label: 'Fabricated Security Panic' },
  ];

  const urgencyMatches: string[] = [];
  for (const p of urgencyPatterns) {
    const match = text.match(p.regex);
    if (match) {
      urgencyMatches.push(match[0]);
    }
  }

  if (urgencyMatches.length > 0) {
    riskScore += 25;
    redFlags.push({
      id: 'urgency-threat',
      label: 'Artificial Urgency & Coercive Pressure',
      category: 'urgency',
      severity: 'high',
      description: 'Scammers create panic with artificial deadlines (e.g., "account frozen in 2 hours") to force hasty action before verification.',
      matchedSnippets: urgencyMatches,
    });
    detailedAnalysis.push('The message uses artificial time pressure or account suspension threats to provoke panic.');
  }

  // 2. Check for Credential / OTP / 2FA Harvesting
  const credentialPatterns = [
    { regex: /(send|provide|reply with|share|enter|give|input)\s+(your\s+)?(6-digit\s+)?(account\s+)?(verification\s+)?(otp|one-time password|verification code|security code|2fa|sms code)/i, label: 'OTP / Verification Code Request' },
    { regex: /(seed phrase|secret recovery phrase|private key|master password)/i, label: 'Private Key / Seed Phrase Request' },
    { regex: /(password|pin|trading password|account pin)\s+(verification|confirmation|to continue)/i, label: 'Password / PIN Request' },
  ];

  const credentialMatches: string[] = [];
  for (const p of credentialPatterns) {
    const match = text.match(p.regex);
    if (match) {
      credentialMatches.push(match[0]);
    }
  }

  if (credentialMatches.length > 0) {
    riskScore += 40;
    redFlags.push({
      id: 'credential-harvesting',
      label: 'OTP / Credential Harvesting',
      category: 'credential',
      severity: 'high',
      description: 'CRITICAL WARNING: Deriv staff NEVER ask for your OTP, 2FA code, password, or security PIN under any circumstances.',
      matchedSnippets: credentialMatches,
    });
    detailedAnalysis.push('The message explicitly requests sensitive credentials (OTP / 2FA / Password). This is the #1 hallmark of account takeover scams.');
    officialAdvice.push('NEVER share your 6-digit OTP code or password. Anyone asking for it is an unauthorized impostor.');
  }

  // 3. Domain & URL Inspection
  const suspiciousUrls: string[] = [];
  let containsLegitDerivDomain = false;

  for (const url of urls) {
    const cleanUrl = url.toLowerCase();
    const isShortener = URL_SHORTENERS.some(s => cleanUrl.includes(s));
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => cleanUrl.includes(tld));
    const isHttpOnly = cleanUrl.startsWith('http://');

    // Parse domain
    let hostname = '';
    try {
      const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      hostname = parsed.hostname;
    } catch {
      hostname = cleanUrl;
    }

    const isOfficial = OFFICIAL_DERIV_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (isOfficial) {
      containsLegitDerivDomain = true;
    } else {
      // Check if it mimics Deriv (typosquatting / deceptive domain)
      const mimicsDeriv = cleanUrl.includes('deriv') || cleanUrl.includes('drv') || cleanUrl.includes('binary');
      if (mimicsDeriv || hasSuspiciousTld || isShortener || isHttpOnly) {
        suspiciousUrls.push(url);
      }
    }
  }

  if (suspiciousUrls.length > 0) {
    riskScore += 35;
    redFlags.push({
      id: 'unofficial-domain',
      label: 'Unofficial / Deceptive Link Detected',
      category: 'domain',
      severity: 'high',
      description: `Links in this message do not point to official Deriv portals (deriv.com). They use deceptive domains, unofficial TLDs, or unencrypted HTTP: ${suspiciousUrls.join(', ')}`,
      matchedSnippets: suspiciousUrls,
    });
    detailedAnalysis.push(`Detected unofficial or deceptive destination URL: ${suspiciousUrls.join(', ')}. Official Deriv links only end in deriv.com or official deriv apps.`);
    officialAdvice.push('Always check the browser address bar. Deriv will only direct you to https://deriv.com or official subdomains.');
  }

  // 4. Off-Platform Redirects (Telegram, WhatsApp, personal DMs)
  const offPlatformPatterns = [
    { regex: /(t\.me\/[a-zA-Z0-9_]+|telegram\.me\/[a-zA-Z0-9_]+|telegram\s+bot|@[\w_]+bot|telegram\s+channel)/i, label: 'Telegram Bot / Handle' },
    { regex: /(wa\.me\/[0-9]+|whatsapp\.com\/[^\s]+|contact\s+via\s+whatsapp|\+?\d{10,14}\s*(whatsapp)?)/i, label: 'WhatsApp Redirection' },
    { regex: /(contact\s+our\s+agent\s+on\s+(telegram|whatsapp|instagram)|reach\s+out\s+directly\s+to\s+@)/i, label: 'Direct Personal Messaging' },
  ];

  const offPlatformMatches: string[] = [];
  for (const p of offPlatformPatterns) {
    const match = text.match(p.regex);
    if (match) {
      offPlatformMatches.push(match[0]);
    }
  }

  if (offPlatformMatches.length > 0) {
    riskScore += 30;
    redFlags.push({
      id: 'off-platform-redirect',
      label: 'Off-Platform Telegram/WhatsApp Lure',
      category: 'redirect',
      severity: 'high',
      description: 'Official Deriv customer support NEVER operates via external Telegram bots, WhatsApp numbers, or private direct messages.',
      matchedSnippets: offPlatformMatches,
    });
    detailedAnalysis.push('The message redirects communication to an unofficial external platform (Telegram / WhatsApp) where transactions cannot be verified.');
    officialAdvice.push('Deriv support is ONLY available through the official Live Chat at deriv.com or verified email tickets.');
  }

  // 5. Unrealistic Financial Incentives & Bonus Baits
  const financialBaits = [
    { regex: /(giveaway|\$?\d+\s*deposit\s*bonus|bonus\s*match|synthetic\s*indices\s*wallet\s*bonus)/i, label: 'Unsolicited Bonus / Giveaway Bait' },
    { regex: /(guaranteed\s*(daily\s*)?profit|100%\s*win\s*rate|risk-free\s*signals|double\s*your\s*(deposit|money))/i, label: 'Guaranteed Profit / Bot Scam' },
    { regex: /(claim\s*limited\s*bonus\s*slot|selected\s*for\s*(the\s*)?deriv\s*vip)/i, label: 'VIP Exclusivity Pressure' },
  ];

  const financialMatches: string[] = [];
  for (const p of financialBaits) {
    const match = text.match(p.regex);
    if (match) {
      financialMatches.push(match[0]);
    }
  }

  if (financialMatches.length > 0) {
    riskScore += 25;
    redFlags.push({
      id: 'financial-bait',
      label: 'High-Reward Bonus / Unrealistic Bait',
      category: 'financial',
      severity: 'medium',
      description: 'Offers of unexpected bonuses, giveaways, or guaranteed profits are classic lures used to steal deposit funds or login tokens.',
      matchedSnippets: financialMatches,
    });
    detailedAnalysis.push('Message advertises unrealistic bonuses or giveaways conditioned on quick deposit or link clicking.');
  }

  // 6. Impersonation of Deriv Security / Compliance Officers
  const impersonationPatterns = [
    { regex: /(senior\s*security\s*agent|deriv\s*security\s*alert|fraud\s*prevention\s*officer|compliance\s*department\s*alert|deriv\s*official\s*support\s*bot)/i, label: 'Official Title Impersonation' },
  ];

  const impersonationMatches: string[] = [];
  for (const p of impersonationPatterns) {
    const match = text.match(p.regex);
    if (match) {
      impersonationMatches.push(match[0]);
    }
  }

  if (impersonationMatches.length > 0) {
    riskScore += 15;
    redFlags.push({
      id: 'impersonation',
      label: 'Deriv Staff Impersonation',
      category: 'impersonation',
      severity: 'medium',
      description: 'Scammers masquerade as Deriv compliance officers or security agents to gain instant trust.',
      matchedSnippets: impersonationMatches,
    });
    detailedAnalysis.push('Sender claims to be a specialized Deriv security or compliance agent.');
  }

  // 7. Check for Positive / Safe Indicators
  const safePatterns = [
    { regex: /(deriv\s+(support\s+)?will\s+never\s+ask\s+for\s+your\s+(password|2fa|otp)|never\s+ask\s+for.*2fa|never\s+share\s+your\s+otp)/i, label: 'Explicit Security Warning Included' },
    { regex: /https:\/\/(app\.)?deriv\.com\/help-centre/i, label: 'Official Deriv Help Centre Link' },
    { regex: /https:\/\/(app\.)?deriv\.com(\/[^\s]*)?/i, label: 'Authentic HTTPS Deriv Portal URL' },
    { regex: /(monthly\s+(account\s+)?trading\s+statement|statement\s+is\s+now\s+available|new\s+login\s+detected)/i, label: 'Routine Informational Security Notice' },
  ];

  for (const sp of safePatterns) {
    const match = text.match(sp.regex);
    if (match) {
      safeIndicators.push(match[0]);
    }
  }

  // Scoring adjustment if legitimate pattern & zero high-risk flags
  if (redFlags.length === 0 && (containsLegitDerivDomain || safeIndicators.length > 0)) {
    riskScore = Math.max(0, riskScore - 20);
    detailedAnalysis.push('Contains authentic Deriv domain links and standard informational security reminders.');
  }

  // Normalize score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, riskScore));

  let riskLevel: RiskLevel = 'SAFE';
  let badgeText = 'VERIFIED SAFE PATTERN';

  if (normalizedScore >= 65) {
    riskLevel = 'SCAM';
    badgeText = 'HIGH RISK SCAM';
  } else if (normalizedScore >= 25) {
    riskLevel = 'SUSPICIOUS';
    badgeText = 'CAUTION / SUSPICIOUS';
  } else {
    riskLevel = 'SAFE';
    badgeText = 'VERIFIED SAFE PATTERN';
  }

  // Generate plain-English summary
  let summary = '';
  if (riskLevel === 'SCAM') {
    summary = `DANGER: This message exhibits ${redFlags.length} severe scam markers, including coercive urgency and credential harvesting attempts. Do NOT click any links, do NOT message external bots, and do NOT share any OTP codes.`;
  } else if (riskLevel === 'SUSPICIOUS') {
    summary = `CAUTION: This message contains ${redFlags.length} suspicious pattern(s). Verify the sender and link destinations directly in your browser before engaging.`;
  } else {
    summary = 'This message matches legitimate Deriv communication patterns. It directs to official deriv.com domains and does not request credentials.';
  }

  if (officialAdvice.length === 0) {
    if (riskLevel === 'SAFE') {
      officialAdvice.push('Always check that your browser address bar displays "https://deriv.com" or official subdomains.');
      officialAdvice.push('Access your account by typing deriv.com directly into your browser rather than clicking email links.');
    } else {
      officialAdvice.push('Forward this message to security@deriv.com to alert Deriv Anti-Fraud operations.');
      officialAdvice.push('If you already entered your credentials, immediately log in to https://app.deriv.com and reset your password & revoke active sessions.');
    }
  }

  return {
    score: normalizedScore,
    riskLevel,
    badgeText,
    summary,
    detailedAnalysis,
    redFlags,
    safeIndicators,
    officialAdvice,
    detectedLinks: urls,
    engineUsed: 'heuristic',
    analyzedAt: new Date().toISOString(),
  };
}
