import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, Plane, Building2, Warehouse, Cpu, Anchor, 
  Check, Crosshair, X, Loader2, Sparkles, Navigation 
} from 'lucide-react';
import { LOGISTICS_PLACES_DATABASE, LogisticsPlace } from '../data/logisticsPlaces';

interface PlacesAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelectPlace: (place: { address: string; city: string; pincode: string; title: string }) => void;
  placeholder?: string;
  helperText?: string;
  type?: 'pickup' | 'destination';
  cityHint?: string;
}

export const PlacesAutocompleteInput: React.FC<PlacesAutocompleteInputProps> = ({
  label,
  value,
  onChange,
  onSelectPlace,
  placeholder = 'Search address, industrial estate, tech park, or airport...',
  helperText,
  type = 'pickup',
  cityHint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLocating, setIsLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter places based on input query
  const query = value.trim().toLowerCase();
  
  const filteredPlaces = LOGISTICS_PLACES_DATABASE.filter((place) => {
    if (!query) return true;
    return (
      place.primary.toLowerCase().includes(query) ||
      place.secondary.toLowerCase().includes(query) ||
      place.city.toLowerCase().includes(query) ||
      place.pincode.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query)
    );
  }).slice(0, 6);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (place: LogisticsPlace) => {
    onChange(`${place.primary}, ${place.secondary}`);
    onSelectPlace({
      address: `${place.primary}, ${place.secondary}`,
      city: place.city,
      pincode: place.pincode,
      title: place.primary,
    });
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredPlaces.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev > 0 ? prev - 1 : filteredPlaces.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredPlaces.length) {
        handleSelect(filteredPlaces[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSimulateGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      const defaultHub = LOGISTICS_PLACES_DATABASE[0]; // Marol Industrial Area
      onChange(`${defaultHub.primary}, ${defaultHub.secondary}`);
      onSelectPlace({
        address: `${defaultHub.primary}, ${defaultHub.secondary}`,
        city: defaultHub.city,
        pincode: defaultHub.pincode,
        title: defaultHub.primary,
      });
      setIsLocating(false);
      setIsOpen(false);
    }, 700);
  };

  const getCategoryIcon = (category: LogisticsPlace['category']) => {
    switch (category) {
      case 'Air Cargo Terminal':
        return <Plane className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'Industrial Estate':
        return <Warehouse className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'Tech Park / SEZ':
        return <Cpu className="w-4 h-4 text-[#a8eb12] shrink-0" />;
      case 'Commercial Hub':
        return <Building2 className="w-4 h-4 text-[#00bf72] shrink-0" />;
      case 'Port / CFS':
        return <Anchor className="w-4 h-4 text-cyan-400 shrink-0" />;
      default:
        return <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block font-medium text-slate-300 text-xs">
          {label}
        </label>
        {type === 'pickup' && (
          <button
            type="button"
            onClick={handleSimulateGPS}
            disabled={isLocating}
            className="text-[11px] text-[#00bf72] hover:text-[#a8eb12] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin text-[#00bf72]" />
            ) : (
              <Crosshair className="w-3 h-3 text-[#00bf72]" />
            )}
            <span>{isLocating ? 'Locating GPS...' : 'Use Current Hub Location'}</span>
          </button>
        )}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors"
        />

        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {helperText && (
        <span className="text-[11px] text-slate-400 mt-1 block">
          {helperText}
        </span>
      )}

      {/* Google Places-Style Floating Autocomplete Panel */}
      {isOpen && (
        <div 
          className="absolute z-50 left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(0, 191, 114, 0.2)'
          }}
        >
          {/* Header Bar: Google Places-Style Attribution & Fast Filter */}
          <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Sparkles className="w-3 h-3 text-[#a8eb12]" />
              <span>Smart Places Autocomplete</span>
            </span>
            <span className="font-data text-slate-500">
              Verified Logistics Corridors
            </span>
          </div>

          {/* List of Place Suggestions */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place, idx) => {
                const isSelected = highlightedIndex === idx;
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => handleSelect(place)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full text-left p-3 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-800/80 text-white' 
                        : 'hover:bg-slate-800/50 text-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      {getCategoryIcon(place.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-white truncate">
                          {place.primary}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-950 text-[#a8eb12] border border-slate-800 shrink-0 font-data">
                          {place.pincode}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {place.secondary}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-data">
                        <span className="text-[#00bf72] font-medium">{place.category}</span>
                        <span>•</span>
                        <span>{place.city}, {place.country}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                <p>No exact logistics hub found for "{value}".</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  You can keep typing your custom street address, building, or landmark.
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-3.5 py-1.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Press ↑↓ to navigate, Enter to select</span>
            <span className="text-[#00bf72]">Auto-fills City & Pincode</span>
          </div>
        </div>
      )}
    </div>
  );
};
