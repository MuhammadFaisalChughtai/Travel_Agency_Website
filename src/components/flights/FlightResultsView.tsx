"use client";

import React, { useState, useMemo } from "react";
import {
  Plane,
  Clock,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Filter,
  X,
  RotateCcw,
  Check,
  Crown,
  Tag,
  Zap,
  SlidersHorizontal,
  PhoneCall,
  Luggage,
  Sparkles,
} from "lucide-react";
import { FlightSearchResultItem } from "@/lib/travelport";
import { FlightBookingModal } from "./FlightBookingModal";
import { AirlineLogo } from "./AirlineLogo";

// Helper to convert "13h 35m" to total minutes
function durationStringToMinutes(dur?: string): number {
  if (!dur) return 0;
  const hMatch = dur.match(/(\d+)\s*h/i);
  const mMatch = dur.match(/(\d+)\s*m/i);
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
  return hours * 60 + mins;
}

// Helper to format minutes back into "13h 35m"
function formatMinutesToDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Helper to calculate total journey duration for a flight
function getFlightTotalMinutes(flight: FlightSearchResultItem): number {
  if (flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0) {
    return flight.legs.reduce((acc, l) => acc + durationStringToMinutes(l.totalDuration), 0);
  }
  const outboundMins = durationStringToMinutes(flight.outbound.totalDuration);
  const inboundMins = flight.inbound ? durationStringToMinutes(flight.inbound.totalDuration) : 0;
  return outboundMins + inboundMins;
}

// Get departure hour from "06:00:00"
function getDepartureHour(flight: FlightSearchResultItem): number {
  const timeStr = flight.outbound.departureTime;
  if (!timeStr) return 12;
  const hour = parseInt(timeStr.split(":")[0], 10);
  return isNaN(hour) ? 12 : hour;
}

interface FlightResultsViewProps {
  flights: FlightSearchResultItem[];
  searchCriteria: {
    tripType: "return" | "one-way" | "multi-city";
    passengers: { adults: number; children: number; infants: number };
    cabin: string;
    bags: number;
    origin?: string;
    destination?: string;
  };
}

