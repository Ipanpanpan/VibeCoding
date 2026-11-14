# 🛡️ Deriv TrustGuard — Anti-Phishing & Suspicious Message Intelligence

> Built for **GDG KL DevFest 2026 Vibing Lounge — Partner Challenge 03 (Deriv)**:  
> *"Help Customers Recognize a Suspicious Message: A customer receives a message from someone claiming to be support. Build a message-checking tool that points out warning signs and tells the customer how to check safely before acting."*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Tests Passing](https://img.shields.io/badge/tests-10%2F10%20passing-brightgreen)](https://github.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38bdf8)](https://tailwindcss.com)

---

## 🚀 Live Demo & Quick Vercel Deployment

Deploy directly to Vercel in 1 command:
```bash
npx vercel
```
Or connect your GitHub repository to Vercel. Everything is pre-configured with zero custom build configuration needed (`framework: "nextjs"`, App Router).

### Important DevFest 2026 Links
- 🎟️ **Claim USD$5.00 Antigravity Credits**: [DevFest 2026 Claim Portal](https://me.developers.google.com/benefits/claim/gdg-kl-devfest-2026-vibing-2)
- 📝 **Project Submission Form**: [Submit Completed Project](https://forms.gle/SvuHXBUnJ3JV1HNa6)

---

## ✨ Features & Architecture

### 1. Hybrid Threat Detection Engine
- **Instant Client-Side Heuristics (0ms latency, 100% privacy)**:
  - Scans for urgency/freeze ultimatums (e.g. *"account suspended within 2 hours"*).
  - Flags sensitive credential harvesting (e.g. OTP, 2FA, password, seed phrase).
  - Validates domains against the official Deriv whitelist (`deriv.com`, `app.deriv.com`, `smarttrader.deriv.com`, `community.deriv.com`, etc.) and alerts on deceptive TLDs (`.xyz`, `.vip`, `.top`, etc.).
  - Catches off-platform redirection lures (Telegram bots `@DerivSupport_bot`, WhatsApp links, personal social media).
  - Detects financial giveaways, bonus multipliers, and 100% win rate bot lures.
  - Distinguishes authentic security notices (e.g., *"Deriv will never ask for your password"*).
- **Optional Google Gemini AI Hybrid Mode (`/api/analyze`)**:
  - Leverages Google Gemini 1.5 Flash for natural language reasoning.
  - Configurable via the in-app Gemini settings modal or `GEMINI_API_KEY` environment variable.
  - Gracefully falls back to the client-side engine if no key is provided or offline.

### 2. Interactive User Experience
- **⚡ 1-Click Test Presets**:
  - **Preset 1**: Urgent Account Suspension & Telegram OTP Lure (*High Risk Scam*)
  - **Preset 2**: Fake $250 VIP Deposit Bonus on `.vip` link (*Suspicious Phishing*)
  - **Preset 3**: Legitimate Deriv Monthly Statement (*Verified Safe*)
  - **Preset 4**: 100% Win Rate Signal Bot Scam (*High Risk Scam*)
  - **Preset 5**: Official 2FA Login Notification (*Verified Safe*)
- **Dynamic Risk Score Gauge (0–100%)**:
  - `0 - 24%`: `VERIFIED SAFE PATTERN` (Emerald)
  - `25 - 64%`: `CAUTION / SUSPICIOUS` (Amber)
  - `65 - 100%`: `HIGH RISK SCAM` (Deriv Coral Red `#ff444f`)
- **Highlighted Red Flag Chips**:
  - Tagged by severity (`high`, `medium`, `low`) and category (`urgency`, `credential`, `domain`, `redirect`, `financial`, `impersonation`).
  - Displays highlighted trigger quotes directly from the message.
- **Interactive Safe Verification Checklist**:
  - 5 interactive steps guiding the customer on inspecting URLs, rejecting OTP requests, ignoring Telegram bots, cross-checking with 24/7 Live Chat, and resisting panic.
- **Incident Action & Reporting Toolkit**:
  - Pre-formatted incident reports for Deriv security (`security@deriv.com`).
  - 1-click **Copy Safety Advice** to forward to family or trading communities.
  - Downloadable Incident Audit (`.txt`).
- **Comprehensive Educational Guide & Deriv Whitelist**:
  - Comparison table: Official Deriv Support vs Fake Impostors.
  - Breakdown of top 3 scam types targeting traders.
- **Deriv Brand Theme**:
  - Sleek modern dark & light mode with signature Deriv Coral Red `#ff444f` accents.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ (tested on Node 24)
- npm 9+

### Setup
```bash
# Clone the repository
git clone <repo-url>
cd VibeCoding

# Install dependencies
npm install

# Run automated test suite (10 unit tests)
npm test

# Run production build
npm run build

# Start local server
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 🧪 Testing Record

Deriv TrustGuard includes a 10-test automated verification suite (`tests/detector.test.ts`):
```bash
npm test
```
**Test Coverage:**
1. Empty or whitespace input handling
2. Preset 1 — Urgent Account Suspension & Telegram OTP lure
3. Preset 2 — Fake $250 VIP Deposit Bonus
4. Preset 3 — Legitimate Deriv monthly statement
5. Preset 4 — 100% Win Rate Signal Bot Scam with WhatsApp and seed phrase
6. Preset 5 — Official 2FA Login Notification
7. `extractUrls` parser domain extraction with trailing punctuation
8. Deceptive domain masquerading (`deriv.com.attacker.com`)
9. High-volume fuzzing / long input handling
10. Case-insensitivity & mixed case evasion attempts

---

## 📜 License
MIT License. Created for DevFest 2026 Vibing Lounge Challenge 03.
