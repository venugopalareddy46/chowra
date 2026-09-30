import React, { useState } from 'react';
import { 
  Package, Search, Calendar, Clock, MapPin, Truck, ArrowRight, 
  CheckCircle2, AlertCircle, Copy, Check, Filter, Printer, 
  ExternalLink, User, Phone, Sparkles, RefreshCw, ChevronRight, ShieldCheck 
} from 'lucide-react';
import { PickupBookingData } from '../types/logistics';

interface BookingHistoryProps {
  bookings: PickupBookingData[];
  onTrackBooking: (trackingOrBookingId: string) => void;
  onOpenNewBooking: () => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  bookings,
  onTrackBooking,
  onOpenNewBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDocket, setSelectedDocket] = useState<PickupBookingData | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: PickupBookingData['status']) => {
    switch (status) {
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00bf72]/20 text-[#a8eb12] border border-[#00bf72]/40 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00bf72] animate-pulse" />
            <span>Driver Dispatched</span>
          </span>
        );
      case 'ASSIGNED':
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Pickup Confirmed</span>
          </span>
        );
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>In Linehaul Transit</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delivered & e-POD Signed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">
            <span>{status}</span>
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      b.bookingId.toLowerCase().includes(q) ||
      (b.trackingId && b.trackingId.toLowerCase().includes(q)) ||
      b.recipientCity.toLowerCase().includes(q) ||
      b.pickupCity.toLowerCase().includes(q) ||
      b.senderName.toLowerCase().includes(q) ||
      b.serviceSpeed.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') {
      return b.status === 'DISPATCHED' || b.status === 'CONFIRMED' || b.status === 'ASSIGNED' || b.status === 'PICKED_UP' || b.status === 'IN_TRANSIT';
    }
    if (statusFilter === 'COMPLETED') {
      return b.status === 'DELIVERED';
    }
    return true;
  });

  const activeCount = bookings.filter(
    (b) => b.status !== 'DELIVERED'
  ).length;

  const completedCount = bookings.filter(
    (b) => b.status === 'DELIVERED'
  ).length;

  return (
    <section id="history" className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
              <span 
                className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm" 
                style={{ backgroundColor: '#00bf72', boxShadow: '0 0 10px #00bf72' }}
              />
              <span 
                className="bg-gradient-to-r from-[#008793] via-[#00bf72] to-[#a8eb12] bg-clip-text text-transparent font-extrabold"
              >
                Live Consignment Registry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
              Booking History & Dispatch Status
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Monitor real-time fulfillment of doorstep pickups, review electronic waybill manifests, and track assigned courier linehauls using your unique Tracking or Booking ID.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenNewBooking}
              className="py-2.5 px-5 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.01] active:scale-98"
              style={{
                background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                boxShadow: '0 4px 20px -2px rgba(0, 191, 114, 0.4)'
              }}
            >
              <Package className="w-4 h-4 text-slate-950" />
              <span>Book New Courier Pickup</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`py-2 px-3.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Consignments ({bookings.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`py-2 px-3.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'ACTIVE'
                  ? 'text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={statusFilter === 'ACTIVE' ? {
                background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
              } : {}}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'ACTIVE' ? 'bg-slate-950' : 'bg-[#00bf72]'} animate-pulse`} />
              <span>Active / En Route ({activeCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('COMPLETED')}
              className={`py-2 px-3.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'COMPLETED'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Delivered ({completedCount})
            </button>
          </div>

          {/* Search Input with Unique ID Lookup */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Tracking ID (e.g. CHW-8942) or Booking ID..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Bookings Grid */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredBookings.map((b) => {
              const trackingCode = b.trackingId || b.bookingId;
              const isRecent = b.createdAt === 'Just now';

              return (
                <div
                  key={b.bookingId}
                  className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all duration-200 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 shadow-xl ${
                    isRecent ? 'ring-2 ring-[#00bf72]/40 border-[#00bf72]/60' : 'border-slate-800'
                  }`}
                >
                  {/* Subtle top indicator if just booked */}
                  {isRecent && (
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: 'linear-gradient(90deg, #008793, #00bf72, #a8eb12)' }}
                    />
                  )}

                  <div className="space-y-4">
                    {/* Header Row: IDs & Status */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-data">
                            Booking ID:
                          </span>
                          <span className="font-data font-bold text-white text-xs sm:text-sm">
                            {b.bookingId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(b.bookingId)}
                            className="text-slate-500 hover:text-[#00bf72] transition-colors cursor-pointer"
                            title="Copy Booking ID"
                          >
                            {copiedId === b.bookingId ? (
                              <Check className="w-3.5 h-3.5 text-[#00bf72]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {isRecent && (
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-extrabold text-slate-950 uppercase tracking-wider animate-pulse"
                              style={{ background: 'linear-gradient(135deg, #00bf72, #a8eb12)' }}
                            >
                              NEW
                            </span>
                          )}
                        </div>

                        {b.trackingId && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-[#00bf72] uppercase tracking-wider font-data">
                              Tracking AWB:
                            </span>
                            <span 
                              className="font-data font-extrabold text-xs sm:text-sm tracking-wide"
                              style={{
                                background: 'linear-gradient(90deg, #00bf72 0%, #a8eb12 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {b.trackingId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(b.trackingId!)}
                              className="text-slate-500 hover:text-[#a8eb12] transition-colors cursor-pointer"
                              title="Copy Tracking AWB"
                            >
                              {copiedId === b.trackingId ? (
                                <Check className="w-3.5 h-3.5 text-[#a8eb12]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div>{getStatusBadge(b.status)}</div>
                    </div>

                    {/* Route Corridor */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                          Origin / Pickup
                        </span>
                        <span className="font-bold text-white block">
                          {b.pickupCity} ({b.pickupPincode})
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[170px] block">
                          {b.pickupAddress}
                        </span>
                      </div>

                      <div className="flex flex-col items-center px-2">
                        <Truck className="w-4 h-4 text-[#00bf72]" />
                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#008793] to-[#00bf72] my-1" />
                        <span className="text-[10px] text-slate-500 font-data">{b.serviceSpeed.split(' ')[0]}</span>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                          Destination
                        </span>
                        <span className="font-bold text-white block">
                          {b.recipientCity} ({b.recipientPincode})
                        </span>
                        <span className="text-[11px] text-slate-400 block font-data">
                          Direct Linehaul
                        </span>
                      </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Consignment</span>
                        <span className="font-semibold text-white font-data">
                          {b.packageCount} Box(es) · {b.estimatedWeightKg} kg
                        </span>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{b.packageType}</div>
                      </div>

                      <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Pickup Window</span>
                        <span className="font-semibold text-white truncate block">
                          {b.pickupDate}
                        </span>
                        <div className="text-[10px] text-[#a8eb12] truncate mt-0.5">{b.pickupTimeSlot}</div>
                      </div>

                      <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Assigned Driver</span>
                        {b.driverName ? (
                          <>
                            <span className="font-semibold text-white truncate block text-[11px]">
                              {b.driverName.split('(')[0]}
                            </span>
                            <span className="text-[10px] text-slate-400 font-data block">
                              {b.driverPhone}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Allocating nearest van</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-data">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Registered: {b.createdAt || 'Standard Dispatch'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDocket(b)}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-400" />
                        <span>Docket</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onTrackBooking(trackingCode)}
                        className="py-1.5 px-3.5 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-98 shadow-md"
                        style={{
                          background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                        }}
                      >
                        <span>Live Telemetry</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-slate-900 border border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                No Bookings Found Matching "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Check that you entered the exact Booking ID (e.g. BK-CHW-XXXXX) or Tracking AWB, or clear your active filters.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Reset Search Filters
              </button>
              <button
                type="button"
                onClick={onOpenNewBooking}
                className="py-2 px-4 rounded-xl text-xs font-bold text-slate-950 cursor-pointer transition-all"
                style={{
                  background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                }}
              >
                Schedule New Booking
              </button>
            </div>
          </div>
        )}

        {/* Informational SLA Footer Note */}
        <div className="mt-10 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00bf72]" />
            <span>All consignments backed by 256-bit encrypted electronic proof of delivery and continuous cold-chain/GPS telemetry.</span>
          </div>
          <div className="text-[11px] font-data text-slate-500">
            Automated Audit Refresh · Every 30 seconds
          </div>
        </div>

      </div>

      {/* Modal: Waybill Docket View */}
      {selectedDocket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-white relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#00bf72] uppercase tracking-wider block">
                  Electronic Waybill Manifest
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {selectedDocket.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocket(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Code:</span>
                  <span className="font-data font-bold text-[#a8eb12]">{selectedDocket.trackingId || selectedDocket.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Class:</span>
                  <span className="text-white font-medium">{selectedDocket.serviceSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consignment:</span>
                  <span className="text-white font-data">{selectedDocket.packageCount} Pcs · {selectedDocket.estimatedWeightKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Facility:</span>
                  <span className="text-white">{selectedDocket.pickupCity} ({selectedDocket.pickupPincode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-white">{selectedDocket.recipientCity} ({selectedDocket.recipientPincode})</span>
                </div>
              </div>

              {/* Barcode Graphic Simulation */}
              <div className="pt-2 text-center">
                <div className="h-12 bg-white rounded p-1.5 flex items-center justify-around space-x-1 max-w-xs mx-auto">
                  {[4,2,5,1,3,6,2,4,7,1,3,5,2,4,1,3,6,2,3,1,4].map((w, i) => (
                    <div key={i} className="bg-slate-950 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <span className="font-data text-[10px] text-slate-400 mt-2 block tracking-wider">
                  CRYPTOGRAPHIC BARCODE · SHA-256 HMAC VERIFIED
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-[#a8eb12]" />
                <span>Print Official Docket</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const code = selectedDocket.trackingId || selectedDocket.bookingId;
                  setSelectedDocket(null);
                  onTrackBooking(code);
                }}
                className="flex-1 py-2.5 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{
                  background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                }}
              >
                <span>Track Live Status</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
