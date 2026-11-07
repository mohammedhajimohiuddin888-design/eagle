/**
 * PlatformSection.tsx
 * Explains the EAGLE altitude vision platform and real-time aerial processing engine.
 */

import React, { useState } from 'react';
import { Eye, Wind, Cpu, Radio, Shield, Zap, CheckCircle2 } from 'lucide-react';

export const PlatformSection: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState(0);

  const pillars = [
    {
      id: '01',
      title: 'Biomimetic Flight Vectoring',
      subtitle: 'Kinematic trajectory modeling derived from eagle soaring mechanics',
      icon: Wind,
      metrics: '14,000m Service Ceiling · 0.02° Attitude Precision',
      description:
        'Continuous neural adaptation to mountain thermals and high-altitude shear. Trajectory vectors calculate lift, drag, and thermal vortex entry in real time, conserving 64% more kinetic energy than standard fixed-wing algorithms.',
      features: [
        'Dynamic thermal energy harvesting',
        'Sub-second stall prevention matrices',
        'Autonomous gust-load attenuation',
        'Coordinated swarm altitude banking',
      ],
    },
    {
      id: '02',
      title: 'Multi-Spectral Optical Flow',
      subtitle: 'Sub-pixel ground tracking through cloud cover and atmospheric haze',
      icon: Eye,
      metrics: '4K 120FPS Sensor Lock · 380nm-1100nm Spectrum',
      description:
        'Combines visual aperture, short-wave infrared, and atmospheric depth sensing. Ground landmarks and maritime vessels are resolved with sub-centimeter fidelity even through thin cirrus cloud decks and solar glare.',
      features: [
        'Real-time atmospheric glare suppression',
        'Neural haze penetrating filter chains',
        'Continuous multi-object vector locking',
        'Sub-pixel optical flow disparity mapping',
      ],
    },
    {
      id: '03',
      title: '12ms Edge Telemetry Engine',
      subtitle: 'On-device tensor processing without cloud backhaul delays',
      icon: Cpu,
      metrics: '12ms Ingestion · 48 TOPS Edge Inference',
      description:
        'Critical decision telemetry runs natively on low-power avionics hardware. Optical feeds are processed locally, transmitting only vectorized semantic coordinates and anomaly alerts to ground stations.',
      features: [
        'Low-overhead binary protocol (EAGLE-Sync)',
        'Mesh peer-to-peer relay fallback',
        'Zero-trust hardware security enclave',
        'Deterministic execution latency guarantee',
      ],
    },
    {
      id: '04',
      title: 'Global Corridors & SatLink',
      subtitle: 'Redundant LEO satellite uplink with instantaneous failover',
      icon: Radio,
      metrics: '99.98% Link Reliability · Global Roaming',
      description:
        'Dual-band orbital uplink ensures uninterrupted telemetry across polar caps, deep mountain canyons, and open oceans beyond terrestrial cellular range.',
      features: [
        'Direct-to-satellite phased array antenna',
        'Automatic ground relay handoffs',
        'End-to-end encrypted datalinks',
        'Sub-second route replanning on link loss',
      ],
    },
  ];

  return (
    <section id="platform" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 scroll-mt-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-black/[0.08] pb-8">
        <div>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#9A7D3A] uppercase block mb-2">
            Architecture & Platform
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#1B1A17] font-normal tracking-tight">
            Autonomous vision at <span className="italic">scale</span>
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-xs sm:text-sm text-black/60 max-w-md font-normal leading-relaxed">
          EAGLE fuses biological flight principles with high-frequency edge computing to establish persistent optical surveillance across planetary corridors.
        </p>
      </div>

      {/* Interactive Platform Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Selector List */}
        <div className="lg:col-span-5 space-y-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = selectedPillar === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillar(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-black/15 shadow-md scale-[1.01]'
                    : 'bg-white/40 border-black/5 hover:bg-white/70 hover:border-black/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-medium text-black/40">
                      {pillar.id}
                    </span>
                    <h3 className="text-base font-semibold text-[#1B1A17]">
                      {pillar.title}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#1B1A17] text-white' : 'bg-black/5 text-black/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-black/60 line-clamp-2">
                  {pillar.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Architectural Breakdown Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-black/[0.08] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/40 via-sky-100/20 to-transparent pointer-events-none rounded-bl-full" />

          {/* Active Pillar Detail */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
                  MODULE {pillars[selectedPillar].id}
                </span>
                <span className="text-xs text-black/40">·</span>
                <span className="text-xs font-mono text-black/60">
                  {pillars[selectedPillar].metrics}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Operational</span>
              </div>
            </div>

            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#1B1A17] font-semibold mb-2">
                {pillars[selectedPillar].title}
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-normal">
                {pillars[selectedPillar].description}
              </p>
            </div>

            {/* Sub-capabilities */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                Key Subsystems & Invariants
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pillars[selectedPillar].features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F8F6F0] border border-black/[0.04] text-xs text-black/80 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Telemetry Box */}
            <div className="p-4 rounded-2xl bg-[#1B1A17] text-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-white/50 text-[10px] uppercase tracking-wider">
                <span>Real-Time Avionics Stream</span>
                <span>Active Link // CH-04</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50">Airspeed</div>
                  <div className="text-sm font-semibold text-amber-300">142 KT</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50">Altitude</div>
                  <div className="text-sm font-semibold text-sky-300">8,420 M</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50">Latency</div>
                  <div className="text-sm font-semibold text-emerald-300">12 MS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
