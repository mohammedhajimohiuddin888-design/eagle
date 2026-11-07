/**
 * App.tsx
 * EAGLE — Full-Website Scroll & Cursor Interactive Experience
 * The scroll effect is the entire website. All extra sections below the eagle are removed.
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollVideoHero } from './components/ScrollVideoHero';
import { LoginModal } from './components/LoginModal';
import { AccessModal } from './components/AccessModal';
import { ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);

  const handleOpenInfo = (title: string, content: string) => {
    setInfoModal({ title, content });
  };

  const handleLoginSuccess = (userEmail: string) => {
    setAuthenticatedUser(userEmail);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#F8F6F0] text-[#1B1A17] flex flex-col relative selection:bg-[#E2D9C8] selection:text-black">
      {/* Operator Session Bar if logged in */}
      {authenticatedUser && (
        <div className="w-full bg-[#1B1A17] text-amber-300 py-1.5 px-4 text-xs flex items-center justify-center gap-2 border-b border-amber-500/30 z-50">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Telemetry Session: <strong>{authenticatedUser}</strong></span>
          <button
            onClick={() => setAuthenticatedUser(null)}
            className="text-[10px] text-white/50 hover:text-white underline ml-2 cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Top Header Navigation */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAccess={() => setIsAccessOpen(true)}
        onNavigate={(sectionId) => {
          if (sectionId === 'platform') {
            handleOpenInfo('Platform Architecture', 'Autonomous high-altitude flight vectoring with 12ms edge telemetry and sub-pixel optical flow.');
          } else if (sectionId === 'coverage') {
            handleOpenInfo('Continental Coverage', '140+ active corridors maintaining continuous presence across alpine, maritime, and polar flight lanes.');
          } else if (sectionId === 'research') {
            handleOpenInfo('Research Publications', 'Biomimetic flight mechanics of Aquila Chrysaetos under alpine shear and neural optical flow.');
          } else if (sectionId === 'company') {
            handleOpenInfo('Organization Mission', 'Dedicated to perpetual high-altitude optical intelligence and aerodynamic mastery.');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Main Experience: Full Scroll-Driven & Cursor-Interactive Eagle */}
      <main className="flex-1 w-full">
        <ScrollVideoHero
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenAccess={() => setIsAccessOpen(true)}
          onOpenInfoModal={handleOpenInfo}
        />
      </main>

      {/* Sign In Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Access / Get Unlimited Modal */}
      <AccessModal
        isOpen={isAccessOpen}
        onClose={() => setIsAccessOpen(false)}
      />

      {/* Quick Info Modal for Nav Links */}
      {infoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#F8F6F0] rounded-3xl p-7 border border-black/10 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInfoModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              EAGLE ARCHIVE
            </div>
            <h3 className="font-editorial text-2xl font-semibold text-[#1B1A17]">
              {infoModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-black/70 leading-relaxed font-normal">
              {infoModal.content}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setInfoModal(null);
                  setIsAccessOpen(true);
                }}
                className="w-full py-2.5 bg-[#1B1A17] hover:bg-black text-white text-xs font-semibold rounded-full tracking-wider uppercase transition-all cursor-pointer"
              >
                Request Detailed Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
