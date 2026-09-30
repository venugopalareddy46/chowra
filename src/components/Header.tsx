/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Chowra Navigation & Header Console
 * System Architecture & Engineering: Chowra Engineering Team
 */

import React, { useState } from 'react';
import { Truck, Phone, Menu, X, ArrowRight, ShieldCheck, Clock, User, LogIn, LayoutDashboard } from 'lucide-react';
import { UserAccount } from '../types/auth';

interface HeaderProps {
  onOpenPickupModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  bookingCount?: number;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
  onOpenDashboard?: () => void;
  onOpenHealthModal?: (tab?: 'telemetry' | 'custom-domain' | 'tech-stack') => void;
  onOpenDocsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenPickupModal, 
  onScrollToSection, 
  bookingCount,
  currentUser,
  onOpenAuthModal,
  onOpenDashboard,
  onOpenHealthModal,
  onOpenDocsModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-all duration-200">
      {/* Quiet Corporate Operational Strip */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 sm:px-8 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">24/7 Control Tower</span>
            </span>

            <span className="hidden xl:inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>GST & E-Way Bill Compliant</span>
            </span>

          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a 
              href="tel:18004192469" 
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-data font-medium">+91 90000 00000</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Avg Dispatch: 18 mins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar - 3 Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
          className="text-lg sm:text-xl font-display font-extrabold tracking-tight text-white flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Truck className="w-4 h-4 text-slate-950" />
          </div>
          <span className="tracking-tight text-slate-100">
            CHOWRA <span className="text-amber-400 font-light">LOGISTICS</span>
          </span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => handleNavClick('tracker')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Track Consignment
          </button>
          <button 
            onClick={() => handleNavClick('booking')}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors py-1 cursor-pointer flex items-center gap-1"
          >
            <span>Book Courier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </button>
          <button 
            onClick={() => handleNavClick('history')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer flex items-center gap-1.5"
            title="View Booking History & Dispatch Registry"
          >
            <span>History</span>
            {bookingCount !== undefined && bookingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#00bf72]/20 text-[#a8eb12] border border-[#00bf72]/40">
                {bookingCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => handleNavClick('services')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Courier & Express
          </button>
          <button 
            onClick={() => handleNavClick('freight')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Multimodal Freight
          </button>
          <button 
            onClick={() => handleNavClick('calculator')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Rate Calculator
          </button>
          <button 
            onClick={() => handleNavClick('network')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Hub Network
          </button>
          <button 
            onClick={() => handleNavClick('enterprise')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Corporate
          </button>
          <button 
            onClick={() => handleNavClick('faq')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            FAQs
          </button>
          <button 
            onClick={() => handleNavClick('contact')}
            className="hover:text-amber-400 transition-colors py-1 cursor-pointer"
          >
            Contact Us
          </button>
        </nav>

        {/* Zone 3: Primary action controls */}
        <div className="flex items-center gap-2.5">
          {/* User Account / Auth Button */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
              title="Open Corporate Dashboard"
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-slate-950 shadow-xs"
                style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
              >
                {currentUser.avatarInitials}
              </div>
              <span className="max-w-[100px] truncate hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-data">Dashboard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In</span>
            </button>
          )}


          
          <button
            onClick={() => handleNavClick('booking')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow-amber-400/20 transition-all duration-150 whitespace-nowrap active:scale-[0.98] cursor-pointer"
          >
            <span>Book Pickup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-5 shadow-2xl space-y-4">
          {/* Mobile User Profile Section */}
          <div className="pb-3 border-b border-slate-800">
            {currentUser ? (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onOpenDashboard?.(); }}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-slate-950"
                    style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
                  >
                    {currentUser.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.company}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                  Dashboard
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onOpenAuthModal?.(); }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
          <div className="flex flex-col space-y-2.5 text-sm font-medium text-slate-200">
            <button
              onClick={() => handleNavClick('booking')}
              className="text-left px-3 py-2.5 rounded-lg bg-amber-400/10 text-amber-400 font-bold border border-amber-400/30 flex items-center justify-between"
            >
              <span>Book Courier / Doorstep Pickup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => handleNavClick('tracker')} className="text-left px-3 py-2 rounded-md hover:bg-slate-900 hover:text-amber-400 transition-colors">
              Track Shipment
            </button>
            <button onClick={() => handleNavClick('services')} className="text-left px-3 py-2 rounded-md hover:bg-slate-900 hover:text-amber-400 transition-colors">
              Services
            </button>
            <button onClick={() => handleNavClick('calculator')} className="text-left px-3 py-2 rounded-md hover:bg-slate-900 hover:text-amber-400 transition-colors">
              Rate Calculator
            </button>
            <button onClick={() => handleNavClick('contact')} className="text-left px-3 py-2 rounded-md hover:bg-slate-900 hover:text-amber-400 transition-colors">
              Contact Us
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPickupModal();
              }}
              className="w-full py-2.5 px-4 text-center font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors text-sm"
            >
              Schedule Doorstep Pickup
            </button>
            <a
              href="tel:18004192469"
              className="w-full py-2 px-4 text-center font-medium text-slate-300 border border-slate-800 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-slate-900"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Dispatch Hotline: +91 90000 00000</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
