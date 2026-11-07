/**
 * ScrollVideoHero.tsx
 * 100% Full-Screen Wheel-Driven & Mobile Touch-Interactive Eagle Experience.
 * Responsive for all screens: desktop, tablet, and mobile (touch/swipe/3D tilt).
 *
 * Cinematic scroll-driven typography:
 * - Single clean top Navbar.
 * - Dynamic phase-based titles, subtitles, and telemetry that reveal as you scroll or swipe.
 * - Upward kinetic translation: titles and written copy glide upward with scroll momentum.
 * - Mobile optimized: zero overlap, dynamic viewport height (dvh), seamless touch scrub & tilt.
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Activity,
  ShieldCheck,
  Wind,
  Compass,
  Radio,
  Eye,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ScrollVideoHeroProps {
  onOpenLogin: () => void;
  onOpenAccess: () => void;
  onOpenInfoModal?: (title: string, content: string) => void;
}

interface PhaseData {
  id: number;
  corridor: string;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  subDescription: string;
  range: [number, number];
  eagleAction: string;
  metrics: {
    card1: {
      label: string;
      value: string;
      sub: string;
      accent: 'amber' | 'sky' | 'emerald';
      icon: 'activity' | 'wind' | 'compass' | 'eye' | 'shield' | 'radio';
    };
    card2: {
      label: string;
      value: string;
      sub: string;
      accent: 'amber' | 'sky' | 'emerald';
      icon: 'activity' | 'wind' | 'compass' | 'eye' | 'shield' | 'radio';
    };
  };
}

const PHASES_DATA: Record<number, PhaseData> = {
  1: {
    id: 1,
    corridor: 'CORRIDOR 01 / 8,420M',
    tag: 'PHASE 01 · TROPOSPHERIC SOAR',
    titleLine1: 'Watch from',
    titleLine2: 'altitude',
    subtitle: 'Autonomous high-altitude vision vectors scanning 8,420m alpine corridors with continuous optical alignment.',
    subDescription: 'Scroll wheel or swipe to scrub flight progression. Move finger or cursor for 3D perspective.',
    range: [0, 0.2],
    eagleAction: 'Straight at camera · Gliding with wings fully spread',
    metrics: {
      card1: {
        label: 'Telemetry',
        value: '12ms',
        sub: 'Real-time link',
        accent: 'amber',
        icon: 'activity',
      },
      card2: {
        label: 'Precision',
        value: '99.98%',
        sub: 'Sub-pixel lock',
        accent: 'sky',
        icon: 'shield',
      },
    },
  },
  2: {
    id: 2,
    corridor: 'CORRIDOR 02 / 6,150M',
    tag: 'PHASE 02 · BIOMIMETIC LIFT',
    titleLine1: 'Wingspan',
    titleLine2: 'in expanse',
    subtitle: 'Dynamic 2.3-meter dihedral wing morphing slicing through alpine mountain shear with passive stability.',
    subDescription: 'Thermal draft exploitation providing continuous altitude lift without engine vibration.',
    range: [0.2, 0.45],
    eagleAction: 'Frontal approach · Wings flexing into high thermal draft',
    metrics: {
      card1: {
        label: 'Thermal Lift',
        value: '+4.8m/s',
        sub: 'Alpine updraft',
        accent: 'emerald',
        icon: 'wind',
      },
      card2: {
        label: 'Span Dihedral',
        value: '2.30m',
        sub: 'Aerodynamic lock',
        accent: 'amber',
        icon: 'compass',
      },
    },
  },
  3: {
    id: 3,
    corridor: 'CORRIDOR 03 / 4,890M',
    tag: 'PHASE 03 · OPTICAL LOCK',
    titleLine1: 'Sub-pixel',
    titleLine2: 'precision',
    subtitle: 'Dual foveal neural sensors delivering millimeter target tracking through cloud decks and turbulence.',
    subDescription: 'Edge telemetry computes optical flow vectors at 240 frames per second on the sensor plane.',
    range: [0.45, 0.65],
    eagleAction: 'Close flyby · Piercing eye contact & symmetrical sweep',
    metrics: {
      card1: {
        label: 'Sensor Rate',
        value: '240 fps',
        sub: 'Neural optical flow',
        accent: 'sky',
        icon: 'eye',
      },
      card2: {
        label: 'Resolution',
        value: '99.98%',
        sub: 'Foveal track lock',
        accent: 'emerald',
        icon: 'shield',
      },
    },
  },
  4: {
    id: 4,
    corridor: 'CORRIDOR 04 / 3,420M',
    tag: 'PHASE 04 · VECTOR BANKING',
    titleLine1: 'Tactical',
    titleLine2: 'banking',
    subtitle: 'Instantaneous 68° banking maneuver hugging ridgelines without losing optical lock on target vectors.',
    subDescription: 'High-G aerodynamic agility replicating the rapid hunting dives of Golden Eagles across alpine terrain.',
    range: [0.65, 0.85],
    eagleAction: 'Sharp banking turn · Slicing through ridge turbulence',
    metrics: {
      card1: {
        label: 'Bank Angle',
        value: '68.4°',
        sub: 'Contour dive',
        accent: 'amber',
        icon: 'compass',
      },
      card2: {
        label: 'G-Force',
        value: '3.4 G',
        sub: 'Structural safe',
        accent: 'sky',
        icon: 'activity',
      },
    },
  },
  5: {
    id: 5,
    corridor: 'CORRIDOR 05 / 7,800M',
    tag: 'PHASE 05 · CONTINUOUS PRESENCE',
    titleLine1: 'Perpetual',
    titleLine2: 'vigilance',
    subtitle: 'Unbroken multi-spectral intelligence overlooking continental frontiers across alpine and maritime zones.',
    subDescription: '140+ active corridors maintaining persistent coverage with autonomous fleet synchronization.',
    range: [0.85, 1.0],
    eagleAction: 'Profile perch & plumage glance · Horizon locked',
    metrics: {
      card1: {
        label: 'Active Lanes',
        value: '140+',
        sub: 'Global coverage',
        accent: 'emerald',
        icon: 'radio',
      },
      card2: {
        label: 'Fleet Uptime',
        value: '99.99%',
        sub: 'Continuous watch',
        accent: 'amber',
        icon: 'shield',
      },
    },
  },
};

export const ScrollVideoHero: React.FC<ScrollVideoHeroProps> = ({
  onOpenLogin,
  onOpenAccess,
  onOpenInfoModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [flightProgress, setFlightProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [videoDuration, setVideoDuration] = useState(10);
  const [interactiveMode, setInteractiveMode] = useState<'wheel' | 'autoplay'>('wheel');

  // Tilt refs for smooth 60fps damped transform (mouse or touch)
  const tiltRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Progress ref for smooth wheel & touch accumulation and lerp
  const progressRef = useRef({
    current: 0,
    target: 0,
  });

  // Multi-axis Touch tracking for mobile
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isTouchingRef = useRef(false);

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  // Wheel & Touch gesture listeners
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent browser from scrolling the document
      e.preventDefault();

      if (interactiveMode === 'autoplay') {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
        setInteractiveMode('wheel');
      }

      // Smooth delta calculation (supports mouse wheels and trackpads)
      const sensitivity = 0.00065;
      const delta = e.deltaY * sensitivity;
      const nextTarget = Math.max(0, Math.min(1, progressRef.current.target + delta));
      progressRef.current.target = nextTarget;
    };

    // Mobile touch listeners: smooth swipe in any direction + 3D tilt
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartXRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
        isTouchingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        // Prevent mobile browser pull-to-refresh & navigation
        if (e.cancelable) e.preventDefault();

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = touchStartXRef.current - currentX;
        const diffY = touchStartYRef.current - currentY;
        touchStartXRef.current = currentX;
        touchStartYRef.current = currentY;

        // Mobile 3D tilt tracking from touch position
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          const normX = ((currentX - rect.left) / rect.width) * 2 - 1;
          const normY = ((currentY - rect.top) / rect.height) * 2 - 1;
          tiltRef.current.targetX = Math.max(-1, Math.min(1, normX));
          tiltRef.current.targetY = Math.max(-1, Math.min(1, normY));
        }

        if (interactiveMode === 'autoplay') {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
          setInteractiveMode('wheel');
        }

        // Natural touch sensitivity: support both vertical swipe & horizontal swipe
        const dominantDelta = Math.abs(diffY) >= Math.abs(diffX) ? diffY : diffX;
        const sensitivity = 0.0032;
        const nextTarget = Math.max(0, Math.min(1, progressRef.current.target + dominantDelta * sensitivity));
        progressRef.current.target = nextTarget;
      }
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      // Smoothly return perspective tilt towards neutral center after touch release
      setTimeout(() => {
        if (!isTouchingRef.current) {
          tiltRef.current.targetX = 0;
          tiltRef.current.targetY = 0;
        }
      }, 400);
    };

    const node = containerRef.current || window;
    node.addEventListener('wheel', handleWheel as any, { passive: false });
    node.addEventListener('touchstart', handleTouchStart as any, { passive: true });
    node.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    node.addEventListener('touchend', handleTouchEnd as any, { passive: true });

    return () => {
      node.removeEventListener('wheel', handleWheel as any);
      node.removeEventListener('touchstart', handleTouchStart as any);
      node.removeEventListener('touchmove', handleTouchMove as any);
      node.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [interactiveMode]);

  // 60FPS animation loop for 3D perspective tilt and smooth video scrub
  useEffect(() => {
    let animId = 0;

    const tick = () => {
      // 1. Tilt lerp
      tiltRef.current.x += (tiltRef.current.targetX - tiltRef.current.x) * 0.08;
      tiltRef.current.y += (tiltRef.current.targetY - tiltRef.current.y) * 0.08;

      if (cardRef.current) {
        const tiltX = -tiltRef.current.y * 6.5; // Max 6.5 deg pitch
        const tiltY = tiltRef.current.x * 8.5;  // Max 8.5 deg yaw
        cardRef.current.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }

      // 2. Smooth flight progress lerp
      if (interactiveMode === 'wheel') {
        const pDiff = progressRef.current.target - progressRef.current.current;
        if (Math.abs(pDiff) > 0.00015) {
          progressRef.current.current += pDiff * 0.14;
          const currentP = progressRef.current.current;
          setFlightProgress(currentP);

          // Synchronize phase with actual lerped progress
          let nextPhase = 1;
          if (currentP < 0.2) nextPhase = 1;
          else if (currentP < 0.45) nextPhase = 2;
          else if (currentP < 0.65) nextPhase = 3;
          else if (currentP < 0.85) nextPhase = 4;
          else nextPhase = 5;
          setCurrentPhase(nextPhase);

          // Update video currentTime
          if (videoRef.current && !videoRef.current.seeking) {
            const dur = videoRef.current.duration || videoDuration;
            const targetTime = currentP * dur;
            try {
              videoRef.current.currentTime = targetTime;
            } catch {
              // Ignore seek throttling
            }
          }
        }
      } else if (interactiveMode === 'autoplay' && videoRef.current) {
        const dur = videoRef.current.duration || videoDuration;
        const currentP = dur > 0 ? videoRef.current.currentTime / dur : 0;
        setFlightProgress(currentP);
        progressRef.current.current = currentP;
        progressRef.current.target = currentP;

        if (currentP < 0.2) setCurrentPhase(1);
        else if (currentP < 0.45) setCurrentPhase(2);
        else if (currentP < 0.65) setCurrentPhase(3);
        else if (currentP < 0.85) setCurrentPhase(4);
        else setCurrentPhase(5);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [interactiveMode, videoDuration]);

  // Desktop Mouse move handler for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    tiltRef.current.targetX = Math.max(-1, Math.min(1, x));
    tiltRef.current.targetY = Math.max(-1, Math.min(1, y));
  };

  const handleMouseLeave = () => {
    tiltRef.current.targetX = 0;
    tiltRef.current.targetY = 0;
  };

  // Toggle playback mode
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setInteractiveMode('wheel');
    } else {
      setInteractiveMode('autoplay');
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    soundEngine.toggleWind(!nextMuted);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    progressRef.current.current = 0;
    progressRef.current.target = 0;
    setFlightProgress(0);
    setCurrentPhase(1);
    videoRef.current.play();
    setIsPlaying(true);
    setInteractiveMode('autoplay');
  };

  const jumpToPhase = (phase: number) => {
    const progressMap: Record<number, number> = {
      1: 0.05,
      2: 0.3,
      3: 0.55,
      4: 0.75,
      5: 0.95,
    };
    const p = progressMap[phase] || 0;
    progressRef.current.target = p;
    setCurrentPhase(phase);
    if (interactiveMode === 'autoplay') {
      if (videoRef.current) {
        const dur = videoRef.current.duration || videoDuration;
        videoRef.current.currentTime = p * dur;
      }
    }
  };

  const activeContent = PHASES_DATA[currentPhase] || PHASES_DATA[1];

  // Calculate subtle continuous upward drift based on progress within the active phase
  const intraProgress = useMemo(() => {
    const [minP, maxP] = activeContent.range;
    return Math.max(0, Math.min(1, (flightProgress - minP) / (maxP - minP)));
  }, [activeContent.range, flightProgress]);

  // Upward translation offset in pixels (0px to 20px upward drift as wheel/touch scrubs)
  const upwardDrift = intraProgress * 20;

  // Helper icon renderer
  const renderMetricIcon = (iconName: string, accent: string) => {
    const colorClass =
      accent === 'emerald'
        ? 'text-emerald-400'
        : accent === 'sky'
        ? 'text-sky-400'
        : 'text-amber-400';

    switch (iconName) {
      case 'activity':
        return <Activity className={`w-5 h-5 ${colorClass} relative z-10`} />;
      case 'wind':
        return <Wind className={`w-5 h-5 ${colorClass} relative z-10`} />;
      case 'compass':
        return <Compass className={`w-5 h-5 ${colorClass} relative z-10`} />;
      case 'eye':
        return <Eye className={`w-5 h-5 ${colorClass} relative z-10`} />;
      case 'radio':
        return <Radio className={`w-5 h-5 ${colorClass} relative z-10`} />;
      case 'shield':
      default:
        return <ShieldCheck className={`w-5 h-5 ${colorClass} relative z-10`} />;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ touchAction: 'none' }}
      className="relative w-full h-[calc(100dvh-54px)] sm:h-[calc(100vh-68px)] max-h-[calc(100dvh-54px)] sm:max-h-[calc(100vh-68px)] flex flex-col items-center justify-between px-2 sm:px-6 pt-0.5 pb-2 sm:pb-3 overflow-hidden select-none"
    >
      {/* Main 3D Card with Perspective Parallax */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: 'transform', touchAction: 'none' }}
        className="relative w-full max-w-7xl flex-1 max-h-[84dvh] sm:max-h-[82vh] rounded-[20px] sm:rounded-[36px] bg-[#C5DCF0] overflow-hidden border border-black/[0.08] shadow-[0_25px_60px_-15px_rgba(20,25,35,0.18)] transition-shadow duration-300"
      >
        {/* Pristine High-Resolution Source Video */}
        <div className="absolute inset-0 w-full h-full bg-[#9AC3E6]">
          <video
            ref={videoRef}
            src="/assets/aistudio/Eagle_1_1304c0c3.mp4"
            className="w-full h-full object-cover pointer-events-none"
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              setInteractiveMode('wheel');
            }}
          />

          {/* Subtle atmospheric natural scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

          {/* Dynamic Cursor / Finger Light Sheen */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 500px at ${(tiltRef.current.x * 0.5 + 0.5) * 100}% ${(tiltRef.current.y * 0.5 + 0.5) * 100}%, rgba(255, 250, 235, 0.25) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* --- SLEEK MINIMAL TOP TELEMETRY BAR (NO duplicate site navbar) --- */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3.5 sm:px-10 py-3 sm:py-5 pointer-events-none">
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/20">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.16em] text-white/90 uppercase font-semibold">
              LIVE STREAM · {activeContent.corridor}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/80 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <span>FOV 114°</span>
            <span className="text-white/40">·</span>
            <span>240 FPS SENSOR</span>
            <span className="text-white/40">·</span>
            <span className="text-amber-300 font-semibold">EGL-SYS 4.8</span>
          </div>
        </div>

        {/* --- LEFT SIDE: KINETIC SCROLL-DRIVEN EDITORIAL HEADLINE & SUBTITLES --- */}
        <div className="absolute left-3.5 sm:left-12 bottom-13 sm:bottom-20 z-20 max-w-sm sm:max-w-lg pointer-events-auto">
          {/* Animated phase content with upward entrance, exit, and real-time scroll drift */}
          <div
            style={{
              transform: `translateY(-${upwardDrift.toFixed(1)}px)`,
              transition: 'transform 0.08s linear',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`headline-phase-${currentPhase}`}
                initial={{ opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -42 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2 sm:space-y-4"
              >
                {/* Dynamic Phase Tag Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/30 text-[9px] sm:text-[10px] font-mono tracking-[0.16em] text-white font-semibold uppercase shadow-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>{activeContent.tag}</span>
                </motion.div>

                {/* Editorial Serif Title (Upward kinetic motion) */}
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="font-editorial text-[34px] sm:text-6xl md:text-7xl lg:text-[80px] font-normal leading-[0.93] tracking-[-0.025em] text-[#1B1A17] drop-shadow-[0_2px_12px_rgba(255,255,255,0.45)]"
                >
                  <span className="block font-light text-[#1B1A17]">{activeContent.titleLine1}</span>
                  <span className="block italic font-normal text-[#2A261F]">{activeContent.titleLine2}</span>
                </motion.h1>

                {/* Dynamic Subtitle & Written Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.14 }}
                  className="space-y-1 max-w-xs sm:max-w-md"
                >
                  <p className="text-[11px] sm:text-[14px] text-[#24211B] font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)] line-clamp-2 sm:line-clamp-none">
                    {activeContent.subtitle}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#38332A]/85 font-normal leading-normal hidden sm:block">
                    {activeContent.subDescription}
                  </p>

                  {/* Mobile-only compact telemetry pills to prevent card overlap */}
                  <div className="flex sm:hidden items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-black/45 backdrop-blur-xs text-[9px] font-mono text-white flex items-center gap-1 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{activeContent.metrics.card1.label}: <strong className="text-amber-300">{activeContent.metrics.card1.value}</strong></span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/45 backdrop-blur-xs text-[9px] font-mono text-white flex items-center gap-1 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>{activeContent.metrics.card2.label}: <strong className="text-sky-300">{activeContent.metrics.card2.value}</strong></span>
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Callouts & CTA (Anchor positioned for stability) */}
          <div className="pt-2 sm:pt-3.5 flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenAccess}
              className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#E8BD4D] hover:bg-[#DDAE3C] text-[#1B1A17] font-semibold text-[11px] sm:text-xs tracking-wider uppercase rounded-full shadow-[0_4px_16px_rgba(232,189,77,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Start Free</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={() => onOpenInfoModal?.('Platform Flight Vectors', 'Multi-band neural optical flow and edge vectoring with continuous corridor oversight.')}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs text-[#1B1A17] hover:text-black font-semibold tracking-wide transition-colors cursor-pointer bg-white/40 hover:bg-white/60 backdrop-blur-xs rounded-full border border-black/10"
            >
              Explore →
            </button>
          </div>
        </div>

        {/* --- RIGHT SIDE: DYNAMIC TELEMETRY CARDS (Desktop & Tablet only; mobile has inline pills) --- */}
        <div className="hidden sm:flex absolute right-6 sm:right-10 bottom-16 sm:bottom-20 z-20 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`cards-phase-${currentPhase}`}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -35 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {/* Telemetry Card 1 */}
              <div
                onClick={() => onOpenInfoModal?.(activeContent.metrics.card1.label, activeContent.metrics.card1.sub)}
                className="w-36 sm:w-40 p-3 rounded-2xl bg-black/65 backdrop-blur-md border border-white/15 text-white shadow-xl hover:scale-105 hover:bg-black/80 transition-all duration-200 cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-gradient-to-br from-black/80 to-black/95 overflow-hidden relative mb-2.5 border border-white/10 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:8px_8px]" />
                  {renderMetricIcon(activeContent.metrics.card1.icon, activeContent.metrics.card1.accent)}
                  <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-white/50">
                    S-01
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] font-medium text-white/60 tracking-wider uppercase">
                    {activeContent.metrics.card1.label}
                  </div>
                  <div className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
                    {activeContent.metrics.card1.value}
                  </div>
                  <div className="text-[9px] text-white/70 flex items-center gap-1 pt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeContent.metrics.card1.accent === 'emerald'
                          ? 'bg-emerald-400'
                          : activeContent.metrics.card1.accent === 'sky'
                          ? 'bg-sky-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span>{activeContent.metrics.card1.sub}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Card 2 */}
              <div
                onClick={() => onOpenInfoModal?.(activeContent.metrics.card2.label, activeContent.metrics.card2.sub)}
                className="w-36 sm:w-40 p-3 rounded-2xl bg-black/65 backdrop-blur-md border border-white/15 text-white shadow-xl hover:scale-105 hover:bg-black/80 transition-all duration-200 cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-gradient-to-br from-black/80 to-black/95 overflow-hidden relative mb-2.5 border border-white/10 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:8px_8px]" />
                  {renderMetricIcon(activeContent.metrics.card2.icon, activeContent.metrics.card2.accent)}
                  <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-white/50">
                    S-02
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] font-medium text-white/60 tracking-wider uppercase">
                    {activeContent.metrics.card2.label}
                  </div>
                  <div className="text-xl font-bold tracking-tight text-white font-mono tabular-nums">
                    {activeContent.metrics.card2.value}
                  </div>
                  <div className="text-[9px] text-white/70 flex items-center gap-1 pt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeContent.metrics.card2.accent === 'emerald'
                          ? 'bg-emerald-400'
                          : activeContent.metrics.card2.accent === 'sky'
                          ? 'bg-sky-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span>{activeContent.metrics.card2.sub}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- BOTTOM FLOATING CONTROLS & PHASE TRACKER --- */}
        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-3 sm:inset-x-10 z-20 flex items-center justify-between text-[11px] text-black/70 pointer-events-auto">
          {/* Dynamic Flight Action Indicator & Phase Pills */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-black/10 backdrop-blur-xs px-3 py-1 rounded-full border border-black/5">
              <span className="font-semibold text-black/85 text-[10px]">{activeContent.eagleAction}</span>
            </div>

            {/* Phase jump selector with thumb-friendly touch targets on mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-black/20 backdrop-blur-sm rounded-full p-0.5 sm:p-1 border border-white/30">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => jumpToPhase(p)}
                  className={`px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                    currentPhase === p
                      ? 'bg-[#1B1A17] text-white shadow-xs font-semibold'
                      : 'text-black/75 hover:text-black hover:bg-black/10'
                  }`}
                  title={`Jump to Phase ${p}: ${PHASES_DATA[p]?.tag}`}
                >
                  P{p}
                </button>
              ))}
            </div>
          </div>

          {/* Right interaction controls (Play/Pause, Replay, Mute) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-black/20 hover:bg-black/30 text-black font-semibold text-[10px] sm:text-[11px] transition-colors cursor-pointer border border-white/20"
              title={isPlaying ? 'Pause Auto Video' : 'Play Continuous Video'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden xs:inline">{isPlaying ? 'Pause' : 'Auto'}</span>
            </button>

            <button
              onClick={restartVideo}
              className="p-1 sm:p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-black transition-colors cursor-pointer border border-white/20"
              title="Restart Flight Sequence"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1 sm:p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-black transition-colors cursor-pointer border border-white/20"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- BOTTOM STATUS & INTERACTION INSTRUCTION BAR --- */}
      <div className="w-full max-w-7xl pt-1.5 px-2 flex items-center justify-between text-[10px] sm:text-[11px] text-black/60 font-mono">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="font-semibold text-black/80">
            {interactiveMode === 'autoplay' ? 'AUTOPLAY' : 'SWIPE / SCROLL'}
          </span>
          <div className="w-16 sm:w-36 h-1.5 bg-black/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-75"
              style={{ width: `${(flightProgress * 100).toFixed(1)}%` }}
            />
          </div>
          <span className="tabular-nums font-semibold">{Math.round(flightProgress * 100)}%</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-amber-900 font-semibold bg-amber-200/80 px-2 sm:px-2.5 py-0.5 rounded-md border border-amber-300/50 text-[9px] sm:text-[10px]">
            {activeContent.tag}
          </span>
          <span className="hidden md:inline text-black/30">·</span>
          <span className="hidden md:inline text-black/50 font-medium">3D PARALLAX</span>
        </div>
      </div>
    </div>
  );
};
