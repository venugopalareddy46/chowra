import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, Truck, Calendar, Clock, MapPin, Phone, User, 
  ArrowRight, ShieldCheck, Printer, CheckCircle2, Box, Sparkles, 
  Loader2, Check, RefreshCw, Calculator, Receipt, Zap, Tag, Info
} from 'lucide-react';
import { PickupBookingData } from '../types/logistics';
import { PlacesAutocompleteInput } from './PlacesAutocompleteInput';
import { sqliteDb } from '../services/sqliteDb';
import courierDeliveryImg from '../assets/images/courier_delivery_1790661676476.jpg';

interface BookingSectionProps {
  prefillData?: {
    origin?: string;
    destination?: string;
    weight?: number;
    serviceTier?: string;
  };
  onBookingComplete?: (booking: PickupBookingData) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  prefillData,
  onBookingComplete,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [senderName, setSenderName] = useState('Rahul Deshmukh');
  const [senderPhone, setSenderPhone] = useState('+91 98200 44810');
  const [senderEmail, setSenderEmail] = useState('r.deshmukh@precisiontools.in');
  const [pickupAddress, setPickupAddress] = useState('Plot 42, Marol Industrial Area, Andheri East');
  const [pickupPincode, setPickupPincode] = useState(prefillData?.origin || '400059');
  const [pickupCity, setPickupCity] = useState('Mumbai');

  const [recipientCity, setRecipientCity] = useState(prefillData?.destination || 'New Delhi');
  const [recipientPincode, setRecipientPincode] = useState('110037');
  const [packageType, setPackageType] = useState('Commercial Parcel / Spare Parts');
  const [weightKg, setWeightKg] = useState<number>(prefillData?.weight || 3.5);
  const [packageCount, setPackageCount] = useState<number>(1);
  const [serviceSpeed, setServiceSpeed] = useState<string>(prefillData?.serviceTier || 'Chowra Air Express Next-Day');

  const [pickupDate, setPickupDate] = useState('Today (Within 2 Hours)');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Evening Slot (16:00 - 19:00)');
  const [specialInstructions, setSpecialInstructions] = useState('Ring security gate #2 for warehouse entrance.');

  // Loading & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState<PickupBookingData | null>(null);

  // Sync prefill
  useEffect(() => {
    if (prefillData?.origin) setPickupPincode(prefillData.origin);
    if (prefillData?.destination) setRecipientCity(prefillData.destination);
    if (prefillData?.weight) setWeightKg(prefillData.weight);
    if (prefillData?.serviceTier) setServiceSpeed(prefillData.serviceTier);
  }, [prefillData]);

  // Dynamic Cost Calculation Engine (Real-Time Pricing)
  const calculatePricing = () => {
    let ratePerKg = 180;
    let etaDesc = 'Tomorrow by 12:00 PM';
    let speedTag = 'Next-Day Air Express';

    if (serviceSpeed.includes('Same-Day')) {
      ratePerKg = 260;
      etaDesc = 'Today under 4 Hours';
      speedTag = 'Hyper-Express Metro';
    } else if (serviceSpeed.includes('Surface')) {
      ratePerKg = 48;
      etaDesc = '2-3 Business Days';
      speedTag = 'Economy Surface Linehaul';
    } else if (serviceSpeed.includes('Global')) {
      ratePerKg = 450;
      etaDesc = '48-72 Hours Worldwide';
      speedTag = 'Global Air Priority';
    }

    const safeWeight = Math.max(0.5, Number(weightKg) || 1);
    const safeCount = Math.max(1, Number(packageCount) || 1);
    const baseFreight = Math.round(safeWeight * ratePerKg);
    const fuelSurcharge = Math.round(baseFreight * 0.08); // 8% fuel & security index
    const doorstepPickupFeeOriginal = 150;
    const doorstepPickupFeeCharged = 0; // Complimentary 100% Free on Platform
    const subtotal = baseFreight + fuelSurcharge;
    const gstAmount = Math.round(subtotal * 0.18); // 18% statutory GST
    const totalCost = subtotal + gstAmount;

    return {
      ratePerKg,
      safeWeight,
      safeCount,
      baseFreight,
      fuelSurcharge,
      doorstepPickupFeeOriginal,
      doorstepPickupFeeCharged,
      subtotal,
      gstAmount,
      totalCost,
      etaDesc,
      speedTag,
    };
  };

