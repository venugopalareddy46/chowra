import React, { useState } from 'react';
import { Building2, Shield, CheckCircle2, ArrowRight, FileSpreadsheet, Headset, Users, Send } from 'lucide-react';
import { corporateLogisticsPerks } from '../data/logisticsData';

export const CorporateSolutions: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('500 - 2,500 Consignments/month');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !phone) return;
    setSubmitted(true);
  };

  return (
    <section id="enterprise" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Enterprise B2B Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Corporate Supply Chain & Contract Logistics Solutions
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Tailored logistics frameworks for manufacturing conglomerates, pharmaceutical exporters, automotive OEMs, and national retail chains requiring guaranteed fleet capacity.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Strategic Enterprise Inclusions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {corporateLogisticsPerks.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display font-bold text-white text-sm">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>

            {/* SLA Governance Banner */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Contractual Service Level Agreements (SLAs)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">On-Time Guarantee</span>
                  <span className="font-data font-bold text-white text-base">99.5% Clause</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Loss / Damage Cover</span>
                  <span className="font-data font-bold text-white text-base">100% Full Value</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Dedicated Account Head</span>
                  <span className="font-bold text-white text-base">Single Point Lead</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Corporate Proposal Request Form */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Corporate Inquiry Received
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{contactName}</strong>. Our Senior Supply Chain Director for {companyName} will contact you within 2 business hours with customized B2B tariff sheets and credit assessment papers.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-slate-800 text-xs text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                    Enterprise Request
                  </span>
                  <h3 className="text-lg font-display font-bold text-white mt-0.5">
                    Request Corporate Tariff Proposal
                  </h3>
                  <p className="text-slate-400 mt-0.5">
                    Unlock contracted enterprise rates, 45-day credit lines, and dedicated dispatch fleets.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Company / Organization Legal Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Precision Technologies Pvt Ltd"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Key Executive Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. S. Venkataraman"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Corporate Work Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. supplychain@acme.in"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Direct Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98200 44810"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-data"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Monthly Shipping Volume</label>
                    <select
                      value={monthlyVolume}
                      onChange={(e) => setMonthlyVolume(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="100 - 500 Consignments/month">100 - 500 Consignments/month</option>
                      <option value="500 - 2,500 Consignments/month">500 - 2,500 Consignments/month</option>
                      <option value="2,500 - 10,000 Consignments/month">2,500 - 10,000 Consignments/month</option>
                      <option value="10,000+ Full Enterprise Volume">10,000+ Full Enterprise Volume</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Custom Corporate Proposal</span>
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  Protected by NDA standards. Data encrypted under ISO 27001 protocols.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
