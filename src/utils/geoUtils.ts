/**
 * Geospatial and Distance Computation Utilities for Chowra Logistics Visual Tracker
 */

export interface GeoCoordinate {
  lat: number;
  lng: number;
  city: string;
  country?: string;
  hubCode?: string;
}

// Comprehensive database of domestic hubs and global air cargo gateways
export const KNOWN_CITIES_COORDINATES: Record<string, GeoCoordinate> = {
  // India Metros & Primary Hubs
  mumbai: { lat: 19.076, lng: 72.8777, city: 'Mumbai', country: 'India', hubCode: 'BOM-01' },
  bombay: { lat: 19.076, lng: 72.8777, city: 'Mumbai', country: 'India', hubCode: 'BOM-01' },
  'new delhi': { lat: 28.6139, lng: 77.209, city: 'New Delhi', country: 'India', hubCode: 'DEL-01' },
  delhi: { lat: 28.6139, lng: 77.209, city: 'New Delhi', country: 'India', hubCode: 'DEL-01' },
  gurugram: { lat: 28.4595, lng: 77.0266, city: 'Gurugram', country: 'India', hubCode: 'DEL-01' },
  noida: { lat: 28.5355, lng: 77.391, city: 'Noida', country: 'India', hubCode: 'DEL-01' },
  bengaluru: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', country: 'India', hubCode: 'BLR-01' },
  bangalore: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', country: 'India', hubCode: 'BLR-01' },
  hyderabad: { lat: 17.385, lng: 78.4867, city: 'Hyderabad', country: 'India', hubCode: 'HYD-01' },
  chennai: { lat: 13.0827, lng: 80.2707, city: 'Chennai', country: 'India', hubCode: 'MAA-01' },
  madras: { lat: 13.0827, lng: 80.2707, city: 'Chennai', country: 'India', hubCode: 'MAA-01' },
  kolkata: { lat: 22.5726, lng: 88.3639, city: 'Kolkata', country: 'India', hubCode: 'CCU-01' },
  calcutta: { lat: 22.5726, lng: 88.3639, city: 'Kolkata', country: 'India', hubCode: 'CCU-01' },
  pune: { lat: 18.5204, lng: 73.8567, city: 'Pune', country: 'India', hubCode: 'PUN-01' },
  ahmedabad: { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', country: 'India', hubCode: 'AMD-01' },
  surat: { lat: 21.1702, lng: 72.8311, city: 'Surat', country: 'India', hubCode: 'STV-01' },
  jaipur: { lat: 26.9124, lng: 75.7873, city: 'Jaipur', country: 'India', hubCode: 'JAI-01' },
  lucknow: { lat: 26.8467, lng: 80.9462, city: 'Lucknow', country: 'India', hubCode: 'LKO-01' },
  chandigarh: { lat: 30.7333, lng: 76.7794, city: 'Chandigarh', country: 'India', hubCode: 'IXC-01' },
  kochi: { lat: 9.9312, lng: 76.2673, city: 'Kochi', country: 'India', hubCode: 'COK-01' },
  cochin: { lat: 9.9312, lng: 76.2673, city: 'Kochi', country: 'India', hubCode: 'COK-01' },
  indore: { lat: 22.7196, lng: 75.8577, city: 'Indore', country: 'India', hubCode: 'IDR-01' },
  nagpur: { lat: 21.1458, lng: 79.0882, city: 'Nagpur', country: 'India', hubCode: 'NAG-01' },
  guwahati: { lat: 26.1445, lng: 91.7362, city: 'Guwahati', country: 'India', hubCode: 'GAU-01' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, city: 'Visakhapatnam', country: 'India', hubCode: 'VTZ-01' },
  coimbatore: { lat: 11.0168, lng: 76.9558, city: 'Coimbatore', country: 'India', hubCode: 'CJB-01' },
  vadodara: { lat: 22.3072, lng: 73.1812, city: 'Vadodara', country: 'India', hubCode: 'BDQ-01' },
  bhopal: { lat: 23.2599, lng: 77.4126, city: 'Bhopal', country: 'India', hubCode: 'BHO-01' },
  patna: { lat: 25.5941, lng: 85.1376, city: 'Patna', country: 'India', hubCode: 'PAT-01' },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, city: 'Bhubaneswar', country: 'India', hubCode: 'BBI-01' },

  // Key International Gateways
  frankfurt: { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', country: 'Germany', hubCode: 'FRA-INT' },
  'frankfurt am main': { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', country: 'Germany', hubCode: 'FRA-INT' },
  dubai: { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'United Arab Emirates', hubCode: 'DXB-INT' },
  singapore: { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore', hubCode: 'SIN-INT' },
  london: { lat: 51.5074, lng: -0.1278, city: 'London', country: 'United Kingdom', hubCode: 'LHR-INT' },
  paris: { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', hubCode: 'CDG-INT' },
  amsterdam: { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands', hubCode: 'AMS-INT' },
  tokyo: { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', hubCode: 'NRT-INT' },
  'new york': { lat: 40.7128, lng: -74.006, city: 'New York', country: 'United States', hubCode: 'JFK-INT' },
  'hong kong': { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'Hong Kong', hubCode: 'HKG-INT' },
  doha: { lat: 25.2854, lng: 51.531, city: 'Doha', country: 'Qatar', hubCode: 'DOH-INT' },
  sydney: { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', hubCode: 'SYD-INT' },
};

/**
 * Normalizes city query and finds or estimates geographical coordinates.
 */
export function getCityCoordinates(cityName: string, country?: string): GeoCoordinate {
  if (!cityName) {
    return { lat: 19.076, lng: 72.8777, city: 'Mumbai', country: 'India', hubCode: 'BOM-01' };
  }

  const clean = cityName.trim().toLowerCase();

  // Direct match
  if (KNOWN_CITIES_COORDINATES[clean]) {
    return KNOWN_CITIES_COORDINATES[clean];
  }

  // Partial substring match
  for (const [key, coord] of Object.entries(KNOWN_CITIES_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coord;
    }
  }

  // Deterministic fallback if unlisted
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = (hash << 5) - hash + cityName.charCodeAt(i);
    hash |= 0;
  }
  const isForeign = country && country.toLowerCase() !== 'india';
  
  if (isForeign) {
    // Spread in Europe/Middle East/Asia range
    const lat = 20 + Math.abs(hash % 35);
    const lng = 30 + Math.abs((hash >> 3) % 70);
    return { lat, lng, city: cityName, country: country || 'International', hubCode: `${cityName.slice(0, 3).toUpperCase()}-GW` };
  }

  // Spread within India subcontinent bounds (Lat: 8.4 to 34.0, Lng: 72.0 to 88.5)
  const lat = 11.0 + Math.abs(hash % 190) / 10;
  const lng = 73.0 + Math.abs((hash >> 2) % 150) / 10;
  return { lat, lng, city: cityName, country: 'India', hubCode: `${cityName.slice(0, 3).toUpperCase()}-01` };
}

/**
 * Calculates Great-Circle distance in kilometers between two geo-coordinates
 * using the Haversine formula.
 */
export function calculateDistanceKm(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  // If identical city or same pin
  if (
    coord1.city.toLowerCase() === coord2.city.toLowerCase() &&
    Math.abs(coord1.lat - coord2.lat) < 0.01 &&
    Math.abs(coord1.lng - coord2.lng) < 0.01
  ) {
    return 38; // Intra-city metro logistics transit distance (avg 35-45 km)
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

/**
 * Computes the coverage progress ratio (0 to 1) based on shipment status and checkpoints.
 */
export function calculateCoverageProgress(
  statusCode: string,
  checkpointCount: number = 4
): number {
  switch (statusCode) {
    case 'DELIVERED':
      return 1.0;
    case 'OUT_FOR_DELIVERY':
      return 0.92;
    case 'CUSTOMS_CLEARANCE':
      return 0.82;
    case 'IN_TRANSIT': {
      // Dynamic scaling: between 38% and 74% depending on checkpoint count
      const base = 0.45;
      const bonus = Math.min(checkpointCount * 0.06, 0.28);
      return Math.min(base + bonus, 0.76);
    }
    case 'BOOKED':
    default:
      return 0.12;
  }
}

/**
 * Computes quadratic Bézier curve coordinates and vehicle position/tangent angle.
 */
export interface BezierRouteData {
  start: { x: number; y: number };
  control: { x: number; y: number };
  end: { x: number; y: number };
  pathD: string;
  currentVehiclePos: { x: number; y: number };
  currentAngleDeg: number;
}

export function computeBezierRoute(
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  progress: number
): BezierRouteData {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distance = Math.hypot(dx, dy);

  // Normal vector perpendicular to chord
  const mx = (startPoint.x + endPoint.x) / 2;
  const my = (startPoint.y + endPoint.y) / 2;

  // Arc bend offset (curving upward / northward)
  const bendFactor = Math.min(Math.max(distance * 0.22, 25), 80);
  // Unit normal
  const nx = -dy / (distance || 1);
  const ny = dx / (distance || 1);

  // Ensure arc always curves nicely toward the upper viewport
  const sign = ny < 0 ? 1 : -1;
  const cx = mx + nx * bendFactor * sign;
  const cy = my + ny * bendFactor * sign;

  const t = Math.max(0, Math.min(1, progress));

  // Quadratic Bézier: B(t) = (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2
  const vx = Math.pow(1 - t, 2) * startPoint.x + 2 * (1 - t) * t * cx + Math.pow(t, 2) * endPoint.x;
  const vy = Math.pow(1 - t, 2) * startPoint.y + 2 * (1 - t) * t * cy + Math.pow(t, 2) * endPoint.y;

  // Derivative for tangent vector: B'(t) = 2*(1-t)*(P1 - P0) + 2*t*(P2 - P1)
  const dtx = 2 * (1 - t) * (cx - startPoint.x) + 2 * t * (endPoint.x - cx);
  const dty = 2 * (1 - t) * (cy - startPoint.y) + 2 * t * (endPoint.y - cy);
  const angleDeg = (Math.atan2(dty, dtx) * 180) / Math.PI;

  const pathD = `M ${startPoint.x.toFixed(1)} ${startPoint.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${endPoint.x.toFixed(1)} ${endPoint.y.toFixed(1)}`;

  return {
    start: startPoint,
    control: { x: cx, y: cy },
    end: endPoint,
    pathD,
    currentVehiclePos: { x: vx, y: vy },
    currentAngleDeg: angleDeg,
  };
}
