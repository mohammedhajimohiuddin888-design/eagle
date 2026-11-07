/**
 * Navbar.tsx
 * Minimal premium top header for the EAGLE altitude vision platform.
 */

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenAccess: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenAccess,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between text-[#1B1A17] shrink-0">
      {/* Brand Zone */}
      <div
        onClick={() => handleNavClick('hero')}
        className="flex items-center gap-2 cursor-pointer group select-none"
      >
        <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1B1A17] group-hover:text-black transition-colors">
          Eagle
        </span>
      </div>

      {/* Primary Navigation Links (Desktop) */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.14em] text-[#1B1A17]/70 uppercase">
        <button
          onClick={() => handleNavClick('platform')}
          className="hover:text-[#1B1A17] transition-colors cursor-pointer py-1"
        >
          Platform
        </button>
        <button
          onClick={() => handleNavClick('coverage')}
          className="hover:text-[#1B1A17] transition-colors cursor-pointer py-1"
        >
          Coverage
        </button>
        <button
          onClick={() => handleNavClick('research')}
          className="hover:text-[#1B1A17] transition-colors cursor-pointer py-1"
        >
          Research
        </button>
        <button
          onClick={() => handleNavClick('company')}
          className="hover:text-[#1B1A17] transition-colors cursor-pointer py-1"
        >
          Company
        </button>
      </nav>

      {/* Action Zone: Log In + Gold "Get Unlimited" */}
      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={onOpenLogin}
          className="text-xs font-medium text-[#1B1A17]/80 hover:text-[#1B1A17] transition-colors cursor-pointer px-2 py-1"
        >
          Log in
        </button>

        <button
          onClick={onOpenAccess}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E8BD4D] hover:bg-[#DDAE3C] text-[#1B1A17] text-xs font-semibold rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Get Unlimited</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex sm:hidden items-center gap-2">
        <button
          onClick={onOpenAccess}
          className="px-3 py-1.5 bg-[#E8BD4D] text-[#1B1A17] text-xs font-semibold rounded-full"
        >
          Access
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#1B1A17] rounded-lg hover:bg-black/5"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-black/10 px-6 py-6 z-50 flex flex-col gap-4 shadow-xl sm:hidden">
          <button
            onClick={() => handleNavClick('platform')}
            className="text-left text-sm font-medium py-2 border-b border-black/5"
          >
            Platform
          </button>
          <button
            onClick={() => handleNavClick('coverage')}
            className="text-left text-sm font-medium py-2 border-b border-black/5"
          >
            Coverage
          </button>
          <button
            onClick={() => handleNavClick('research')}
            className="text-left text-sm font-medium py-2 border-b border-black/5"
          >
            Research
          </button>
          <button
            onClick={() => handleNavClick('company')}
            className="text-left text-sm font-medium py-2 border-b border-black/5"
          >
            Company
          </button>
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="text-sm font-medium text-black/70"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAccess();
              }}
              className="px-4 py-2 bg-[#E8BD4D] text-[#1B1A17] text-xs font-semibold rounded-full"
            >
              Get Unlimited
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
