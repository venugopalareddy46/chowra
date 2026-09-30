import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Mail, ArrowRight, Search, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC<{ onScrollToSection: (id: string) => void }> = ({ onScrollToSection }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'How do I track my shipment without an AWB number?',
      a: 'You can track using your booking reference number (e.g. REF-BOM-DEL-9921) or consignor purchase order number. Simply enter it into the tracking console above or connect with our 24/7 Control Tower hotline (+91 90000 00000) with your registered sender mobile number.',
      category: 'Tracking & Telemetry',
    },
    {
      q: 'How is Volumetric (Dimensional) Weight calculated?',
      a: 'Following international IATA air cargo standards, volumetric weight is computed as (Length × Width × Height in cm) ÷ 5000. Your final invoice is billed on whichever is higher between actual gross scale weight and volumetric weight.',
      category: 'Pricing & Tariffs',
    },
    {
      q: 'What is the cut-off time for Same-Day and Next-Flight-Out dispatch?',
      a: 'For Same-Day Metro Courier, bookings placed before 02:00 PM are delivered within 4 to 6 hours. For Mission-Critical Next-Flight-Out (NFO) air cargo, our control tower operates 24/7/365 with continuous airport tarmac injections on the next available commercial flight leg.',
      category: 'Courier Services',
    },
    {
      q: 'How fast is Cash on Delivery (COD) remitted to e-commerce merchants?',
      a: 'Unlike traditional postal operators that hold funds for 7 to 10 days, Chowra processes automated T+1 (24-48 hours) bank transfers directly via RTGS/NEFT once the recipient acknowledges digital proof of delivery.',
      category: 'E-Commerce Logistics',
    },
    {
      q: 'What transit risk insurance and compensation coverage is provided?',
      a: 'All commercial shipments include basic carrier liability. In addition, shippers can opt for comprehensive all-risk transit cover up to ₹50 Lakhs for 0.5% of declared invoice value, backed by guaranteed claim settlement within 7 business days.',
      category: 'Insurance & Claims',
    },
    {
      q: 'How does the Doorstep Pickup process work?',
      a: 'Once you book online, our nearest field executive is assigned in under 18 minutes. The driver arrives at your premises with certified digital weighing scales, Bluetooth barcode label printer, and tamper-evident courier envelopes.',
      category: 'Doorstep Pickup',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Support & Knowledge Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Quick, transparent answers on parcel tracking, volumetric rate formulas, customs clearance, and courier pickup scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Search & FAQ Accordions */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Clean Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., volumetric weight, COD, pickup, insurance)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-slate-50/80 border-slate-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-amber-700 tracking-wide uppercase block">
                          {faq.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-display font-bold text-slate-900">
                          {faq.q}
                        </h3>
                      </div>
                      <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-amber-100 text-amber-900' : 'text-slate-500'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No matching questions found for "{searchQuery}". Call our 24/7 hotline at +91 90000 00000 for immediate assistance.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Clean Help Desk Card */}
          <div className="lg:col-span-4 bg-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-5 text-xs sticky top-24">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                24/7 Customer Care
              </span>
              <h4 className="text-lg font-display font-bold text-white mt-1">
                Need Personal Assistance?
              </h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Our logistics coordinators are on standby round-the-clock to resolve transit inquiries and schedule high-priority pickups.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="tel:18004192469"
                className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3 hover:border-amber-400/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Toll-Free Dispatch Desk</span>
                  <span className="font-data font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                    +91 90000 00000
                  </span>
                </div>
              </a>

              <a
                href="mailto:support@chowralogistics.example"
                className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3 hover:border-amber-400/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Electronic Support Manifest</span>
                  <span className="font-medium text-white group-hover:text-amber-400 transition-colors">
                    support@chowralogistics.example
                  </span>
                </div>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onScrollToSection('booking')}
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Book Doorstep Pickup Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onScrollToSection('calculator')}
                className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs transition-colors text-center cursor-pointer border border-slate-800"
              >
                Open Rate Calculator
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
