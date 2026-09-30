/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Chowra Real-Time Telemetry & Geospatial Transit Engine
 * Core Architecture & System Engineering: Chowra Engineering Team
 * Ref: SEC-ID-CHW-VGRE-2026-PROD
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plane, Truck, MapPin, Navigation, Compass, Radio, 
  Clock, Gauge, Maximize2, Minimize2, Play, Pause, 
  RotateCcw, Info, Layers, CheckCircle2, AlertTriangle, ArrowRight,
  ZoomIn, ZoomOut, Move, Crosshair, Search, X, SlidersHorizontal, Target
} from 'lucide-react';
import { ShipmentData } from '../types/logistics';
import { 
  getCityCoordinates, 
  calculateDistanceKm, 
  calculateCoverageProgress, 
  computeBezierRoute,
  GeoCoordinate 
} from '../utils/geoUtils';

interface ShipmentVisualMapTrackerProps {
  shipment: ShipmentData;
  className?: string;
}

export const ShipmentVisualMapTracker: React.FC<ShipmentVisualMapTrackerProps> = ({ 
  shipment, 
  className = '' 
}) => {
  // Distance units toggle
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'corridor' | 'network'>('corridor');
  const [hoveredNode, setHoveredNode] = useState<{ title: string; subtitle: string; x: number; y: number } | null>(null);

  // Zoom & Pan Interactive Telemetry State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [focusedHubName, setFocusedHubName] = useState<string | null>(null);
  const [activeFocusedHub, setActiveFocusedHub] = useState<{
    name: string;
    code: string;
    city: string;
    pin: string;
    pt: { x: number; y: number };
    status: string;
  } | null>(null);
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  // User input controls state with explicit placeholder support
  const [hubSearchQuery, setHubSearchQuery] = useState<string>('');
  const [inputZoomPercent, setInputZoomPercent] = useState<string>('100');
  const [inputPanX, setInputPanX] = useState<string>('0');
  const [inputPanY, setInputPanY] = useState<string>('0');

  // Keep input values in sync with live zoom/pan changes
  useEffect(() => {
    setInputZoomPercent(String(Math.round(zoom * 100)));
  }, [zoom]);

  useEffect(() => {
    setInputPanX(String(Math.round(pan.x)));
    setInputPanY(String(Math.round(pan.y)));
  }, [pan.x, pan.y]);

  const handleZoomIn = () => {
    setZoom((z) => Math.min(3.5, Number((z + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFocusedHubName(null);
    setActiveFocusedHub(null);
    setHubSearchQuery('');
  };

  const focusOnHub = (
    pt: { x: number; y: number }, 
    name: string, 
    subtitle: string,
    details?: { code?: string; city?: string; pin?: string; status?: string }
  ) => {
    const targetZoom = 2.1;
    // Map center is (400, 210). Pan to align clicked hub at center
    const targetPanX = (400 - pt.x) * targetZoom;
    const targetPanY = (210 - pt.y) * targetZoom;
    setZoom(targetZoom);
    setPan({ x: Math.round(targetPanX), y: Math.round(targetPanY) });
    setFocusedHubName(name);
    setHoveredNode({
      title: name,
      subtitle,
      x: pt.x,
      y: pt.y,
    });

    setActiveFocusedHub({
      name,
      code: details?.code || name.split(' ')[0],
      city: details?.city || name.split(' ')[0],
      pin: details?.pin || 'PIN-Verified',
      pt,
      status: details?.status || subtitle,
    });
  };

  const handleApplyZoomInput = (val: string) => {
    setInputZoomPercent(val);
    const num = Number(val);
    if (!isNaN(num) && num >= 50 && num <= 350) {
      setZoom(Number((num / 100).toFixed(2)));
    }
  };

  const handleApplyPanXInput = (val: string) => {
    setInputPanX(val);
    const num = Number(val);
    if (!isNaN(num)) {
      setPan((p) => ({ ...p, x: Math.round(num) }));
    }
  };

  const handleApplyPanYInput = (val: string) => {
    setInputPanY(val);
    const num = Number(val);
    if (!isNaN(num)) {
      setPan((p) => ({ ...p, y: Math.round(num) }));
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prevZoom) => {
      const next = Math.max(0.75, Math.min(3.5, prevZoom + zoomDelta));
      return Number(next.toFixed(2));
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && touchStartRef.current && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = null;
  };

  // Playback simulation of transit sweep
  const [isPlayingSimulation, setIsPlayingSimulation] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number | null>(null);

  // 1. Resolve Origin and Destination Coordinates
  const originCoord = useMemo<GeoCoordinate>(() => {
    return getCityCoordinates(shipment.origin.city, shipment.origin.country);
  }, [shipment.origin.city, shipment.origin.country]);

  const destCoord = useMemo<GeoCoordinate>(() => {
    return getCityCoordinates(shipment.destination.city, shipment.destination.country);
  }, [shipment.destination.city, shipment.destination.country]);

  // 2. Real-Time Distance Computation
  const totalDistanceKm = useMemo<number>(() => {
    return calculateDistanceKm(originCoord, destCoord);
  }, [originCoord, destCoord]);

  // Real Progress based on shipment status and checkpoints
  const targetProgress = useMemo<number>(() => {
    return calculateCoverageProgress(shipment.statusCode, shipment.checkpoints.length);
  }, [shipment.statusCode, shipment.checkpoints.length]);

  const activeProgress = simProgress !== null ? simProgress : targetProgress;

  // Active distance values
  const coveredDistanceKm = Math.round(totalDistanceKm * activeProgress);
  const remainingDistanceKm = Math.max(0, totalDistanceKm - coveredDistanceKm);

  // Unit conversion
  const formatDist = (km: number) => {
    if (unit === 'mi') {
      return `${Math.round(km * 0.621371).toLocaleString()} mi`;
    }
    return `${km.toLocaleString()} km`;
  };

  // Determine vehicle type (Flight vs Truck vs Van)
  const isAirMode = useMemo(() => {
    const v = (shipment.vehicleOrFlightNo || '').toLowerCase();
    const s = shipment.serviceType.toLowerCase();
    return v.includes('flight') || v.includes('air') || v.includes('lufthansa') || v.includes('6e') || s.includes('air') || s.includes('priority air');
  }, [shipment.vehicleOrFlightNo, shipment.serviceType]);

  // Estimated speed and ETA
  const averageSpeedKmh = isAirMode ? 750 : totalDistanceKm < 80 ? 35 : 68;
  const estimatedHoursRemaining = remainingDistanceKm > 0 ? (remainingDistanceKm / averageSpeedKmh).toFixed(1) : '0';

  // 3. Coordinate Projection onto SVG Viewport
  // SVG Viewport: 800 x 420
  const svgWidth = 800;
  const svgHeight = 420;

  // Map geographic (lat, lng) to SVG (x, y) coordinates
  const projectToSvg = (coord: GeoCoordinate) => {
    if (viewMode === 'corridor') {
      // Focus bounding box around origin & destination
      const minLat = Math.min(originCoord.lat, destCoord.lat);
      const maxLat = Math.max(originCoord.lat, destCoord.lat);
      const minLng = Math.min(originCoord.lng, destCoord.lng);
      const maxLng = Math.max(originCoord.lng, destCoord.lng);

      const latSpan = Math.max(maxLat - minLat, 5);
      const lngSpan = Math.max(maxLng - minLng, 6);

      const padX = 140;
      const padY = 80;

      // Project with latitude inverted (north is up in SVG)
      const x = padX + ((coord.lng - (minLng - lngSpan * 0.2)) / (lngSpan * 1.4)) * (svgWidth - padX * 2);
      const y = svgHeight - padY - ((coord.lat - (minLat - latSpan * 0.2)) / (latSpan * 1.4)) * (svgHeight - padY * 2);

      return {
        x: Math.max(60, Math.min(svgWidth - 60, x)),
        y: Math.max(50, Math.min(svgHeight - 50, y)),
      };
    } else {
      // Network view: Standard regional/India/Asia bounds (Lat: 6 to 54, Lng: 0 to 110)
      const isIntl = shipment.origin.country !== 'India' || shipment.destination.country !== 'India' || totalDistanceKm > 2200;
      
      const minLat = isIntl ? 0 : 7;
      const maxLat = isIntl ? 56 : 36;
      const minLng = isIntl ? -5 : 68;
      const maxLng = isIntl ? 115 : 94;

      const x = 70 + ((coord.lng - minLng) / (maxLng - minLng)) * (svgWidth - 140);
      const y = svgHeight - 60 - ((coord.lat - minLat) / (maxLat - minLat)) * (svgHeight - 120);

      return {
        x: Math.max(60, Math.min(svgWidth - 60, x)),
        y: Math.max(45, Math.min(svgHeight - 45, y)),
      };
    }
  };

  const startPt = useMemo(() => projectToSvg(originCoord), [originCoord, viewMode]);
  const endPt = useMemo(() => projectToSvg(destCoord), [destCoord, viewMode]);

  // Compute curved flight / road arc and current vehicle position
  const routeData = useMemo(() => {
    return computeBezierRoute(startPt, endPt, activeProgress);
  }, [startPt, endPt, activeProgress]);

  // Waypoint / Hub intermediate nodes for background context
  const networkWaypoints = useMemo(() => {
    const list: Array<{ name: string; code: string; coord: GeoCoordinate }> = [
      { name: 'Mumbai Super-Hub', code: 'BOM', coord: getCityCoordinates('Mumbai') },
      { name: 'Delhi NCR Hub', code: 'DEL', coord: getCityCoordinates('New Delhi') },
      { name: 'Bengaluru Aero Hub', code: 'BLR', coord: getCityCoordinates('Bengaluru') },
      { name: 'Hyderabad Hub', code: 'HYD', coord: getCityCoordinates('Hyderabad') },
      { name: 'Kolkata Gateway', code: 'CCU', coord: getCityCoordinates('Kolkata') },
      { name: 'Chennai Port Hub', code: 'MAA', coord: getCityCoordinates('Chennai') },
    ];
    return list.map(item => ({
      ...item,
      pt: projectToSvg(item.coord),
    }));
  }, [viewMode]);

  // Comprehensive searchable hub directory for user exploration
  const allSearchableHubs = useMemo(() => {
    return [
      {
        name: `${shipment.origin.city} Origin Hub`,
        code: originCoord.hubCode,
        city: shipment.origin.city,
        pin: shipment.origin.pin,
        pt: startPt,
        type: 'Origin Hub',
        status: 'Active Origin Facility',
      },
      {
        name: `${shipment.destination.city} Destination Hub`,
        code: destCoord.hubCode,
        city: shipment.destination.city,
        pin: shipment.destination.pin,
        pt: endPt,
        type: 'Destination Hub',
        status: 'Receiving Cargo Terminal',
      },
      ...networkWaypoints.map((w) => ({
        name: w.name,
        code: w.code,
        city: w.name.split(' ')[0],
        pin: '24/7 Cargo Hub',
        pt: w.pt,
        type: 'Key Transshipment Hub',
        status: 'Operational 24/7',
      })),
      {
        name: 'Ahmedabad Cargo Complex',
        code: 'AMD',
        city: 'Ahmedabad',
        pin: '380003',
        pt: projectToSvg(getCityCoordinates('Ahmedabad')),
        type: 'Western Linehaul Node',
        status: 'Active In-Scan Node',
      },
      {
        name: 'Pune Linehaul Sortation',
        code: 'PNQ',
        city: 'Pune',
        pin: '411014',
        pt: projectToSvg(getCityCoordinates('Pune')),
        type: 'Express Surface Node',
        status: 'Automated Sorter Active',
      },
    ];
  }, [shipment, originCoord, destCoord, startPt, endPt, networkWaypoints]);

  const filteredHubs = useMemo(() => {
    if (!hubSearchQuery.trim()) return [];
    const q = hubSearchQuery.trim().toLowerCase();
    return allSearchableHubs.filter(
      (h) =>
        (h.name || '').toLowerCase().includes(q) ||
        (h.code || '').toLowerCase().includes(q) ||
        (h.city || '').toLowerCase().includes(q) ||
        (h.pin || '').toLowerCase().includes(q)
    );
  }, [allSearchableHubs, hubSearchQuery]);

  // Animated sweep simulation loop
  useEffect(() => {
    let animFrame: number;
    let startTime: number | null = null;
    const duration = 4000; // 4 seconds full sweep

    if (isPlayingSimulation) {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const p = (elapsed % duration) / duration;
        setSimProgress(p);
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    } else {
      setSimProgress(null);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isPlayingSimulation]);

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-white shadow-xl transition-all ${className}`}>
      
      {/* Visual Tracker Telemetry Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Corridor & AWB Title */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-md shrink-0"
              style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
            >
              {isAirMode ? (
                <Plane className="w-5 h-5 text-slate-950" />
              ) : (
                <Truck className="w-5 h-5 text-slate-950" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-data">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Real-Time Hub-to-Hub Distance Telemetry</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-data">
                  {shipment.awbNumber}
                </span>
              </div>

              <div className="text-sm sm:text-base font-display font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{shipment.origin.city}</span>
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{shipment.destination.city}</span>
                <span className="text-xs font-normal text-slate-400 font-data hidden sm:inline">
                  ({originCoord.hubCode} → {destCoord.hubCode})
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Unit, Simulation, Mode, Expand */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-data">
              <button
                type="button"
                onClick={() => setViewMode('corridor')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'corridor' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Zoom into current transit lane"
              >
                Lane Focus
              </button>
              <button
                type="button"
                onClick={() => setViewMode('network')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'network' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Pan to complete hub logistics grid"
              >
                Grid View
              </button>
            </div>

            {/* Play/Pause Sweep Simulation */}
            <button
              type="button"
              onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 px-2.5 transition-colors cursor-pointer font-data ${
                isPlayingSimulation 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isPlayingSimulation ? 'Pause transit path animation' : 'Play transit route motion sweep'}
            >
              {isPlayingSimulation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{isPlayingSimulation ? 'Sweep: On' : 'Sweep Path'}</span>
            </button>

            {/* Units Toggle */}
            <button
              type="button"
              onClick={() => setUnit(unit === 'km' ? 'mi' : 'km')}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-data text-slate-300 transition-colors cursor-pointer"
              title="Toggle Kilometers / Miles"
            >
              {unit.toUpperCase()}
            </button>

            {/* Expand / Minimize */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse map viewport' : 'Expand map viewport'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Distance Coverage Metrics HUD Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Metric 1: Distance Covered */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/90">
            <span className="text-slate-400 block text-[11px] font-medium">Distance Covered</span>
            <div className="text-sm sm:text-base font-data font-bold text-[#a8eb12] mt-0.5">
              {formatDist(coveredDistanceKm)}
            </div>
            <span className="text-[10px] text-slate-500 font-data">
              {(activeProgress * 100).toFixed(1)}% Completed
            </span>
          </div>

          {/* Metric 2: Distance Remaining */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/90">
            <span className="text-slate-400 block text-[11px] font-medium">Distance Remaining</span>
            <div className="text-sm sm:text-base font-data font-bold text-amber-300 mt-0.5">
              {formatDist(remainingDistanceKm)}
            </div>
            <span className="text-[10px] text-slate-500 font-data">
              To {shipment.destination.city} Terminal
            </span>
          </div>

          {/* Metric 3: Total Lane Distance */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/90">
            <span className="text-slate-400 block text-[11px] font-medium">Total Hub Distance</span>
            <div className="text-sm sm:text-base font-data font-bold text-white mt-0.5">
              {formatDist(totalDistanceKm)}
            </div>
            <span className="text-[10px] text-slate-500 font-data">
              Great-Circle Geodesic
            </span>
          </div>

          {/* Metric 4: Cruising Velocity */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/90">
            <span className="text-slate-400 block text-[11px] font-medium">Telemetry Speed</span>
            <div className="text-sm sm:text-base font-data font-bold text-sky-400 mt-0.5 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{averageSpeedKmh} {unit === 'mi' ? 'mph' : 'km/h'}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-data">
              {isAirMode ? 'Air Corridor Speed' : 'Linehaul Surface Velocity'}
            </span>
          </div>

          {/* Metric 5: Estimated Time to Destination */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/90 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px] font-medium">Remaining Transit</span>
            <div className="text-sm sm:text-base font-data font-bold text-white mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {shipment.statusCode === 'DELIVERED' 
                  ? '0h (Delivered)' 
                  : `~${estimatedHoursRemaining} hrs`}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-data">
              Based on live dispatch
            </span>
          </div>

        </div>

        {/* Real-time Progress Bar */}
        <div className="mt-3.5 space-y-1">
          <div className="flex justify-between text-[11px] font-data text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00bf72]" />
              <span>Origin Hub: {originCoord.hubCode}</span>
            </span>
            <span className="text-amber-400 font-semibold font-data">
              {coveredDistanceKm} / {totalDistanceKm} km ({(activeProgress * 100).toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1">
              <span>Destination: {destCoord.hubCode}</span>
              <MapPin className="w-3 h-3 text-emerald-400" />
            </span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{
                width: `${Math.min(100, Math.max(3, activeProgress * 100))}%`,
                background: 'linear-gradient(90deg, #008793 0%, #00bf72 60%, #a8eb12 100%)',
                boxShadow: '0 0 12px rgba(0, 191, 114, 0.6)'
              }}
            >
              {/* Shimmer line */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Hub Exploration & Zoom/Pan Values Input Console */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          
          {/* Hub & Terminal Quick Search Input with Placeholder */}
          <div className="flex-1 relative">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore Hub Locations:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Enter values or click presets to inspect transshipment nodes
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={hubSearchQuery}
                onChange={(e) => setHubSearchQuery(e.target.value)}
                placeholder="Search hub or terminal (e.g. BOM, DEL, BLR, Hyderabad, CCU, MAA)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 font-data focus:outline-none focus:border-amber-400 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {hubSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHubSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtered Hubs Autocomplete Dropdown */}
            {filteredHubs.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800 max-h-48 overflow-y-auto">
                {filteredHubs.map((hub, idx) => (
                  <div
                    key={`search-hub-${idx}`}
                    onClick={() => {
                      focusOnHub(hub.pt, hub.name, `${hub.city} (${hub.code}) · ${hub.type}`, hub);
                      setHubSearchQuery('');
                    }}
                    className="p-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-[10px]">
                        {hub.code}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{hub.name}</div>
                        <div className="text-[10px] text-slate-400">{hub.city} · {hub.type} · PIN: {hub.pin}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-400 font-data flex items-center gap-1">
                      <span>Coordinates: ({Math.round(hub.pt.x)}, {Math.round(hub.pt.y)})</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coordinate & Zoom Value Inputs (User input fields with placeholders) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom % Input with Placeholder */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Zoom Level (%):</label>
              <div className="relative">
                <input
                  type="number"
                  min="75"
                  max="350"
                  step="5"
                  value={inputZoomPercent}
                  onChange={(e) => handleApplyZoomInput(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-data text-right focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-amber-500 absolute right-2 top-2 pointer-events-none">%</span>
              </div>
            </div>

            {/* Pan X Input with Placeholder */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Pan Offset X (px):</label>
              <input
                type="number"
                value={inputPanX}
                onChange={(e) => handleApplyPanXInput(e.target.value)}
                placeholder="e.g. 0"
                className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-data text-right focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Pan Y Input with Placeholder */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Pan Offset Y (px):</label>
              <input
                type="number"
                value={inputPanY}
                onChange={(e) => handleApplyPanYInput(e.target.value)}
                placeholder="e.g. 0"
                className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-data text-right focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Reset Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetView}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer font-data text-xs shadow-xs"
                title="Reset zoom to 100% and pan coordinates to (0, 0)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset View</span>
              </button>
            </div>

          </div>

        </div>

        {/* Quick Hub Focus Selector Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-data pt-1 border-t border-slate-800/80">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Crosshair className="w-3 h-3 text-amber-400" />
            <span>Quick Focus:</span>
          </span>
          <button
            type="button"
            onClick={() => focusOnHub(startPt, `${shipment.origin.city} Origin Hub`, `${shipment.origin.hub} · PIN: ${shipment.origin.pin}`, {
              code: originCoord.hubCode,
              city: shipment.origin.city,
              pin: shipment.origin.pin,
              status: 'Origin Consignment Departure Hub',
            })}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              focusedHubName?.includes(shipment.origin.city)
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{originCoord.hubCode} (Origin)</span>
          </button>

          <button
            type="button"
            onClick={() => focusOnHub(endPt, `${shipment.destination.city} Destination Hub`, `${shipment.destination.hub} · PIN: ${shipment.destination.pin}`, {
              code: destCoord.hubCode,
              city: shipment.destination.city,
              pin: shipment.destination.pin,
              status: 'Destination Consignment Receiving Hub',
            })}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              focusedHubName?.includes(shipment.destination.city)
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{destCoord.hubCode} (Dest)</span>
          </button>

          {networkWaypoints.map((wp, idx) => (
            <button
              key={`quick-wp-${idx}`}
              type="button"
              onClick={() => focusOnHub(wp.pt, wp.name, `Active Chowra Node · 24/7 Transshipment`, {
                code: wp.code,
                city: wp.name.split(' ')[0],
                pin: 'Cargo Terminal',
                status: 'Operational 24/7 Transshipment Facility',
              })}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                focusedHubName === wp.name
                  ? 'bg-sky-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {wp.code} ({wp.name.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div 
        className={`relative bg-slate-950 select-none overflow-hidden transition-all duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isExpanded ? 'h-[520px]' : 'h-[360px] sm:h-[400px]'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Floating Zoom & Pan Control HUD */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50"
            title="Zoom In (+25%)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetView();
            }}
            className="px-2 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-data text-amber-300 hover:text-amber-200 flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50 font-bold"
            title="Current Zoom Level. Click to Reset (100%)"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50"
            title="Zoom Out (-25%)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetView();
            }}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50"
            title="Center and Reset Pan & Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Hub Focus Selector Chips */}
        <div className="absolute top-3 left-3 z-20 hidden sm:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-2xl text-[11px] font-data">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Crosshair className="w-3 h-3 text-amber-400" />
            <span>Focus Hub:</span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              focusOnHub(startPt, `${shipment.origin.city} Origin Hub`, `${shipment.origin.hub} · PIN: ${shipment.origin.pin}`);
            }}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              focusedHubName?.includes(shipment.origin.city)
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {originCoord.hubCode} (Origin)
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              focusOnHub(endPt, `${shipment.destination.city} Destination Hub`, `${shipment.destination.hub} · PIN: ${shipment.destination.pin}`);
            }}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              focusedHubName?.includes(shipment.destination.city)
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {destCoord.hubCode} (Dest)
          </button>
          {networkWaypoints.slice(0, 3).map((wp, idx) => (
            <button
              key={`focus-wp-${idx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                focusOnHub(wp.pt, wp.name, `Active Chowra Node · 24/7 Transshipment`);
              }}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer hidden md:inline-block ${
                focusedHubName === wp.name
                  ? 'bg-sky-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {wp.code}
            </button>
          ))}
        </div>

        {/* Subtle geospatial grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient glow around route center */}
        <div 
          className="absolute pointer-events-none rounded-full blur-3xl opacity-15"
          style={{
            left: `${((startPt.x + endPt.x) / 2 / svgWidth) * 100}%`,
            top: `${((startPt.y + endPt.y) / 2 / svgHeight) * 100}%`,
            width: '280px',
            height: '280px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #00bf72 0%, #008793 40%, transparent 70%)'
          }}
        />

        {/* Main SVG Render */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full block"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Linear gradient for active route path */}
            <linearGradient id="routeProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#008793" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00bf72" stopOpacity="1" />
              <stop offset="100%" stopColor="#a8eb12" stopOpacity="1" />
            </linearGradient>

            {/* Glowing filter for active transit path */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulse ripple animation */}
            <radialGradient id="pulseRadial">
              <stop offset="0%" stopColor="#00bf72" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a8eb12" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Master Zoomable & Pannable Layer */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) translate(400, 210) scale(${zoom}) translate(-400, -210)`}
          >

          {/* Latitude / Longitude Subtle Reference Grids */}
          <g stroke="#334155" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.35">
            <line x1="0" y1="105" x2={svgWidth} y2="105" />
            <line x1="0" y1="210" x2={svgWidth} y2="210" />
            <line x1="0" y1="315" x2={svgWidth} y2="315" />
            <line x1="200" y1="0" x2="200" y2={svgHeight} />
            <line x1="400" y1="0" x2="400" y2={svgHeight} />
            <line x1="600" y1="0" x2="600" y2={svgHeight} />
          </g>

          {/* Geospatial Subcontinent & Coastal Silhouette Shapes (Stylized Vector Topology) */}
          <g opacity="0.22" fill="none" stroke="#475569" strokeWidth="1.2">
            {/* Stylized Indian Subcontinent coastline reference polygon */}
            <path d="M 120 80 Q 240 60 420 70 Q 560 80 680 90 L 710 130 Q 640 180 580 230 Q 520 310 470 380 Q 450 400 440 370 Q 380 320 340 260 Q 290 220 220 180 Q 150 140 120 80 Z" />
            {/* Arabian Sea / Bay of Bengal arc lines */}
            <path d="M 200 240 Q 260 300 320 340" strokeDasharray="2 4" stroke="#334155" />
            <path d="M 520 220 Q 560 280 600 320" strokeDasharray="2 4" stroke="#334155" />
          </g>

          {/* Secondary Network Hubs & Connecting Lanes (Background Grid View) */}
          {networkWaypoints.map((wp, i) => {
            const isOriginOrDest = 
              wp.code === originCoord.hubCode?.split('-')[0] || 
              wp.code === destCoord.hubCode?.split('-')[0];
            
            if (isOriginOrDest) return null;

            return (
              <g 
                key={`wp-${i}`} 
                opacity={viewMode === 'network' ? 0.7 : 0.25}
                className="transition-opacity cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  focusOnHub(wp.pt, `${wp.name} (${wp.code})`, `Active Chowra Node · 24/7 Transshipment Hub`);
                }}
                onMouseEnter={() => setHoveredNode({
                  title: `${wp.name} (${wp.code})`,
                  subtitle: `Active Chowra Node · 24/7 Transshipment (Click to zoom into hub)`,
                  x: wp.pt.x,
                  y: wp.pt.y
                })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle cx={wp.pt.x} cy={wp.pt.y} r="3.5" fill="#64748b" />
                <circle cx={wp.pt.x} cy={wp.pt.y} r="8" fill="transparent" stroke="#475569" strokeWidth="0.75" />
                <text 
                  x={wp.pt.x} 
                  y={wp.pt.y + 13} 
                  fill="#94a3b8" 
                  fontSize="9" 
                  textAnchor="middle" 
                  fontFamily="JetBrains Mono, monospace"
                >
                  {wp.code}
                </text>
              </g>
            );
          })}

          {/* Complete Planned Route Lane (Dashed Inactive Path) */}
          <path
            d={routeData.pathD}
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Active Distance Covered Route Path (Vibrant Gradient Arc) */}
          {/* We render a clipped / partial stroke using strokeDasharray to represent distance covered */}
          <path
            d={routeData.pathD}
            fill="none"
            stroke="url(#routeProgressGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            pathLength="100"
            strokeDasharray={`${Math.max(1, activeProgress * 100)} 100`}
            style={{
              transition: isPlayingSimulation ? 'none' : 'stroke-dasharray 0.6s ease-out'
            }}
          />

          {/* Subtle Dynamic CSS Animation Line: Flowing Light Particles Between Pickup & Destination Hubs */}
          <path
            d={routeData.pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="8 16"
            strokeLinecap="round"
            className="animate-flow-transit opacity-70 pointer-events-none"
            filter="url(#neonGlow)"
          />

          {/* Secondary High-Velocity Photon Beam along the path */}
          <path
            d={routeData.pathD}
            fill="none"
            stroke="#a8eb12"
            strokeWidth="1.5"
            strokeDasharray="4 20"
            strokeLinecap="round"
            className="animate-flow-fast opacity-85 pointer-events-none"
          />

          {/* Milepost Tick Markers at 25%, 50%, 75% along the arc */}
          {[0.25, 0.5, 0.75].map((pct, idx) => {
            const pt = computeBezierRoute(startPt, endPt, pct).currentVehiclePos;
            const isPassed = activeProgress >= pct;
            return (
              <g key={`marker-${idx}`} opacity={0.85}>
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isPassed ? "3" : "2"} 
                  fill={isPassed ? "#a8eb12" : "#475569"} 
                />
                <text 
                  x={pt.x} 
                  y={pt.y - 8} 
                  fill={isPassed ? "#a8eb12" : "#64748b"} 
                  fontSize="8" 
                  textAnchor="middle" 
                  fontFamily="JetBrains Mono, monospace"
                >
                  {(pct * 100)}%
                </text>
              </g>
            );
          })}

          {/* Origin Hub (Departed / Terminal Node) */}
          <g 
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              focusOnHub(startPt, `${shipment.origin.city} Origin Hub (${originCoord.hubCode})`, `${shipment.origin.hub} · Pincode: ${shipment.origin.pin}`);
            }}
            onMouseEnter={() => setHoveredNode({
              title: `${shipment.origin.city} Origin Hub (${originCoord.hubCode})`,
              subtitle: `${shipment.origin.hub} · Pincode: ${shipment.origin.pin} (Click to zoom into hub)`,
              x: startPt.x,
              y: startPt.y
            })}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Radar wave ping */}
            <circle cx={startPt.x} cy={startPt.y} r="16" fill="url(#pulseRadial)" className="animate-ping opacity-40" />
            <circle cx={startPt.x} cy={startPt.y} r="10" fill="#008793" opacity="0.3" />
            <circle cx={startPt.x} cy={startPt.y} r="6" fill="#00bf72" stroke="#ffffff" strokeWidth="1.5" />
            
            {/* Origin Label Badge */}
            <rect 
              x={startPt.x - 48} 
              y={startPt.y + 11} 
              width="96" 
              height="20" 
              rx="4" 
              fill="#0f172a" 
              stroke="#00bf72" 
              strokeWidth="1" 
              opacity="0.95"
            />
            <text 
              x={startPt.x} 
              y={startPt.y + 24} 
              fill="#ffffff" 
              fontSize="10" 
              fontWeight="bold" 
              textAnchor="middle" 
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {shipment.origin.city}
            </text>
            <text 
              x={startPt.x} 
              y={startPt.y - 12} 
              fill="#00bf72" 
              fontSize="8.5" 
              fontWeight="600" 
              textAnchor="middle" 
              fontFamily="JetBrains Mono, monospace"
            >
              ORIGIN HUB
            </text>
          </g>

          {/* Destination Hub (Target Delivery Terminal) */}
          <g 
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              focusOnHub(endPt, `${shipment.destination.city} Terminal (${destCoord.hubCode})`, `${shipment.destination.hub} · Pincode: ${shipment.destination.pin}`);
            }}
            onMouseEnter={() => setHoveredNode({
              title: `${shipment.destination.city} Terminal (${destCoord.hubCode})`,
              subtitle: `${shipment.destination.hub} · Pincode: ${shipment.destination.pin} (Click to zoom into hub)`,
              x: endPt.x,
              y: endPt.y
            })}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Radar wave target */}
            <circle cx={endPt.x} cy={endPt.y} r="18" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={endPt.x} cy={endPt.y} r="11" fill="#f59e0b" opacity="0.25" />
            <circle cx={endPt.x} cy={endPt.y} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />

            {/* Destination Label Badge */}
            <rect 
              x={endPt.x - 52} 
              y={endPt.y + 11} 
              width="104" 
              height="20" 
              rx="4" 
              fill="#0f172a" 
              stroke="#f59e0b" 
              strokeWidth="1" 
              opacity="0.95"
            />
            <text 
              x={endPt.x} 
              y={endPt.y + 24} 
              fill="#ffffff" 
              fontSize="10" 
              fontWeight="bold" 
              textAnchor="middle" 
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {shipment.destination.city}
            </text>
            <text 
              x={endPt.x} 
              y={endPt.y - 12} 
              fill="#fbbf24" 
              fontSize="8.5" 
              fontWeight="600" 
              textAnchor="middle" 
              fontFamily="JetBrains Mono, monospace"
            >
              DESTINATION
            </text>
          </g>

          {/* Active Live In-Transit Vehicle (Aircraft or Highway Truck) */}
          <g
            transform={`translate(${routeData.currentVehiclePos.x}, ${routeData.currentVehiclePos.y}) rotate(${routeData.currentAngleDeg})`}
            className="transition-transform duration-300"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0, 191, 114, 0.8))' }}
            onMouseEnter={() => setHoveredNode({
              title: `${shipment.vehicleOrFlightNo || (isAirMode ? 'Air Cargo Linehaul' : 'Express Highway Fleet')}`,
              subtitle: `Active Telemetry: ${coveredDistanceKm} km covered (${(activeProgress * 100).toFixed(1)}%) · Remaining: ${remainingDistanceKm} km`,
              x: routeData.currentVehiclePos.x,
              y: routeData.currentVehiclePos.y
            })}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Beacon ping aura */}
            <circle cx="0" cy="0" r="16" fill="rgba(168, 235, 18, 0.2)" className="animate-ping" />
            <circle cx="0" cy="0" r="12" fill="#0f172a" stroke="#a8eb12" strokeWidth="1.5" />

            {/* Vehicle Icon Centered */}
            {isAirMode ? (
              // Air Cargo Airplane SVG Vector (rotated to face heading)
              <path
                d="M -5 -7 L 0 -1 L 8 -7 L 10 -6 L 4 0 L 11 0 L 13 -2 L 14 -1 L 12 1 L 14 3 L 13 4 L 11 2 L 4 2 L 10 8 L 8 9 L 0 3 L -5 9 L -7 8 L -4 1 L -9 1 L -11 3 L -12 2 L -11 0 L -12 -2 L -11 -3 L -9 -1 L -4 -1 Z"
                fill="#ffffff"
                transform="rotate(90)"
              />
            ) : (
              // Highway Container Truck / Van SVG Vector
              <g transform="scale(0.8) translate(-8, -8)">
                <rect x="2" y="3" width="9" height="10" rx="1.5" fill="#a8eb12" />
                <path d="M 11 5 L 14 7 L 14 13 L 11 13 Z" fill="#ffffff" />
                <circle cx="5" cy="13" r="1.5" fill="#0f172a" />
                <circle cx="12" cy="13" r="1.5" fill="#0f172a" />
              </g>
            )}
          </g>

          {/* Floating Vehicle Status Tooltip Pill (always rendered right above vehicle) */}
          <g
            transform={`translate(${routeData.currentVehiclePos.x}, ${Math.max(26, routeData.currentVehiclePos.y - 28)})`}
            className="pointer-events-none"
          >
            <rect
              x="-60"
              y="-12"
              width="120"
              height="22"
              rx="11"
              fill="#020617"
              stroke="#a8eb12"
              strokeWidth="1"
              opacity="0.95"
            />
            <text
              x="0"
              y="3"
              fill="#a8eb12"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              {shipment.statusCode === 'DELIVERED' 
                ? 'ARRIVED & DELIVERED' 
                : `${(activeProgress * 100).toFixed(0)}% · ${formatDist(coveredDistanceKm)}`}
            </text>
          </g>

          {/* Active Focused Hub Target Reticle Animation */}
          {activeFocusedHub && (
            <g transform={`translate(${activeFocusedHub.pt.x}, ${activeFocusedHub.pt.y})`} className="pointer-events-none">
              <circle r="30" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin" />
              <circle r="20" fill="rgba(251, 191, 36, 0.18)" stroke="#fbbf24" strokeWidth="1.5" />
              <circle r="4" fill="#fbbf24" />
              <line x1="-34" y1="0" x2="-12" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="12" y1="0" x2="34" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="0" y1="-34" x2="0" y2="-12" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="0" y1="12" x2="0" y2="34" stroke="#fbbf24" strokeWidth="1.5" />
            </g>
          )}

          {/* End Master Zoomable Layer */}
          </g>

        </svg>

        {/* Focused Hub Telemetry Inspector Overlay */}
        {activeFocusedHub && (
          <div className="absolute top-14 left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-amber-400/60 rounded-xl p-3.5 shadow-2xl max-w-sm text-xs text-white space-y-2 animate-in fade-in zoom-in-95 pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold font-display">
                <Target className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Hub Inspector: {activeFocusedHub.code}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveFocusedHub(null);
                  setFocusedHubName(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                title="Close Hub View"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-300 font-data space-y-1">
              <div className="font-semibold text-white">{activeFocusedHub.name}</div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>PIN: <strong className="text-white font-mono">{activeFocusedHub.pin}</strong></span>
                <span>·</span>
                <span>Metro: <strong className="text-white">{activeFocusedHub.city}</strong></span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-800 text-[10px]">
                <span className="text-slate-400">SVG Map Coordinates:</span>
                <span className="text-emerald-400 font-mono font-bold">X: {Math.round(activeFocusedHub.pt.x)}, Y: {Math.round(activeFocusedHub.pt.y)}</span>
              </div>
              <div className="text-[10px] text-amber-300/90 pt-0.5">
                {activeFocusedHub.status}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={handleZoomIn}
                className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <ZoomIn className="w-3 h-3" />
                <span>Zoom Closer</span>
              </button>
              <button
                type="button"
                onClick={handleResetView}
                className="py-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Reset View to 100%"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Hover Tooltip Overlay */}
        {hoveredNode && (
          <div 
            className="absolute z-20 pointer-events-none bg-slate-900/95 border border-slate-700 text-white rounded-lg p-2.5 shadow-2xl backdrop-blur-sm text-xs font-sans max-w-xs transition-all"
            style={{
              left: `${Math.min(svgWidth - 180, Math.max(10, hoveredNode.x))}px`,
              top: `${Math.min(svgHeight - 70, Math.max(10, hoveredNode.y - 45))}px`,
            }}
          >
            <div className="font-bold text-amber-400 font-display flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{hoveredNode.title}</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 leading-snug font-data">
              {hoveredNode.subtitle}
            </div>
          </div>
        )}

        {/* Map Watermark & Control Tower Legend Footer */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-data pointer-events-none">
          <div className="flex items-center gap-3 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-xs pointer-events-auto">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00bf72]" />
              <span>Origin</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#a8eb12]" />
              <span>In-Transit</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
              <span>Destination</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-amber-300/90 pl-2 border-l border-slate-700">
              <Move className="w-3 h-3 text-amber-400" />
              <span>Drag to Pan · Wheel to Zoom · Click Hubs</span>
            </span>
          </div>

          <div 
            className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-xs cursor-pointer hover:border-amber-500/50 transition-colors pointer-events-auto"
            onClick={handleResetView}
            title="Reset Pan & Zoom View to 100%"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Chowra Multimodal Geospatial Engine v2.4 · Lead Architect: Chowra Engineering Team</span>
          </div>
        </div>

      </div>

      {/* Visual Tracker Bottom Summary Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-data">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Active Transit Waypoints:</span>
          <span className="text-white font-medium">
            {shipment.origin.hub.split(',')[0]} → {shipment.destination.hub.split(',')[0]}
          </span>
        </div>

        <div className="flex items-center gap-3 font-data text-[11px]">
          <span className="text-slate-400">
            Carrier: <strong className="text-slate-200">{shipment.vehicleOrFlightNo || 'Chowra Logistics Linehaul'}</strong>
          </span>
          <span>·</span>
          <span className="text-slate-400">
            Status: <strong className="text-[#a8eb12]">{shipment.currentStatus.split('-')[0]}</strong>
          </span>
        </div>
      </div>

    </div>
  );
};
