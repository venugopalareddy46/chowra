/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authentication Modal: Login & Registration
 * Architect: Chowra Engineering Team
 */

import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Building, Phone, ArrowRight, 
  ShieldCheck, Check, Sparkles, Eye, EyeOff, AlertCircle 
} from 'lucide-react';
import { UserAccount, DEMO_USERS } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Match demo user or create session user
    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      setSuccessMsg(`Welcome back, ${matched.name}!`);
      setTimeout(() => {
        onLoginSuccess(matched);
        onClose();
      }, 600);
      return;
    }

    // New registered user
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email: email.trim(),
      phone: phone || '+91 98000 00000',
      company: company || 'Enterprise Shipper',
      role: 'Client',
      avatarInitials: (name || email).slice(0, 2).toUpperCase(),
      verified: true,
      memberSince: 'Just now',
      creditBalance: 50000,
      savedAddressesCount: 1,
      totalShipmentsCount: 0,
    };

    setSuccessMsg(mode === 'register' ? 'Registration complete! Logging in...' : 'Logged in successfully!');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = (user: UserAccount) => {
    setEmail(user.email);
    setPassword('••••••••');
    setSuccessMsg(`Authenticating as ${user.name}...`);
    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Decorative Accent Bar */}
        <div 
          className="h-1.5 w-full" 
          style={{ background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)' }} 
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div 
              className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-lg font-bold text-slate-950"
              style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
            >
              <Lock className="w-6 h-6 text-slate-950" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {mode === 'login' ? 'Chowra Dispatch Portal Login' : 'Create Shipper Account'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {mode === 'login' 
                ? 'Access your corporate consignments, real-time telemetry, and billing statements.' 
                : 'Register to unlock automated AWB bookings, discounted linehaul rates, and GST credits.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mb-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Access</span>
              </span>
              <span className="text-[10px] text-slate-500 font-data">One-click</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_USERS[0])}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-amber-400 flex items-center gap-1">
                  <span>Chowra Support Team</span>
                  <span className="text-[9px] px-1 rounded bg-[#00bf72]/20 text-[#a8eb12]">Director</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Enterprise Command</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_USERS[1])}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-400/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-amber-400 flex items-center gap-1">
                  <span>Rajesh Malhotra</span>
                  <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300">Client</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Apex Precision Eng.</div>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chowra Engineering Team"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                      required={mode === 'register'}
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">Company Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Reliance Logistics Ltd."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">Mobile Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98200 44810"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-data"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Corporate Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@company.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-data"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-medium">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Demo password reminder: Any password will allow authentication with your registered or demo accounts.')}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password (min 6 characters)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-data"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>{mode === 'login' ? 'Authenticate & Open Dashboard' : 'Complete Registration & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 256-Bit Encrypted</span>
            </span>
            <span className="text-slate-500 font-data">
              Architect: Chowra Engineering Team
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
