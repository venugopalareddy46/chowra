export interface TrackingCheckpoint {
  id: string;
  timestamp: string;
  status: 'completed' | 'current' | 'upcoming';
  location: string;
  description: string;
  details?: string;
  badge?: string;
}

export interface ShipmentData {
  awbNumber: string;
  referenceNumber: string;
  serviceType: string;
  origin: {
    city: string;
    hub: string;
    country: string;
    pin: string;
  };
  destination: {
    city: string;
    hub: string;
    country: string;
    pin: string;
  };
  senderName: string;
  recipientName: string;
  estimatedDelivery: string;
  currentStatus: string;
  statusCode: 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CUSTOMS_CLEARANCE' | 'BOOKED';
  weightKg: number;
  pieces: number;
  vehicleOrFlightNo?: string;
  temperature?: string;
  lastUpdated: string;
  podSignedBy?: string;
  podTimestamp?: string;
  checkpoints: TrackingCheckpoint[];
}

export interface RateEstimateInput {
  originPincode: string;
  destinationPincode: string;
  destinationCountry: string;
  isInternational: boolean;
  packageType: 'document' | 'parcel' | 'heavy_freight';
  actualWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  serviceTier: 'standard' | 'express' | 'priority_overnight';
  insuranceRequired: boolean;
  invoiceValue?: number;
}

export interface RateBreakdown {
  chargedWeightKg: number;
  volumetricWeightKg: number;
  baseFreight: number;
  fuelSurcharge: number;
  handlingFee: number;
  insuranceFee: number;
  gstOrTaxes: number;
  totalCost: number;
  estimatedTransitDays: string;
  serviceTierName: string;
}

export interface PickupBookingData {
  bookingId: string;
  trackingId?: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  pickupAddress: string;
  pickupPincode: string;
  pickupCity: string;
  recipientCity: string;
  recipientPincode: string;
  packageType: string;
  estimatedWeightKg: number;
  packageCount: number;
  pickupDate: string;
  pickupTimeSlot: string;
  specialInstructions?: string;
  serviceSpeed: string;
  status: 'CONFIRMED' | 'DISPATCHED' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  driverName?: string;
  driverPhone?: string;
  createdAt?: string;
  estimatedCost?: number;
}

export interface NetworkHub {
  id: string;
  name: string;
  code: string;
  type: 'air_hub' | 'sea_gateway' | 'surface_transshipment' | 'fulfillment_center';
  city: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'International';
  country: string;
  capacityDailyKg: string;
  directLanesCount: number;
  fleetAllocated: number;
  isCustomsPort: boolean;
}