export function FlightResultsView({
  flights,
  searchCriteria,
}: FlightResultsViewProps) {
  // ─── Sorting State ───
  const [sortBy, setSortBy] = useState<
    "cheapest" | "best" | "quickest" | "price-desc" | "departure-earliest" | "departure-latest"
  >("cheapest");

  // ─── Filter State ───
  const [selectedStops, setSelectedStops] = useState<number[]>([0, 1, 2]); // 0 = direct, 1 = 1 stop, 2 = 2+ stops
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [durationRange, setDurationRange] = useState<number>(0);
  const [checkedBagOnly, setCheckedBagOnly] = useState<boolean>(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]); // "morning", "afternoon", "evening"

  // ─── UI State ───
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState<FlightSearchResultItem | null>(null);

  // ─── Compute Global Metrics across all available flights ───
  const metrics = useMemo(() => {
    if (flights.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 1000,
        minDuration: 0,
        maxDuration: 1440,
        allAirlines: [] as string[],
        airlineMinPrices: {} as Record<string, number>,
        stopsMinPrices: {} as Record<number, number | null>,
        cheapestFlight: null as FlightSearchResultItem | null,
        bestFlight: null as FlightSearchResultItem | null,
        quickestFlight: null as FlightSearchResultItem | null,
      };
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let minDuration = Infinity;
    let maxDuration = -Infinity;

    const airlineMinPrices: Record<string, number> = {};
    const stopsMinPrices: Record<number, number | null> = {
      0: null,
      1: null,
      2: null,
    };

    flights.forEach((f) => {
      // Price
      if (f.price < minPrice) minPrice = f.price;
      if (f.price > maxPrice) maxPrice = f.price;

      // Duration
      const totalMins = getFlightTotalMinutes(f);
      if (totalMins < minDuration) minDuration = totalMins;
      if (totalMins > maxDuration) maxDuration = totalMins;

      // Airline
      if (!airlineMinPrices[f.airline] || f.price < airlineMinPrices[f.airline]) {
        airlineMinPrices[f.airline] = f.price;
      }

      // Stops
      const maxLegStops =
        f.tripType === "multi-city" && f.legs
          ? Math.max(...f.legs.map((l) => l.stopsCount))
          : Math.max(f.outbound.stopsCount, f.inbound?.stopsCount || 0);

      const stopCategory = maxLegStops === 0 ? 0 : maxLegStops === 1 ? 1 : 2;
      if (stopsMinPrices[stopCategory] === null || f.price < stopsMinPrices[stopCategory]!) {
        stopsMinPrices[stopCategory] = f.price;
      }
    });

    const allAirlines = Object.keys(airlineMinPrices).sort();

    // Identify Cheapest flight
    let cheapestFlight = flights[0];
    flights.forEach((f) => {
      if (f.price < cheapestFlight.price) cheapestFlight = f;
    });

    // Identify Quickest flight
    let quickestFlight = flights[0];
    flights.forEach((f) => {
      if (getFlightTotalMinutes(f) < getFlightTotalMinutes(quickestFlight)) {
        quickestFlight = f;
      }
    });

    // Identify Best flight (weighted score: 60% price, 40% duration)
    let bestFlight = flights[0];
    let bestScore = Infinity;
    flights.forEach((f) => {
      const priceNorm = (f.price - minPrice) / (maxPrice - minPrice || 1);
      const durNorm =
        (getFlightTotalMinutes(f) - minDuration) / (maxDuration - minDuration || 1);
      const score = priceNorm * 0.6 + durNorm * 0.4;
      if (score < bestScore) {
        bestScore = score;
        bestFlight = f;
      }
    });

    return {
      minPrice: Math.floor(minPrice),
      maxPrice: Math.ceil(maxPrice),
      minDuration,
      maxDuration,
      allAirlines,
      airlineMinPrices,
      stopsMinPrices,
      cheapestFlight,
      bestFlight,
      quickestFlight,
    };
  }, [flights]);

  // Initialize filter limits when flights change
  React.useEffect(() => {
    if (metrics.maxPrice > 0 && priceRange === 0) {
      setPriceRange(metrics.maxPrice);
    }
    if (metrics.maxDuration > 0 && durationRange === 0) {
      setDurationRange(metrics.maxDuration);
    }
    if (metrics.allAirlines.length > 0 && selectedAirlines.length === 0) {
      setSelectedAirlines(metrics.allAirlines);
    }
  }, [metrics, priceRange, durationRange, selectedAirlines.length]);

  // ─── Filter Logic ───
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      // 1. Stops filter
      const maxLegStops =
        flight.tripType === "multi-city" && flight.legs
          ? Math.max(...flight.legs.map((l) => l.stopsCount))
          : Math.max(flight.outbound.stopsCount, flight.inbound?.stopsCount || 0);

      const stopCategory = maxLegStops === 0 ? 0 : maxLegStops === 1 ? 1 : 2;
      if (!selectedStops.includes(stopCategory)) {
        return false;
      }

      // 2. Airline filter
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
        return false;
      }

      // 3. Price filter
      if (priceRange > 0 && flight.price > priceRange) {
        return false;
      }

      // 4. Duration filter
      if (durationRange > 0 && getFlightTotalMinutes(flight) > durationRange) {
        return false;
      }

      // 5. Checked Bag only filter
      if (checkedBagOnly) {
        const bagLower = flight.baggage.toLowerCase();
        if (bagLower.includes("no checked") || bagLower.includes("0 checked") || bagLower.includes("0 bag")) {
          return false;
        }
      }

      // 6. Time of day filter
      if (selectedTimeOfDay.length > 0) {
        const hour = getDepartureHour(flight);
        let matchesTime = false;
        if (selectedTimeOfDay.includes("morning") && hour >= 6 && hour < 12) matchesTime = true;
        if (selectedTimeOfDay.includes("afternoon") && hour >= 12 && hour < 18) matchesTime = true;
        if (selectedTimeOfDay.includes("evening") && (hour >= 18 || hour < 6)) matchesTime = true;
        if (!matchesTime) return false;
      }

      return true;
    });
  }, [
    flights,
    selectedStops,
    selectedAirlines,
    priceRange,
    durationRange,
    checkedBagOnly,
    selectedTimeOfDay,
  ]);

  // ─── Sort Logic ───
  const sortedFlights = useMemo(() => {
    const copy = [...filteredFlights];
    switch (sortBy) {
      case "cheapest":
        return copy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return copy.sort((a, b) => b.price - a.price);
      case "quickest":
        return copy.sort(
          (a, b) => getFlightTotalMinutes(a) - getFlightTotalMinutes(b)
        );
      case "departure-earliest":
        return copy.sort((a, b) =>
          a.outbound.departureTime.localeCompare(b.outbound.departureTime)
        );
      case "departure-latest":
        return copy.sort((a, b) =>
          b.outbound.departureTime.localeCompare(a.outbound.departureTime)
        );
      case "best":
      default: {
        const minP = metrics.minPrice;
        const maxP = metrics.maxPrice;
        const minD = metrics.minDuration;
        const maxD = metrics.maxDuration;
        return copy.sort((a, b) => {
          const scoreA =
            ((a.price - minP) / (maxP - minP || 1)) * 0.6 +
            ((getFlightTotalMinutes(a) - minD) / (maxD - minD || 1)) * 0.4;
          const scoreB =
            ((b.price - minP) / (maxP - minP || 1)) * 0.6 +
            ((getFlightTotalMinutes(b) - minD) / (maxD - minD || 1)) * 0.4;
          return scoreA - scoreB;
        });
      }
    }
  }, [filteredFlights, sortBy, metrics]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedStops([0, 1, 2]);
    setSelectedAirlines(metrics.allAirlines);
    setPriceRange(metrics.maxPrice);
    setDurationRange(metrics.maxDuration);
    setCheckedBagOnly(false);
    setSelectedTimeOfDay([]);
  };

  // Check if any filter is active
  const hasActiveFilters =
    selectedStops.length < 3 ||
    selectedAirlines.length < metrics.allAirlines.length ||
    (priceRange > 0 && priceRange < metrics.maxPrice) ||
    (durationRange > 0 && durationRange < metrics.maxDuration) ||
    checkedBagOnly ||
    selectedTimeOfDay.length > 0;

  // Toggle stop in filter
  const toggleStop = (stop: number) => {
    setSelectedStops((prev) =>
      prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop]
    );
  };

  // Toggle airline in filter
  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline]
    );
  };

  // Toggle time of day in filter
  const toggleTimeOfDay = (slot: string) => {
    setSelectedTimeOfDay((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 relative z-0">
      {/* ─── Top Header: Search Results Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs relative z-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-[#382626]">
            Flight Offers ({sortedFlights.length} of {flights.length})
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Prices include all airline taxes, surcharges, and Terrific Travel Price Match Guarantee.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileFilterDrawer(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6b4f4f] text-[#fff3e4] text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#eed6c4]" />
            )}
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#6b4f4f] bg-[#eed6c4]/25 px-3 py-1.5 rounded-full border border-[#eed6c4]/60">
            <ShieldCheck className="w-4 h-4 text-[#6b4f4f]" />
            <span>ATOL Protected</span>
          </span>
        </div>
      </div>

      {/* ─── Top Sort Bar (Cheapest / Best / Quickest Tabs) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6 relative z-0">
        {/* Cheapest Tab */}
        <button
          type="button"
          onClick={() => setSortBy("cheapest")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative z-0 overflow-hidden ${
            sortBy === "cheapest"
              ? "bg-[#6b4f4f] text-[#fff3e4] border-[#eed6c4] shadow-md ring-2 ring-[#eed6c4]/60"
              : "bg-white text-slate-800 border-slate-200 hover:border-[#6b4f4f]/50 hover:bg-[#f5f0eb]/40 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-heading font-black text-sm sm:text-base">
              <Tag className={`w-4 h-4 ${sortBy === "cheapest" ? "text-[#eed6c4]" : "text-[#6b4f4f]"}`} />
              <span>Cheapest</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sortBy === "cheapest"
                  ? "bg-[#eed6c4] text-[#382626]"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              Lowest Fare
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black">
              £{metrics.cheapestFlight?.price.toFixed(0) || "—"}
            </span>
            <span className="text-xs opacity-80">
              • {metrics.cheapestFlight?.outbound.totalDuration || ""}
            </span>
          </div>
        </button>

        {/* Best Tab */}
        <button
          type="button"
          onClick={() => setSortBy("best")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative z-0 overflow-hidden ${
            sortBy === "best"
              ? "bg-[#6b4f4f] text-[#fff3e4] border-[#eed6c4] shadow-md ring-2 ring-[#eed6c4]/60"
              : "bg-white text-slate-800 border-slate-200 hover:border-[#6b4f4f]/50 hover:bg-[#f5f0eb]/40 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-heading font-black text-sm sm:text-base">
              <Crown className={`w-4 h-4 ${sortBy === "best" ? "text-[#eed6c4]" : "text-amber-600"}`} />
              <span>Best</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sortBy === "best"
                  ? "bg-[#eed6c4] text-[#382626]"
                  : "bg-[#eed6c4]/40 text-[#6b4f4f] border border-[#eed6c4]/60"
              }`}
            >
              Price &amp; Speed
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black">
              £{metrics.bestFlight?.price.toFixed(0) || "—"}
            </span>
            <span className="text-xs opacity-80">
              • {metrics.bestFlight?.outbound.totalDuration || ""}
            </span>
          </div>
        </button>

        {/* Quickest Tab */}
        <button
          type="button"
          onClick={() => setSortBy("quickest")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative z-0 overflow-hidden ${
            sortBy === "quickest"
              ? "bg-[#6b4f4f] text-[#fff3e4] border-[#eed6c4] shadow-md ring-2 ring-[#eed6c4]/60"
              : "bg-white text-slate-800 border-slate-200 hover:border-[#6b4f4f]/50 hover:bg-[#f5f0eb]/40 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-heading font-black text-sm sm:text-base">
              <Zap className={`w-4 h-4 ${sortBy === "quickest" ? "text-[#eed6c4]" : "text-blue-600"}`} />
              <span>Quickest</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sortBy === "quickest"
                  ? "bg-[#eed6c4] text-[#382626]"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              Shortest Time
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black">
              £{metrics.quickestFlight?.price.toFixed(0) || "—"}
            </span>
            <span className="text-xs opacity-80">
              • {metrics.quickestFlight?.outbound.totalDuration || ""}
            </span>
          </div>
        </button>

        {/* Other Sort Options Dropdown */}
        <div className="relative z-0 flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full h-full min-h-[56px] px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#6b4f4f] cursor-pointer appearance-none shadow-xs hover:border-[#6b4f4f]/50 transition-colors"
          >
            <option value="cheapest">Sort: Price (Lowest First)</option>
            <option value="price-desc">Sort: Price (Highest First)</option>
            <option value="quickest">Sort: Duration (Shortest)</option>
            <option value="departure-earliest">Sort: Departure (Earliest)</option>
            <option value="departure-latest">Sort: Departure (Latest)</option>
            <option value="best">Sort: Best Overall Value</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
      </div>

      {/* ─── Main 2-Column Section: Sidebar Filters + Flight Results ─── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ─── Desktop Left Filter Sidebar ─── */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6b4f4f]" />
              <h3 className="font-heading font-black text-sm text-[#382626]">
                Filter by
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#6b4f4f] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>
            )}
          </div>

          {/* 1. Stops Filter */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#382626] uppercase tracking-wider">
              Stops
            </h4>
            <div className="space-y-1.5">
              {[
                { label: "Direct", value: 0, minPrice: metrics.stopsMinPrices[0] },
                { label: "1 stop", value: 1, minPrice: metrics.stopsMinPrices[1] },
                { label: "2+ stops", value: 2, minPrice: metrics.stopsMinPrices[2] },
              ].map((stop) => {
                const isAvailable = stop.minPrice !== null;
                const isChecked = selectedStops.includes(stop.value);
                return (
                  <label
                    key={stop.value}
                    className={`flex items-center justify-between text-xs py-1 px-1.5 rounded-lg cursor-pointer transition-colors ${
                      isAvailable
                        ? "hover:bg-[#f5f0eb]/70 text-slate-700"
                        : "opacity-40 cursor-not-allowed text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked && isAvailable}
                        disabled={!isAvailable}
                        onChange={() => toggleStop(stop.value)}
                        className="rounded border-slate-300 text-[#6b4f4f] focus:ring-[#6b4f4f] cursor-pointer"
                      />
                      <span className="font-semibold">{stop.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">
                      {isAvailable ? `from £${stop.minPrice?.toFixed(0)}` : "None"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Fare Assistant / Baggage */}
          <div className="space-y-2.5 pb-4 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#382626] uppercase tracking-wider flex items-center justify-between">
              <span>Baggage</span>
              <Luggage className="w-3.5 h-3.5 text-[#6b4f4f]" />
            </h4>
            <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer hover:bg-[#f5f0eb]/70 p-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={checkedBagOnly}
                onChange={(e) => setCheckedBagOnly(e.target.checked)}
                className="rounded border-slate-300 text-[#6b4f4f] focus:ring-[#6b4f4f] cursor-pointer"
              />
              <span>Checked bag included only</span>
            </label>
            <p className="text-[10px] text-slate-400 px-1">
              Filter flights that provide full 20kg+ checked luggage allowance.
            </p>
          </div>

          {/* 3. Take-off Times Filter */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#382626] uppercase tracking-wider flex items-center justify-between">
              <span>Departure Time</span>
              <Clock className="w-3.5 h-3.5 text-[#6b4f4f]" />
            </h4>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "morning", label: "Morning", sub: "06-12h" },
                { id: "afternoon", label: "Afternoon", sub: "12-18h" },
                { id: "evening", label: "Evening", sub: "18-24h" },
              ].map((slot) => {
                const isActive = selectedTimeOfDay.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleTimeOfDay(slot.id)}
                    className={`py-1.5 px-1 rounded-xl text-center border transition-all ${
                      isActive
                        ? "bg-[#6b4f4f] text-[#fff3e4] border-[#eed6c4]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#f5f0eb]"
                    }`}
                  >
                    <span className="block text-[11px] font-bold">{slot.label}</span>
                    <span className="block text-[9px] opacity-75">{slot.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Airlines Filter */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#382626] uppercase tracking-wider">
                Airlines
              </h4>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedAirlines(metrics.allAirlines)}
                  className="text-[#6b4f4f] hover:underline"
                >
                  All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedAirlines([])}
                  className="text-slate-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {metrics.allAirlines.map((airline) => {
                const isChecked = selectedAirlines.includes(airline);
                const minP = metrics.airlineMinPrices[airline];
                const carrier = flights.find((f) => f.airline === airline)?.carrier;
                return (
                  <label
                    key={airline}
                    className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg cursor-pointer hover:bg-[#f5f0eb]/70 text-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAirline(airline)}
                        className="rounded border-slate-300 text-[#6b4f4f] focus:ring-[#6b4f4f] cursor-pointer"
                      />
                      <AirlineLogo carrier={carrier} name={airline} className="w-5 h-5 rounded-md" />
                      <span className="font-semibold truncate max-w-[110px]" title={airline}>
                        {airline}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 shrink-0">
                      £{minP?.toFixed(0)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Price Filter */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-[#382626] uppercase tracking-wider">
                Max Price
              </h4>
              <span className="font-black text-[#6b4f4f]">
                Up to £{priceRange || metrics.maxPrice}
              </span>
            </div>
            <input
              type="range"
              min={metrics.minPrice}
              max={metrics.maxPrice}
              value={priceRange || metrics.maxPrice}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#6b4f4f] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>£{metrics.minPrice}</span>
              <span>£{metrics.maxPrice}</span>
            </div>
          </div>

          {/* 6. Duration Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-[#382626] uppercase tracking-wider">
                Max Duration
              </h4>
              <span className="font-black text-[#6b4f4f]">
                {formatMinutesToDuration(durationRange || metrics.maxDuration)}
              </span>
            </div>
            <input
              type="range"
              min={metrics.minDuration}
              max={metrics.maxDuration}
              value={durationRange || metrics.maxDuration}
              onChange={(e) => setDurationRange(Number(e.target.value))}
              className="w-full accent-[#6b4f4f] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>{formatMinutesToDuration(metrics.minDuration)}</span>
              <span>{formatMinutesToDuration(metrics.maxDuration)}</span>
            </div>
          </div>
        </aside>

        {/* ─── Right Flight Results List ─── */}
        <main className="flex-1 w-full space-y-4">
          {sortedFlights.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#eed6c4]/40 text-[#6b4f4f] mx-auto flex items-center justify-center">
                <Filter className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#382626]">
                No Flights Match Your Filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, including stops, or selecting more airlines.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[#6b4f4f] text-[#fff3e4] font-bold text-xs hover:bg-[#382626] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            sortedFlights.map((flight) => {
              const isExpanded = expandedFlightId === flight.id;
              const isCheapest = metrics.cheapestFlight?.id === flight.id;
              const isBest = metrics.bestFlight?.id === flight.id && !isCheapest;
              const isQuickest = metrics.quickestFlight?.id === flight.id && !isCheapest && !isBest;

              return (
                <div
                  key={flight.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#eed6c4]/70 hover:border-[#6b4f4f] hover:shadow-[0_15px_30px_rgba(56,38,38,0.08)] transition-all duration-300 flex flex-col relative"
                >
                  {/* Top Badge (if Cheapest / Best / Quickest) */}
                  {(isCheapest || isBest || isQuickest) && (
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-[#eed6c4] to-[#f5e6d8] px-3.5 py-1 rounded-br-xl text-[10px] font-black uppercase tracking-wider text-[#382626] flex items-center gap-1.5 border-b border-r border-[#eed6c4] z-10 shadow-xs">
                      {isCheapest && (
                        <>
                          <Tag className="w-3 h-3 text-[#6b4f4f]" />
                          <span>Cheapest Flight</span>
                        </>
                      )}
                      {isBest && (
                        <>
                          <Crown className="w-3 h-3 text-amber-700" />
                          <span>Best Value</span>
                        </>
                      )}
                      {isQuickest && (
                        <>
                          <Zap className="w-3 h-3 text-blue-700" />
                          <span>Quickest Route</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Main Flight Row */}
                  <div className="flex flex-col md:flex-row justify-between items-stretch pt-4 sm:pt-5">
                    {/* Left / Flights Timeline Info */}
                    <div className="p-4 sm:p-5 flex-1 space-y-4">
                      {/* Airline Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <AirlineLogo
                            carrier={flight.carrier}
                            name={flight.airline}
                            className="w-24 sm:w-36 h-12 sm:h-14 px-2.5 py-1.5"
                            variant="banner"
                          />
                          <div>
                            <span className="font-heading font-black text-sm sm:text-base text-[#382626] block">
                              {flight.airline}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold block mt-0.5">
                              {flight.tripType === "multi-city" && flight.legs
                                ? flight.legs.map((l, i) => `Flight ${i + 1}: ${l.flightNumbers}`).join(" • ")
                                : flight.outbound.flightNumbers}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {flight.cabin}
                          </span>
                        </div>
                      </div>

                      {/* Flight Legs Summary */}
                      {flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0 ? (
                        /* Multi-City Leg Rows */
                        <div className="space-y-3">
                          {flight.legs.map((leg, legIdx) => (
                            <div
                              key={legIdx}
                              className={legIdx > 0 ? "pt-3 border-t border-dashed border-slate-200" : ""}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#eed6c4]/40 text-[#6b4f4f]">
                                  Flight {legIdx + 1}
                                </span>
                                <span className="text-[11px] font-bold text-slate-600">
                                  {leg.departureAirport} → {leg.arrivalAirport}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  • {leg.departureDate}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                                <div className="w-28 sm:w-36">
                                  <span className="text-base sm:text-lg font-black text-slate-900 block">
                                    {leg.departureTime.slice(0, 5)}
                                  </span>
                                  <span className="font-bold text-slate-700 block">
                                    {leg.departureAirport}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    {leg.departureAirportName || leg.departureAirport}
                                  </span>
                                </div>

                                <div className="flex-1 flex flex-col items-center max-w-[190px]">
                                  <span className="text-[11px] font-bold text-slate-500">
                                    {leg.totalDuration}
                                  </span>
                                  <div className="w-full flex items-center gap-1 my-1">
                                    <div className="h-0.5 flex-1 bg-slate-200" />
                                    <Plane className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 rotate-90" />
                                    <div className="h-0.5 flex-1 bg-slate-200" />
                                  </div>
                                  <span className="text-[10px] font-bold text-[#6b4f4f]">
                                    {leg.isDirect
                                      ? "Non-stop"
                                      : `${leg.stopsCount} stop (${leg.segments[0]?.arrivalAirport})`}
                                  </span>
                                </div>

                                <div className="w-28 sm:w-36 text-right">
                                  <span className="text-base sm:text-lg font-black text-slate-900 block">
                                    {leg.arrivalTime.slice(0, 5)}
                                    {leg.arrivalDate !== leg.departureDate && (
                                      <sup className="text-rose-600 text-[10px] font-bold ml-0.5">
                                        +1
                                      </sup>
                                    )}
                                  </span>
                                  <span className="font-bold text-slate-700 block">
                                    {leg.arrivalAirport}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    {leg.arrivalAirportName || leg.arrivalAirport}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Return or One-Way Rows */
                        <div className="space-y-3.5">
                          {/* Outbound Leg */}
                          <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                            <div className="w-28 sm:w-36">
                              <span className="text-base sm:text-lg font-black text-slate-900 block">
                                {flight.outbound.departureTime.slice(0, 5)}
                              </span>
                              <span className="font-bold text-slate-700 block">
                                {flight.outbound.departureAirport}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {flight.outbound.departureDate}
                              </span>
                            </div>

                            <div className="flex-1 flex flex-col items-center max-w-[190px]">
                              <span className="text-[11px] font-bold text-slate-500">
                                {flight.outbound.totalDuration}
                              </span>
                              <div className="w-full flex items-center gap-1 my-1">
                                <div className="h-0.5 flex-1 bg-slate-200" />
                                <Plane className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 rotate-90" />
                                <div className="h-0.5 flex-1 bg-slate-200" />
                              </div>
                              <span className="text-[10px] font-bold text-[#6b4f4f]">
                                {flight.outbound.isDirect
                                  ? "Non-stop"
                                  : `${flight.outbound.stopsCount} stop (${flight.outbound.segments[0]?.arrivalAirport})`}
                              </span>
                            </div>

                            <div className="w-28 sm:w-36 text-right">
                              <span className="text-base sm:text-lg font-black text-slate-900 block">
                                {flight.outbound.arrivalTime.slice(0, 5)}
                                {flight.outbound.arrivalDate !== flight.outbound.departureDate && (
                                  <sup className="text-rose-600 text-[10px] font-bold ml-0.5">
                                    +1
                                  </sup>
                                )}
                              </span>
                              <span className="font-bold text-slate-700 block">
                                {flight.outbound.arrivalAirport}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {flight.outbound.arrivalDate}
                              </span>
                            </div>
                          </div>

                          {/* Inbound Leg (if Return) */}
                          {flight.inbound && (
                            <div className="flex items-center justify-between gap-4 text-xs sm:text-sm pt-3 border-t border-dashed border-slate-100">
                              <div className="w-28 sm:w-36">
                                <span className="text-base sm:text-lg font-black text-slate-900 block">
                                  {flight.inbound.departureTime.slice(0, 5)}
                                </span>
                                <span className="font-bold text-slate-700 block">
                                  {flight.inbound.departureAirport}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {flight.inbound.departureDate}
                                </span>
                              </div>

                              <div className="flex-1 flex flex-col items-center max-w-[190px]">
                                <span className="text-[11px] font-bold text-slate-500">
                                  {flight.inbound.totalDuration}
                                </span>
                                <div className="w-full flex items-center gap-1 my-1">
                                  <div className="h-0.5 flex-1 bg-slate-200" />
                                  <Plane className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 -rotate-90" />
                                  <div className="h-0.5 flex-1 bg-slate-200" />
                                </div>
                                <span className="text-[10px] font-bold text-[#6b4f4f]">
                                  {flight.inbound.isDirect
                                    ? "Non-stop"
                                    : `${flight.inbound.stopsCount} stop (${flight.inbound.segments[0]?.arrivalAirport})`}
                                </span>
                              </div>

                              <div className="w-28 sm:w-36 text-right">
                                <span className="text-base sm:text-lg font-black text-slate-900 block">
                                  {flight.inbound.arrivalTime.slice(0, 5)}
                                  {flight.inbound.arrivalDate !== flight.inbound.departureDate && (
                                    <sup className="text-rose-600 text-[10px] font-bold ml-0.5">
                                      +1
                                    </sup>
                                  )}
                                </span>
                                <span className="font-bold text-slate-700 block">
                                  {flight.inbound.arrivalAirport}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {flight.inbound.arrivalDate}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Flight Details Toggle Link */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFlightId(isExpanded ? null : flight.id)
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b4f4f] hover:text-[#382626] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#eed6c4]/20 border border-transparent hover:border-[#eed6c4]/50"
                        >
                          <span>
                            {isExpanded ? "Hide Flight Details" : "Flight details & transit"}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                            <span>{flight.baggage}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right / Pricing & CTA Column */}
                    <div className="w-full md:w-60 p-4 sm:p-5 bg-[#fcfaf8] border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between items-center text-center">
                      <div>
                        {/* Baggage Indicator Icons */}
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <span
                            title="Cabin Bag"
                            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                          >
                            <Briefcase className="w-3 h-3 text-emerald-600" />
                            <span>Cabin Bag</span>
                          </span>

                          <span
                            title="Checked Bag"
                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                              flight.baggage.toLowerCase().includes("no checked") ||
                              flight.baggage.toLowerCase().includes("0 checked")
                                ? "text-slate-400 bg-slate-100 border-slate-200 line-through"
                                : "text-emerald-700 bg-emerald-50 border-emerald-200"
                            }`}
                          >
                            <Luggage className="w-3 h-3" />
                            <span>Checked Bag</span>
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Total Price
                        </span>
                        <div className="text-2xl sm:text-3xl font-heading font-black text-[#6b4f4f] mt-0.5">
                          £{flight.price.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                          {flight.cabin} Cabin • All Taxes Included
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full space-y-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedFlightForBooking(flight)}
                          className="w-full h-11 rounded-xl bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        >
                          <span>Select / Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#eed6c4]" />
                        </button>

                        {/* WhatsApp CTA */}
                        <a
                          href={`https://wa.me/447888461474?text=${encodeURIComponent(
                            flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
                              ? `Hello Terrific Travel, I would like to book the multi-city flight with ${flight.airline} (${flight.legs.map((l, i) => `Flight ${i + 1}: ${l.departureAirport} to ${l.arrivalAirport} on ${l.departureDate}`).join(", ")}) for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                              : flight.inbound
                              ? `Hello Terrific Travel, I would like to book the return flight with ${flight.airline} (${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport} on ${flight.outbound.departureDate}, returning ${flight.inbound.departureDate}) for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                              : `Hello Terrific Travel, I would like to book the ${flight.airline} flight (${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport}) on ${flight.outbound.departureDate} for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-9 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <svg className="w-4 h-4 text-[#25D366] shrink-0 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
                          </svg>
                          <span>Chat on WhatsApp</span>
                        </a>

                        <a
                          href="tel:+441215291630"
                          className="text-[11px] font-bold text-[#6b4f4f] hover:underline flex items-center justify-center gap-1 pt-0.5"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Call 01215 291630</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ─── Expandable Flight Details Drawer ─── */}
                  {isExpanded && (
                    <div className="w-full bg-[#fcfaf8] border-t border-[#eed6c4]/60 p-4 sm:p-6 space-y-6">
                      {flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0 ? (
                        /* Multi-City Legs Detailed Breakdown */
                        flight.legs.map((leg, legIdx) => (
                          <div
                            key={legIdx}
                            className={`space-y-3 ${legIdx > 0 ? "pt-5 border-t border-[#eed6c4]/60" : ""}`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eed6c4]/50">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#6b4f4f] text-[#fff3e4] flex items-center justify-center font-bold text-xs">
                                  <Plane className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-heading font-black text-sm text-[#382626]">
                                    Flight {legIdx + 1} • {leg.departureAirportName || leg.departureAirport} to{" "}
                                    {leg.arrivalAirportName || leg.arrivalAirport}
                                  </h4>
                                  <p className="text-[11px] text-slate-500">
                                    {leg.departureDate} • Total Travel Time:{" "}
                                    <strong className="text-slate-700">{leg.totalDuration}</strong>
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#6b4f4f] bg-[#eed6c4]/30 px-2.5 py-0.5 rounded-full border border-[#eed6c4]/50">
                                {leg.isDirect ? "Non-stop" : `${leg.stopsCount} Connection(s)`}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {leg.segments.map((seg, sIdx) => (
                                <React.Fragment key={sIdx}>
                                  <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100 text-xs">
                                      <div className="flex items-center gap-2">
                                        <AirlineLogo
                                          carrier={seg.carrier || flight.carrier}
                                          name={seg.airline}
                                          size="xs"
                                          className="w-6 h-6"
                                        />
                                        <span className="font-heading font-black text-sm text-[#382626]">
                                          {seg.airline}
                                        </span>
                                        <span className="bg-[#eed6c4]/30 text-[#6b4f4f] font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                                          {seg.flightNumber}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-600 font-medium text-[11px]">
                                          {seg.aircraft || "Commercial Jet"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                          {flight.cabin}
                                        </span>
                                        <span className="text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5 text-[#6b4f4f]" />
                                          Flight duration: {seg.duration}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                      <div>
                                        <span className="font-heading font-black text-slate-900 text-lg">
                                          {seg.departureTime.slice(0, 5)}
                                        </span>
                                        <span className="font-bold text-slate-800 ml-2">
                                          {seg.departureAirport}
                                        </span>
                                        {seg.departureTerminal && (
                                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">
                                            Terminal {seg.departureTerminal}
                                          </span>
                                        )}
                                        <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                          {seg.departureAirportName || seg.departureAirport}
                                        </p>
                                        <p className="text-[11px] text-slate-400">Date: {seg.departureDate}</p>
                                      </div>

                                      <div>
                                        <span className="font-heading font-black text-slate-900 text-lg">
                                          {seg.arrivalTime.slice(0, 5)}
                                        </span>
                                        <span className="font-bold text-slate-800 ml-2">
                                          {seg.arrivalAirport}
                                        </span>
                                        {seg.arrivalTerminal && (
                                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">
                                            Terminal {seg.arrivalTerminal}
                                          </span>
                                        )}
                                        <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                          {seg.arrivalAirportName || seg.arrivalAirport}
                                        </p>
                                        <p className="text-[11px] text-slate-400">Date: {seg.arrivalDate}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {sIdx < leg.segments.length - 1 && (
                                    <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 flex items-center gap-3">
                                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-amber-700" />
                                      </div>
                                      <div className="text-xs text-amber-950 font-bold">
                                        <span>Layover at {seg.arrivalAirport}: </span>
                                        <span className="bg-amber-100 px-2 py-0.5 rounded font-black">
                                          {seg.connectionDuration || "Connection"}
                                        </span>
                                        <span className="font-normal ml-1.5 text-amber-800 text-[11px]">
                                          • Baggage checked through
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        /* Outbound & Inbound Detailed Segments */
                        <>
                          {/* Outbound Segments */}
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eed6c4]/50">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#6b4f4f] text-[#fff3e4] flex items-center justify-center font-bold text-xs">
                                  <Plane className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-heading font-black text-sm text-[#382626]">
                                    Outbound • {flight.outbound.departureAirportName || flight.outbound.departureAirport} to{" "}
                                    {flight.outbound.arrivalAirportName || flight.outbound.arrivalAirport}
                                  </h4>
                                  <p className="text-[11px] text-slate-500">
                                    {flight.outbound.departureDate} • Total Travel Time:{" "}
                                    <strong className="text-slate-700">{flight.outbound.totalDuration}</strong>
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#6b4f4f] bg-[#eed6c4]/30 px-2.5 py-0.5 rounded-full border border-[#eed6c4]/50">
                                {flight.outbound.isDirect
                                  ? "Non-stop"
                                  : `${flight.outbound.stopsCount} Connection(s)`}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {flight.outbound.segments.map((seg, sIdx) => (
                                <React.Fragment key={sIdx}>
                                  <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100 text-xs">
                                      <div className="flex items-center gap-2">
                                        <AirlineLogo
                                          carrier={seg.carrier || flight.carrier}
                                          name={seg.airline}
                                          size="xs"
                                          className="w-6 h-6"
                                        />
                                        <span className="font-heading font-black text-sm text-[#382626]">
                                          {seg.airline}
                                        </span>
                                        <span className="bg-[#eed6c4]/30 text-[#6b4f4f] font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                                          {seg.flightNumber}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-600 font-medium text-[11px]">
                                          {seg.aircraft || "Commercial Jet"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                          {flight.cabin}
                                        </span>
                                        <span className="text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5 text-[#6b4f4f]" />
                                          Flight duration: {seg.duration}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                      <div>
                                        <span className="font-heading font-black text-slate-900 text-lg">
                                          {seg.departureTime.slice(0, 5)}
                                        </span>
                                        <span className="font-bold text-slate-800 ml-2">
                                          {seg.departureAirport}
                                        </span>
                                        {seg.departureTerminal && (
                                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">
                                            Terminal {seg.departureTerminal}
                                          </span>
                                        )}
                                        <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                          {seg.departureAirportName || seg.departureAirport}
                                        </p>
                                        <p className="text-[11px] text-slate-400">Date: {seg.departureDate}</p>
                                      </div>

                                      <div>
                                        <span className="font-heading font-black text-slate-900 text-lg">
                                          {seg.arrivalTime.slice(0, 5)}
                                        </span>
                                        <span className="font-bold text-slate-800 ml-2">
                                          {seg.arrivalAirport}
                                        </span>
                                        {seg.arrivalTerminal && (
                                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">
                                            Terminal {seg.arrivalTerminal}
                                          </span>
                                        )}
                                        <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                          {seg.arrivalAirportName || seg.arrivalAirport}
                                        </p>
                                        <p className="text-[11px] text-slate-400">Date: {seg.arrivalDate}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {sIdx < flight.outbound.segments.length - 1 && (
                                    <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 flex items-center gap-3">
                                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-amber-700" />
                                      </div>
                                      <div className="text-xs text-amber-950 font-bold">
                                        <span>Layover at {seg.arrivalAirport}: </span>
                                        <span className="bg-amber-100 px-2 py-0.5 rounded font-black">
                                          {seg.connectionDuration || "Connection"}
                                        </span>
                                        <span className="font-normal ml-1.5 text-amber-800 text-[11px]">
                                          • Baggage checked through to final destination
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          {/* Inbound Segments (if Return) */}
                          {flight.inbound && (
                            <div className="space-y-3 pt-4 border-t border-[#eed6c4]/50">
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eed6c4]/50">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#6b4f4f] text-[#fff3e4] flex items-center justify-center font-bold text-xs">
                                    <Plane className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-heading font-black text-sm text-[#382626]">
                                      Return • {flight.inbound.departureAirportName || flight.inbound.departureAirport} to{" "}
                                      {flight.inbound.arrivalAirportName || flight.inbound.arrivalAirport}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                      {flight.inbound.departureDate} • Total Travel Time:{" "}
                                      <strong className="text-slate-700">{flight.inbound.totalDuration}</strong>
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#6b4f4f] bg-[#eed6c4]/30 px-2.5 py-0.5 rounded-full border border-[#eed6c4]/50">
                                  {flight.inbound.isDirect
                                    ? "Non-stop"
                                    : `${flight.inbound.stopsCount} Connection(s)`}
                                </span>
                              </div>

                              <div className="space-y-3">
                                {flight.inbound.segments.map((seg, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm">
                                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100 text-xs">
                                        <div className="flex items-center gap-2">
                                          <AirlineLogo
                                            carrier={seg.carrier || flight.carrier}
                                            name={seg.airline}
                                            size="xs"
                                            className="w-6 h-6"
                                          />
                                          <span className="font-heading font-black text-sm text-[#382626]">
                                            {seg.airline}
                                          </span>
                                          <span className="bg-[#eed6c4]/30 text-[#6b4f4f] font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                                            {seg.flightNumber}
                                          </span>
                                          <span className="text-slate-300">•</span>
                                          <span className="text-slate-600 font-medium text-[11px]">
                                            {seg.aircraft || "Commercial Jet"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                            {flight.cabin}
                                          </span>
                                          <span className="text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-[#6b4f4f]" />
                                            Flight duration: {seg.duration}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                        <div>
                                          <span className="font-heading font-black text-slate-900 text-lg">
                                            {seg.departureTime.slice(0, 5)}
                                          </span>
                                          <span className="font-bold text-slate-800 ml-2">
                                            {seg.departureAirport}
                                          </span>
                                          {seg.departureTerminal && (
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">
                                              Terminal {seg.departureTerminal}
                                            </span>
                                          )}
                                          <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                            {seg.departureAirportName || seg.departureAirport}
                                          </p>
                                          <p className="text-[11px] text-slate-400">Date: {seg.departureDate}</p>
                                        </div>

                                        <div>
                                          <span className="font-heading font-black text-slate-900 text-lg">
                                            {seg.arrivalTime.slice(0, 5)}
                                          </span>
                                          <span className="font-bold text-slate-800 ml-2">
                                            {seg.arrivalAirport}
                                          </span>
                                          {seg.arrivalTerminal && (
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">
                                              Terminal {seg.arrivalTerminal}
                                            </span>
                                          )}
                                          <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                            {seg.arrivalAirportName || seg.arrivalAirport}
                                          </p>
                                          <p className="text-[11px] text-slate-400">Date: {seg.arrivalDate}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {sIdx < flight.inbound!.segments.length - 1 && (
                                      <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                          <Clock className="w-4 h-4 text-amber-700" />
                                        </div>
                                        <div className="text-xs text-amber-950 font-bold">
                                          <span>Layover at {seg.arrivalAirport}: </span>
                                          <span className="bg-amber-100 px-2 py-0.5 rounded font-black">
                                            {seg.connectionDuration || "Connection"}
                                          </span>
                                          <span className="font-normal ml-1.5 text-amber-800 text-[11px]">
                                            • Baggage checked through
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Drawer Bottom Bar: Baggage & Select */}
                      <div className="bg-[#eed6c4]/20 border border-[#eed6c4]/60 rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <Briefcase className="w-3.5 h-3.5 text-[#6b4f4f]" />
                            <span>Baggage: {flight.baggage}</span>
                          </span>
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Terrific Travel ATOL Protected Booking</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              Total
                            </span>
                            <span className="font-heading font-black text-base text-[#6b4f4f]">
                              £{flight.price.toFixed(2)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFlightForBooking(flight)}
                            className="px-5 py-2 rounded-xl bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Book This Flight
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* ─── Mobile Filter Drawer Modal ─── */}
      {showMobileFilterDrawer && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div className="w-full max-w-sm bg-white h-full ml-auto overflow-y-auto p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#6b4f4f]" />
                  <h3 className="font-heading font-black text-base text-[#382626]">
                    Filter Flights
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileFilterDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stops Filter Mobile */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h4 className="text-xs font-bold text-[#382626] uppercase">Stops</h4>
                <div className="space-y-1.5">
                  {[
                    { label: "Direct", value: 0, minPrice: metrics.stopsMinPrices[0] },
                    { label: "1 stop", value: 1, minPrice: metrics.stopsMinPrices[1] },
                    { label: "2+ stops", value: 2, minPrice: metrics.stopsMinPrices[2] },
                  ].map((stop) => (
                    <label
                      key={stop.value}
                      className="flex items-center justify-between text-xs py-1 text-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedStops.includes(stop.value)}
                          disabled={stop.minPrice === null}
                          onChange={() => toggleStop(stop.value)}
                          className="rounded text-[#6b4f4f]"
                        />
                        <span>{stop.label}</span>
                      </div>
                      <span className="font-bold text-slate-500">
                        {stop.minPrice !== null ? `from £${stop.minPrice?.toFixed(0)}` : "None"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Baggage Filter Mobile */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h4 className="text-xs font-bold text-[#382626] uppercase">Baggage</h4>
                <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={checkedBagOnly}
                    onChange={(e) => setCheckedBagOnly(e.target.checked)}
                    className="rounded text-[#6b4f4f]"
                  />
                  <span>Checked bag included only</span>
                </label>
              </div>

              {/* Airlines Mobile */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <h4 className="text-xs font-bold text-[#382626] uppercase">Airlines</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {metrics.allAirlines.map((airline) => {
                    const carrier = flights.find((f) => f.airline === airline)?.carrier;
                    return (
                      <label
                        key={airline}
                        className="flex items-center justify-between text-xs py-1.5 text-slate-700"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={selectedAirlines.includes(airline)}
                            onChange={() => toggleAirline(airline)}
                            className="rounded text-[#6b4f4f]"
                          />
                          <AirlineLogo carrier={carrier} name={airline} className="w-5 h-5 rounded-md" />
                          <span className="truncate">{airline}</span>
                        </div>
                        <span className="font-bold text-slate-500 shrink-0">
                          £{metrics.airlineMinPrices[airline]?.toFixed(0)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Mobile */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-[#382626] uppercase">Max Price</h4>
                  <span className="font-black text-[#6b4f4f]">Up to £{priceRange || metrics.maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={metrics.minPrice}
                  max={metrics.maxPrice}
                  value={priceRange || metrics.maxPrice}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#6b4f4f]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilterDrawer(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#6b4f4f] text-[#fff3e4] text-xs font-bold"
              >
                Apply ({sortedFlights.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Flight Booking Modal ─── */}
      <FlightBookingModal
        flight={selectedFlightForBooking}
        isOpen={!!selectedFlightForBooking}
        onClose={() => setSelectedFlightForBooking(null)}
        searchCriteria={searchCriteria}
      />
    </div>
  );
}
