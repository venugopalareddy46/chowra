import React, { useState } from 'react';
import { Search, ArrowRight, Calculator, PackageCheck, Shield, Sparkles, Navigation } from 'lucide-react';
import heroFleetImg from '../assets/images/hero_logistics_fleet_1790560629934.jpg';

interface HeroSectionProps {
  onTrackShipment: (awb: string) => void;
  onOpenPickupModal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTrackShipment,
  onOpenPickupModal,
  onScrollToSection,
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'rate' | 'pickup'>('track');
  const [trackingInput, setTrackingInput] = useState('CHW-8942-IN');
  const [quickOrigin, setQuickOrigin] = useState('Mumbai (400001)');
  const [quickDest, setQuickDest] = useState('New Delhi (110001)');
  const [quickWeight, setQuickWeight] = useState('2.5');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      onTrackShipment(trackingInput.trim());
      onScrollToSection('tracker');
    }
  };

  const handleQuickRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToSection('calculator');
  };

  return (
    <section id="hero" className="relative w-full bg-slate-950 text-white overflow-hidden pt-8 pb-16 lg:pb-24 border-b border-slate-800">
      {/* Background Graphic & Subtle Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Mission */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Chowra Logistics and Couriers Limited · Est. 2008</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight text-balance">
              Precision Supply Chain & <span className="text-amber-400">Global Express</span> Couriers
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Powering commerce across Extensive Pan-India Coverage and International Destinations with scheduled time-definite air express, automated sorting transshipment hubs, and multimodal freight networks.
            </p>

            {/* Quick Proof Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                <span>Same-Day & Next-Day Air Express</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">✓</div>
                <span>End-to-End Real-Time GPS Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">✓</div>
                <span>Full Customs House Clearance</span>
              </div>
            </div>

            {/* Direct Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onScrollToSection('booking')}
                className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-amber-400/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <PackageCheck className="w-4 h-4 text-slate-950" />
                <span>Book Courier Pickup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('tracker')}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Track AWB Consignment</span>
              </button>
            </div>

            {/* Interactive Hero Action Console */}
            <div className="pt-2 max-w-xl">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 sm:p-3 shadow-xl backdrop-blur-sm">
                
                {/* Segmented Controls for Console Modes */}
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('track')}
                    className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'track' 
                        ? 'bg-amber-400 text-slate-950 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track AWB</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rate')}
                    className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'rate' 
                        ? 'bg-amber-400 text-slate-950 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Quick Quote</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pickup')}
                    className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'pickup' 
                        ? 'bg-amber-400 text-slate-950 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Book Pickup</span>
                  </button>
                </div>

                {/* Tab 1: Tracking Input */}
                {activeTab === 'track' && (
                  <form onSubmit={handleTrackSubmit} className="mt-3 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="Enter AWB / Consignment No. (e.g. CHW-8942-IN)"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-data focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <span>Track Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Pre-loaded sample suggestions */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span className="text-slate-500">Quick Test AWBs:</span>
                      <button
                        type="button"
                        onClick={() => { setTrackingInput('CHW-8942-IN'); onTrackShipment('CHW-8942-IN'); onScrollToSection('tracker'); }}
                        className="text-amber-400 hover:underline font-data"
                      >
                        CHW-8942-IN
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => { setTrackingInput('CHW-5521-EXP'); onTrackShipment('CHW-5521-EXP'); onScrollToSection('tracker'); }}
                        className="text-amber-400 hover:underline font-data"
                      >
                        CHW-5521-EXP
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => { setTrackingInput('CHW-3104-DEL'); onTrackShipment('CHW-3104-DEL'); onScrollToSection('tracker'); }}
                        className="text-amber-400 hover:underline font-data"
                      >
                        CHW-3104-DEL
                      </button>
                    </div>
                  </form>
                )}

                {/* Tab 2: Rate Calculator Teaser */}
                {activeTab === 'rate' && (
                  <form onSubmit={handleQuickRateSubmit} className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={quickOrigin}
                        onChange={(e) => setQuickOrigin(e.target.value)}
                        placeholder="Origin (e.g. Mumbai or 400059)"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                      <input
                        type="text"
                        value={quickDest}
                        onChange={(e) => setQuickDest(e.target.value)}
                        placeholder="Dest (e.g. Delhi or 110037)"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500"
                      />
                      <input
                        type="number"
                        value={quickWeight}
                        onChange={(e) => setQuickWeight(e.target.value)}
                        placeholder="Weight kg (e.g. 5.0)"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-data"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Open Full Volumetric Rate Calculator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {/* Tab 3: Pickup Scheduler Teaser */}
                {activeTab === 'pickup' && (
                  <div className="mt-3 space-y-3 text-center sm:text-left">
                    <p className="text-xs text-slate-300">
                      Schedule a doorstep collection for packages up to 500 kg. Our courier unit arrives with digital scale, barcode label printer, and tamper-proof packaging.
                    </p>
                    <button
                      type="button"
                      onClick={() => onScrollToSection('booking')}
                      className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Schedule Courier Pickup Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Hero High-Impact Visual Carrier */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={heroFleetImg}
                alt="Chowra Logistics modern air cargo aircraft and transport fleet at dusk freight terminal"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

              {/* Floating Real-time Fleet Stat Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-white">Live Logistics Fleet Dispatch</span>
                  </div>
                  <span className="font-data text-amber-400">1,248 Units En Route</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Linehaul Trucks</span>
                    <span className="font-data font-semibold text-white">840 Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Air Charter Sectors</span>
                    <span className="font-data font-semibold text-white">38 Flight Legs Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quantified Metrics Proof Row */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-data">
              99.4<span className="text-amber-400">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">On-Time SLA Delivery Across India</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-data">
              19,200<span className="text-amber-400">+</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Postal Pincodes Direct Coverage</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-data">
              220<span className="text-amber-400">+</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">International Countries Connected</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-data">
              4.8M<span className="text-amber-400">+</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Monthly Consignments Dispatched</div>
          </div>
        </div>

      </div>
    </section>
  );
};
