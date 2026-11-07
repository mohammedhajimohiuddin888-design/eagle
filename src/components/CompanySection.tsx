/**
 * CompanySection.tsx
 * Company mission, engineering culture, and strategic access inquiry form.
 */

import React, { useState } from 'react';
import { Shield, Sparkles, Send, CheckCircle, ArrowRight } from 'lucide-react';

interface CompanySectionProps {
  onOpenAccess: () => void;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ onOpenAccess }) => {
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setOrg('');
    }, 4000);
  };

  const values = [
    {
      title: 'Aerodynamic Rigor',
      desc: 'We do not build generic quadcopters. We emulate the evolutionary refinement of apex raptors to achieve unprecedented range and silent high-altitude loitering.',
    },
    {
      title: 'Sovereign Edge Computing',
      desc: 'All optical telemetry is vectorized locally on aircraft. Zero unencrypted video streams ever enter public networks.',
    },
    {
      title: 'Zero Latency Tolerance',
      desc: 'Real-world aerial tracking demands determinism. We architect every software and hardware layer for sub-15ms round-trip delivery.',
    },
  ];

  return (
    <section id="company" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 scroll-mt-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-black/[0.08] pb-8">
        <div>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#9A7D3A] uppercase block mb-2">
            Organization & Mission
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#1B1A17] font-normal tracking-tight">
            Clarity at <span className="italic">altitude</span>
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-xs sm:text-sm text-black/60 max-w-md font-normal leading-relaxed">
          Founded by aerospace engineers and computer vision researchers dedicated to unlocking perpetual autonomous aerial perception.
        </p>
      </div>

      {/* Grid: Story & Values */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
        {/* Story */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-9 border border-black/[0.08] shadow-sm space-y-4">
          <span className="text-xs font-semibold tracking-wider uppercase text-black/40">
            Genesis
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl text-[#1B1A17] font-normal leading-snug">
            Nature engineered the ultimate high-altitude vision system over 40 million years. We brought it to software.
          </h3>
          <p className="text-xs sm:text-sm text-black/70 leading-relaxed font-normal">
            Traditional drones fight physics with brute thrust. EAGLE harnesses the dynamics of air itself: banking on invisible thermals, adjusting feather wingtips with millimeter precision, and resolving ground movement from the stratosphere.
          </p>
          <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs text-black/60">
            <span>Zurich & Boulder Labs</span>
            <span>·</span>
            <span>Est. 2024</span>
          </div>
        </div>

        {/* Core Principles */}
        <div className="lg:col-span-7 space-y-4">
          {values.map((v, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/70 border border-black/[0.06] hover:bg-white hover:shadow-xs transition-all"
            >
              <h4 className="text-sm font-semibold text-[#1B1A17] mb-1.5">
                {v.title}
              </h4>
              <p className="text-xs text-black/60 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Access Invitation Banner */}
      <div className="rounded-3xl bg-[#1B1A17] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
            Enterprise Deployment
          </span>
          <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
            Reserve dedicated corridor telemetry for your airspace.
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
            We partner with scientific institutions, environmental agencies, and aerospace operators seeking persistent high-altitude vision.
          </p>

          <form onSubmit={handleSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@organization.com"
              required
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#E8BD4D] hover:bg-[#DDAE3C] text-[#1B1A17] text-xs font-semibold rounded-full tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
            >
              {submitted ? 'Inquiry Sent' : 'Request Briefing'}
            </button>
          </form>

          {submitted && (
            <div className="flex items-center gap-2 text-xs text-amber-300 pt-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4" />
              <span>Thank you. Our mission operations team will review your sector brief within 24 hours.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
