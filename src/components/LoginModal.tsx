/**
 * LoginModal.tsx
 * Clean, accessible sign-in modal for the EAGLE platform.
 */

import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userEmail: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Close on Escape key
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
    setError('');

    if (!email || !password) {
      setError('Please provide your operator credentials.');
      return;
    }

    setIsLoading(true);

    // Realistic client-side authentication simulation
    setTimeout(() => {
      setIsLoading(false);
      setAuthenticated(true);
      setTimeout(() => {
        onSuccess(email);
        onClose();
        setAuthenticated(false);
      }, 1200);
    }, 900);
  };

  const handleDemoFill = () => {
    setEmail('operator@eagle-vision.aero');
    setPassword('altitude-vision-2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#F8F6F0] rounded-3xl p-7 sm:p-9 border border-black/10 shadow-2xl text-[#1B1A17] space-y-6"
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
            <div className="w-5 h-5 rounded-full border border-black/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 stroke-black stroke-[2.2]">
                <path d="M3 13C6 8 11 6 21 6C16 11 14 16 14 21C11 17 8 15 3 13Z" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest text-[#1B1A17] uppercase">
              EAGLE CONSOLE
            </span>
          </div>
          <h2 className="font-editorial text-3xl font-normal text-[#1B1A17]">
            Sign in to Telemetry
          </h2>
          <p className="text-xs text-black/60">
            Access encrypted altitude flight feeds and vectorized corridor analytics.
          </p>
        </div>

        {authenticated ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-semibold text-black">
              Authentication Verified
            </h3>
            <p className="text-xs text-black/60">
              Welcome back, operator. Connecting to telemetry session...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/70">
                Operator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@organization.aero"
                  required
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-black/15 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <Mail className="w-4 h-4 text-black/40 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-black/70">
                  Encryption Key / Password
                </label>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[10px] text-amber-700 hover:text-amber-900 underline font-medium"
                >
                  Fill Demo Key
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-black/15 text-xs text-black placeholder:text-black/35 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <Lock className="w-4 h-4 text-black/40 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1B1A17] hover:bg-black text-white text-xs font-semibold rounded-full tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Handshaking Hardware...</span>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-black/40 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                End-to-End Encrypted Quantum-Resistant Key Exchange
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
