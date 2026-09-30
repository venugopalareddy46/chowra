import React, { useState } from 'react';
import { Anchor, Plane, Truck, HardHat, Check, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import freightImg from '../assets/images/freight_cargo_multimodal_1790560644568.jpg';
import { freightCargoCapabilities } from '../data/logisticsData';

interface FreightCargoProps {
  onOpenPickupModal: () => void;
  onOpenCalculator: () => void;
}

export const FreightCargo: React.FC<FreightCargoProps> = ({
  onOpenPickupModal,
  onOpenCalculator,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const activeCapability = freightCargoCapabilities[activeTab];

  return (
    <section id="freight" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Heavy Industrial & Bulk Logistics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Multimodal Freight & Global Cargo Services
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Synchronized sea, air, rail, and highway transportation. We manage end-to-end supply chains for heavy engineering, automotive tier suppliers, chemicals, and consumer electronics.
          </p>
        </div>

        {/* Multimodal Mode Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {freightCargoCapabilities.map((cap, idx) => {
            const isCurrent = activeTab === idx;
            return (
              <button
                key={cap.mode}
                onClick={() => setActiveTab(idx)}
                className={`py-3 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {idx === 0 && <Plane className="w-4 h-4 shrink-0" />}
                {idx === 1 && <Anchor className="w-4 h-4 shrink-0" />}
                {idx === 2 && <Truck className="w-4 h-4 shrink-0" />}
                {idx === 3 && <HardHat className="w-4 h-4 shrink-0" />}
                <span className="truncate">{cap.mode}</span>
              </button>
            );
          })}
        </div>

        {/* Active Mode Deep-Dive Showcase */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-semibold text-amber-400 font-data block mb-1">
                  {activeCapability.tagline}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white">
                  {activeCapability.headline}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeCapability.description}
              </p>

              {/* Spec list */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Key Technical Specifications
                </span>
                {activeCapability.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Verified Metric Badge */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-400">Annual Operational Throughput:</span>
                <span className="font-data font-bold text-amber-400">{activeCapability.stat}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenPickupModal}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Request Custom Freight RFQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Calculate Volumetric Freight
                </button>
              </div>
            </div>

            {/* Right Media Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 group shadow-lg">
                <img
                  src={freightImg}
                  alt="Modern multimodal logistics sea port and container cargo freight"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-84 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-300">
                  <div className="font-semibold text-white">Chowra Global Gateway Network</div>
                  <div className="text-[11px] text-slate-400">Direct vessel space allocations & inland terminal connections</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
