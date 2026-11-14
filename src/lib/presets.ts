import { PresetMessage } from '../types/analyzer';

export const PRESET_MESSAGES: PresetMessage[] = [
  {
    id: 'preset-1-scam',
    name: 'Suspension Threat & Telegram OTP Lure',
    category: 'Scam Phishing',
    badge: 'HIGH RISK',
    badgeColor: 'bg-red-500/20 text-red-500 border-red-500/30',
    description: 'Aggressive suspension panic coercing user to reveal OTP to a fake Telegram bot.',
    text: `[URGENT] Deriv Security Alert: Unusual withdrawal attempt detected on your account #CR982314. Your funds will be frozen within 2 hours unless verified. 

Send your 6-digit verification OTP or contact our Senior Security Agent @DerivSupportOfficial_bot on Telegram immediately to prevent permanent account suspension: https://deriv-verify-security.xyz/auth`,
  },
  {
    id: 'preset-2-phishing',
    name: '$250 VIP Bonus on Unofficial Link',
    category: 'Suspicious Bonus',
    badge: 'SUSPICIOUS',
    badgeColor: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    description: 'Fake high-return anniversary deposit bait hosted on an unofficial .vip domain.',
    text: `Congratulations! You have been selected for the Deriv VIP Trader Anniversary Giveaway! Deposit minimum $50 today and receive an instant $250 bonus match directly into your synthetic indices wallet. 

Claim limited bonus slot before 23:59 GMT: http://deriv-promotions-bonus.vip/claim`,
  },
  {
    id: 'preset-3-safe',
    name: 'Authentic Deriv Monthly Statement',
    category: 'Official Safe',
    badge: 'VERIFIED SAFE',
    badgeColor: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    description: 'Standard security-conscious statement reminder with legitimate HTTPS domains and safety notes.',
    text: `Dear Deriv client, your monthly account trading statement for October 2026 is now available. 

You can log in securely to your account dashboard at https://app.deriv.com or via the official Deriv Bot app to view your trading history. 

Deriv will never ask for your password, 2FA code, or personal payment details over email or chat. For inquiries, reach out through our official Help Centre at https://deriv.com/help-centre.`,
  },
  {
    id: 'preset-4-signals',
    name: '100% Win Rate Signal Bot Scam',
    category: 'Scam Phishing',
    badge: 'HIGH RISK',
    badgeColor: 'bg-red-500/20 text-red-500 border-red-500/30',
    description: 'Bot multiplier scam promising 100% win rate and asking for seed phrase.',
    text: `Guaranteed daily profit! Official Deriv AI Trading Bot v4.2 launched. 100% win rate on Volatility 75 index. Double your deposit in 24 hours. Contact via WhatsApp +1-800-DERIV-BOT or enter your wallet seed phrase to connect auto-trader: http://deriv-ai-signals.top`,
  },
  {
    id: 'preset-5-safe-login',
    name: 'Official 2FA Login Notification',
    category: 'Official Safe',
    badge: 'VERIFIED SAFE',
    badgeColor: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    description: 'Legitimate login alert informing user without demanding replies or sensitive keys.',
    text: `New login detected on your Deriv account from Chrome on Windows (IP: 175.140.22.1). If this was you, no action is needed. 

If you did not authorize this session, please review your active devices immediately at https://app.deriv.com/account/security. Remember: Deriv support will never ask for your 2FA OTP code.`,
  },
];
