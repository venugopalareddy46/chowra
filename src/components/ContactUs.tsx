import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, 
  MessageSquare, User, Building, ArrowRight, Loader2, Sparkles 
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Corporate Logistics Contract');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const subjectOptions = [
    'Corporate Logistics Contract',
    'Express Courier & Doorstep Pickup',
    'International Air / Ocean Freight RFQ',
    'E-Commerce Fulfillment & COD Remittance',
    'Consignment Tracking Escalation',
    'Customs House Brokerage Consultation',
    'Other Inquiries',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate instant secure submission
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketId(`INQ-${Math.floor(10000 + Math.random() * 90000)}`);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('Corporate Logistics Contract');
    setCustomSubject('');
    setMessage('');
    setSubmitted(false);
    setTicketId('');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #008793, #00bf72)' }}
      />
      <div 
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00bf72, #a8eb12)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: '#00bf72' }}
            />
            <span 
              className="bg-gradient-to-r from-[#008793] via-[#00bf72] to-[#a8eb12] bg-clip-text text-transparent font-extrabold"
            >
              Direct Communication & Inquiries
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Contact Chowra Logistics
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Have questions about specialized freight forwarding, same-day metro couriers, or enterprise contract tariffs? Send us a message and our supply chain desk will respond promptly.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Columns: User-Friendly Contact Form */}
          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {submitted ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                    boxShadow: '0 0 30px rgba(0, 191, 114, 0.4)'
                  }}
                >
                  <CheckCircle2 className="w-9 h-9 text-slate-950 stroke-[2.5]" />
                </div>

                <div>
                  <span className="text-[11px] font-data font-bold text-[#a8eb12] uppercase tracking-wider block">
                    INQUIRY DISPATCHED · REF #{ticketId}
                  </span>
                  <h3 
                    className="text-2xl font-display font-extrabold mt-1"
                    style={{
                      background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Thank You, {name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                    Your inquiry has been routed to our Senior Logistics Coordination Team. A regional representative will contact you via email at <strong className="text-white">{email}</strong> within 30 minutes during active operating hours.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Inquiry Reference:</span>
                    <span className="font-data font-semibold text-white">{ticketId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Selected Subject:</span>
                    <span className="font-semibold text-[#a8eb12]">{subject}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Priority Response:</span>
                    <span className="text-emerald-400 font-medium">Under 30 Minutes</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2.5 px-6 rounded-xl text-xs font-bold text-slate-950 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-98"
                    style={{
                      background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#00bf72' }}>
                    Send an Inquiry
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
                    How Can We Assist Your Supply Chain?
                  </h3>
                  <p className="text-slate-400 mt-0.5">
                    Fill out the form below. All inquiries receive priority handling from verified logistics experts.
                  </p>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kulkarni"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh@company.in"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98200 44810"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 font-data focus:outline-none focus:border-[#00bf72] transition-colors"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Inquiry Subject <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00bf72] transition-colors"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Subject field if "Other Inquiries" is selected */}
                {subject === 'Other Inquiries' && (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Please Specify Subject <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="e.g. Partnership proposal or vendor inquiry"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors"
                    />
                  </div>
                )}

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-300">
                      Detailed Message / Consignment Specs <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {message.length} / 1000 characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your cargo dimensions, origin & destination pincodes, required delivery speed, or specific logistics challenges..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#00bf72]" />
                    <span>Protected by ISO 27001 Data Confidentiality</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto py-3 px-8 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                      boxShadow: '0 4px 25px -3px rgba(0, 191, 114, 0.45)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>Submit Inquiry</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right 5 Columns: Direct Contact Directory & Fast Channels */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Contact Cards */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: '#00bf72' }}>
                  Fast Response Channels
                </span>
                <h4 className="text-lg font-display font-bold text-white mt-1">
                  Connect With Dispatch
                </h4>
              </div>

              {/* Toll Free Phone */}
              <a
                href="tel:18004192469"
                className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-3.5 hover:border-[#00bf72]/50 transition-colors group"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
                >
                  <Phone className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Toll-Free National Hotline (24/7)</span>
                  <span className="font-data font-bold text-white text-sm group-hover:text-[#a8eb12] transition-colors">
                    +91 90000 00000
                  </span>
                  <div className="text-[11px] text-slate-500 font-data">+91 90000 00000 (Corporate Line)</div>
                </div>
              </a>

              {/* Electronic Email */}
              <a
                href="mailto:inquiries@chowralogistics.example"
                className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-3.5 hover:border-[#00bf72]/50 transition-colors group"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #00bf72, #a8eb12)' }}
                >
                  <Mail className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Commercial Inquiries & RFQs</span>
                  <span className="font-medium text-white group-hover:text-[#a8eb12] transition-colors">
                    inquiries@chowralogistics.example
                  </span>
                  <div className="text-[11px] text-slate-500">contact@chowralogistics.example</div>
                </div>
              </a>

              {/* Corporate HQ */}
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[#00bf72]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Corporate & Aviation Headquarters</span>
                  <span className="font-semibold text-white">
                    Chowra Logistics Tower, India Operations Hub
                  </span>
                  <div className="text-slate-400 mt-0.5">
                    Andheri East, Mumbai 400099, Maharashtra, India
                  </div>
                </div>
              </div>

              {/* Operating Hours Banner */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#a8eb12]" />
                  <span>Control Tower Desk:</span>
                </div>
                <span className="font-semibold text-white">24/7/365 Non-Stop Operations</span>
              </div>
            </div>

            {/* Strategic Regional Desks */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl space-y-2.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Regional Hub Coordination Desks
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">North India</span>
                  <span className="text-slate-400 text-[11px]">DEL-01 IGI Terminal</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">South India</span>
                  <span className="text-slate-400 text-[11px]">BLR-01 Devanahalli Hub</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">East India</span>
                  <span className="text-slate-400 text-[11px]">CCU-01 Rajarhat Gateway</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Middle East</span>
                  <span className="text-slate-400 text-[11px]">DXB-INT DWC Logistics City</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
