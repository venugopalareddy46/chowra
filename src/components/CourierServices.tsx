import React, { useState } from 'react';
import { Plane, Truck, Globe, Shield, CheckCircle, ArrowRight, Clock, FileCheck } from 'lucide-react';
import { serviceCatalog } from '../data/logisticsData';

interface CourierServicesProps {
  onOpenPickupModal: () => void;
  onOpenCalculator: () => void;
}

export const CourierServices: React.FC<CourierServicesProps> = ({
  onOpenPickupModal,
  onOpenCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');

  const services = activeTab === 'domestic' ? serviceCatalog.domestic : serviceCatalog.international;

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Core Transport Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Domestic & International Courier Services
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Engineered for velocity and end-to-end chain of custody. From same-day intra-metro envelopes to consolidated cross-border freight pallets across International Destinations.
            </p>
          </div>

          {/* Interactive Segmented Switcher */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('domestic')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'domestic'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Domestic Network (Extensive Pan-India Coverage)</span>
            </button>
            <button
              onClick={() => setActiveTab('international')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'international'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>International Gateways (International Destinations)</span>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-amber-700 tracking-wide block mb-1">
                      {svc.speed}
                    </span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {svc.title}
                    </h3>
                  </div>
                  <span className="text-xs font-data font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-md shrink-0">
                    {svc.priceStarts}
                  </span>
                </div>

                {/* Subtext info */}
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  <strong className="text-slate-700">Ideal for: </strong>{svc.bestFor}
                </p>

                {/* Coverage & Weight info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-3 px-3.5 bg-white rounded-lg border border-slate-200/80 text-xs mb-5">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Geographic Scope</span>
                    <span className="font-medium text-slate-800">{svc.coverage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Payload Capacity</span>
                    <span className="font-data font-medium text-slate-800">{svc.weightLimits}</span>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Operational Inclusions
                  </span>
                  {svc.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="text-xs font-semibold text-slate-700 hover:text-amber-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Estimate Rate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onOpenPickupModal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Book Doorstep Pickup
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Compliance & Customs Brokerage Strip */}
        <div className="mt-12 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>In-House Customs House Brokerage (CHA) & Green Channel Clearance</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Chowra Logistics operates dedicated customs desks at BOM, DEL, BLR, MAA, HYD, and CCU international cargo terminals. We handle duty assessment (DDP/DDU), Harmonized System (HS) code filing, phytosanitary clearance, and DG certificates with zero demurrage hold-ups.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 justify-end">
              <button
                type="button"
                onClick={onOpenPickupModal}
                className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg text-center transition-colors cursor-pointer"
              >
                Schedule International Air Dispatch
              </button>
              <div className="text-[11px] text-slate-400 text-center">
                AEO-Tier 2 Certified · Authorised Economic Operator
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
