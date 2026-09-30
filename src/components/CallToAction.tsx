import React from 'react';
import { ArrowRight, Phone, Calculator, PackageCheck, ShieldCheck } from 'lucide-react';

interface CallToActionProps {
  onOpenPickupModal: () => void;
  onOpenCalculator: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  onOpenPickupModal,
  onOpenCalculator,
}) => {
  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Immediate Logistics Deployment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight text-balance">
              Ready to Accelerate Your Supply Chain Velocity?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Whether you need an emergency same-day courier dispatch or an integrated multimodal freight contract across International Gateways, Chowra Logistics delivers with verified SLA precision.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenPickupModal}
                className="py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Schedule Doorstep Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenCalculator}
                className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Calculate Volumetric Tariff</span>
              </button>

              <a
                href="tel:18004192469"
                className="py-3.5 px-6 text-slate-300 hover:text-amber-400 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call +91 90000 00000</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Licensed IATA Cargo Agent #14-3-9921</span>
              </div>
              <div>·</div>
              <div>Ministry of Corporate Affairs CIN: U60200MH2008PLC184920</div>
              <div>·</div>
              <div>Average Dispatch Response &lt; 20 Mins</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