  const pricing = calculatePricing();

  const stages = [
    { 
      title: 'Validating pickup address & postal serviceability', 
      detail: `Verifying route coordinates and pin code ${pickupPincode} in Western Hub Zone`,
      statusText: 'Address Verified' 
    },
    { 
      title: 'Connecting with Regional Dispatch Control Tower', 
      detail: 'Locating active linehaul fleet and optimizing courier route telemetry',
      statusText: 'Control Tower Linked' 
    },
    { 
      title: 'Allocating nearest express van & field executive', 
      detail: 'Express Van #MH-02-CW-9921 reserved for direct doorstep dispatch',
      statusText: 'Driver Dispatched' 
    },
    { 
      title: 'Generating encrypted electronic waybill manifest', 
      detail: '256-bit cryptographic barcode generated for tamper-evident chain of custody',
      statusText: 'Waybill Ready' 
    },
  ];

  const triggerSubmission = () => {
    setIsSubmitting(true);
    setProcessingProgress(12);
    setProcessingStage(0);

    // Scroll smoothly to top of booking section so loading state is in full view
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedBooking: PickupBookingData = {
      bookingId: `BK-CHW-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingId: `CHW-${randomSuffix}-EXP`,
      senderName,
      senderPhone,
      senderEmail,
      pickupAddress,
      pickupPincode,
      pickupCity,
      recipientCity,
      recipientPincode,
      packageType,
      estimatedWeightKg: weightKg,
      packageCount,
      pickupDate,
      pickupTimeSlot,
      specialInstructions,
      serviceSpeed,
      status: 'DISPATCHED',
      driverName: 'Vikramjit Singh (Van #MH-02-CW-9921)',
      driverPhone: '+91 98199 12040',
      createdAt: 'Just now',
      estimatedCost: pricing.totalCost,
    };

    // Stage 1
    const timer1 = setTimeout(() => {
      setProcessingStage(1);
      setProcessingProgress(38);
    }, 600);

    // Stage 2
    const timer2 = setTimeout(() => {
      setProcessingStage(2);
      setProcessingProgress(70);
    }, 1300);

    // Stage 3
    const timer3 = setTimeout(() => {
      setProcessingStage(3);
      setProcessingProgress(95);
    }, 1950);

    // Complete & Transition to Success View
    const timer4 = setTimeout(() => {
      setProcessingProgress(100);
      setIsSubmitting(false);
      setConfirmedBooking(generatedBooking);
      // Persist in relational SQLite database
      sqliteDb.insertBooking(generatedBooking).catch((err) => {
        console.error('Failed to persist booking in SQLite database:', err);
      });
      onBookingComplete?.(generatedBooking);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmission();
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setIsSubmitting(false);
    setProcessingProgress(0);
    setProcessingStage(0);
    setActiveStep(1);
  };

  return (
    <section id="booking" className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span 
              className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm" 
              style={{ 
                backgroundColor: '#00bf72',
                boxShadow: '0 0 10px #00bf72'
              }}
            />
            <span 
              className="bg-gradient-to-r from-[#008793] via-[#00bf72] to-[#a8eb12] bg-clip-text text-transparent font-extrabold tracking-wide"
            >
              Instant Doorstep Collection & Route Dispatch
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            Book Courier & Doorstep Pickup
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Schedule on-demand courier collection from your office, factory, or residence across Extensive Pan-India Coverage. Our driver arrives with digital scale, thermal barcode printer, and tamper-proof packaging.
          </p>
        </div>

        {/* 1. Interactive Loading / Processing UI State */}
        {isSubmitting ? (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-8 sm:p-14 shadow-2xl max-w-2xl mx-auto text-center relative overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient Background Glow with the brand colors */}
            <div 
              className="absolute -top-28 -left-28 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #008793, #00bf72)' }}
            />
            <div 
              className="absolute -bottom-28 -right-28 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #00bf72, #a8eb12)' }}
            />

            {/* Circular Multi-Ring Loading Spinner with Colors #008793 → #00bf72 → #a8eb12 */}
            <div className="relative w-32 h-32 mx-auto mb-7 flex items-center justify-center">
              {/* Outer Rotating Conic Ring */}
              <div 
                className="absolute inset-0 rounded-full animate-spin-gradient p-1.5 shadow-xl"
                style={{
                  background: 'conic-gradient(from 0deg, #008793 0%, #00bf72 50%, #a8eb12 100%, #008793 100%)'
                }}
              >
                <div className="w-full h-full bg-slate-950 rounded-full" />
              </div>

              {/* Pulsing Radial Glow Aura */}
              <div 
                className="absolute inset-2 rounded-full animate-pulse opacity-50 blur-xs"
                style={{
                  background: 'radial-gradient(circle, #00bf72 0%, #a8eb12 100%)'
                }}
              />

              {/* Center Vehicle Emblem with Gradient */}
              <div 
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                  boxShadow: '0 0 30px rgba(0, 191, 114, 0.55)'
                }}
              >
                <Truck className="w-8 h-8 text-slate-950 animate-bounce" />
              </div>
            </div>

            {/* Dynamic Processing Status Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-[#00bf72]/40 text-xs font-semibold text-[#a8eb12] mb-3 font-data">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00bf72]" />
              <span>LIVE DISPATCH ENGINE · {processingProgress}% COMPLETE</span>
            </div>

            {/* Processing Headline with Gradient Text */}
            <h3 
              className="text-2xl sm:text-3xl font-display font-extrabold mb-2"
              style={{
                background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Processing Booking Request...
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-7 leading-relaxed">
              Establishing priority link with Chowra Regional Control Tower to allocate your courier driver, calculate fuel routing, and encrypt your digital waybill manifest.
            </p>

            {/* Gradient Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 mb-7 shadow-inner relative overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${processingProgress}%`,
                  background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                  boxShadow: '0 0 20px rgba(0, 191, 114, 0.7)'
                }}
              />
            </div>

