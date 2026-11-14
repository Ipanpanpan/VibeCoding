import { VerificationStep } from '../types/analyzer';

export const INITIAL_CHECKLIST_STEPS: VerificationStep[] = [
  {
    id: 'verify-domain',
    title: '1. Inspect the Website URL & Domain',
    description: 'Check whether the link uses HTTPS and its host is deriv.com or a subdomain such as app.deriv.com. A matching link does not prove who sent the message.',
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
    description: 'Did an unsolicited account or number ask you to move the conversation to a messaging app?',
    officialGuidance: 'Check the contact options listed at deriv.com/contact-us yourself. Do not trust a number or account supplied only in the message.',
    completed: false,
  },
  {
    id: 'verify-live-chat',
    title: '4. Direct Cross-Check with Official Support',
    description: 'Open a new browser tab, type "deriv.com/contact-us", and use a contact option listed there to ask if the alert is genuine.',
    officialGuidance: 'Deriv directs suspicious-message reports and verification requests to support reached through its official website.',
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
