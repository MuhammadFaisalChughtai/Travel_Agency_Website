"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  X,
  Plus,
  Trash2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  PlaneTakeoff,
  PlaneLanding,
  ArrowRight,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { POPULAR_AIRPORTS, searchAirports, Airport } from "@/lib/airports";
import { FlightSearchResultItem, formatBaggageAllowance } from "@/lib/travelport";
import { FlightBookingModal } from "./FlightBookingModal";

export function TravelportFlightSearch() {
  const [tripType, setTripType] = useState<"return" | "one-way" | "multi-city">("return");
  const [bags, setBags] = useState<number>(0);

  // Return / One-way fields
  const [origin, setOrigin] = useState<string>("Manchester (MAN)");
  const [originCode, setOriginCode] = useState<string>("MAN");

  const [destination, setDestination] = useState<string>("");
  const [destinationCode, setDestinationCode] = useState<string>("");

  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  // Passenger & Cabin state
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [cabin, setCabin] = useState<string>("Economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState<boolean>(false);

  // Multi-city legs
  const [multiCityLegs, setMultiCityLegs] = useState<
    Array<{
      from: string;
      fromCode: string;
      to: string;
      toCode: string;
      date: string;
      cabin: string;
    }>
  >([
    { from: "Manchester (MAN)", fromCode: "MAN", to: "", toCode: "", date: "", cabin: "Economy" },
    { from: "", fromCode: "", to: "Manchester (MAN)", toCode: "MAN", date: "", cabin: "Economy" },
  ]);

  // Autocomplete dropdown state
  const [activeAirportField, setActiveAirportField] = useState<string | null>(null);
  const [airportQuery, setAirportQuery] = useState<string>("");

  // Search results state
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<FlightSearchResultItem[]>([]);
  const [searchError, setSearchError] = useState<string>("");
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState<FlightSearchResultItem | null>(null);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

  const passengerDropdownRef = useRef<HTMLDivElement>(null);
  const airportDropdownRef = useRef<HTMLDivElement>(null);

  // Default dates: departure in 3 weeks, return in 4 weeks
  useEffect(() => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(dep.getDate() + 25);
    const ret = new Date(dep);
    ret.setDate(ret.getDate() + 7);

    const formatYMD = (d: Date) => d.toISOString().split("T")[0];
    setDepartureDate(formatYMD(dep));
    setReturnDate(formatYMD(ret));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        passengerDropdownRef.current &&
        !passengerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPassengerDropdown(false);
      }
      if (
        airportDropdownRef.current &&
        !airportDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveAirportField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Swap Origin and Destination
  const handleSwapAirports = () => {
    const tempName = origin;
    const tempCode = originCode;
    setOrigin(destination);
    setOriginCode(destinationCode);
    setDestination(tempName);
    setDestinationCode(tempCode);
  };

  // Select airport from dropdown
  const handleSelectAirport = (field: string, airport: Airport) => {
    const label = `${airport.city} (${airport.code})`;
    if (field === "origin") {
      setOrigin(label);
      setOriginCode(airport.code);
    } else if (field === "destination") {
      setDestination(label);
      setDestinationCode(airport.code);
    } else if (field.startsWith("multi-from-")) {
      const idx = parseInt(field.replace("multi-from-", ""), 10);
      setMultiCityLegs((prev) => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], from: label, fromCode: airport.code };
        return copy;
      });
    } else if (field.startsWith("multi-to-")) {
      const idx = parseInt(field.replace("multi-to-", ""), 10);
      setMultiCityLegs((prev) => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], to: label, toCode: airport.code };
        return copy;
      });
    }
    setActiveAirportField(null);
    setAirportQuery("");
  };

  // Add another flight leg in multi-city
  const handleAddMultiCityLeg = () => {
    if (multiCityLegs.length < 5) {
      const lastLeg = multiCityLegs[multiCityLegs.length - 1];
      setMultiCityLegs((prev) => [
        ...prev,
        {
          from: lastLeg.to || "",
          fromCode: lastLeg.toCode || "",
          to: "",
          toCode: "",
          date: "",
          cabin: "Economy",
        },
      ]);
    }
  };

  // Remove multi-city leg
  const handleRemoveMultiCityLeg = (index: number) => {
    if (multiCityLegs.length > 2) {
      setMultiCityLegs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Clear all multi-city legs
  const handleClearMultiCity = () => {
    setMultiCityLegs([
      { from: "", fromCode: "", to: "", toCode: "", date: "", cabin: "Economy" },
      { from: "", fromCode: "", to: "", toCode: "", date: "", cabin: "Economy" },
    ]);
  };

  // Execute Flight Search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError("");
    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]);

    try {
      let legs: Array<{ from: string; to: string; departureDate: string }> = [];

      if (tripType === "return") {
        if (!originCode || !destinationCode || !departureDate || !returnDate) {
          setSearchError("Please select departure airport, destination, and dates.");
          setIsSearching(false);
          return;
        }
        legs = [
          { from: originCode, to: destinationCode, departureDate },
          { from: destinationCode, to: originCode, departureDate: returnDate },
        ];
      } else if (tripType === "one-way") {
        if (!originCode || !destinationCode || !departureDate) {
          setSearchError("Please select departure airport, destination, and date.");
          setIsSearching(false);
          return;
        }
        legs = [{ from: originCode, to: destinationCode, departureDate }];
      } else {
        // Multi-city
        for (let i = 0; i < multiCityLegs.length; i++) {
          const l = multiCityLegs[i];
          if (!l.fromCode || !l.toCode || !l.date) {
            setSearchError(`Please complete all details for Flight Leg ${i + 1}.`);
            setIsSearching(false);
            return;
          }
          legs.push({ from: l.fromCode, to: l.toCode, departureDate: l.date });
        }
      }

      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType,
          legs,
          passengers: { adults, children, infants },
          cabin,
          bags,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to fetch flights.");
      }

      setSearchResults(data.flights || []);
      if (!data.flights || data.flights.length === 0) {
        setSearchError(
          data.message ||
            "No flights were found for these exact dates and route. Please adjust your dates or contact our agents for offline specials."
        );
      }

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById("travelport-results-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("[Search Error]", err);
      setSearchError(err.message || "An error occurred while searching flights.");
    } finally {
      setIsSearching(false);
    }
  };

  const totalPassengers = adults + children + infants;
  const passengerSummaryText = `${totalPassengers} ${
    totalPassengers === 1 ? "adult" : "travelers"
  }, ${cabin}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-10 md:-mt-16 relative z-30">
      {/* ─── Search Bar Container ─── */}
      <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-[0_20px_50px_rgba(56,38,38,0.12)] border border-[#eed6c4]/80">
        
        {/* Top Selectors (Trip Type & Bags) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-4">
            {/* Trip Type Dropdown */}
            <div className="relative">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as any)}
                className="appearance-none bg-transparent hover:text-[#6b4f4f] pr-6 py-1 cursor-pointer font-bold focus:outline-none transition-colors"
              >
                <option value="return">Return</option>
                <option value="one-way">One-way</option>
                <option value="multi-city">Multi-city</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            {/* Bags Dropdown */}
            <div className="relative">
              <select
                value={bags}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBags(val);
                  if (searchResults.length > 0) {
                    const newBaggage = formatBaggageAllowance(val);
                    setSearchResults((prev) =>
                      prev.map((f) => ({ ...f, baggage: newBaggage }))
                    );
                  }
                }}
                className="appearance-none bg-transparent hover:text-[#6b4f4f] pr-6 py-1 cursor-pointer font-bold focus:outline-none transition-colors"
              >
                <option value={0}>0 bags</option>
                <option value={1}>1 bag</option>
                <option value={2}>2 bags</option>
                <option value={3}>3+ bags</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>

        {/* ─── Search Form Body ─── */}
        {tripType !== "multi-city" ? (
          /* RETURN & ONE-WAY LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 bg-[#f5f0eb]/60 rounded-2xl border border-slate-200/80">
            {/* Origin & Destination with Swap Button */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-11 gap-1 items-center bg-white rounded-xl border border-slate-200/90 p-1 relative">
              {/* Origin */}
              <div className="sm:col-span-5 relative">
                <input
                  type="text"
                  value={activeAirportField === "origin" ? airportQuery : origin}
                  onFocus={() => {
                    setActiveAirportField("origin");
                    setAirportQuery("");
                  }}
                  onChange={(e) => setAirportQuery(e.target.value)}
                  placeholder="From?"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {origin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrigin("");
                      setOriginCode("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  title="Swap Departure and Destination"
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#eed6c4]/40 flex items-center justify-center text-slate-600 hover:text-[#6b4f4f] transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Destination */}
              <div className="sm:col-span-5 relative">
                <input
                  type="text"
                  value={activeAirportField === "destination" ? airportQuery : destination}
                  onFocus={() => {
                    setActiveAirportField("destination");
                    setAirportQuery("");
                  }}
                  onChange={(e) => setAirportQuery(e.target.value)}
                  placeholder="To?"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {destination && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDestination("");
                      setDestinationCode("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Airport Autocomplete Popover */}
              {activeAirportField && (
                <div
                  ref={airportDropdownRef}
                  className="absolute left-0 top-full mt-2 w-full sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 max-h-72 overflow-y-auto"
                >
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {airportQuery ? "Matching Airports" : "Popular Airports"}
                  </p>
                  {searchAirports(airportQuery).map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelectAirport(activeAirportField, item)}
                      className="w-full text-left px-3 py-2 hover:bg-[#f5f0eb] rounded-xl flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          {item.city} ({item.code})
                        </span>
                        <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                          {item.name}, {item.country}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {item.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dates (Departure & Return) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 px-3 py-1 flex items-center justify-between relative">
              <div className="flex-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Departure
                  </span>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              {tripType === "return" && (
                <>
                  <div className="w-px h-8 bg-slate-200 mx-2" />
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Return
                      </span>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Passenger & Cabin Dropdown */}
            <div className="lg:col-span-2 relative" ref={passengerDropdownRef}>
              <button
                type="button"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="w-full h-full min-h-[50px] bg-white rounded-xl border border-slate-200/90 px-3 py-2 flex items-center justify-between text-left hover:border-[#6b4f4f]/50 transition-colors"
              >
                <div className="truncate pr-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Travelers
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {passengerSummaryText}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* Popover */}
              {showPassengerDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                  {/* Adults */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Adults</p>
                      <p className="text-slate-400 text-[10px]">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(9, prev + 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Children</p>
                      <p className="text-slate-400 text-[10px]">Age 2 - 11</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Infants</p>
                      <p className="text-slate-400 text-[10px]">Under 2</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => Math.min(4, prev + 1))}
                        className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cabin Class */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="font-bold text-slate-800 text-xs mb-2">Cabin Class</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Economy", "PremiumEconomy", "Business", "First"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCabin(c)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left transition-colors ${
                            cabin === c
                              ? "bg-[#6b4f4f] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {c === "PremiumEconomy" ? "Premium Eco" : c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassengerDropdown(false)}
                    className="w-full py-2 bg-[#6b4f4f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#382626] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1 flex items-center">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="w-full h-full min-h-[50px] bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isSearching ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-CITY LAYOUT */
          <div className="space-y-3">
            {multiCityLegs.map((leg, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 bg-[#f5f0eb]/60 rounded-2xl border border-slate-200/80 items-center"
              >
                {/* Leg From */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 px-3 py-2 relative">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    From (Flight {index + 1})
                  </span>
                  <input
                    type="text"
                    value={activeAirportField === `multi-from-${index}` ? airportQuery : leg.from}
                    onFocus={() => {
                      setActiveAirportField(`multi-from-${index}`);
                      setAirportQuery("");
                    }}
                    onChange={(e) => setAirportQuery(e.target.value)}
                    placeholder="From?"
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  {activeAirportField === `multi-from-${index}` && (
                    <div
                      ref={airportDropdownRef}
                      className="absolute left-0 top-full mt-2 w-full sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 max-h-60 overflow-y-auto"
                    >
                      {searchAirports(airportQuery).map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelectAirport(`multi-from-${index}`, item)}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f0eb] rounded-xl flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-slate-800">
                            {item.city} ({item.code})
                          </span>
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Leg To */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 px-3 py-2 relative">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    To
                  </span>
                  <input
                    type="text"
                    value={activeAirportField === `multi-to-${index}` ? airportQuery : leg.to}
                    onFocus={() => {
                      setActiveAirportField(`multi-to-${index}`);
                      setAirportQuery("");
                    }}
                    onChange={(e) => setAirportQuery(e.target.value)}
                    placeholder="To?"
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  {activeAirportField === `multi-to-${index}` && (
                    <div
                      ref={airportDropdownRef}
                      className="absolute left-0 top-full mt-2 w-full sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 max-h-60 overflow-y-auto"
                    >
                      {searchAirports(airportQuery).map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelectAirport(`multi-to-${index}`, item)}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f0eb] rounded-xl flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-slate-800">
                            {item.city} ({item.code})
                          </span>
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Leg Departure Date */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 px-3 py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Departure
                  </span>
                  <input
                    type="date"
                    value={leg.date}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMultiCityLegs((prev) => {
                        const copy = [...prev];
                        copy[index] = { ...copy[index], date: val };
                        return copy;
                      });
                    }}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                  />
                </div>

                {/* Cabin */}
                <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/90 px-2 py-2 text-center text-xs font-bold text-slate-700">
                  {leg.cabin}
                </div>

                {/* Remove Leg Button */}
                <div className="lg:col-span-1 flex justify-center">
                  {index >= 2 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveMultiCityLeg(index)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove Leg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-8" />
                  )}
                </div>
              </div>
            ))}

            {/* Bottom Actions for Multi-City */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={handleAddMultiCityLeg}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#6b4f4f] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#6b4f4f]" />
                  <span>Add another flight</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearMultiCity}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="px-8 h-[48px] bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 ml-auto"
              >
                {isSearching ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search Flights</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {searchError && (
          <div className="mt-4 flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <p className="flex-1">{searchError}</p>
          </div>
        )}
      </div>

      {/* ─── Search Results Section ─── */}
      <div id="travelport-results-section" className="mt-8">
        {isSearching && (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#eed6c4]/40 flex items-center justify-center text-[#6b4f4f] animate-bounce mb-4">
              <Plane className="w-8 h-8 rotate-45" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#382626]">
              Searching Live Flight Fares…
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md">
              Connecting to global airlines for the lowest available rates and live seat availability.
            </p>
          </div>
        )}

        {!isSearching && hasSearched && searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="font-heading font-black text-slate-800 text-base sm:text-lg">
                  Available Flight Offers ({searchResults.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Showing lowest live fares from airlines worldwide. All taxes included.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6b4f4f] bg-[#eed6c4]/20 px-3 py-1 rounded-full border border-[#eed6c4]/40">
                  Price Match Guarantee
                </span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((flight) => {
                const isExpanded = expandedFlightId === flight.id;
                return (
                  <div
                    key={flight.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#eed6c4]/60 hover:border-[#6b4f4f]/50 hover:shadow-[0_15px_30px_rgba(56,38,38,0.08)] transition-all duration-300 flex flex-col"
                  >
                    {/* Top Row: Flight Summary & Pricing Column */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch">
                      {/* Left / Flight Summary Column */}
                      <div className="p-4 sm:p-5 flex-1 space-y-4">
                        {/* Airline & Status Bar */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-[#6b4f4f]">
                              {flight.carrier}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-[#382626]">
                                {flight.airline}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
                                  ? flight.legs.map((l, i) => `Flight ${i + 1}: ${l.flightNumbers}`).join(" • ")
                                  : flight.outbound.flightNumbers}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {flight.cabin}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                flight.baggage.toLowerCase().includes("no checked") || flight.baggage.toLowerCase().includes("0 checked")
                                  ? "bg-slate-100 text-slate-700 border-slate-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {flight.baggage}
                            </span>
                          </div>
                        </div>

                        {/* Multi-City Journey or Outbound/Inbound Summary */}
                        {flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0 ? (
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
                                    <span className="text-base sm:text-lg font-black text-slate-800 block">
                                      {leg.departureTime.slice(0, 5)}
                                    </span>
                                    <span className="font-bold text-slate-600 block">
                                      {leg.departureAirport}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block truncate">
                                      {leg.departureAirportName || leg.departureAirport}
                                    </span>
                                  </div>

                                  <div className="flex-1 flex flex-col items-center max-w-[180px]">
                                    <span className="text-[11px] font-semibold text-slate-500">
                                      {leg.totalDuration}
                                    </span>
                                    <div className="w-full flex items-center gap-1 my-1">
                                      <div className="h-0.5 flex-1 bg-slate-200" />
                                      <Plane className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 rotate-90" />
                                      <div className="h-0.5 flex-1 bg-slate-200" />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#6b4f4f]">
                                      {leg.isDirect
                                        ? "Direct Flight"
                                        : `${leg.stopsCount} stop (${leg.segments[0]?.arrivalAirport})`}
                                    </span>
                                  </div>

                                  <div className="w-28 sm:w-36 text-right">
                                    <span className="text-base sm:text-lg font-black text-slate-800 block">
                                      {leg.arrivalTime.slice(0, 5)}
                                    </span>
                                    <span className="font-bold text-slate-600 block">
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
                          <>
                            {/* Outbound Leg Summary */}
                            <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                              <div className="w-28 sm:w-36">
                                <span className="text-base sm:text-lg font-black text-slate-800 block">
                                  {flight.outbound.departureTime.slice(0, 5)}
                                </span>
                                <span className="font-bold text-slate-600 block">
                                  {flight.outbound.departureAirport}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {flight.outbound.departureDate}
                                </span>
                              </div>

                              <div className="flex-1 flex flex-col items-center max-w-[180px]">
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {flight.outbound.totalDuration}
                                </span>
                                <div className="w-full flex items-center gap-1 my-1">
                                  <div className="h-0.5 flex-1 bg-slate-200" />
                                  <Plane className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 rotate-90" />
                                  <div className="h-0.5 flex-1 bg-slate-200" />
                                </div>
                                <span className="text-[10px] font-bold text-[#6b4f4f]">
                                  {flight.outbound.isDirect
                                    ? "Direct Flight"
                                    : `${flight.outbound.stopsCount} stop (${flight.outbound.segments[0]?.arrivalAirport})`}
                                </span>
                              </div>

                              <div className="w-28 sm:w-36 text-right">
                                <span className="text-base sm:text-lg font-black text-slate-800 block">
                                  {flight.outbound.arrivalTime.slice(0, 5)}
                                </span>
                                <span className="font-bold text-slate-600 block">
                                  {flight.outbound.arrivalAirport}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {flight.outbound.arrivalDate}
                                </span>
                              </div>
                            </div>

                            {/* Inbound Leg Summary (if Return) */}
                            {flight.inbound && (
                              <div className="flex items-center justify-between gap-4 text-xs sm:text-sm pt-3 border-t border-dashed border-slate-100">
                                <div className="w-28 sm:w-36">
                                  <span className="text-base sm:text-lg font-black text-slate-800 block">
                                    {flight.inbound.departureTime.slice(0, 5)}
                                  </span>
                                  <span className="font-bold text-slate-600 block">
                                    {flight.inbound.departureAirport}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    {flight.inbound.departureDate}
                                  </span>
                                </div>

                                <div className="flex-1 flex flex-col items-center max-w-[180px]">
                                  <span className="text-[11px] font-semibold text-slate-500">
                                    {flight.inbound.totalDuration}
                                  </span>
                                  <div className="w-full flex items-center gap-1 my-1">
                                    <div className="h-0.5 flex-1 bg-slate-200" />
                                    <Plane className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 -rotate-90" />
                                    <div className="h-0.5 flex-1 bg-slate-200" />
                                  </div>
                                  <span className="text-[10px] font-bold text-[#6b4f4f]">
                                    {flight.inbound.isDirect
                                      ? "Direct Flight"
                                      : `${flight.inbound.stopsCount} stop (${flight.inbound.segments[0]?.arrivalAirport})`}
                                  </span>
                                </div>

                                <div className="w-28 sm:w-36 text-right">
                                  <span className="text-base sm:text-lg font-black text-slate-800 block">
                                    {flight.inbound.arrivalTime.slice(0, 5)}
                                  </span>
                                  <span className="font-bold text-slate-600 block">
                                    {flight.inbound.arrivalAirport}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate">
                                    {flight.inbound.arrivalDate}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Flight Details Toggle Bar */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedFlightId(isExpanded ? null : flight.id)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b4f4f] hover:text-[#382626] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#eed6c4]/20 border border-transparent hover:border-[#eed6c4]/50"
                          >
                            <span>
                              {isExpanded ? "Hide Flight Details" : "Flight Details & Transit"}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#6b4f4f]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#6b4f4f]" />
                            )}
                          </button>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            {flight.tripType === "multi-city" && flight.legs ? (
                              flight.legs.some((l) => l.segments.some((s) => s.connectionDuration)) && (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Transit Connections
                                </span>
                              )
                            ) : (
                              flight.outbound.segments.some((s) => s.connectionDuration) && (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  {flight.outbound.segments[0]?.connectionDuration} Layover
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right / Pricing & Book Now Column */}
                      <div className="w-full md:w-56 p-4 sm:p-5 bg-[#fcfaf8] border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between items-center text-center">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            Total Price
                          </span>
                          <div className="text-2xl sm:text-3xl font-heading font-black text-[#6b4f4f] mt-0.5">
                            £{flight.price.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Includes all taxes &amp; fees
                          </span>
                        </div>

                        <div className="w-full space-y-2 mt-4">
                          <button
                            type="button"
                            onClick={() => setSelectedFlightForBooking(flight)}
                            className="w-full h-11 rounded-xl bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                          >
                            <span>Book Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Inquiry Button */}
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
                            <span>Call +44 1215 291630</span>
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
                                    {legIdx === 0 ? (
                                      <PlaneTakeoff className="w-4 h-4" />
                                    ) : legIdx === flight.legs!.length - 1 ? (
                                      <PlaneLanding className="w-4 h-4" />
                                    ) : (
                                      <Plane className="w-4 h-4" />
                                    )}
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
                                  {leg.isDirect
                                    ? "Non-stop"
                                    : `${leg.stopsCount} Connection(s)`}
                                </span>
                              </div>

                              {/* Multi-city Segments Loop */}
                              <div className="space-y-3">
                                {leg.segments.map((seg, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:border-[#eed6c4] transition-colors">
                                      {/* Segment Header */}
                                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100 text-xs">
                                        <div className="flex items-center gap-2">
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

                                      {/* Departure & Arrival Details */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                        {/* Departure */}
                                        <div className="flex items-start gap-3">
                                          <div className="w-3 h-3 rounded-full bg-[#6b4f4f] mt-1 shrink-0 ring-4 ring-[#eed6c4]/40" />
                                          <div>
                                            <div className="flex items-baseline gap-2">
                                              <span className="font-heading font-black text-slate-900 text-lg">
                                                {seg.departureTime.slice(0, 5)}
                                              </span>
                                              <span className="font-bold text-slate-800">
                                                {seg.departureAirport}
                                              </span>
                                              {seg.departureTerminal && (
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                  Terminal {seg.departureTerminal}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                              {seg.departureAirportName || seg.departureAirport}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                              Date: {seg.departureDate}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Arrival */}
                                        <div className="flex items-start gap-3">
                                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white mt-1 shrink-0 ring-4 ring-[#eed6c4]/40" />
                                          <div>
                                            <div className="flex items-baseline gap-2">
                                              <span className="font-heading font-black text-slate-900 text-lg">
                                                {seg.arrivalTime.slice(0, 5)}
                                              </span>
                                              <span className="font-bold text-slate-800">
                                                {seg.arrivalAirport}
                                              </span>
                                              {seg.arrivalTerminal && (
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                  Terminal {seg.arrivalTerminal}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                              {seg.arrivalAirportName || seg.arrivalAirport}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                              Date: {seg.arrivalDate}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Transit / Layover Banner */}
                                    {sIdx < leg.segments.length - 1 && (
                                      <div className="bg-gradient-to-r from-amber-50 to-[#fff8f0] border border-amber-200/90 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-amber-700" />
                                          </div>
                                          <div>
                                            <div className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                                              <span>Layover / Transit at {seg.arrivalAirportName || seg.arrivalAirport}:</span>
                                              <span className="font-black text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                                                {seg.connectionDuration || "Connection"}
                                              </span>
                                            </div>
                                            <p className="text-[11px] text-amber-800 mt-0.5">
                                              Baggage checked through to final destination • Connect to{" "}
                                              <strong className="text-amber-950">
                                                {leg.segments[sIdx + 1]?.airline} (
                                                {leg.segments[sIdx + 1]?.flightNumber})
                                              </strong>
                                            </p>
                                          </div>
                                        </div>
                                        <span className="bg-amber-200/70 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                                          Plane Change
                                        </span>
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            {/* Outbound Leg Detailed Breakdown */}
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eed6c4]/50">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#6b4f4f] text-[#fff3e4] flex items-center justify-center font-bold text-xs">
                                    <PlaneTakeoff className="w-4 h-4" />
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

                              {/* Segments Loop */}
                              <div className="space-y-3">
                                {flight.outbound.segments.map((seg, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:border-[#eed6c4] transition-colors">
                                      {/* Segment Header */}
                                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100 text-xs">
                                        <div className="flex items-center gap-2">
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

                                      {/* Departure & Arrival Details */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                        {/* Departure */}
                                        <div className="flex items-start gap-3">
                                          <div className="w-3 h-3 rounded-full bg-[#6b4f4f] mt-1 shrink-0 ring-4 ring-[#eed6c4]/40" />
                                          <div>
                                            <div className="flex items-baseline gap-2">
                                              <span className="font-heading font-black text-slate-900 text-lg">
                                                {seg.departureTime.slice(0, 5)}
                                              </span>
                                              <span className="font-bold text-slate-800">
                                                {seg.departureAirport}
                                              </span>
                                              {seg.departureTerminal && (
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                  Terminal {seg.departureTerminal}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                              {seg.departureAirportName || seg.departureAirport}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                              Date: {seg.departureDate}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Arrival */}
                                        <div className="flex items-start gap-3">
                                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white mt-1 shrink-0 ring-4 ring-[#eed6c4]/40" />
                                          <div>
                                            <div className="flex items-baseline gap-2">
                                              <span className="font-heading font-black text-slate-900 text-lg">
                                                {seg.arrivalTime.slice(0, 5)}
                                              </span>
                                              <span className="font-bold text-slate-800">
                                                {seg.arrivalAirport}
                                              </span>
                                              {seg.arrivalTerminal && (
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                  Terminal {seg.arrivalTerminal}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                              {seg.arrivalAirportName || seg.arrivalAirport}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                              Date: {seg.arrivalDate}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Transit / Layover Banner */}
                                    {sIdx < flight.outbound.segments.length - 1 && (
                                      <div className="bg-gradient-to-r from-amber-50 to-[#fff8f0] border border-amber-200/90 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-amber-700" />
                                          </div>
                                          <div>
                                            <div className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                                              <span>Layover / Transit at {seg.arrivalAirportName || seg.arrivalAirport}:</span>
                                              <span className="font-black text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                                                {seg.connectionDuration || "Connection"}
                                              </span>
                                            </div>
                                            <p className="text-[11px] text-amber-800 mt-0.5">
                                              Baggage checked through to final destination • Connect to{" "}
                                              <strong className="text-amber-950">
                                                {flight.outbound.segments[sIdx + 1]?.airline} (
                                                {flight.outbound.segments[sIdx + 1]?.flightNumber})
                                              </strong>
                                            </p>
                                          </div>
                                        </div>
                                        <span className="bg-amber-200/70 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                                          Plane Change
                                        </span>
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>

                            {/* Inbound Leg Detailed Breakdown (if Return Trip) */}
                            {flight.inbound && (
                              <div className="space-y-3 pt-4 border-t border-[#eed6c4]/50">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eed6c4]/50">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#6b4f4f] text-[#fff3e4] flex items-center justify-center font-bold text-xs">
                                      <PlaneLanding className="w-4 h-4" />
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

                                {/* Inbound Segments Loop */}
                                <div className="space-y-3">
                                  {flight.inbound.segments.map((seg, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:border-[#eed6c4] transition-colors">
                                        {/* Segment Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100 text-xs">
                                          <div className="flex items-center gap-2">
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

                                        {/* Departure & Arrival Details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                          {/* Departure */}
                                          <div className="flex items-start gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#6b4f4f] mt-1 shrink-0 ring-4 ring-[#eed6c4]/40" />
                                            <div>
                                              <div className="flex items-baseline gap-2">
                                                <span className="font-heading font-black text-slate-900 text-lg">
                                                  {seg.departureTime.slice(0, 5)}
                                                </span>
                                                <span className="font-bold text-slate-800">
                                                  {seg.departureAirport}
                                                </span>
                                                {seg.departureTerminal && (
                                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                    Terminal {seg.departureTerminal}
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                                {seg.departureAirportName || seg.departureAirport}
                                              </p>
                                              <p className="text-[11px] text-slate-400">
                                                Date: {seg.departureDate}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Arrival */}
                                          <div className="flex items-start gap-3">
                                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white mt-1 shrink-0 ring-4 ring-[#eed6c4]/40" />
                                            <div>
                                              <div className="flex items-baseline gap-2">
                                                <span className="font-heading font-black text-slate-900 text-lg">
                                                  {seg.arrivalTime.slice(0, 5)}
                                                </span>
                                                <span className="font-bold text-slate-800">
                                                  {seg.arrivalAirport}
                                                </span>
                                                {seg.arrivalTerminal && (
                                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                    Terminal {seg.arrivalTerminal}
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                                                {seg.arrivalAirportName || seg.arrivalAirport}
                                              </p>
                                              <p className="text-[11px] text-slate-400">
                                                Date: {seg.arrivalDate}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Transit / Layover Banner */}
                                      {sIdx < flight.inbound!.segments.length - 1 && (
                                        <div className="bg-gradient-to-r from-amber-50 to-[#fff8f0] border border-amber-200/90 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                              <Clock className="w-4 h-4 text-amber-700" />
                                            </div>
                                            <div>
                                              <div className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
                                                <span>Layover / Transit at {seg.arrivalAirportName || seg.arrivalAirport}:</span>
                                                <span className="font-black text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                                                  {seg.connectionDuration || "Connection"}
                                                </span>
                                              </div>
                                              <p className="text-[11px] text-amber-800 mt-0.5">
                                                Baggage checked through to final destination • Connect to{" "}
                                                <strong className="text-amber-950">
                                                  {flight.inbound!.segments[sIdx + 1]?.airline} (
                                                  {flight.inbound!.segments[sIdx + 1]?.flightNumber})
                                                </strong>
                                              </p>
                                            </div>
                                          </div>
                                          <span className="bg-amber-200/70 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                                            Plane Change
                                          </span>
                                        </div>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Drawer Bottom Bar: Baggage & Book Button */}
                        <div className="bg-[#eed6c4]/20 border border-[#eed6c4]/60 rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                            <span className="flex items-center gap-1.5 font-bold text-slate-700">
                              <Briefcase className="w-3.5 h-3.5 text-[#6b4f4f]" />
                              <span>Baggage: {flight.baggage}</span>
                            </span>
                            <span className="flex items-center gap-1.5 font-bold text-slate-700">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>Full Airline Protection &amp; ATOL Coverage</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-3 ml-auto">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                                Total Fare
                              </span>
                              <span className="font-heading font-black text-base text-[#6b4f4f]">
                                £{flight.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
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
                                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
                                </svg>
                                <span>WhatsApp</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => setSelectedFlightForBooking(flight)}
                                className="px-5 py-2 rounded-xl bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Flight Booking Modal ─── */}
      <FlightBookingModal
        flight={selectedFlightForBooking}
        isOpen={!!selectedFlightForBooking}
        onClose={() => setSelectedFlightForBooking(null)}
        searchCriteria={{
          tripType,
          passengers: { adults, children, infants },
          cabin,
          bags,
        }}
      />
    </div>
  );
}
