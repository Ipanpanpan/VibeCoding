# 🛡️ Deriv TrustGuard — Anti-Phishing & Suspicious Message Intelligence

> Built for **GDG KL DevFest 2026 Vibing Lounge — Partner Challenge 03 (Deriv)**:  
> *"Help Customers Recognize a Suspicious Message: A customer receives a message from someone claiming to be support. Build a message-checking tool that points out warning signs and tells the customer how to check safely before acting."*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Tests Passing](https://img.shields.io/badge/tests-30%2F30%20passing-brightgreen)](https://github.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4%20App%20Router-black)](https://nextjs.org)
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
- **On-device pattern scanner (the default)**: Messages stay in the browser unless the user explicitly selects Gemini for a scan.
  - Scans for urgency/freeze ultimatums (e.g. *"account suspended within 2 hours"*).
  - Flags sensitive credential harvesting (e.g. OTP, 2FA, password, seed phrase).
  - Checks whether links use HTTPS on `deriv.com` or its subdomains, and flags unrelated or deceptive destinations. A domain match does not verify the sender.
  - Catches off-platform redirection lures (Telegram bots `@DerivSupport_bot`, WhatsApp links, personal social media).
  - Detects financial giveaways, bonus multipliers, and 100% win rate bot lures.
  - Recognizes familiar security reminders without treating them as proof that a message is genuine.
- **Optional Google Gemini AI Hybrid Mode (`/api/analyze`)**:
  - Uses Gemini 3.5 Flash only when the user selects it for a scan; that message is sent through this app to Google.
  - Configurable via a key stored only in the current browser tab or a server-side `GEMINI_API_KEY` environment variable.
  - Falls back to the on-device scanner with a visible notice if Gemini is unavailable.

### 2. Interactive User Experience
- **⚡ 1-Click Test Presets**:
  - **Preset 1**: Urgent Account Suspension & Telegram OTP Lure (*High Risk Scam*)
  - **Preset 2**: Fake $250 VIP Deposit Bonus on `.xyz` link (*Suspicious Phishing*)
  - **Preset 3**: Example Deriv Monthly Statement (*No Flags Found*)
  - **Preset 4**: 100% Win Rate Signal Bot Scam (*High Risk Scam*)
  - **Preset 5**: Example 2FA Login Notification (*No Flags Found*)
- **Dynamic Warning Sign Score (0–100%)**:
  - `0 - 24%`: `NO WARNING SIGNS FOUND` (Emerald; sender still unverified)
  - `25 - 64%`: `CAUTION / SUSPICIOUS` (Amber)
  - `65 - 100%`: `HIGH RISK SCAM` (Deriv Coral Red `#ff444f`)
- **Highlighted Red Flag Chips**:
  - Tagged by severity (`high`, `medium`, `low`) and category (`urgency`, `credential`, `domain`, `redirect`, `financial`, `impersonation`).
  - Displays highlighted trigger quotes directly from the message.
- **Interactive Verification Checklist**:
  - 5 interactive steps guiding the customer on inspecting URLs, rejecting OTP requests, checking unsolicited support accounts, contacting Deriv through its website, and resisting panic.
- **Incident Action & Reporting Toolkit**:
  - Copyable and downloadable reports, plus a link to Deriv's official contact page for reporting.
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
- Node.js 20.9+ (tested on Node 24)
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

Deriv TrustGuard includes automated detector, API, and UI checks (`tests/`):
```bash
npm test
```
**Test Coverage:**
1. Empty or whitespace input handling
2. Preset 1 — Urgent Account Suspension & Telegram OTP lure
3. Preset 2 — Fake $250 VIP Deposit Bonus on `.xyz` link
4. Preset 3 — Legitimate Deriv monthly statement
5. Preset 4 — 100% Win Rate Signal Bot Scam with WhatsApp and seed phrase
6. Preset 5 — Official 2FA Login Notification
7. `extractUrls` parser strips quotes, brackets, and trailing punctuation
8. Deceptive domain masquerading (`deriv.com.attacker.com`) and zero safe indicator leaks
9. IDN Homoglyph / Punycode anti-spoofing detection (e.g. Cyrillic 'і' in `derіv.com`)
10. Strict `isOfficialDerivUrl` & `isOfficialDerivDomain` validator
11. Generic benign text does not claim it directs to official Deriv domains
12. High-volume fuzzing / long input boundary handling
13. Case-insensitivity & mixed case evasion attempts

---

## 📜 License
MIT License. Created for DevFest 2026 Vibing Lounge Challenge 03.
