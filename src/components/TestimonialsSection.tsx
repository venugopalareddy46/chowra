import React from 'react';
import { Quote, ArrowUpRight, CheckCircle2, Building2 } from 'lucide-react';
import { clientCaseStudies } from '../data/logisticsData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Proven Enterprise Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Case Studies in Supply Chain Transformation
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Real outcomes delivered for industrial leaders, global pharmaceutical firms, and high-velocity digital commerce brands.
          </p>
        </div>

        {/* 3 Detailed Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {clientCaseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {study.industry}
                  </span>
                  <Quote className="w-5 h-5 text-amber-400/60" />
                </div>

                <h3 className="font-display font-bold text-slate-900 text-lg mb-3">
                  {study.clientName}
                </h3>

                {/* Challenge & Solution */}
                <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <div>
                    <strong className="text-slate-800">Challenge: </strong>
                    <span>{study.challenge}</span>
                  </div>
                  <div>
                    <strong className="text-slate-800">Deployment: </strong>
                    <span>{study.solution}</span>
                  </div>
                </div>

                {/* Result Highlight Box */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl mb-6">
                  <div className="text-base sm:text-lg font-display font-extrabold text-amber-900 font-data">
                    {study.resultMetric}
                  </div>
                  <div className="text-xs text-slate-700 mt-0.5">
                    {study.resultDetail}
                  </div>
                </div>
              </div>

              {/* Author attribution */}
              <div className="pt-4 border-t border-slate-100 text-xs">
                <div className="font-bold text-slate-900">{study.author}</div>
                <div className="text-slate-500 text-[11px]">{study.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Trust Brand Ticker */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-slate-500 font-medium whitespace-nowrap">
            Trusted by 450+ Enterprise Shippers:
          </span>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-display font-bold text-slate-400 text-sm">
            <span className="hover:text-slate-800 transition-colors">TATA MOTORS</span>
            <span className="hover:text-slate-800 transition-colors">DR. REDDY'S</span>
            <span className="hover:text-slate-800 transition-colors">MAHINDRA LOGISTICS</span>
            <span className="hover:text-slate-800 transition-colors">SCHNEIDER ELECTRIC</span>
            <span className="hover:text-slate-800 transition-colors">BOSCH INDIA</span>
          </div>
        </div>

      </div>
    </section>
  );
};
