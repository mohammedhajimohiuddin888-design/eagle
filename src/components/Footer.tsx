/**
 * Footer.tsx
 * Clean editorial footer with section anchors, newsletter subscription, and altitude status.
 */

import React, { useState } from 'react';
import { ArrowUp, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAccess: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAccess }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 border-t border-black/[0.08] text-[#1B1A17]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-black/[0.06]">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <div className="w-6 h-6 rounded-full border border-black/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 stroke-black stroke-[2.2]">
                <path d="M3 13C6 8 11 6 21 6C16 11 14 16 14 21C11 17 8 15 3 13Z" />
              </svg>
            </div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#1B1A17]">
              Eagle
            </span>
          </div>
          <p className="text-xs text-black/60 max-w-sm leading-relaxed">
            High-altitude autonomous vision systems uniting evolutionary aerodynamics with deterministic edge intelligence.
          </p>
          <div className="text-xs text-black/40 font-mono">
            Operational Service Ceiling: 14,000M ASL
          </div>
        </div>

        {/* Navigation Links Column */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-black/40 block">
            Navigation
          </span>
          <ul className="space-y-2 text-xs font-medium text-black/70">
            <li>
              <button
                onClick={() => onNavigate('hero')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Altitude Hero
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('platform')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Platform Architecture
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('coverage')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Global Coverage
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('research')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Research & Publications
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('company')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Company & Values
              </button>
            </li>
          </ul>
        </div>

        {/* Resources & Technical Column */}
        <div className="md:col-span-2 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-black/40 block">
            Technical
          </span>
          <ul className="space-y-2 text-xs font-medium text-black/70">
            <li>
              <span className="cursor-pointer hover:text-black transition-colors" onClick={onOpenAccess}>
                Corridor API
              </span>
            </li>
            <li>
              <span className="cursor-pointer hover:text-black transition-colors" onClick={onOpenAccess}>
                Telemetry Protocol
              </span>
            </li>
            <li>
              <span className="cursor-pointer hover:text-black transition-colors" onClick={() => onNavigate('research')}>
                Flight Mechanics
              </span>
            </li>
            <li>
              <span className="cursor-pointer hover:text-black transition-colors" onClick={onOpenAccess}>
                LEO SatLink Docs
              </span>
            </li>
          </ul>
        </div>

        {/* Dispatch Newsletter Column */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-black/40 block">
            The Altitude Dispatch
          </span>
          <p className="text-xs text-black/60 leading-relaxed">
            Quarterly technical analysis on raptor biomimetics, high-altitude optical flow, and sovereign aerial networks.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@domain.aero"
              required
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-black/15 text-xs text-black placeholder:text-black/40 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B1A17] hover:bg-black text-white text-xs font-medium rounded-xl transition-all cursor-pointer shrink-0"
            >
              {subscribed ? <Check className="w-4 h-4 text-emerald-400" /> : 'Subscribe'}
            </button>
          </form>

          {subscribed && (
            <div className="text-[11px] text-emerald-700 font-medium">
              Subscribed to research briefings.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/50">
        <div>
          © 2026 EAGLE Aeronautics & Vision Systems. All rights reserved.
        </div>

        <div className="flex items-center gap-6">
          <span className="hover:text-black transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-black transition-colors cursor-pointer">Security Standards</span>
          <span className="hover:text-black transition-colors cursor-pointer">System Status (99.98%)</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-black hover:text-amber-700 transition-colors cursor-pointer font-medium"
            title="Scroll to Top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
