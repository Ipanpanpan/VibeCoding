import { VerificationStep } from '../types/analyzer';

export const INITIAL_CHECKLIST_STEPS: VerificationStep[] = [
  {
    id: 'verify-domain',
    title: '1. Inspect the Website URL & Domain',
    description: 'Ensure the link begins with "https://" and the host ends strictly in "deriv.com" (e.g. app.deriv.com or deriv.com/help-centre).',
    officialGuidance: 'Scammers frequently register domains like deriv-secure.xyz or deriv-bonus.vip. Never enter your credentials on any unofficial domain.',
    completed: false,
  },
  {
    id: 'verify-no-otp',
    title: '2. Check for OTP / Password Requests',
    description: 'Did the message request a 6-digit SMS code, authenticator OTP, or trading password?',
    officialGuidance: 'Deriv employees will NEVER ask for your OTP or password. Sharing an OTP gives attackers instant access to drain your balance.',
    completed: false,
  },
  {
    id: 'verify-no-off-platform',
    title: '3. Verify Communication Channel',
    description: 'Is the sender asking you to chat on Telegram (@bot), WhatsApp, or personal social media?',
    officialGuidance: 'Deriv never handles account issues, security alerts, or withdrawals via Telegram or WhatsApp bots. All communications occur on deriv.com.',
    completed: false,
  },
  {
    id: 'verify-live-chat',
    title: '4. Direct Cross-Check with Official Support',
    description: 'Open a new browser tab, manually type "deriv.com", and ask Official Live Chat if the alert is legitimate.',
    officialGuidance: 'Deriv 24/7 Live Chat can look up your real account ID to immediately verify if any genuine security holds exist.',
    completed: false,
  },
  {
    id: 'verify-urgency-pressure',
    title: '5. Resist Artificial Panic & Urgency',
    description: 'Notice if the message demands immediate compliance under threat of account deletion or fund forfeiture.',
    officialGuidance: 'Phishers exploit fear of loss. Genuine compliance procedures provide formal account notifications inside your verified dashboard.',
    completed: false,
  },
];
