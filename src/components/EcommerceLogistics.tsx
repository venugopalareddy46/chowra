import React, { useState } from 'react';
import { Package, RefreshCw, DollarSign, Cpu, Check, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import warehouseImg from '../assets/images/warehouse_ecommerce_automation_1790560656696.jpg';
import { ecommerceSolutions } from '../data/logisticsData';

interface EcommerceLogisticsProps {
  onOpenPickupModal: () => void;
}

export const EcommerceLogistics: React.FC<EcommerceLogisticsProps> = ({ onOpenPickupModal }) => {
  const [dailyShipments, setDailyShipments] = useState(350);
  const [avgOrderValue, setAvgOrderValue] = useState(1400);

  // Cash flow calculation:
  // Standard market courier locks COD for 7-10 days. Chowra settles in 1 day (T+1).
  const dailyCodVolume = dailyShipments * 0.65 * avgOrderValue; // assume 65% COD
  const workingCapitalUnlocked = Math.round(dailyCodVolume * 6); // 6 days faster capital velocity

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Digital Commerce Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            E-Commerce Fulfillment & Accelerated COD Logistics
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Eliminate working capital bottlenecks. We combine automated micro-fulfillment hubs, rapid T+1 Cash on Delivery remittance, and intelligent reverse logistics with doorstep quality inspection.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Visual Carrier */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img
                src={warehouseImg}
                alt="Automated smart logistics fulfillment center with conveyor sortation"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-400">Chowra Fulfillment Automation</span>
                  <span className="font-data">Zone BOM-WH-03</span>
                </div>
                <div className="text-xs text-slate-300">
                  Pick-Pack-Ship cycle time under 18 minutes with 99.8% barcode verification accuracy.
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities Bento */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ecommerceSolutions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-data font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block mb-2">
                      {item.metric}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 text-sm mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Integration Logos */}
            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-medium">Native One-Click API Plugins:</span>
              <div className="flex items-center gap-3 font-semibold text-slate-200">
                <span className="hover:text-amber-400 transition-colors">Shopify</span>
                <span>·</span>
                <span className="hover:text-amber-400 transition-colors">WooCommerce</span>
                <span>·</span>
                <span className="hover:text-amber-400 transition-colors">Magento 2</span>
                <span>·</span>
                <span className="hover:text-amber-400 transition-colors">Amazon EasyShip</span>
                <span>·</span>
                <span className="hover:text-amber-400 transition-colors">Zoho SCM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive COD Working Capital Acceleration Calculator */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Interactive E-Commerce Tool
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Calculate Your Working Capital Velocity with T+1 COD Remittance
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Traditional logistics providers hold your COD money for 7 to 10 days. See how much trapped liquidity Chowra unlocks directly into your operational account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Sliders and Direct Inputs */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1.5">
                  <span>Your Average Daily Order Volume:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      step="10"
                      value={dailyShipments}
                      onChange={(e) => setDailyShipments(Math.max(1, Number(e.target.value)))}
                      placeholder="e.g. 500"
                      className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs font-data text-amber-400 text-right focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-slate-400 font-data">orders/day</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={dailyShipments}
                  onChange={(e) => setDailyShipments(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-medium text-slate-300 mb-1.5">
                  <span>Average Order Value (AOV):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-data">₹</span>
                    <input
                      type="number"
                      min="100"
                      max="100000"
                      step="50"
                      value={avgOrderValue}
                      onChange={(e) => setAvgOrderValue(Math.max(1, Number(e.target.value)))}
                      placeholder="e.g. 1500"
                      className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs font-data text-amber-400 text-right focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <div className="text-xs text-slate-400 mb-1">Cash Flow Unlocked for Inventory & Growth</div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400 font-data">
                ₹{workingCapitalUnlocked.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Continuous rolling liquidity credited every 24 hours via automated bank clearing (NEFT/RTGS).
              </p>

              <button
                type="button"
                onClick={onOpenPickupModal}
                className="mt-4 w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Integrate Chowra E-Com API</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
