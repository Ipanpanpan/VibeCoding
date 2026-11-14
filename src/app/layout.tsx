import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deriv TrustGuard | Suspicious Message Checker',
  description: 'DevFest 2026 Vibing Lounge Challenge 03: Help customers recognize suspicious messages, detect warning signs, and verify safely before acting.',
  keywords: ['Deriv', 'Phishing detector', 'Scam verification', 'DevFest 2026', 'Cybersecurity', 'Financial security'],
  authors: [{ name: 'GDG KL DevFest 2026 Vibing Lounge' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 dark:bg-[#0b0e14] dark:text-slate-100 antialiased selection:bg-[#ff444f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
