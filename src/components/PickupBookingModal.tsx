import React, { useState } from 'react';
import { 
  X, Check, Calendar, Clock, MapPin, Package, User, Phone, 
  Truck, ArrowRight, ShieldCheck, Printer, CheckCircle2 
} from 'lucide-react';
import { PickupBookingData } from '../types/logistics';

interface PickupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    origin?: string;
    destination?: string;
    weight?: number;
    serviceTier?: string;
  };
  onBookingComplete?: (booking: PickupBookingData) => void;
}

export const PickupBookingModal: React.FC<PickupBookingModalProps> = ({
  isOpen,
  onClose,
  prefillData,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [senderName, setSenderName] = useState('Rahul Deshmukh');
  const [senderPhone, setSenderPhone] = useState('+91 98200 44810');
  const [senderEmail, setSenderEmail] = useState('r.deshmukh@precisiontools.in');
  const [pickupAddress, setPickupAddress] = useState('Plot 42, Marol Industrial Area, Andheri East');
  const [pickupPincode, setPickupPincode] = useState(prefillData?.origin || '400059');
  const [pickupCity, setPickupCity] = useState('Mumbai');

  const [recipientCity, setRecipientCity] = useState(prefillData?.destination || 'New Delhi');
  const [recipientPincode, setRecipientPincode] = useState('110037');
  const [packageType, setPackageType] = useState('Commercial Parcel');
  const [weightKg, setWeightKg] = useState<number>(prefillData?.weight || 3.5);
  const [packageCount, setPackageCount] = useState<number>(1);
  const [serviceSpeed, setServiceSpeed] = useState<string>(prefillData?.serviceTier || 'Domestic Express Air Priority');

  const [pickupDate, setPickupDate] = useState('Today (Within 2 Hours)');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Evening Slot (16:00 - 19:00)');
  const [specialInstructions, setSpecialInstructions] = useState('Fragile medical calibration instrument. Bring tamper-proof pouch.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<PickupBookingData | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } else if (step === 3) {
      setIsSubmitting(true);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newBooking: PickupBookingData = {
        bookingId: `BK-CHW-${Math.floor(10000 + Math.random() * 90000)}`,
        trackingId: `CHW-${randomSuffix}-MOD`,
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
        estimatedCost: Math.round(weightKg * 180 + 250),
      };

      setTimeout(() => {
        setIsSubmitting(false);
        setConfirmedBooking(newBooking);
        setStep(4);
        onBookingComplete?.(newBooking);
      }, 1600);
    }
  };

  const handleReset = () => {
    setStep(1);
    setConfirmedBooking(null);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span 
              className="text-[11px] font-bold uppercase tracking-wider block"
              style={{ color: '#008793' }}
            >
              Doorstep Logistics Dispatch
            </span>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900">
              Schedule Express Courier Pickup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Spinner Screen when Submitting */}
        {isSubmitting ? (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full animate-spin-gradient p-1"
                style={{
                  background: 'conic-gradient(from 0deg, #008793, #00bf72, #a8eb12, #008793)'
                }}
              >
                <div className="w-full h-full bg-white rounded-full" />
              </div>
              <div 
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                }}
              >
                <Truck className="w-5 h-5 text-slate-950" />
              </div>
            </div>

            <h4 
              className="text-base font-display font-bold"
              style={{
                background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Dispatching Courier Unit...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Connecting to Chowra Control Tower & generating digital waybill manifest.
            </p>
          </div>
        ) : (
          <>
            {/* Step Progress Bar */}
            {step < 4 && (
              <div className="py-4 border-b border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span className={step >= 1 ? 'text-[#008793] font-bold' : ''}>1. Sender Info</span>
                  <span>·</span>
                  <span className={step >= 2 ? 'text-[#008793] font-bold' : ''}>2. Consignment</span>
                  <span>·</span>
                  <span className={step >= 3 ? 'text-[#008793] font-bold' : ''}>3. Slot & Confirmation</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${(step / 3) * 100}%`,
                      background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Sender & Address */}
            {step === 1 && (
              <div className="py-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Name / Company</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Rahul Deshmukh or Acme Enterprises"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number for OTP</label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="e.g. +91 98200 44810"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-data text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email for Digital Waybill Receipt</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="e.g. sender@company.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Complete Pickup Address / Landmark</label>
                  <textarea
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. Unit 402, Trade Tower, Andheri East, Mumbai"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pickup Postal PIN Code</label>
                    <input
                      type="text"
                      value={pickupPincode}
                      onChange={(e) => setPickupPincode(e.target.value)}
                      placeholder="e.g. 400059"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-data text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Consignment Specs */}
            {step === 2 && (
              <div className="py-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Destination City / Country</label>
                    <input
                      type="text"
                      value={recipientCity}
                      onChange={(e) => setRecipientCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Destination Postal Code</label>
                    <input
                      type="text"
                      value={recipientPincode}
                      onChange={(e) => setRecipientPincode(e.target.value)}
                      placeholder="e.g. 110037"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-data text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimated Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      placeholder="e.g. 5.0"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-data text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Pieces / Boxes</label>
                    <input
                      type="number"
                      min="1"
                      value={packageCount}
                      onChange={(e) => setPackageCount(Number(e.target.value))}
                      placeholder="e.g. 2"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-data text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Nature & Category</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                  >
                    <option value="Confidential Documents / Legal Envelopes">Confidential Documents / Legal Envelopes</option>
                    <option value="Commercial Parcel / Spare Parts">Commercial Parcel / Spare Parts</option>
                    <option value="Electronics & IT Hardware">Electronics & IT Hardware</option>
                    <option value="Pharma / Medical Life Sciences">Pharma / Medical Life Sciences</option>
                    <option value="Heavy Freight / Wooden Crate">Heavy Freight / Wooden Crate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Priority</label>
                  <select
                    value={serviceSpeed}
                    onChange={(e) => setServiceSpeed(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                  >
                    <option value="Chowra Air Express Next-Day">Chowra Air Express Next-Day (By 12:00 PM)</option>
                    <option value="Same-Day Metro Hyper-Express">Same-Day Metro Hyper-Express (Under 4 Hours)</option>
                    <option value="Express Surface Linehaul Cargo">Express Surface Linehaul Cargo (Economy)</option>
                    <option value="Global Express Air Priority">Global Express Air Priority (International)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Slot Scheduling */}
            {step === 3 && (
              <div className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Preferred Pickup Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Today (Immediate Dispatch)', 'Tomorrow Morning'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setPickupDate(d)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          pickupDate === d
                            ? 'border-[#00bf72] font-bold text-slate-950 bg-emerald-50'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Pickup Window Slot</label>
                  <div className="space-y-2">
                    {[
                      'Morning Priority Slot (09:00 - 12:00)',
                      'Afternoon Standard Slot (12:00 - 16:00)',
                      'Evening Express Slot (16:00 - 19:00)',
                      'Night Linehaul Cut-Off (19:00 - 21:00)',
                    ].map((s) => (
                      <div
                        key={s}
                        onClick={() => setPickupTimeSlot(s)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          pickupTimeSlot === s
                            ? 'border-[#00bf72] font-bold text-slate-950 bg-emerald-50'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{s}</span>
                        {pickupTimeSlot === s && <Check className="w-4 h-4 text-[#00bf72]" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Driver Instructions & Access Code</label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-[#00bf72] focus:outline-none"
                    placeholder="e.g. Ring gate security, request invoice sign-off"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00bf72] shrink-0" />
                  <span>Chowra pickup executives carry calibrated digital scales and Bluetooth label printers.</span>
                </div>
              </div>
            )}

            {/* Step 4: Booking Confirmation & Digital Waybill */}
            {step === 4 && confirmedBooking && (
              <div className="py-4 space-y-4">
                {/* Celebratory Banner */}
                <div 
                  className="p-5 rounded-2xl text-center border relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 135, 147, 0.1) 0%, rgba(0, 191, 114, 0.15) 50%, rgba(168, 235, 18, 0.1) 100%)',
                    borderColor: 'rgba(0, 191, 114, 0.4)'
                  }}
                >
                  {/* Drawing SVG Checkmark */}
                  <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <div 
                      className="absolute inset-0 rounded-full animate-pulse-glow"
                      style={{
                        background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                      }}
                    />
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#a8eb12] shadow-md">
                      <svg 
                        className="w-7 h-7" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#00bf72" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" className="animate-draw-check" />
                      </svg>
                    </div>
                  </div>

                  <h4 
                    className="font-display font-extrabold text-lg"
                    style={{
                      background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Doorstep Pickup Confirmed & Dispatched!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Dispatch order dispatched to Western Regional Control Tower.
                  </p>
                </div>

                {/* Consignment Booking Card */}
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Booking Reference</span>
                    <span className="font-data font-bold text-[#a8eb12] text-sm">
                      {confirmedBooking.bookingId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Assigned Driver & Van</span>
                      <span className="font-semibold text-white">{confirmedBooking.driverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Driver Direct Phone</span>
                      <span className="font-data font-semibold text-[#00bf72]">{confirmedBooking.driverPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Scheduled Arrival</span>
                      <span className="font-semibold text-white">{confirmedBooking.pickupDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Time Window</span>
                      <span className="font-semibold text-white">{confirmedBooking.pickupTimeSlot}</span>
                    </div>
                  </div>

                  {/* Barcode graphic simulation */}
                  <div className="pt-2 border-t border-slate-800 text-center">
                    <div className="h-10 bg-white rounded p-1 flex items-center justify-around space-x-1">
                      {[4,2,6,1,3,5,2,4,7,1,3,6,2,5,3,1,4,2,6].map((w, i) => (
                        <div key={i} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }} />
                      ))}
                    </div>
                    <span className="font-data text-[10px] text-slate-400 mt-1 block">
                      DIGITAL WAYBILL MANIFEST · {confirmedBooking.bookingId}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Waybill Voucher</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            {step < 4 && (
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2.5 px-6 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  style={{
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                  }}
                >
                  <span>{step === 3 ? 'Confirm & Dispatch Driver' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
