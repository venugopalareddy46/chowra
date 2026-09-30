/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Website Loading Screen & Telemetry Boot Animation
 * Architect: Chowra Engineering Team
 */

import React, { useState, useEffect } from 'react';
import { Truck, Plane, ShieldCheck, Compass, Radio } from 'lucide-react';

interface WebsiteLoadingScreenProps {
  onComplete: () => void;
}

export const WebsiteLoadingScreen: React.FC<WebsiteLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Calibrating Global Air Cargo & Multimodal Hubs...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(38);
      setStatusText('Syncing Real-Time GPS Highway & Flight Telemetry...');
    }, 300);

    const timer2 = setTimeout(() => {
      setProgress(68);
      setStatusText('Connecting Sahar 24/7 Operations Control Tower...');
    }, 600);

    const timer3 = setTimeout(() => {
      setProgress(94);
      setStatusText('Geospatial Engine Ready · Architect: Chowra Engineering Team');
    }, 900);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setStatusText('Chowra Logistics Control Tower Online');
      setFadeOut(true);
      setTimeout(onComplete, 350);
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00bf72 0%, #008793 50%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        
        {/* Animated Brand Emblem with Spinner Ring */}
        <div className="relative mb-6">
          <div 
            className="w-20 h-20 rounded-2xl p-1 animate-spin-gradient flex items-center justify-center shadow-2xl"
            style={{
              background: 'conic-gradient(from 0deg, #008793, #00bf72, #a8eb12, #008793)',
            }}
          >
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Truck className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>
          
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-md">
            <Radio className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-white mb-1">
          CHOWRA <span className="text-amber-400 font-light">LOGISTICS</span>
        </h1>
        <p className="text-[11px] text-slate-400 font-data tracking-wider uppercase mb-6">
          Enterprise Multimodal Freight & Couriers Limited
        </p>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                boxShadow: '0 0 10px rgba(0, 191, 114, 0.7)'
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-data text-slate-400">
            <span className="truncate pr-2">{statusText}</span>
            <span className="text-[#a8eb12] font-bold">{progress}%</span>
          </div>
        </div>

        {/* Skip button for user-friendliness */}
        <button
          type="button"
          onClick={() => { setFadeOut(true); setTimeout(onComplete, 200); }}
          className="mt-6 text-[11px] text-slate-500 hover:text-slate-300 transition-colors underline cursor-pointer"
        >
          Skip Introduction →
        </button>

        {/* Secret Architect Footer */}
        <div className="mt-8 text-[10px] text-slate-600 font-data flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-slate-600" />
          <span>Core Engineering: Chowra Engineering Team</span>
        </div>

      </div>
    </div>
  );
};
