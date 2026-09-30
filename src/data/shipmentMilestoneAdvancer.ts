import { ShipmentData, TrackingCheckpoint } from '../types/logistics';

export interface MilestoneAdvanceResult {
  updatedShipment: ShipmentData;
  eventTitle: string;
  eventDescription: string;
  location: string;
  statusCode: ShipmentData['statusCode'];
  isReset?: boolean;
}

/**
 * Advances a shipment's state to the next milestone in its transit lifecycle,
 * generating dynamic timestamps, checkpoints, and telemetry updates.
 */
export function advanceShipmentMilestone(shipment: ShipmentData): MilestoneAdvanceResult {
  const awb = shipment.awbNumber;
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Clone current shipment
  const updated: ShipmentData = JSON.parse(JSON.stringify(shipment));

  // Determine stage based on current status code & checkpoint count
  if (updated.statusCode === 'DELIVERED') {
    // If already delivered, cycle back to In Transit with fresh simulation so user can test repeatedly
    updated.statusCode = 'IN_TRANSIT';
    updated.currentStatus = 'Active In-Transit - Departed Origin Hub';
    updated.lastUpdated = `Today, ${nowTime}`;
    updated.podSignedBy = undefined;
    updated.podTimestamp = undefined;
    updated.estimatedDelivery = 'Tomorrow by 02:00 PM';

    const newCp: TrackingCheckpoint = {
      id: `cp-sim-${Date.now()}`,
      timestamp: `Today, ${nowTime}`,
      status: 'current',
      location: `${updated.origin.city} Central Linehaul Gateway`,
      description: `New linehaul movement dispatched for consignment #${awb}`,
      details: 'Linehaul vehicle inspected and electronic seal #CHW-SEAL-8891 applied.',
    };

    // Mark previous current checkpoints as completed
    updated.checkpoints = [
      newCp,
      ...updated.checkpoints.map((cp) => ({
        ...cp,
        status: 'completed' as const,
      })),
    ].slice(0, 8);

    return {
      updatedShipment: updated,
      eventTitle: 'Linehaul Movement Started',
      eventDescription: `Consignment #${awb} has departed ${updated.origin.city} Central Gateway.`,
      location: `${updated.origin.city} Gateway`,
      statusCode: 'IN_TRANSIT',
      isReset: true,
    };
  }

  if (updated.statusCode === 'CUSTOMS_CLEARANCE') {
    // Advance Customs -> Out for Delivery
    updated.statusCode = 'OUT_FOR_DELIVERY';
    updated.currentStatus = 'Customs Cleared - Out for Delivery via European Shuttle';
    updated.lastUpdated = `Today, ${nowTime}`;
    updated.estimatedDelivery = 'Today by 05:30 PM CET';
    updated.vehicleOrFlightNo = 'European Cold-Chain Van #FRA-09';

    const newCp: TrackingCheckpoint = {
      id: `cp-sim-${Date.now()}`,
      timestamp: `Today, ${nowTime}`,
      status: 'current',
      location: 'Frankfurt Airport Zollamt Gate 4',
      description: 'Import customs clearance completed. Transferred to refrigerated delivery van.',
      details: 'Phytosanitary health certificate verified. Cold chain logged at +4.1°C.',
    };

    updated.checkpoints = [
      newCp,
      ...updated.checkpoints.map((cp) => ({ ...cp, status: 'completed' as const })),
    ].slice(0, 8);

    return {
      updatedShipment: updated,
      eventTitle: 'Customs Clearance Approved',
      eventDescription: `Customs cleared for #${awb}. Handed over to European Cold-Chain Shuttle.`,
      location: 'Frankfurt Airport Gateway',
      statusCode: 'OUT_FOR_DELIVERY',
    };
  }

  if (updated.statusCode === 'OUT_FOR_DELIVERY') {
    // Advance Out for Delivery -> Delivered
    updated.statusCode = 'DELIVERED';
    updated.currentStatus = `Delivered - Signed by ${updated.recipientName.split(' ')[0]} at Reception`;
    updated.lastUpdated = `Today, ${nowTime}`;
    updated.estimatedDelivery = `Delivered Today at ${nowTime}`;
    updated.podSignedBy = `${updated.recipientName} (Authorized Signatory)`;
    updated.podTimestamp = `Today at ${nowTime}`;

    const newCp: TrackingCheckpoint = {
      id: `cp-sim-${Date.now()}`,
      timestamp: `Today, ${nowTime}`,
      status: 'completed',
      location: `${updated.destination.city} Destination Facility`,
      description: `Shipment delivered successfully. Digital Proof of Delivery (e-POD) recorded.`,
      details: 'Recipient identity verified via secure OTP. Package inspected intact.',
    };

    updated.checkpoints = [
      newCp,
      ...updated.checkpoints.map((cp) => ({ ...cp, status: 'completed' as const })),
    ].slice(0, 8);

    return {
      updatedShipment: updated,
      eventTitle: 'Shipment Delivered (e-POD Captured)',
      eventDescription: `Consignment #${awb} was successfully delivered and signed by ${updated.podSignedBy}.`,
      location: `${updated.destination.city} Facility`,
      statusCode: 'DELIVERED',
    };
  }

  // IN_TRANSIT: Advance between Flight/Linehaul and Out For Delivery
  // Check if it's already midway or ready for delivery
  const isMidway = updated.checkpoints.some((c) =>
    c.description.toLowerCase().includes('airborne') || c.description.toLowerCase().includes('in-flight')
  );

  if (!isMidway) {
    // Step 1: Flight Departure / Highway Transit
    updated.currentStatus = 'In-Flight Air Cargo Linehaul - Cruising to Destination Hub';
    updated.lastUpdated = `Today, ${nowTime}`;

    const newCp: TrackingCheckpoint = {
      id: `cp-sim-${Date.now()}`,
      timestamp: `Today, ${nowTime}`,
      status: 'current',
      location: `${updated.origin.city} Air Cargo Ramp (Tarmac)`,
      description: `Flight ${updated.vehicleOrFlightNo || '6E-882'} departed tarmac runway. En route to ${updated.destination.city}.`,
      details: 'Satellite linehaul telemetry active. Estimated arrival window confirmed.',
    };

    updated.checkpoints = [
      newCp,
      ...updated.checkpoints.map((cp) => ({ ...cp, status: 'completed' as const })),
    ].slice(0, 8);

    return {
      updatedShipment: updated,
      eventTitle: 'Linehaul Flight Airborne',
      eventDescription: `Flight carrying #${awb} has departed ${updated.origin.city} for ${updated.destination.city}.`,
      location: `${updated.origin.city} Airport`,
      statusCode: 'IN_TRANSIT',
    };
  } else {
    // Step 2: Arrived at Destination Hub & Out for Delivery
    updated.statusCode = 'OUT_FOR_DELIVERY';
    updated.currentStatus = 'Out for Delivery - Onboard Last-Mile Express Van';
    updated.lastUpdated = `Today, ${nowTime}`;
    updated.estimatedDelivery = `Today between ${nowTime} and 18:00`;
    updated.vehicleOrFlightNo = 'Express Van #MH-02-CW-9921 (Driver: Vikramjit Singh)';

    const newCp: TrackingCheckpoint = {
      id: `cp-sim-${Date.now()}`,
      timestamp: `Today, ${nowTime}`,
      status: 'current',
      location: `${updated.destination.city} Delivery Hub`,
      description: 'Shipment loaded onto Express Van with Driver Vikramjit Singh (+91 98199 12040)',
      details: 'Driver dispatched on optimized delivery route sequence #4. OTP security active.',
    };

    updated.checkpoints = [
      newCp,
      ...updated.checkpoints.map((cp) => ({ ...cp, status: 'completed' as const })),
    ].slice(0, 8);

    return {
      updatedShipment: updated,
      eventTitle: 'Out for Doorstep Delivery',
      eventDescription: `Consignment #${awb} is out for delivery with Driver Vikramjit Singh in ${updated.destination.city}.`,
      location: `${updated.destination.city} Delivery Hub`,
      statusCode: 'OUT_FOR_DELIVERY',
    };
  }
}
