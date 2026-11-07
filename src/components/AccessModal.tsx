/**
 * AccessModal.tsx
 * Modal for "Get Access" / "Get Unlimited", with tier selection and corridor reservation.
 */

import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Shield, Sparkles } from 'lucide-react';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessModal: React.FC<AccessModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<'pilot' | 'corridor' | 'sovereign'>('corridor');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2400);
  };

  const tiers = [
    {
      id: 'pilot',
      name: 'Researcher Access',
      price: 'Academic License',
      desc: 'Full access to aerodynamic telemetry dataset, flight logs, and Three.js flight mechanics SDK.',
      features: ['Flight dynamic API access', 'Archived corridor logs', 'Atmospheric wave data'],
    },
    {
      id: 'corridor',
      name: 'Corridor Operator',
      price: 'Custom Dedicated Link',
      popular: true,
      desc: 'Real-time 12ms live optical flow stream over 1 designated continental or maritime corridor.',
      features: ['Sub-second vector alerts', '4K 120FPS live feed', 'Priority satellite downlink'],
    },
    {
      id: 'sovereign',
      name: 'Sovereign Fleet',
      price: 'Global Coverage',
      desc: 'Full planetary presence with coordinated multi-unit autonomous loiter & sovereign edge encryption.',
      features: ['Dedicated LEO satellite channel', 'Air-to-air mesh relay', 'Custom neural optical weights'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#F8F6F0] rounded-3xl p-6 sm:p-9 border border-black/10 shadow-2xl text-[#1B1A17] space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              EAGLE DEPLOYMENT
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1B1A17]">
            Get Access to the Altitude Fleet
          </h2>
          <p className="text-xs sm:text-sm text-black/60">
            Select your operational tier to reserve real-time telemetry feeds and flight corridor bandwidth.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-semibold text-black">
              Access Request Dispatched
            </h3>
            <p className="text-xs sm:text-sm text-black/60 max-w-md mx-auto">
              We have provisioned a preliminary sandbox token for <span className="font-semibold">{email}</span>. Check your inbox for security credentials.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tiers.map((t) => {
                const isSelected = selectedTier === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTier(t.id as any)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white/50 border-black/10 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>{t.name}</span>
                      {t.popular && (
                        <span className="text-[9px] font-bold tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-sm uppercase">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-medium text-black/60 mb-2">
                      {t.price}
                    </div>
                    <p className="text-[11px] text-black/60 mb-3 leading-relaxed">
                      {t.desc}
                    </p>
                    <div className="space-y-1 border-t border-black/5 pt-2">
                      {t.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-black/70">
                          <Check className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter organization email address"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-black/15 text-xs text-black placeholder:text-black/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#E8BD4D] hover:bg-[#DDAE3C] text-[#1B1A17] text-xs font-semibold rounded-xl tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Initiate Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
