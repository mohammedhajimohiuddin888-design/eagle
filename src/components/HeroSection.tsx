/**
 * HeroSection.tsx
 * Large cinematic hero panel reproducing the reference EAGLE website.
 * Features dual render engines: Interactive 3D Three.js WebGL & Cinematic Video Reel,
 * editorial serif headline, floating telemetry cards, and gold CTA.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Eagle3DCanvas, FlightPhase } from './Eagle3DCanvas';
import { ArrowUpRight, Volume2, VolumeX, Play, Pause, RotateCcw, Maximize2, ShieldCheck, Activity, Compass, Layers } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeroSectionProps {
  onOpenLogin: () => void;
  onOpenAccess: () => void;
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenLogin,
  onOpenAccess,
  onNavigate,
}) => {
  const [renderMode, setRenderMode] = useState<'3d' | 'video'>('3d');
  const [currentPhase, setCurrentPhase] = useState<FlightPhase>(3);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Synchronize video play/pause
  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleSound = () => {
    if (renderMode === 'video' && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      const active = soundEngine.toggleWind();
      setIsMuted(!active);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
    setCurrentPhase(1);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-12">
      {/* Outer framing card container with refined borders and warm shadow */}
      <div className="relative w-full aspect-[16/10] min-h-[580px] md:min-h-[680px] lg:min-h-[740px] rounded-[28px] md:rounded-[36px] bg-[#D2E4F2] overflow-hidden border border-black/[0.08] shadow-[0_20px_50px_-15px_rgba(30,25,18,0.12)]">
        
        {/* Render Engine Canvas / Video */}
        <div className="absolute inset-0 w-full h-full">
          {renderMode === '3d' ? (
            <Eagle3DCanvas
              currentPhase={currentPhase}
              onPhaseChange={(phase) => setCurrentPhase(phase)}
              isAutoPlay={isAutoPlay}
              className="w-full h-full"
            />
          ) : (
            <div className="relative w-full h-full bg-[#9DC2E6]">
              <video
                ref={videoRef}
                src="/assets/aistudio/Eagle_1_1304c0c3.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
              {/* Soft overlay gradient matching the daylight sky */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </div>
          )}
        </div>

        {/* --- HERO INTERNAL TOP NAVIGATION BAR --- */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5 pointer-events-auto">
          {/* Top-Left: Eagle Emblem + Wordmark */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('hero')}>
            <div className="w-6 h-6 rounded-full border border-black/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 stroke-black stroke-[2.2]">
                <path d="M3 13C6 8 11 6 21 6C16 11 14 16 14 21C11 17 8 15 3 13Z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-[0.18em] text-[#1B1A17] uppercase">
              Eagle
            </span>
          </div>

          {/* Center Links (Functional section navigation) */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.14em] text-[#1B1A17]/80 uppercase">
            <button
              onClick={() => onNavigate('platform')}
              className="hover:text-[#1B1A17] transition-colors cursor-pointer"
            >
              Platform
            </button>
            <button
              onClick={() => onNavigate('coverage')}
              className="hover:text-[#1B1A17] transition-colors cursor-pointer"
            >
              Coverage
            </button>
            <button
              onClick={() => onNavigate('research')}
              className="hover:text-[#1B1A17] transition-colors cursor-pointer"
            >
              Research
            </button>
            <button
              onClick={() => onNavigate('company')}
              className="hover:text-[#1B1A17] transition-colors cursor-pointer"
            >
              Company
            </button>
          </nav>

          {/* Top-Right: Sign In + Get Access Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="text-[11px] font-semibold tracking-[0.12em] text-[#1B1A17]/80 hover:text-[#1B1A17] uppercase px-2 py-1 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAccess}
              className="px-4 py-2 bg-[#1B1A17] text-white text-[11px] font-medium tracking-[0.08em] rounded-full hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm uppercase cursor-pointer"
            >
              Get Access
            </button>
          </div>
        </div>

        {/* --- HERO CONTENT: LEFT HEADLINE & EDITORIAL ACCENT --- */}
        <div className="absolute left-6 sm:left-12 bottom-16 sm:bottom-20 z-20 max-w-md pointer-events-auto">
          <div className="space-y-4">
            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-normal leading-[0.92] tracking-[-0.02em] text-[#1B1A17]">
              <span className="block">Watch from</span>
              <span className="block italic text-[#26241F]">altitude</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#38342D]/80 font-normal leading-relaxed max-w-sm">
              Continuous high-altitude computer vision and aerodynamic intelligence synthesized at 12ms edge latency.
            </p>

            {/* Gold-accented CTA Button below headline */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenAccess}
                className="group flex items-center gap-2 px-5 py-2.5 bg-[#E8BD4D] hover:bg-[#DDAE3C] text-[#1B1A17] font-semibold text-xs tracking-wider uppercase rounded-full shadow-[0_4px_16px_rgba(232,189,77,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(232,189,77,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Start Free</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={() => onNavigate('platform')}
                className="px-4 py-2.5 text-xs text-[#1B1A17]/80 hover:text-[#1B1A17] font-medium tracking-wide transition-colors cursor-pointer"
              >
                Explore Architecture →
              </button>
            </div>
          </div>
        </div>

        {/* --- HERO CONTENT: RIGHT SIDE FLOATING INFORMATION CARDS --- */}
        <div className="absolute right-6 sm:right-10 bottom-16 sm:bottom-20 z-20 flex flex-col sm:flex-row gap-3 pointer-events-auto">
          {/* Card 1: 12ms Telemetry / Ultra-low Latency */}
          <div
            onMouseEnter={() => setActiveCard(1)}
            onMouseLeave={() => setActiveCard(null)}
            className={`w-36 sm:w-40 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-xl transition-all duration-200 cursor-pointer ${
              activeCard === 1 ? 'scale-[1.04] bg-black/75 border-amber-400/40 shadow-2xl' : 'hover:bg-black/70'
            }`}
          >
            {/* Thumbnail graphic representing aerial optical telemetry */}
            <div className="w-full h-16 rounded-xl bg-gradient-to-br from-amber-900/60 to-black/80 overflow-hidden relative mb-2.5 border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:8px_8px]" />
              <Activity className="w-6 h-6 text-amber-400 relative z-10" />
              <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-amber-300/80">
                8,420M ALT
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] font-medium text-white/60 tracking-wider uppercase">
                Latency
              </div>
              <div className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
                12ms
              </div>
              <div className="text-[9px] text-amber-300/80 flex items-center gap-1 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live Optical Feed</span>
              </div>
            </div>
          </div>

          {/* Card 2: 99.98% Accuracy & Aerial Coverage */}
          <div
            onMouseEnter={() => setActiveCard(2)}
            onMouseLeave={() => setActiveCard(null)}
            className={`w-36 sm:w-40 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-xl transition-all duration-200 cursor-pointer ${
              activeCard === 2 ? 'scale-[1.04] bg-black/75 border-amber-400/40 shadow-2xl' : 'hover:bg-black/70'
            }`}
          >
            {/* Thumbnail graphic representing sub-centimeter accuracy */}
            <div className="w-full h-16 rounded-xl bg-gradient-to-br from-sky-950/70 to-black/80 overflow-hidden relative mb-2.5 border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:8px_8px]" />
              <ShieldCheck className="w-6 h-6 text-sky-400 relative z-10" />
              <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-sky-300/80">
                SUB-PIXEL
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] font-medium text-white/60 tracking-wider uppercase">
                Vision Lock
              </div>
              <div className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
                99.98%
              </div>
              <div className="text-[9px] text-sky-300/80 flex items-center gap-1 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Multi-Spectral Lock</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- HERO FOOTER METADATA BAR (Matching the reference video) --- */}
        <div className="absolute bottom-3 inset-x-6 sm:inset-x-10 z-20 flex items-center justify-between text-[10px] text-black/50 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Straight at the camera with wings fully</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-black/30" />
            <span className="font-medium text-black/70">Stack: Three.js PBR Engine</span>
          </div>

          {/* Quick Engine Switcher & Utility Dock */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/10 rounded-full p-0.5">
              <button
                onClick={() => setRenderMode('3d')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  renderMode === '3d' ? 'bg-white text-black shadow-xs font-semibold' : 'text-black/60 hover:text-black'
                }`}
              >
                Interactive 3D
              </button>
              <button
                onClick={() => setRenderMode('video')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  renderMode === 'video' ? 'bg-white text-black shadow-xs font-semibold' : 'text-black/60 hover:text-black'
                }`}
              >
                Cinematic Reel
              </button>
            </div>

            {renderMode === 'video' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleVideoPlay}
                  className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-black/70 transition-colors"
                  title={isVideoPlaying ? 'Pause' : 'Play'}
                >
                  {isVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  onClick={restartVideo}
                  className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-black/70 transition-colors"
                  title="Replay Video"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              onClick={toggleSound}
              className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-black/70 transition-colors"
              title={isMuted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
