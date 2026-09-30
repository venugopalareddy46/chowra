import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Shield, Check, Info, RefreshCw, Box, AlertTriangle } from 'lucide-react';
import { RateBreakdown } from '../types/logistics';

interface RateCalculatorProps {
  onBookWithQuote: (data: {
    origin: string;
    destination: string;
    weight: number;
    serviceTier: string;
    estimatedCost: number;
  }) => void;
}

export const RateCalculator: React.FC<RateCalculatorProps> = ({ onBookWithQuote }) => {
  const [isInternational, setIsInternational] = useState(false);
  const [originPincode, setOriginPincode] = useState('400001'); // Mumbai
  const [destinationPincode, setDestinationPincode] = useState('110001'); // Delhi
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [actualWeightKg, setActualWeightKg] = useState<number>(3.5);
  const [lengthCm, setLengthCm] = useState<number>(30);
  const [widthCm, setWidthCm] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(20);
  const [serviceTier, setServiceTier] = useState<'standard' | 'express' | 'priority'>('express');
  const [insuranceRequired, setInsuranceRequired] = useState(true);
  const [declaredValue, setDeclaredValue] = useState<number>(15000);

  // Compute volumetric and charged weights
  const calculation: RateBreakdown = useMemo(() => {
    // Volumetric weight = (L * W * H) / 5000 in kg
    const volWeight = Number(((lengthCm * widthCm * heightCm) / 5000).toFixed(2));
    const chargedWeight = Math.max(actualWeightKg, volWeight);

    let baseRatePerKg = 0;
    let baseMinFee = 0;
    let days = '';
    let tierName = '';

    if (isInternational) {
      if (serviceTier === 'standard') {
        baseMinFee = 1200;
        baseRatePerKg = 380;
        days = '5 - 7 Business Days';
        tierName = 'International Economy Freight';
      } else if (serviceTier === 'express') {
        baseMinFee = 1850;
        baseRatePerKg = 540;
        days = '2 - 3 Business Days';
        tierName = 'International Air Express Priority';
      } else {
        baseMinFee = 3200;
        baseRatePerKg = 790;
        days = 'Next Flight Out (1 - 2 Days)';
        tierName = 'International Mission Critical';
      }
    } else {
      if (serviceTier === 'standard') {
        baseMinFee = 120;
        baseRatePerKg = 24;
        days = '2 - 4 Business Days';
        tierName = 'Domestic Surface Linehaul';
      } else if (serviceTier === 'express') {
        baseMinFee = 220;
        baseRatePerKg = 65;
        days = 'Next Business Day by 12:00 PM';
        tierName = 'Domestic Express Air Priority';
      } else {
        baseMinFee = 450;
        baseRatePerKg = 110;
        days = 'Same-Day / Early Morning 09:30 AM';
        tierName = 'Chowra Hyper-Express NFO';
      }
    }

    const baseFreight = Math.round(baseMinFee + (chargedWeight * baseRatePerKg));
    const fuelSurcharge = Math.round(baseFreight * 0.12);
    const handlingFee = isInternational ? 250 : 60;
    const insuranceFee = insuranceRequired ? Math.max(80, Math.round(declaredValue * 0.005)) : 0;
    const subtotal = baseFreight + fuelSurcharge + handlingFee + insuranceFee;
    const gstOrTaxes = Math.round(subtotal * 0.18);
    const totalCost = subtotal + gstOrTaxes;

    return {
      chargedWeightKg: chargedWeight,
      volumetricWeightKg: volWeight,
      baseFreight,
      fuelSurcharge,
      handlingFee,
      insuranceFee,
      gstOrTaxes,
      totalCost,
      estimatedTransitDays: days,
      serviceTierName: tierName,
    };
  }, [
    isInternational,
    actualWeightKg,
    lengthCm,
    widthCm,
    heightCm,
    serviceTier,
    insuranceRequired,
    declaredValue,
  ]);

  const handleBookQuote = () => {
    onBookWithQuote({
      origin: originPincode,
      destination: isInternational ? destinationCountry : destinationPincode,
      weight: calculation.chargedWeightKg,
      serviceTier: calculation.serviceTierName,
      estimatedCost: calculation.totalCost,
    });
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Transparent Pricing Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Volumetric Freight Rate Calculator
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Real-world IATA standard calculation. Compare actual gross weight against volumetric cubic dimensions and receive an instant, itemized commercial quote.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Geographic Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Destination Territory
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsInternational(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    !isInternational ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Domestic (India)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInternational(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isInternational ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  International (International Destinations)
                </button>
              </div>
            </div>

            {/* Origin & Destination Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Origin Pincode / City (India)
                </label>
                <input
                  type="text"
                  value={originPincode}
                  onChange={(e) => setOriginPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-data text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="e.g. 400001 (Mumbai)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isInternational ? 'Destination Country' : 'Destination Pincode / City'}
                </label>
                {isInternational ? (
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="United States">United States (USA)</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                    <option value="Germany">Germany (EU Gateway)</option>
                    <option value="Singapore">Singapore (APAC)</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Japan">Japan</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={destinationPincode}
                    onChange={(e) => setDestinationPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-data text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    placeholder="e.g. 110001 (Delhi)"
                  />
                )}
              </div>
            </div>

            {/* Weights and Dimensions */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Package Weight & Dimensions
                </span>
                <span className="text-[11px] text-slate-400 font-data">Formula: (L × W × H) / 5000</span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-slate-700 mb-1">
                  <span>Actual Gross Weight: <strong className="font-data">{actualWeightKg} kg</strong></span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Input Weight:</span>
                    <input
                      type="number"
                      min="0.1"
                      max="500"
                      step="0.5"
                      value={actualWeightKg}
                      onChange={(e) => setActualWeightKg(Math.max(0.1, Number(e.target.value)))}
                      placeholder="e.g. 5.0"
                      className="w-20 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs font-data text-slate-900 text-right focus:bg-white focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={actualWeightKg}
                  onChange={(e) => setActualWeightKg(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* 3 Dimensions (L, W, H) in cm */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Length (cm)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Math.max(1, Number(e.target.value)))}
                    placeholder="e.g. 30"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-data text-slate-900 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Math.max(1, Number(e.target.value)))}
                    placeholder="e.g. 20"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-data text-slate-900 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(1, Number(e.target.value)))}
                    placeholder="e.g. 15"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-data text-slate-900 text-center"
                  />
                </div>
              </div>

              {/* Weight Comparison Alert Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-700" />
                  <span className="text-slate-700">
                    Volumetric Weight: <strong className="font-data font-semibold text-slate-900">{calculation.volumetricWeightKg} kg</strong>
                  </span>
                </div>
                <div className="text-amber-900 font-semibold text-[11px]">
                  Billed on: <span className="font-data font-bold underline">{calculation.chargedWeightKg} kg</span> ({calculation.chargedWeightKg === actualWeightKg ? 'Actual' : 'Volumetric'})
                </div>
              </div>
            </div>

            {/* Service Tier Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Service Speed Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceTier('standard')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    serviceTier === 'standard'
                      ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Standard Economy</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Most economical</div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceTier('express')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    serviceTier === 'express'
                      ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Express Priority</div>
                  <div className="text-[11px] text-amber-700 mt-0.5 font-medium">Recommended</div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceTier('priority')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    serviceTier === 'priority'
                      ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Next-Flight-Out</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Mission critical</div>
                </button>
              </div>
            </div>

            {/* Insurance Checkbox */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={insuranceRequired}
                  onChange={(e) => setInsuranceRequired(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Include Comprehensive All-Risk Cargo Insurance Cover
                </span>
              </label>

              {insuranceRequired && (
                <div className="pl-6 pt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-600">Declared Invoice Value: ₹</span>
                  <input
                    type="number"
                    min="1000"
                    max="1000000"
                    step="5000"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    placeholder="e.g. 50000"
                    className="w-32 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-data text-slate-900"
                  />
                  <span className="text-[11px] text-slate-400">Coverage up to 100% of declared value</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Summary & Breakdown Card */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl sticky top-24">
            <div className="border-b border-slate-800 pb-4 mb-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Official Estimate Breakdown
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-1">
                {calculation.serviceTierName}
              </h3>
              <div className="text-xs text-slate-400 mt-1">
                Estimated Delivery Commitment: <span className="font-semibold text-slate-200">{calculation.estimatedTransitDays}</span>
              </div>
            </div>

            {/* Itemized lines */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Chargeable Weight</span>
                <span className="font-data font-semibold text-white">{calculation.chargedWeightKg} kg</span>
              </div>

              <div className="flex justify-between">
                <span>Base Air / Surface Freight</span>
                <span className="font-data text-white">₹{calculation.baseFreight.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Aviation / Highway Fuel Surcharge (12%)</span>
                <span className="font-data text-white">₹{calculation.fuelSurcharge.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Terminal Handling & Docket Fee</span>
                <span className="font-data text-white">₹{calculation.handlingFee.toLocaleString('en-IN')}</span>
              </div>

              {insuranceRequired && (
                <div className="flex justify-between text-amber-400">
                  <span>Cargo Risk Coverage & Transit Shield</span>
                  <span className="font-data">₹{calculation.insuranceFee.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-400">
                <span>Statutory GST / Service Tax (18%)</span>
                <span className="font-data">₹{calculation.gstOrTaxes.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Total All-Inclusive Estimate</span>
                <span className="text-[11px] text-emerald-400">Zero Hidden Surcharges</span>
              </div>
              <div className="text-3xl font-display font-extrabold text-amber-400 font-data">
                ₹{calculation.totalCost.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handleBookQuote}
              className="mt-6 w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Book Pickup With This Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-normal flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Commercial rate locked for 7 days. Corporate contract discounts applied automatically upon GST registration verification.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
