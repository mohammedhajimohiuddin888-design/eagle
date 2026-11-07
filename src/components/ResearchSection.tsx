/**
 * ResearchSection.tsx
 * Show research papers, aerodynamics studies, and optical computer vision publications.
 */

import React, { useState } from 'react';
import { FileText, Download, ArrowUpRight, BookOpen, Check } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const papers = [
    {
      id: 'EAGLE-RES-01',
      title: 'Biomimetic Flight Mechanics of Aquila Chrysaetos Under Extreme Alpine Shear',
      authors: 'Dr. Evelyn Ward, Marcus Thorne · Dept. of Aerospace Biomimetics',
      date: 'Published 2026',
      readTime: '18 min read',
      abstract:
        'A comprehensive aerodynamic analysis of feather slotting and wrist camber during high-speed mountain banking maneuvers, demonstrating a 31% reduction in induced drag.',
      topics: ['Aerodynamics', 'Feather Slotting', 'Vorticity Control'],
    },
    {
      id: 'EAGLE-RES-02',
      title: 'Sub-Centimeter Optical Flow and Ground Disparity at 10,000 Meters',
      authors: 'Aeronautical Computer Vision Lab & EAGLE Core Systems',
      date: 'Published 2026',
      readTime: '14 min read',
      abstract:
        'Neural haze compensation algorithms capable of reconstructing high-frequency surface features through atmospheric turbulence and micro-droplet scattering in the troposphere.',
      topics: ['Optical Flow', 'Atmospheric Haze', 'Edge Inference'],
    },
    {
      id: 'EAGLE-RES-03',
      title: 'Zero-Fuel Thermal Soaring Algorithms in Discontinuous Mountain Thermals',
      authors: 'Autonomous Kinematics Group',
      date: 'Published 2025',
      readTime: '22 min read',
      abstract:
        'Reinforcement learning policies trained on raptor GPS telemetry achieving indefinite continuous loiter time across complex alpine ridgelines without mechanical propulsion.',
      topics: ['Energy Harvesting', 'Thermal Soaring', 'Autonomous Loiter'],
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloadedId(id);
    // Generate a downloadable text/markdown summary of the paper
    const content = `# ${title}\nResearch Paper Ref: ${id}\nEAGLE Altitude Vision Platform\n\nAbstract:\nThis publication represents peer-reviewed research in high-altitude aeronautical computer vision and biomimetic flight dynamics.\n`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}_Whitepaper.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadedId(null);
    }, 3000);
  };

  return (
    <section id="research" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 scroll-mt-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-black/[0.08] pb-8">
        <div>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#9A7D3A] uppercase block mb-2">
            Publications & Theory
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#1B1A17] font-normal tracking-tight">
            Scientific <span className="italic">foundations</span>
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-xs sm:text-sm text-black/60 max-w-md font-normal leading-relaxed">
          Open-source flight dynamics, aerodynamic data collections, and peer-reviewed computer vision literature published by the EAGLE research lab.
        </p>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {papers.map((paper) => {
          const isDownloaded = downloadedId === paper.id;
          return (
            <div
              key={paper.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.08] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-black/40 font-mono">
                  <span>{paper.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{paper.date}</span>
                    <span>·</span>
                    <span>{paper.readTime}</span>
                  </div>
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#1B1A17] leading-snug group-hover:text-black">
                  {paper.title}
                </h3>

                <p className="text-xs text-black/50 font-medium">
                  {paper.authors}
                </p>

                <p className="text-xs text-black/70 leading-relaxed font-normal">
                  {paper.abstract}
                </p>

                {/* Topics metadata without pill boxes (Anti-slop compliance) */}
                <div className="flex items-center gap-2 text-[11px] text-black/50 pt-2">
                  {paper.topics.map((t, idx) => (
                    <React.Fragment key={idx}>
                      <span>{t}</span>
                      {idx < paper.topics.length - 1 && <span className="text-black/30">/</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-black/[0.06] flex items-center justify-between">
                <button
                  onClick={() => handleDownload(paper.id, paper.title)}
                  className="flex items-center gap-2 text-xs font-semibold text-[#1B1A17] hover:text-black transition-colors cursor-pointer"
                >
                  {isDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-amber-700" />
                      <span>Download Paper (PDF)</span>
                    </>
                  )}
                </button>

                <div className="text-black/20 group-hover:text-black/60 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
