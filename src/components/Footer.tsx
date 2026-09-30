import React, { useState } from 'react';
import { Truck, Phone, Mail, MapPin, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenPickupModal: () => void;
  onOpenHealthModal?: (tab?: 'telemetry' | 'custom-domain' | 'tech-stack') => void;
  onOpenDocsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onScrollToSection, 
  onOpenPickupModal,
  onOpenHealthModal,
  onOpenDocsModal
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Corporate Profile */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black">
                <Truck className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-base font-display font-extrabold text-white tracking-tight">
                CHOWRA <span className="text-amber-400 font-light">LOGISTICS</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              CHOWRA LOGISTICS AND COURIERS LIMITED is a premier Indian integrated supply chain corporation providing domestic express courier networks, multimodal freight forwarding, temperature-controlled life science transit, and automated e-commerce fulfillment across Extensive Pan-India Coverage and International Destinations.
            </p>

            <div className="pt-2 text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Corporate HQ: Chowra Logistics — India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:18004192469" className="hover:text-white font-data">
                  Toll-Free Dispatch: +91 90000 00000 (+91 90000 00000)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>24/7 Operations: contact@chowralogistics.example</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-white text-sm">
              Courier & Express
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onScrollToSection('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Same-Day Metro Courier
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Next-Day Air Priority
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Surface Linehaul Cargo
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Global Express Air (International)
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  GDP Cold-Chain Express
                </button>
              </li>
              <li>
                <button onClick={onOpenPickupModal} className="text-amber-400 hover:underline cursor-pointer">
                  Book Doorstep Pickup →
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('history')} className="hover:text-amber-400 transition-colors cursor-pointer text-[#a8eb12] font-medium">
                  Booking History & Registry →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Multimodal & Supply Chain */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-white text-sm">
              Freight & Enterprise
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onScrollToSection('freight')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Air Cargo & Full Charters
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('freight')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Ocean Freight (FCL / LCL)
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('freight')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Over-Dimensional Project Cargo
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('enterprise')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  B2B Corporate Contract Logistics
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('network')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Super-Hubs & Air Cargo Directory
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('calculator')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Volumetric Tariff Calculator (₹ INR)
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('network')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Pan-India PIN Code Network (Extensive Pan-India Coverage)
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('contact')} className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400 font-semibold">
                  Contact Us & Submit Inquiry →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Bulletins */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-white text-sm">
              Regulatory & Trade Bulletins
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Subscribe to monthly customs advisory updates, peak season flight schedules, and aviation fuel surcharge index reports.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed to trade bulletins successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter corporate email (e.g. logistics@company.in)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Subscribe to Regulatory Bulletins
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-slate-500">
              Zero spam. Verified operational notices only.
            </div>
          </div>

        </div>

        {/* Regulatory Accreditation Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-400">
          <div>
            <span className="font-semibold text-white block">Corporate Identity</span>
            <span>CIN: U60200MH2008PLC184920</span>
          </div>
          <div>
            <span className="font-semibold text-white block">Aviation Accreditation</span>
            <span>IATA CASS Cargo Agent #14-3-9921</span>
          </div>
          <div>
            <span className="font-semibold text-white block">Customs Tier</span>
            <span>AEO-T2 Certified Operator</span>
          </div>
          <div>
            <span className="font-semibold text-white block">Quality Management</span>
            <span>ISO 9001:2015 & GDP Compliant</span>
          </div>
        </div>

        {/* Copyright and Legal Mirror */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} CHOWRA LOGISTICS AND COURIERS LIMITED. All rights reserved.
            <span className="hidden sm:inline text-slate-600 ml-2">| Core Architecture & Telemetry Engineering: Chowra Engineering Team</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-data">
            <span className="hover:text-slate-300 cursor-pointer">Conditions of Carriage</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Prohibited & Hazardous Goods</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">GST & E-Way Bill Terms</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Citizen Whistleblower Charter</span>
          </div>
        </div>

      </div>
    <div className="text-center text-xs text-slate-500 mt-4">Illustrative demo website for technical assignment purposes. Service figures and contact details are sample data.</div>
      </footer>
  );
};
