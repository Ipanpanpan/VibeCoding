import React from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#171719] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-md">
            <div className="flex items-center gap-3 text-xl font-bold tracking-tight"><span className="grid place-items-center w-10 h-10 rounded-full bg-[#ff444f]"><ShieldCheck className="w-5 h-5" /></span>deriv<span className="text-[#ff444f] -ml-3">.</span> trustguard</div>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">A simple way to spot suspicious messages and learn how to verify them safely before acting.</p>
            <p className="mt-3 text-xs text-slate-400">Independent project built for GDG KL DevFest 2026 Deriv Challenge 03.</p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-sm">
            <div className="space-y-3"><h3 className="font-bold text-white">Stay safe</h3><a className="block text-slate-300 hover:text-white" href="https://deriv.com/help-centre" target="_blank" rel="noopener noreferrer">Deriv help centre <ArrowUpRight className="inline w-3.5 h-3.5" /></a><a className="block text-slate-300 hover:text-white" href="https://deriv.com/" target="_blank" rel="noopener noreferrer">Official Deriv site <ArrowUpRight className="inline w-3.5 h-3.5" /></a></div>
            <div className="space-y-3"><h3 className="font-bold text-white">DevFest</h3><a className="block text-slate-300 hover:text-white" href="https://forms.gle/SvuHXBUnJ3JV1HNa6" target="_blank" rel="noopener noreferrer">Submit project <ArrowUpRight className="inline w-3.5 h-3.5" /></a><a className="block text-slate-300 hover:text-white" href="https://me.developers.google.com/benefits/claim/gdg-kl-devfest-2026-vibing-2" target="_blank" rel="noopener noreferrer">Claim credits <ArrowUpRight className="inline w-3.5 h-3.5" /></a></div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/15 text-xs text-slate-400">TrustGuard offers guidance, not a guarantee that a message is safe. Verify sensitive requests through official Deriv channels.</div>
      </div>
    </footer>
  );
}
