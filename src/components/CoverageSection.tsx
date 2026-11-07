/**
 * CoverageSection.tsx
 * Present global high-altitude coverage corridors, flight strata, and key telemetry metrics.
 */

import React, { useState } from 'react';
import { Globe, MapPin, Compass, Shield, Signal, Mountain } from 'lucide-react';

export const CoverageSection: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(2);

  const altitudeTiers = [
    {
      level: 'Strata 1',
      name: 'Ridge & Valley Patrol',
      altitude: '1,500m – 4,000m',
      focus: 'Topographic contour mapping, wildfire thermal scanning, alpine pass surveillance.',
      speed: '90 – 140 km/h',
      endurance: '36 Hours',
    },
    {
      level: 'Strata 2',
      name: 'Mountain Thermal Soar',
      altitude: '4,000m – 8,500m',
      focus: 'Trans-alpine corridor monitoring, sub-zero sensor operation, cloud-deck infiltration.',
      speed: '120 – 190 km/h',
      endurance: '72 Hours',
    },
    {
      level: 'Strata 3',
      name: 'Upper Troposphere Cruise',
      altitude: '8,500m – 14,000m',
      focus: 'Continental air lane monitoring, jet stream navigation, wide-aperture horizon sweeps.',
      speed: '210 – 320 km/h',
      endurance: '120 Hours',
    },
  ];

  const corridors = [
    { name: 'Alpine Crest Arc', region: 'Europe (Alps & Pyrenees)', activeUnits: 28, status: 'Active' },
    { name: 'Cascadia Mountain Line', region: 'North America (Pacific Rim)', activeUnits: 34, status: 'Active' },
    { name: 'Himalayan High Pass', region: 'South Asia (High Karakorams)', activeUnits: 19, status: 'Active' },
    { name: 'Andean Continental Ridge', region: 'South America (Patagonia to Peru)', activeUnits: 22, status: 'Active' },
    { name: 'Nordic Arctic Corridor', region: 'Northern Scandinavia & Svalbard', activeUnits: 16, status: 'Active' },
    { name: 'Southern Oceanic Transit', region: 'Roaring Forties (Maritime)', activeUnits: 25, status: 'Active' },
  ];

  return (
    <section id="coverage" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 scroll-mt-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-black/[0.08] pb-8">
        <div>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#9A7D3A] uppercase block mb-2">
            Planetary Deployment
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#1B1A17] font-normal tracking-tight">
            Continental <span className="italic">coverage</span>
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-xs sm:text-sm text-black/60 max-w-md font-normal leading-relaxed">
          Autonomous endurance flights maintaining persistent presence across difficult geographical terrain without ground refueling constraints.
        </p>
      </div>

      {/* Altitude Strata Selector */}
      <div className="mb-10">
        <div className="text-xs font-semibold tracking-wider uppercase text-black/40 mb-3">
          Select Operational Strata
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {altitudeTiers.map((tier, idx) => {
            const isSelected = activeTier === idx;
            return (
              <div
                key={tier.level}
                onClick={() => setActiveTier(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-black/20 shadow-md ring-1 ring-black/10'
                    : 'bg-white/40 border-black/5 hover:bg-white/70 hover:border-black/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-black/40 mb-2">
                  <span className="font-mono font-medium">{tier.level}</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
                    {tier.altitude}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#1B1A17] mb-1">
                  {tier.name}
                </h3>
                <p className="text-xs text-black/60 leading-relaxed mb-4">
                  {tier.focus}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-black/50 pt-2 border-t border-black/5">
                  <span>Speed: {tier.speed}</span>
                  <span>Endurance: {tier.endurance}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Corridors Table & Global Graphic */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.08] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/[0.06]">
          <div>
            <h3 className="text-base font-semibold text-[#1B1A17]">
              Active Altitude Flight Corridors
            </h3>
            <p className="text-xs text-black/50">
              Live orbital and tropospheric operational lanes currently patrolled
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-black/50">Total Active Units: <strong className="text-black font-semibold">144</strong></span>
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% In-Flight Health
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {corridors.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#F8F6F0] border border-black/[0.04] flex items-center justify-between hover:bg-white hover:border-black/10 transition-all hover:shadow-xs"
            >
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#1B1A17] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{c.name}</span>
                </div>
                <div className="text-[11px] text-black/50">{c.region}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-black">
                  {c.activeUnits} units
                </div>
                <span className="inline-block text-[10px] text-emerald-600 font-medium">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