            {/* Step-by-Step Live Verification Pipeline */}
            <div className="space-y-3 text-left bg-slate-950/90 rounded-2xl p-5 border border-slate-800 text-xs">
              {stages.map((stg, idx) => {
                const isPassed = processingStage > idx;
                const isCurrent = processingStage === idx;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 transition-opacity duration-300 ${
                      isPassed || isCurrent ? 'opacity-100' : 'opacity-25'
                    }`}
                  >
                    <div 
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isPassed 
                          ? 'text-slate-950 font-bold shadow-md' 
                          : isCurrent 
                          ? 'border-2 border-[#00bf72] text-[#00bf72]' 
                          : 'border border-slate-700 text-slate-600'
                      }`}
                      style={isPassed ? { background: 'linear-gradient(135deg, #00bf72, #a8eb12)' } : {}}
                    >
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-[#00bf72] animate-ping" />
                      ) : (
                        <span className="text-[10px]">{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isCurrent ? 'text-[#a8eb12]' : isPassed ? 'text-white' : 'text-slate-500'}`}>
                          {stg.title}
                        </span>
                        {isPassed && (
                          <span className="text-[10px] font-data font-bold text-[#00bf72] uppercase tracking-wider">
                            {stg.statusText}
                          </span>
                        )}
                      </div>
                      {(isPassed || isCurrent) && (
                        <div className="text-[11px] text-slate-400 font-data mt-0.5">
                          {stg.detail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-data">
              <span className="w-2 h-2 rounded-full bg-[#00bf72] animate-pulse" />
              <span>SLA Target Dispatch Time: &lt; 18 minutes</span>
            </div>
          </div>
        ) : confirmedBooking ? (
          /* 2. Success Animation & Confirmation View */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            
            {/* Celebratory Success Banner with Custom SVG Animation and Colors #008793 → #00bf72 → #a8eb12 */}
            <div 
              className="p-6 sm:p-8 rounded-2xl text-center mb-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 135, 147, 0.16) 0%, rgba(0, 191, 114, 0.22) 50%, rgba(168, 235, 18, 0.14) 100%)',
                border: '1px solid rgba(0, 191, 114, 0.4)',
                boxShadow: '0 10px 45px -10px rgba(0, 191, 114, 0.3)'
              }}
            >
              {/* Particle Sparkles in Gradient Colors */}
              <div className="absolute top-3 left-6 w-2 h-2 rounded-full bg-[#008793] animate-ping" />
              <div className="absolute top-8 right-10 w-2.5 h-2.5 rounded-full bg-[#00bf72] animate-pulse" />
              <div className="absolute bottom-4 left-1/4 w-2 h-2 rounded-full bg-[#a8eb12] animate-ping" />
              <div className="absolute bottom-6 right-16 w-3 h-3 rounded-full bg-[#00bf72]/70 animate-pulse" />

              {/* Animated Success Badge with Drawing SVG Checkmark */}
              <div className="relative w-22 h-22 mx-auto mb-4 flex items-center justify-center">
                {/* Glow ring */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse-glow"
                  style={{
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                  }}
                />
                
                {/* Center circle */}
                <div className="relative z-10 w-18 h-18 rounded-full bg-slate-950 flex items-center justify-center border-2 border-[#a8eb12] shadow-2xl">
                  <svg 
                    className="w-10 h-10" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="url(#successGradientLarge)" 
                    strokeWidth="3.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient id="successGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00bf72" />
                        <stop offset="100%" stopColor="#a8eb12" />
                      </linearGradient>
                    </defs>
                    <polyline points="20 6 9 17 4 12" className="animate-draw-check" />
                  </svg>
                </div>
              </div>

              <h3 
                className="text-2xl sm:text-3xl font-display font-extrabold mb-1"
                style={{
                  background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Doorstep Pickup Confirmed & Dispatched!
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg mx-auto leading-relaxed">
                Consignment order registered at Western Regional Dispatch Tower. Courier team assigned for immediate route injection.
              </p>

              {/* Status pill with gradient accent */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-[#00bf72]/50 text-xs font-semibold text-[#a8eb12] shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00bf72] animate-pulse" />
                <span>Assigned Driver En Route · ETA &lt; 18 Minutes</span>
              </div>
            </div>

            {/* Consignment Booking Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs text-slate-300 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Consignment Booking ID</span>
                  <span 
                    className="text-xl sm:text-2xl font-display font-extrabold font-data tracking-wide"
                    style={{
                      background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {confirmedBooking.bookingId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="px-3 py-1 rounded-lg text-slate-950 font-bold text-xs shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                    }}
                  >
                    {confirmedBooking.serviceSpeed}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Assigned Field Executive</span>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#00bf72]" />
                    <span>{confirmedBooking.driverName}</span>
                  </div>
                  <div className="text-[#a8eb12] font-data font-medium pl-5">
                    Direct Phone: {confirmedBooking.driverPhone}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Scheduled Arrival Slot</span>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#00bf72]" />
                    <span>{confirmedBooking.pickupDate}</span>
                  </div>
                  <div className="text-slate-400 pl-5">
                    Window: {confirmedBooking.pickupTimeSlot}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Pickup Address</span>
                  <div className="text-xs text-slate-300">
                    {confirmedBooking.pickupAddress}, {confirmedBooking.pickupCity} ({confirmedBooking.pickupPincode})
                  </div>
                  <div className="text-slate-400">
                    Contact: {confirmedBooking.senderName} ({confirmedBooking.senderPhone})
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">Consignment Specs</span>
                  <div className="text-xs text-slate-300">
                    Destination: {confirmedBooking.recipientCity} ({confirmedBooking.recipientPincode})
                  </div>
                  <div className="text-slate-400 font-data">
                    {confirmedBooking.packageCount} Package(s) · {confirmedBooking.estimatedWeightKg} kg · {confirmedBooking.packageType}
                  </div>
                </div>
              </div>

              {/* Barcode graphic simulation */}
              <div className="pt-4 border-t border-slate-800 text-center">
                <div className="h-10 bg-white rounded p-1 flex items-center justify-around space-x-1 max-w-sm mx-auto">
                  {[3,1,4,2,5,1,3,6,2,4,7,1,3,5,2,4,1,3,6,2].map((w, i) => (
                    <div key={i} className="bg-slate-950 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <span className="font-data text-[10px] text-slate-400 mt-2 block tracking-wider">
                  WAYBILL MANIFEST · {confirmedBooking.bookingId} · CHOWRA SPEED DISPATCH
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
              >
                <Printer className="w-4 h-4 text-[#a8eb12]" />
                <span>Print Official Waybill Docket</span>
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:scale-[1.01] active:scale-98"
                style={{
                  background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                  boxShadow: '0 4px 20px -2px rgba(0, 191, 114, 0.4)'
                }}
              >
                <RefreshCw className="w-4 h-4 text-slate-950" />
                <span>Book Another Courier Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Courier Delivery Executive Showcase Banner (Indian English & SQLite Storage) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden relative backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-800 relative group h-56 sm:h-64 shadow-lg">
                  <img
                    src={courierDeliveryImg}
                    alt="Chowra Logistics uniformed Indian courier delivery executive handing express parcel package at customer doorstep with electric courier van"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 font-data">Uniformed Courier Executive</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#a8eb12] font-data text-[10px] font-bold border border-emerald-500/40">
                      EV Fleet Dispatched
                    </span>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                      Pan-India Doorstep Collection
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                    On-Demand Courier Collection Across Extensive Pan-India Coverage
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Our assigned courier partner arrives with a calibrated digital weighing scale, thermal barcode label printer, and tamper-proof security flyer bags. Booking records and transit dockets are immediately recorded with instant OTP verification, GST invoice (Form GST EWB-01), and live linehaul tracking.
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-data">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Collection SLA</span>
                      <span className="font-bold text-white">Within 2 Hours</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Payment Modes</span>
                      <span className="font-bold text-amber-400">UPI / Net Banking / COD</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Documentation</span>
                      <span className="font-bold text-[#a8eb12]">GST & E-Way Bill Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Step-By-Step Interactive Booking Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Interactive Form */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              {/* Step Navigation Pill Tabs */}
              <div className="flex items-center gap-2 mb-8 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeStep === 1
                      ? 'text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={activeStep === 1 ? {
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                  } : {}}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">1</span>
                  <span>Pickup Location</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeStep === 2
                      ? 'text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={activeStep === 2 ? {
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                  } : {}}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">2</span>
                  <span>Consignment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeStep === 3
                      ? 'text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={activeStep === 3 ? {
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                  } : {}}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">3</span>
                  <span>Schedule Slot</span>
                </button>
              </div>

              {/* Step 1: Pickup Location & Sender */}
              {activeStep === 1 && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-base font-display font-bold text-white mb-1">
                      Step 1: Where should we collect the package?
                    </h3>
                    <p className="text-slate-400">
                      Enter sender contact and pickup facility details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Sender Name / Company</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#00bf72]"
                        placeholder="e.g. Rahul Deshmukh"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Phone Number (for Pickup OTP)</label>
                      <input
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-data focus:outline-none focus:border-[#00bf72]"
                        placeholder="e.g. +91 98200 44810"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Corporate Email (for Digital AWB & Invoicing)</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#00bf72]"
                      placeholder="e.g. sender@company.in"
                    />
                  </div>

                  {/* Google Places-Style Autocomplete for Pickup Address */}
                  <div>
                    <PlacesAutocompleteInput
                      label="Pickup Facility / Address & Landmark (Places Intelligence)"
                      value={pickupAddress}
                      onChange={setPickupAddress}
                      onSelectPlace={({ address, city, pincode }) => {
                        setPickupAddress(address);
                        if (city) setPickupCity(city);
                        if (pincode) setPickupPincode(pincode);
                      }}
                      placeholder="Search industrial estate, airport cargo, tech park, or street..."
                      helperText="Select a verified logistics hub to auto-populate City and Pincode, or type custom street address."
                      type="pickup"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Pickup Pincode (India)</label>
                      <input
                        type="text"
                        value={pickupPincode}
                        onChange={(e) => setPickupPincode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-data focus:outline-none focus:border-[#00bf72]"
                        placeholder="e.g. 400059"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">City</label>
                      <input
                        type="text"
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#00bf72]"
                        placeholder="e.g. Mumbai"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="py-3 px-6 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md hover:opacity-95"
                      style={{
                        background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                      }}
                    >
                      <span>Continue to Consignment Specs</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Consignment Specs */}
              {activeStep === 2 && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-base font-display font-bold text-white mb-1">
                      Step 2: Tell us about the package & destination
                    </h3>
                    <p className="text-slate-400">
                      Provide approximate weight, parcel category, and destination.
                    </p>
                  </div>

                  {/* Google Places-Style Destination Autocomplete */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <PlacesAutocompleteInput
                        label="Destination City / Cargo Hub (Places Intelligence)"
                        value={recipientCity}
                        onChange={setRecipientCity}
                        onSelectPlace={({ address, city, pincode, title }) => {
                          setRecipientCity(title || city || address);
                          if (pincode) setRecipientPincode(pincode);
                        }}
                        placeholder="Search destination city, airport terminal, or logistics park..."
                        helperText="Search major Indian metros or international cargo gateways to auto-fill pincode."
                        type="destination"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Destination Pincode / Postal Code</label>
                      <input
                        type="text"
                        value={recipientPincode}
                        onChange={(e) => setRecipientPincode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-data focus:outline-none focus:border-[#00bf72]"
                        placeholder="e.g. 110037"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Approx. Weight (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        placeholder="e.g. 5.0"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-data focus:outline-none focus:border-[#00bf72]"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Calibrated upon van arrival
                      </span>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Number of Packages / Boxes</label>
                      <input
                        type="number"
                        min="1"
                        value={packageCount}
                        onChange={(e) => setPackageCount(Number(e.target.value))}
                        placeholder="e.g. 2"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-data focus:outline-none focus:border-[#00bf72]"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Individual barcodes assigned
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Package Nature</label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#00bf72]"
                    >
                      <option value="Commercial Parcel / Spare Parts">Commercial Parcel / Spare Parts</option>
                      <option value="Confidential Documents / Legal Envelopes">Confidential Documents / Legal Envelopes</option>
                      <option value="Electronics & IT Hardware">Electronics & IT Hardware</option>
                      <option value="Pharma / Medical Life Sciences">Pharma / Medical Life Sciences</option>
                      <option value="Heavy Freight / Wooden Crate">Heavy Freight / Wooden Crate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Speed Commitment</label>
                    <select
                      value={serviceSpeed}
                      onChange={(e) => setServiceSpeed(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#00bf72]"
                    >
                      <option value="Chowra Air Express Next-Day">Chowra Air Express Next-Day (By 12:00 PM) - ₹180/kg</option>
                      <option value="Same-Day Metro Hyper-Express">Same-Day Metro Hyper-Express (Under 4 Hours) - ₹260/kg</option>
                      <option value="Express Surface Linehaul Cargo">Express Surface Linehaul Cargo (Economy) - ₹48/kg</option>
                      <option value="Global Express Air Priority">Global Express Air Priority (International Destinations) - ₹450/kg</option>
                    </select>
                  </div>

                  {/* Dynamic 'Estimated Cost' Preview Card in Step 2 */}
                  <div 
                    className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 135, 147, 0.12) 0%, rgba(0, 191, 114, 0.16) 50%, rgba(168, 235, 18, 0.08) 100%)',
                      borderColor: 'rgba(0, 191, 114, 0.35)',
                      boxShadow: '0 8px 30px -5px rgba(0, 191, 114, 0.15)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-950 font-bold"
                          style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
                        >
                          <Calculator className="w-4 h-4 text-slate-950" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-white text-xs sm:text-sm block">
                            Real-Time Estimated Cost Preview
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Transparent tariff calculation for {pricing.safeWeight} kg · {pricing.speedTag}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00bf72]/20 text-[#a8eb12] border border-[#00bf72]/30 flex items-center gap-1 font-data">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00bf72] animate-pulse" />
                        <span>LIVE TARIFF</span>
                      </span>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Base Freight Tariff ({pricing.safeWeight} kg × ₹{pricing.ratePerKg}/kg):</span>
                        <span className="font-data font-semibold text-white">₹{pricing.baseFreight.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Fuel & Aviation Security Surcharge (8%):</span>
                        <span className="font-data text-slate-300">₹{pricing.fuelSurcharge.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Doorstep Collection & Barcode Tagging:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-slate-500 font-data">₹150</span>
                          <span className="font-data font-bold text-[#a8eb12]">₹0 FREE</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Statutory GST (18%):</span>
                        <span className="font-data text-slate-300">₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Total Bar */}
                      <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                            Total Estimated Cost (All Inclusive)
                          </span>
                          <span className="text-[10px] text-[#00bf72] font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#00bf72]" />
                            <span>Commitment: {pricing.etaDesc}</span>
                          </span>
                        </div>

                        <div className="text-right">
                          <div 
                            className="text-xl sm:text-2xl font-display font-extrabold tracking-tight font-data"
                            style={{
                              background: 'linear-gradient(90deg, #00bf72 0%, #a8eb12 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            ₹{pricing.totalCost.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-slate-500 block">No hidden terminal fees</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="py-3 px-6 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md hover:opacity-95"
                      style={{
                        background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                      }}
                    >
                      <span>Continue to Pickup Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule Date & Slot */}
              {activeStep === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-base font-display font-bold text-white mb-1">
                      Step 3: Select pickup date & dispatch window
                    </h3>
                    <p className="text-slate-400">
                      Our dispatch vehicle will arrive at the scheduled time slot.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-2">Preferred Collection Date</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Today (Immediate Dispatch)', 'Tomorrow Morning'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setPickupDate(d)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            pickupDate === d
                              ? 'border-[#00bf72] text-white font-bold ring-1 ring-[#00bf72]/30'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                          style={pickupDate === d ? {
                            background: 'linear-gradient(135deg, rgba(0, 135, 147, 0.2) 0%, rgba(0, 191, 114, 0.2) 100%)'
                          } : {}}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-2">Pickup Time Slot</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Morning Priority (09:00 - 12:00)',
                        'Afternoon Standard (12:00 - 16:00)',
                        'Evening Express (16:00 - 19:00)',
                        'Night Linehaul (19:00 - 21:00)',
                      ].map((slot) => (
                        <div
                          key={slot}
                          onClick={() => setPickupTimeSlot(slot)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            pickupTimeSlot === slot
                              ? 'border-[#00bf72] text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                          style={pickupTimeSlot === slot ? {
                            background: 'linear-gradient(135deg, rgba(0, 135, 147, 0.2) 0%, rgba(0, 191, 114, 0.2) 100%)'
                          } : {}}
                        >
                          <span>{slot}</span>
                          {pickupTimeSlot === slot && <span className="text-[#a8eb12] font-bold">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Driver Instructions / Security Note</label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#00bf72]"
                      placeholder="e.g. Bring extra cardboard boxes, call upon arrival"
                    />
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2.5 text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-[#00bf72] shrink-0" />
                    <span>Every driver arrives with certified calibration scale, tamper-evident tape, and instant electronic manifest.</span>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                    
                    {/* Submit Button with Colors #008793 → #00bf72 → #a8eb12 */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-3.5 px-8 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xl hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                        boxShadow: '0 6px 25px -4px rgba(0, 191, 114, 0.5)'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Dispatching Driver...</span>
                        </>
                      ) : (
                        <>
                          <PackageCheck className="w-4 h-4 text-slate-950" />
                          <span>Confirm & Dispatch Driver Now</span>
                          <ArrowRight className="w-4 h-4 text-slate-950" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Right 4 Cols: Live Dispatch Summary Dossier */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 text-xs sticky top-24">
              <div className="border-b border-slate-800 pb-4">
                <span 
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: '#00bf72' }}
                >
                  Live Dispatch Summary
                </span>
                <h4 className="text-lg font-display font-bold text-white mt-1">
                  Chowra Priority Courier Unit
                </h4>
                <div className="text-slate-400 mt-0.5 font-data">
                  Nearest Hub: Mumbai BOM-01 Super-Hub
                </div>
              </div>

              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Location:</span>
                  <span className="font-semibold text-white truncate max-w-[160px]">{pickupCity} ({pickupPincode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-semibold text-white truncate max-w-[160px]">{recipientCity} ({recipientPincode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consignment:</span>
                  <span className="font-data font-semibold text-white">{packageCount} Pc · {weightKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-[#a8eb12]">{serviceSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-semibold text-white">{pickupDate}</span>
                </div>
              </div>

              {/* Dynamic Estimated Cost Preview Box in Sidebar */}
              <div 
                className="p-4 rounded-2xl border space-y-2.5 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 135, 147, 0.12) 0%, rgba(0, 191, 114, 0.16) 100%)',
                  borderColor: 'rgba(0, 191, 114, 0.35)'
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-1.5 text-white font-semibold">
                    <Receipt className="w-4 h-4 text-[#00bf72]" />
                    <span>Dynamic Cost Preview</span>
                  </div>
                  <span className="font-data text-[10px] text-[#a8eb12] font-bold">
                    UPDATED LIVE
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Freight ({pricing.safeWeight} kg):</span>
                    <span className="font-data text-white">₹{pricing.baseFreight.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel & Security Surcharge:</span>
                    <span className="font-data text-slate-300">₹{pricing.fuelSurcharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Doorstep Collection:</span>
                    <span className="font-data text-[#a8eb12] font-semibold">₹0 FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Statutory GST (18%):</span>
                    <span className="font-data text-slate-300">₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Total All-Inclusive
                    </span>
                    <span className="text-[9px] text-[#00bf72] font-data">
                      {pricing.etaDesc}
                    </span>
                  </div>
                  <div 
                    className="text-xl font-display font-extrabold font-data"
                    style={{
                      background: 'linear-gradient(90deg, #00bf72 0%, #a8eb12 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ₹{pricing.totalCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Estimated Response Time:</span>
                  <span className="font-data text-[#a8eb12] font-bold">&lt; 18 mins</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tamper-Proof Box Included:</span>
                  <span className="text-white font-semibold">Yes (Complimentary)</span>
                </div>
              </div>

              {/* Instant 1-Click Dispatch Button on the Summary Panel */}
              <button
                type="button"
                onClick={triggerSubmission}
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:scale-[1.01] active:scale-98"
                style={{
                  background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                  boxShadow: '0 4px 20px -2px rgba(0, 191, 114, 0.4)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing Dispatch...</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-4 h-4 text-slate-950" />
                    <span>Instant Dispatch Driver Now</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-slate-500 text-[11px] leading-relaxed">
                Toll-free 24/7 pickup hotline: <strong className="text-slate-300 font-data">+91 90000 00000</strong>
              </div>
            </div>

          </div>
          </div>
        )}

      </div>
    </section>
  );
};
