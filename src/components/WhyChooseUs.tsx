import React from 'react';
import { ShieldCheck, Clock, Navigation, CheckCircle2, TrendingUp, Sparkles, Building, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      metric: '99.4%',
      label: 'On-Time SLA Delivery',
      desc: 'Consistently validated across 4.8 million monthly consignments via automated flight & highway relay management.',
      sub: 'Audited Monthly by KPMG Compliance',
    },
    {
      metric: '24/7/365',
      label: 'Active Control Tower',
      desc: 'Dedicated satellite telemetry desk constantly tracking road blockades, weather delays, and dynamic rerouting.',
      sub: 'Zero Midnight Blackouts',
    },
    {
      metric: '₹50 Lakhs',
      label: 'Transit Risk Coverage',
      desc: 'All-risk cargo insurance backing every shipment with automated claim settlement within 7 business days.',
      sub: 'Comprehensive Carrier Liability',
    },
    {
      metric: '100%',
      label: 'Paperless Digital POD',
      desc: 'Instant recipient e-signature, geocoded camera delivery snapshots, and immediate API notification to consignor.',
      sub: 'Tamper-Evident Chain of Custody',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Operational Rigor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Why Enterprise Leaders Partner with Chowra Logistics
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            We don't just move freight—we engineer resilience into corporate supply chains with measurable precision, transparent accounting, and zero excuses.
          </p>
        </div>

        {/* 4 Quantitative Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-300 hover:bg-slate-50/90 transition-all group"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 font-data group-hover:text-amber-600 transition-colors">
                  {p.metric}
                </div>
                <div className="text-sm font-display font-bold text-slate-900 mt-2 mb-2">
                  {p.label}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-semibold text-amber-700">
                {p.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Trust Strip */}
        <div className="mt-12 p-6 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">IATA Authorized Agent</span>
              <span className="text-slate-500">Global air cargo clearance certification</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">ISO 9001:2015 & GDP Certified</span>
              <span className="text-slate-500">Quality management & cold chain compliance</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">AEO-Tier 2 Operator</span>
              <span className="text-slate-500">Authorized Economic Operator for rapid customs</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
