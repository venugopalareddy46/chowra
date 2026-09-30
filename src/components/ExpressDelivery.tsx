import React, { useState } from 'react';
import { Zap, Plane, Clock, Thermometer, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import courierDeliveryImg from '../assets/images/courier_delivery_1790661676476.jpg';
import { expressServices } from '../data/logisticsData';

interface ExpressDeliveryProps {
  onOpenPickupModal: () => void;
}

export const ExpressDelivery: React.FC<ExpressDeliveryProps> = ({ onOpenPickupModal }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  const activeService = expressServices[selectedServiceIndex];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Time-Definite Express</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            High-Velocity Express Delivery Services
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            When minutes dictate business continuity. Our priority express division deploys dedicated courier couriers, airport tarmac priority ramps, and active temperature-regulated containers.
          </p>
        </div>

        {/* 2-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Service Selector Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expressServices.map((svc, idx) => {
                const isSelected = selectedServiceIndex === idx;
                return (
                  <div
                    key={svc.title}
                    onClick={() => setSelectedServiceIndex(idx)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {svc.badge}
                        </span>
                        {idx === 0 && <Zap className="w-4 h-4 text-amber-500" />}
                        {idx === 1 && <Plane className="w-4 h-4 text-blue-500" />}
                        {idx === 2 && <Clock className="w-4 h-4 text-emerald-500" />}
                        {idx === 3 && <Thermometer className="w-4 h-4 text-purple-500" />}
                      </div>

                      <h3 className="font-display font-bold text-slate-900 text-base mb-1">
                        {svc.title}
                      </h3>
                      
                      <div className="text-xs font-semibold text-amber-600 mb-2 font-data">
                        {svc.timeCommitment}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {svc.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Click to inspect SLA</span>
                      <span className={`font-semibold ${isSelected ? 'text-amber-600' : 'text-slate-400'}`}>
                        {isSelected ? 'Active Selection' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Service Detailed SLA Commitment Box */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-xs font-semibold text-slate-800">
                  Guaranteed SLA Commitment for <span className="text-amber-600">{activeService.title}</span>
                </span>
                <span className="text-[11px] font-data text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Money-Back SLA Guaranteed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Dispatch Cut-off</span>
                  <span className="font-data font-semibold text-slate-800">24/7 Continuous (Zero Cut-Off)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Dedicated Handover</span>
                  <span className="font-semibold text-slate-800">Chain of Custody Handshake</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">GPS & IoT Sensor</span>
                  <span className="font-semibold text-slate-800">Real-Time Continuous Link</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Need priority dispatch within the next 60 minutes?
                </span>
                <button
                  type="button"
                  onClick={onOpenPickupModal}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book Immediate Priority Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: High-Fidelity Courier Visual Spotlight */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative h-64 sm:h-72">
                <img
                  src={courierDeliveryImg}
                  alt="Chowra Logistics Indian courier delivery partner in uniform handing express parcel to customer with delivery van"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block font-data">
                    Pan-India Doorstep Courier Delivery
                  </span>
                  <div className="text-sm font-semibold">
                    Uniformed Courier Executive with Digital Barcode Weight Scale & OTP Handover
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  The Chowra Express Quality Framework
                </h4>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>15-Minute Response Protocol:</strong> Instant driver dispatch allocation via automated dispatch dispatch engine.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Zero-Transshipment Direct Transit:</strong> Same-day consignments bypass intermediate sorting depots to prevent handling friction.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Biometric & OTP Secure Handover:</strong> Secure delivery authentication for sensitive legal, financial, and confidential documents.</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Average courier arrival time:</span>
                  <span className="font-data font-bold text-slate-900">22.4 mins in Tier 1 Metros</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
