import React, { useState } from 'react';
import { Globe, MapPin, Building, Plane, Truck, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { networkHubs } from '../data/logisticsData';

export const NetworkCoverage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'West' | 'North' | 'South' | 'East' | 'International'>('All');
  const [activeHubId, setActiveHubId] = useState<string>('hub-bom');

  const filteredHubs = selectedRegion === 'All' 
    ? networkHubs 
    : networkHubs.filter(h => h.region === selectedRegion);

  const activeHub = networkHubs.find(h => h.id === activeHubId) || networkHubs[0];

  return (
    <section id="network" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Infrastructure Reach</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Domestic & Global Air Cargo Hub Network
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Operating 10 strategic multimodal super-hubs, 140 regional transshipment depots, and direct block-space allocations on 40+ international airlines.
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['All', 'West', 'North', 'South', 'East', 'International'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg === 'International' ? 'Global Gateways' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Hubs Grid & Active Hub Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Hub Directory List */}
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredHubs.map(hub => {
                const isSelected = activeHub.id === hub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => setActiveHubId(hub.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-50/60 border-amber-500 ring-1 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-data font-bold text-xs text-amber-700 bg-white border border-amber-200/80 px-2 py-0.5 rounded">
                        {hub.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {hub.city}, {hub.country}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-slate-900 text-sm mb-2">
                      {hub.name}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/70">
                      <span>Daily Capacity:</span>
                      <span className="font-data font-semibold text-slate-900">{hub.capacityDailyKg}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Hub Telemetry & Operational Profile */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl">
            <div className="border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Super-Hub Telemetry Dossier
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Fully Operational</span>
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mt-1">
                {activeHub.name}
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Location: {activeHub.city}, {activeHub.country} · Terminal ID: <span className="font-data text-amber-400">{activeHub.code}</span>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Daily Freight Handling</span>
                <span className="text-lg font-display font-bold text-amber-400 font-data">
                  {activeHub.capacityDailyKg}
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Direct Transit Corridors</span>
                <span className="text-lg font-display font-bold text-white font-data">
                  {activeHub.directLanesCount} Outbound Lanes
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Dedicated Local Fleet</span>
                <span className="text-lg font-display font-bold text-white font-data">
                  {activeHub.fleetAllocated} Units
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Customs Port Clearance</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Green Channel In-House</span>
                </span>
              </div>
            </div>

            {/* Facility Inclusions */}
            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Automated Cross-Belt Sorter: 18,000 parcels / hour throughput</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-3.5 h-3.5 text-blue-400" />
                <span>Direct Airside Tarmac Access for express flight departures</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 Security X-Ray & Explosive Detection System (EDS)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Need specific lane transit times?</span>
              <a
                href="tel:18004192469"
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Contact Hub Dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
