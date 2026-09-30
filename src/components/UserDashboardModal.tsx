/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * User Dashboard: Profile, Consignment Registry, Booking History, Invoices & Telemetry
 * Core Architecture & System Engineering: Chowra Engineering Team
 */

import React, { useState } from 'react';
import { 
  X, User, Package, MapPin, Clock, Truck, ShieldCheck, 
  CreditCard, FileText, CheckCircle2, ArrowRight, ExternalLink, 
  Copy, Check, Building, Phone, Mail, Sparkles, Navigation, 
  Download, RefreshCw, Calendar, ChevronRight, LogOut, Plane,
  Globe, Database
} from 'lucide-react';
import { UserAccount } from '../types/auth';
import { PickupBookingData } from '../types/logistics';
import { sampleShipments } from '../data/mockShipments';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogout: () => void;
  bookings: PickupBookingData[];
  onTrackAwb: (awb: string) => void;
  onOpenBookingModal: () => void;
  onOpenHealthModal?: (tab?: 'telemetry' | 'custom-domain' | 'tech-stack') => void;
  onOpenDocsModal?: () => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  bookings,
  onTrackAwb,
  onOpenBookingModal,
  onOpenHealthModal,
  onOpenDocsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'consignments' | 'pickups' | 'addresses' | 'billing' | 'system'>('consignments');
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2000);
  };

  const handleDownloadInvoice = (id: string) => {
    setDownloadSuccess(id);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleTrackShipment = (awb: string) => {
    onTrackAwb(awb);
    onClose();
  };

  // Pre-configured shipments linked to this user
  const userShipments = Object.values(sampleShipments);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Stripe */}
        <div 
          className="h-1.5 w-full shrink-0" 
          style={{ background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)' }} 
        />

        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          
          {/* User Profile Header Block */}
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg text-slate-950 shadow-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #008793, #00bf72, #a8eb12)' }}
            >
              {user.avatarInitials}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">
                  {user.name}
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#00bf72]/20 text-[#a8eb12] border border-[#00bf72]/40 flex items-center gap-1 font-data">
                  <ShieldCheck className="w-3 h-3 text-[#00bf72]" />
                  <span>{user.role}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-data">
                  Member since {user.memberSince}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span className="text-slate-300 font-medium">{user.company}</span>
                <span>·</span>
                <span className="font-data">{user.email}</span>
                <span>·</span>
                <span className="font-data">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => { onOpenBookingModal(); onClose(); }}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Book New Pickup</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
              title="Sign Out of Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              aria-label="Close dashboard modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dashboard Stat Highlights */}
        <div className="p-4 sm:px-6 bg-slate-900/60 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Active Dispatches</span>
            <div className="text-lg font-data font-bold text-[#a8eb12] mt-0.5">
              {userShipments.filter(s => s.statusCode !== 'DELIVERED').length} Shipments
            </div>
            <span className="text-[10px] text-slate-500 font-data">Live GPS Telemetry</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Doorstep Bookings</span>
            <div className="text-lg font-data font-bold text-amber-300 mt-0.5">
              {bookings.length} Registered
            </div>
            <span className="text-[10px] text-slate-500 font-data">Dispatched & Scheduled</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Credit Line Balance</span>
            <div className="text-lg font-data font-bold text-white mt-0.5">
              ₹{user.creditBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 font-data">GST Account 27AAACC4912</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Delivery SLA Rating</span>
            <div className="text-lg font-data font-bold text-emerald-400 mt-0.5">
              99.8% On-Time
            </div>
            <span className="text-[10px] text-slate-500 font-data">SOC-2 & ISO Audited</span>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="px-6 pt-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('consignments')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'consignments' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Consignment History ({userShipments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pickups')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pickups' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Doorstep Pickups ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'addresses' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Hubs & Addresses</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'billing' 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tax Invoices & GST</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'system' 
                ? 'border-[#a8eb12] text-[#a8eb12]' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a8eb12]" />
            <span>Architecture Dossier</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: Consignment History */}
          {activeTab === 'consignments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Displaying all corporate consignments tracked under account <strong className="text-white">{user.name}</strong>:</span>
                <span className="font-data text-amber-400">Click "Track on SVG Map" to view live corridor arc</span>
              </div>

              {userShipments.map((s) => {
                const isDelivered = s.statusCode === 'DELIVERED';
                return (
                  <div
                    key={s.awbNumber}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-data font-bold text-base text-amber-400">
                          {s.awbNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-data">Ref: {s.referenceNumber}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-data ${
                          isDelivered 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {s.statusCode.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {s.serviceType}
                        </span>
                      </div>

                      {/* Route strip */}
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="font-semibold text-white">{s.origin.city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold text-white">{s.destination.city}</span>
                        <span className="text-slate-500 font-data">
                          · {s.weightKg} kg · {s.pieces} pcs · Carrier: {s.vehicleOrFlightNo || 'Chowra Express'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Status: <span className="text-slate-200">{s.currentStatus}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCopy(s.awbNumber)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-colors cursor-pointer flex items-center gap-1 font-data"
                        title="Copy AWB number"
                      >
                        {copiedAwb === s.awbNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAwb === s.awbNumber ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTrackShipment(s.awbNumber)}
                        className="py-2 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Track on SVG Map</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Doorstep Pickups */}
          {activeTab === 'pickups' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Active doorstep collection schedules linked to your profile:</span>
                <button
                  type="button"
                  onClick={() => { onOpenBookingModal(); onClose(); }}
                  className="text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  + Schedule Another Pickup
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                  <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 font-medium">No active pickups scheduled.</p>
                  <button
                    type="button"
                    onClick={() => { onOpenBookingModal(); onClose(); }}
                    className="mt-3 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Schedule Pickup Now
                  </button>
                </div>
              ) : (
                bookings.map((bk) => (
                  <div
                    key={bk.bookingId}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-data font-bold text-amber-400 text-sm">
                          {bk.bookingId}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-[#a8eb12] font-data">
                          {bk.status}
                        </span>
                        <span className="text-xs text-slate-400">{bk.serviceSpeed}</span>
                      </div>
                      <div className="text-xs text-slate-200">
                        Pickup: <strong>{bk.pickupCity}</strong> ({bk.pickupAddress}) → Destination: <strong>{bk.recipientCity}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Slot: {bk.pickupTimeSlot}</span>
                        <span>·</span>
                        <span>Assigned Driver: <strong className="text-slate-200">{bk.driverName || 'Chowra Courier Executive'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {bk.trackingId && (
                        <button
                          type="button"
                          onClick={() => handleTrackShipment(bk.trackingId!)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Track #{bk.trackingId}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Saved Address Book */}
          {activeTab === 'addresses' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2">
                Frequently dispatched commercial hubs, manufacturing estates, and client tech centers:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-display">Mumbai Central Warehouse & SEZ</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#a8eb12] font-data">DEFAULT</span>
                  </div>
                  <div className="text-xs text-slate-300">Plot 42, Marol Industrial Area, Andheri East</div>
                  <div className="text-[11px] text-slate-400 font-data">Mumbai, Maharashtra - 400059</div>
                  <div className="text-[11px] text-slate-400">Contact: Chowra Support Team (+91 98490 55120)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 font-display">Bengaluru Electronic City SEZ</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-data">SECONDARY</span>
                  </div>
                  <div className="text-xs text-slate-300">Tower C, Electronic City Phase 1, Hosur Road</div>
                  <div className="text-[11px] text-slate-400 font-data">Bengaluru, Karnataka - 560100</div>
                  <div className="text-[11px] text-slate-400">Contact: Dispatch Manager (+91 98450 11920)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 font-display">Delhi NCR Air Cargo Logistics Depot</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-data">REGIONAL</span>
                  </div>
                  <div className="text-xs text-slate-300">Gate 4, Cargo Complex, Indira Gandhi International Airport</div>
                  <div className="text-[11px] text-slate-400 font-data">New Delhi, Delhi - 110037</div>
                  <div className="text-[11px] text-slate-400">Contact: Air Hub Desk (+91 98110 33410)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 font-display">Hyderabad HITEC City Gateway</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-data">BRANCH</span>
                  </div>
                  <div className="text-xs text-slate-300">Financial District, Gachibowli Logistics Park</div>
                  <div className="text-[11px] text-slate-400 font-data">Hyderabad, Telangana - 500081</div>
                  <div className="text-[11px] text-slate-400">Contact: Regional Lead (+91 98480 22104)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Invoices & Statements */}
          {activeTab === 'billing' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>GST Verified Tax Invoices & Monthly Freight Statements:</span>
                <span className="font-data text-emerald-400">GSTIN: {user.gstNumber || '27AAACC4912K1Z9'}</span>
              </div>

              {[
                { id: 'INV-2026-8819', date: '28 Sep 2026', desc: 'Chowra Air Express Linehaul (Mumbai - Delhi)', base: 880, gst: 158.4, total: 1038.4, status: 'PAID' },
                { id: 'INV-2026-7412', date: '25 Sep 2026', desc: 'Cold-Chain Pharma International (BLR - FRA)', base: 1450, gst: 261, total: 1711, status: 'CREDIT_ACCOUNT' },
                { id: 'INV-2026-6109', date: '21 Sep 2026', desc: 'Heavy Linehaul Surface Cargo (Pune - Chennai)', base: 4200, gst: 756, total: 4956, status: 'PAID' },
              ].map((inv) => (
                <div 
                  key={inv.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-data font-bold text-white text-sm">{inv.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-[#a8eb12] font-semibold font-data">
                        {inv.status}
                      </span>
                      <span className="text-slate-400 font-data">{inv.date}</span>
                    </div>
                    <div className="text-slate-300">{inv.desc}</div>
                    <div className="text-[11px] text-slate-400 font-data">
                      Base: ₹{inv.base.toLocaleString()} + 18% GST (₹{inv.gst.toFixed(1)}) = <strong className="text-white">₹{inv.total.toFixed(1)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(inv.id)}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-data text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {downloadSuccess === inv.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">PDF Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download Tax Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Architecture & Developer Dossier */}
          {activeTab === 'system' && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-950"
                  style={{ background: 'linear-gradient(135deg, #008793, #00bf72, #a8eb12)' }}
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-white text-base">
                    Chowra Multimodal Enterprise Architecture Dossier
                  </h4>
                  <p className="text-xs text-slate-400">
                    Proprietary Real-Time Telemetry & Geospatial Distance Engine
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Principal System Architect & Engineering Lead:</span>
                  <span className="font-bold text-[#a8eb12] font-data">Chowra Engineering Team</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">System Build Signature:</span>
                  <span className="font-mono text-slate-300 text-[11px]">CHW-VGRE-2026-ENTERPRISE-PROD</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Geospatial Distance Algorithm:</span>
                  <span className="text-slate-300 font-data">Haversine Great-Circle Geodesic with Bézier Tangents</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Container & CI/CD Pipeline:</span>
                  <span className="text-slate-300 font-data">Docker Multi-Stage, Kubernetes (HPA), GitHub Actions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security & Compliance:</span>
                  <span className="text-emerald-400 font-semibold font-data">ISO 27001, SOC 2 Type II, TLS 1.3 Certified</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-data">
                This enterprise dispatch system is engineered with sub-millisecond route projection, server-authoritative GPS linehaul syncing, and browser push notification telemetry designed by Chowra Engineering Team for high-concurrency international and domestic freight operations.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenHealthModal?.('custom-domain'); }}
                  className="py-2 px-3.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                  title="Configure custom domain (DNS, CNAME, SSL)"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Connect Custom Domain (DNS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); onOpenHealthModal?.('tech-stack'); }}
                  className="py-2 px-3.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                  title="View complete tech stack and SQLite database"
                >
                  <Database className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tech Stack & SQLite Engine</span>
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); onOpenHealthModal?.('telemetry'); }}
                  className="py-2 px-3.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[#a8eb12] border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00bf72] animate-pulse" />
                  <span>Inspect System Heartbeat (/health)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); onOpenDocsModal?.(); }}
                  className="py-2 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explore REST API Documentation (/docs)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 font-data">
          <span>Active Session ID: <strong className="text-white">SES-{user.id.toUpperCase()}</strong></span>
          <span className="text-slate-500">Chowra Logistics and Couriers Limited © 2026</span>
        </div>

      </div>
    </div>
  );
};
