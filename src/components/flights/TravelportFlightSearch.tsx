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
import { FlightSearchResultItem } from "@/lib/travelport";
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
                onChange={(e) => setBags(parseInt(e.target.value, 10))}
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
              Searching Live Fares on Travelport GDS…
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
                  Showing lowest live fares powered by Travelport GDS. All taxes included.
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
              {searchResults.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#eed6c4]/60 hover:border-[#6b4f4f]/50 hover:shadow-[0_15px_30px_rgba(56,38,38,0.08)] transition-all duration-300 flex flex-col md:flex-row justify-between items-stretch"
                >
                  {/* Left / Flight Details Column */}
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
                            {flight.outbound.flightNumbers}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {flight.cabin}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          {flight.baggage}
                        </span>
                      </div>
                    </div>

                    {/* Outbound Leg */}
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

                    {/* Inbound Leg (if Return) */}
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

                      <a
                        href="tel:+441215291630"
                        className="text-[11px] font-bold text-[#6b4f4f] hover:underline flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call +44 1215 291630</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
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
        }}
      />
    </div>
  );
}
