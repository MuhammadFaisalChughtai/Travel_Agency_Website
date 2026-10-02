"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  X,
  Plus,
  Briefcase,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { searchAirports, Airport } from "@/lib/airports";
import { FlightSearchResultItem } from "@/lib/travelport";
import { FlightResultsView } from "./FlightResultsView";

export function TravelportFlightSearch({
  isHome = false,
}: {
  isHome?: boolean;
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tripType, setTripType] = useState<"return" | "one-way" | "multi-city">("return");
  const [bags, setBags] = useState<number>(1);

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
    const cleanCity = airport.city.split("(")[0].trim();
    const label = `${cleanCity} (${airport.code})`;
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
          cabin: cabin || "Economy",
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
      { from: "", fromCode: "", to: "", toCode: "", date: "", cabin: cabin || "Economy" },
      { from: "", fromCode: "", to: "", toCode: "", date: "", cabin: cabin || "Economy" },
    ]);
  };

  // Set cabin across all multi-city legs and main cabin state
  const handleSetCabin = (newCabin: string) => {
    setCabin(newCabin);
    setMultiCityLegs((prev) =>
      prev.map((leg) => ({ ...leg, cabin: newCabin }))
    );
  };

  // Core flight search executor
  const executeFlightSearch = useCallback(
    async (overrideParams?: {
      tripType: "return" | "one-way" | "multi-city";
      originCode: string;
      destinationCode: string;
      departureDate: string;
      returnDate: string;
      adults: number;
      children: number;
      infants: number;
      cabin: string;
      bags: number;
      multiCityLegs?: any[];
    }) => {
      const currentTripType = overrideParams ? overrideParams.tripType : tripType;
      const currentOriginCode = overrideParams ? overrideParams.originCode : originCode;
      const currentDestinationCode = overrideParams ? overrideParams.destinationCode : destinationCode;
      const currentDepartureDate = overrideParams ? overrideParams.departureDate : departureDate;
      const currentReturnDate = overrideParams ? overrideParams.returnDate : returnDate;
      const currentAdults = overrideParams ? overrideParams.adults : adults;
      const currentChildren = overrideParams ? overrideParams.children : children;
      const currentInfants = overrideParams ? overrideParams.infants : infants;
      const currentCabin = overrideParams ? overrideParams.cabin : cabin;
      const currentBags = overrideParams ? overrideParams.bags : bags;
      const currentMultiCityLegs = overrideParams?.multiCityLegs || multiCityLegs;

      setSearchError("");
      setIsSearching(true);
      setHasSearched(true);
      setSearchResults([]);

      try {
        let legs: Array<{ from: string; to: string; departureDate: string }> = [];

        if (currentTripType === "return") {
          if (!currentOriginCode || !currentDestinationCode || !currentDepartureDate || !currentReturnDate) {
            setSearchError("Please select departure airport, destination, and dates.");
            setIsSearching(false);
            return;
          }
          legs = [
            { from: currentOriginCode, to: currentDestinationCode, departureDate: currentDepartureDate },
            { from: currentDestinationCode, to: currentOriginCode, departureDate: currentReturnDate },
          ];
        } else if (currentTripType === "one-way") {
          if (!currentOriginCode || !currentDestinationCode || !currentDepartureDate) {
            setSearchError("Please select departure airport, destination, and date.");
            setIsSearching(false);
            return;
          }
          legs = [{ from: currentOriginCode, to: currentDestinationCode, departureDate: currentDepartureDate }];
        } else {
          for (let i = 0; i < currentMultiCityLegs.length; i++) {
            const l = currentMultiCityLegs[i];
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
            tripType: currentTripType,
            legs,
            passengers: {
              adults: currentAdults,
              children: currentChildren,
              infants: currentInfants,
            },
            cabin: currentCabin,
            bags: currentBags,
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
        }, 150);
      } catch (err: any) {
        console.error("[Search Error]", err);
        setSearchError(err.message || "An error occurred while searching flights.");
      } finally {
        setIsSearching(false);
      }
    },
    [
      tripType,
      originCode,
      destinationCode,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      cabin,
      bags,
      multiCityLegs,
    ]
  );

  // Auto-hydrate from searchParams on the dedicated flight view page (/flights)
  const hasAutoSearched = useRef<boolean>(false);
  useEffect(() => {
    if (isHome) return;
    if (hasAutoSearched.current) return;

    const paramTripType = searchParams.get("tripType") as "return" | "one-way" | "multi-city" | null;
    const paramFrom = searchParams.get("from");
    const paramFromCode = searchParams.get("fromCode");
    const paramTo = searchParams.get("to");
    const paramToCode = searchParams.get("toCode");
    const paramDep = searchParams.get("departureDate");
    const paramRet = searchParams.get("returnDate");
    const paramAdults = searchParams.get("adults");
    const paramChildren = searchParams.get("children");
    const paramInfants = searchParams.get("infants");
    const paramCabin = searchParams.get("cabin");
    const paramBags = searchParams.get("bags");
    const paramLegs = searchParams.get("legs");

    const isMultiCityValid = paramTripType === "multi-city" && !!paramLegs;
    const isSingleTripValid = !!(paramFromCode && paramToCode && paramDep);

    if (isSingleTripValid || isMultiCityValid) {
      hasAutoSearched.current = true;
      if (paramTripType) setTripType(paramTripType);
      if (paramFrom) setOrigin(paramFrom);
      if (paramFromCode) setOriginCode(paramFromCode);
      if (paramTo) setDestination(paramTo);
      if (paramToCode) setDestinationCode(paramToCode);
      if (paramDep) setDepartureDate(paramDep);
      if (paramRet) setReturnDate(paramRet);
      if (paramAdults) setAdults(parseInt(paramAdults, 10));
      if (paramChildren) setChildren(parseInt(paramChildren, 10));
      if (paramInfants) setInfants(parseInt(paramInfants, 10));
      if (paramCabin) setCabin(paramCabin);
      if (paramBags) setBags(parseInt(paramBags, 10));

      let parsedLegs: any[] = [];
      if (paramLegs) {
        try {
          parsedLegs = JSON.parse(paramLegs);
          setMultiCityLegs(parsedLegs);
        } catch (e) {
          console.error("Failed to parse legs from URL", e);
        }
      }

      executeFlightSearch({
        tripType: paramTripType || "return",
        originCode: paramFromCode || (parsedLegs[0]?.fromCode ?? ""),
        destinationCode: paramToCode || (parsedLegs[0]?.toCode ?? ""),
        departureDate: paramDep || (parsedLegs[0]?.date ?? ""),
        returnDate: paramRet || "",
        adults: paramAdults ? parseInt(paramAdults, 10) : 1,
        children: paramChildren ? parseInt(paramChildren, 10) : 0,
        infants: paramInfants ? parseInt(paramInfants, 10) : 0,
        cabin: paramCabin || "Economy",
        bags: paramBags ? parseInt(paramBags, 10) : 1,
        multiCityLegs: parsedLegs,
      });
    }
  }, [isHome, searchParams, executeFlightSearch]);

  // Execute Flight Search or Redirect if on Home
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError("");

    // If on Home page, navigate to dedicated flight results page (/flights)
    if (isHome) {
      if (tripType === "return") {
        if (!originCode || !destinationCode || !departureDate || !returnDate) {
          setSearchError("Please select departure airport, destination, and dates.");
          return;
        }
      } else if (tripType === "one-way") {
        if (!originCode || !destinationCode || !departureDate) {
          setSearchError("Please select departure airport, destination, and date.");
          return;
        }
      } else {
        for (let i = 0; i < multiCityLegs.length; i++) {
          const l = multiCityLegs[i];
          if (!l.fromCode || !l.toCode || !l.date) {
            setSearchError(`Please complete all details for Flight Leg ${i + 1}.`);
            return;
          }
        }
      }

      const params = new URLSearchParams();
      params.set("tripType", tripType);
      params.set("from", tripType === "multi-city" ? multiCityLegs[0]?.from || origin : origin);
      params.set("fromCode", tripType === "multi-city" ? multiCityLegs[0]?.fromCode || originCode : originCode);
      params.set("to", tripType === "multi-city" ? multiCityLegs[0]?.to || destination : destination);
      params.set("toCode", tripType === "multi-city" ? multiCityLegs[0]?.toCode || destinationCode : destinationCode);
      params.set("departureDate", tripType === "multi-city" ? multiCityLegs[0]?.date || departureDate : departureDate);
      if (tripType === "return" && returnDate) {
        params.set("returnDate", returnDate);
      }
      params.set("adults", adults.toString());
      params.set("children", children.toString());
      params.set("infants", infants.toString());
      params.set("cabin", cabin);
      params.set("bags", bags.toString());
      if (tripType === "multi-city") {
        params.set("legs", JSON.stringify(multiCityLegs));
      }

      router.push(`/flights?${params.toString()}`);
      return;
    }

    // Direct search on flights page
    executeFlightSearch();
  };

  const totalPassengers = adults + children + infants;
  const passengerSummaryText = `${totalPassengers} ${
    totalPassengers === 1 ? "adult" : "travelers"
  }, ${cabin === "PremiumEconomy" ? "Prem Eco" : cabin}`;

  const renderPassengerPopover = (alignClass: string = "right-0") => (
    <div
      className={`absolute ${alignClass} top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-4`}
    >
      <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Travelers & Cabin
        </span>
        <span className="text-[11px] font-semibold text-[#6b4f4f] bg-[#f5f0eb] px-2 py-0.5 rounded-full">
          {totalPassengers} {totalPassengers === 1 ? "traveler" : "travelers"}
        </span>
      </div>

      {/* Adults */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800 text-xs">Adults</p>
          <p className="text-[10px] text-slate-400">Age 12+</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAdults((v) => Math.max(1, v - 1))}
            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-[#f5f0eb] active:scale-95 transition-all"
          >
            -
          </button>
          <span className="w-5 text-center font-bold text-xs">{adults}</span>
          <button
            type="button"
            onClick={() => setAdults((v) => Math.min(9, v + 1))}
            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-[#f5f0eb] active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Children */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800 text-xs">Children</p>
          <p className="text-[10px] text-slate-400">Age 2-11</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChildren((v) => Math.max(0, v - 1))}
            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-[#f5f0eb] active:scale-95 transition-all"
          >
            -
          </button>
          <span className="w-5 text-center font-bold text-xs">{children}</span>
          <button
            type="button"
            onClick={() => setChildren((v) => Math.min(8, v + 1))}
            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-[#f5f0eb] active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Infants */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800 text-xs">Infants</p>
          <p className="text-[10px] text-slate-400">Under 2 (on lap)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInfants((v) => Math.max(0, v - 1))}
            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-[#f5f0eb] active:scale-95 transition-all"
          >
            -
          </button>
          <span className="w-5 text-center font-bold text-xs">{infants}</span>
          <button
            type="button"
            onClick={() => setInfants((v) => Math.min(4, v + 1))}
            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-[#f5f0eb] active:scale-95 transition-all"
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
              onClick={() => handleSetCabin(c)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left transition-colors ${
                cabin === c
                  ? "bg-[#6b4f4f] text-white shadow-xs"
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
        className="w-full py-2 bg-[#6b4f4f] text-[#fff3e4] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#382626] transition-colors cursor-pointer"
      >
        Done
      </button>
    </div>
  );

  return (
    <div
      className={`w-full max-w-6xl mx-auto ${
        isHome ? "px-0 mt-2" : "px-4 -mt-10 md:-mt-16"
      } relative z-40`}
    >
      {/* ─── Search Bar Container ─── */}
      <div
        className={`relative z-40 ${
          isHome
            ? "bg-white/20 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/30"
            : "bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-[0_20px_50px_rgba(56,38,38,0.12)] border border-[#eed6c4]/80"
        }`}
      >
        {/* Top Selectors (Trip Type & Bags) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs sm:text-sm font-semibold">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Trip Type Dropdown */}
            <div
              className={`relative px-3 py-1.5 rounded-xl border transition-all ${
                isHome
                  ? "bg-[#f5f0eb] text-slate-800 border-slate-200/80 shadow-xs hover:border-[#6b4f4f]/50"
                  : "bg-[#f5f0eb] text-slate-800 border-slate-200/80 hover:border-[#6b4f4f]"
              }`}
            >
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as any)}
                className="appearance-none bg-transparent hover:text-[#6b4f4f] pr-6 py-0.5 cursor-pointer font-bold focus:outline-none transition-colors"
              >
                <option value="return" className="text-slate-800 bg-white">Return</option>
                <option value="one-way" className="text-slate-800 bg-white">One-way</option>
                <option value="multi-city" className="text-slate-800 bg-white">Multi-city</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>

            {/* Passenger Selector for Multi-city */}
            {tripType === "multi-city" && (
              <div
                ref={tripType === "multi-city" ? passengerDropdownRef : undefined}
                className="relative z-50"
              >
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isHome
                      ? "bg-[#f5f0eb] text-slate-800 border-slate-200/80 shadow-xs hover:border-[#6b4f4f]/50"
                      : "bg-[#f5f0eb] text-slate-800 border-slate-200/80 hover:border-[#6b4f4f]"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0" />
                  <span className="font-bold">{passengerSummaryText}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${
                      showPassengerDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPassengerDropdown && renderPassengerPopover("left-0")}
              </div>
            )}

            {/* Bags Dropdown */}
            <div
              className={`relative px-3 py-1.5 rounded-xl border transition-all ${
                isHome
                  ? "bg-[#f5f0eb] text-slate-800 border-slate-200/80 shadow-xs hover:border-[#6b4f4f]/50"
                  : "bg-[#f5f0eb] text-slate-800 border-slate-200/80 hover:border-[#6b4f4f]"
              }`}
            >
              <select
                value={bags}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBags(val);
                }}
                className="appearance-none bg-transparent hover:text-[#6b4f4f] pr-6 py-0.5 cursor-pointer font-bold focus:outline-none transition-colors"
              >
                <option value={1} className="text-slate-800 bg-white">1 bag</option>
                <option value={0} className="text-slate-800 bg-white">0 bags</option>
                <option value={2} className="text-slate-800 bg-white">2 bags</option>
                <option value={3} className="text-slate-800 bg-white">3+ bags</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>
          </div>
        </div>

        {/* ─── Search Form Body ─── */}
        {tripType !== "multi-city" ? (
          /* RETURN & ONE-WAY LAYOUT */
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch ${
              isHome ? "" : "p-2 bg-[#f5f0eb]/60 rounded-2xl border border-slate-200/80"
            }`}
          >
            {/* Origin & Destination with Swap Button */}
            <div
              className={`${
                tripType === "return"
                  ? "lg:col-span-4 xl:col-span-4"
                  : "lg:col-span-5 xl:col-span-5"
              } grid grid-cols-1 sm:grid-cols-11 gap-1 items-center bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-2 py-1 relative ${
                activeAirportField ? "z-50" : "z-10"
              } focus-within:bg-white focus-within:border-[#6b4f4f] focus-within:ring-1 focus-within:ring-[#6b4f4f] transition-all duration-300 min-h-[52px] sm:h-[52px]`}
            >
              {/* Origin */}
              <div className="sm:col-span-5 relative flex items-center h-[46px] sm:h-auto">
                <Plane className="w-4 h-4 text-[#6b4f4f] shrink-0 mr-1 pointer-events-none ml-1" />
                <input
                  type="text"
                  value={activeAirportField === "origin" ? airportQuery : origin}
                  onFocus={() => {
                    setActiveAirportField("origin");
                    setAirportQuery("");
                  }}
                  onChange={(e) => setAirportQuery(e.target.value)}
                  placeholder="From?"
                  className="w-full px-1 py-2 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent truncate"
                />
                {origin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrigin("");
                      setOriginCode("");
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center py-1 sm:py-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  title="Swap Departure and Destination"
                  className="w-6 h-6 rounded-full bg-white hover:bg-[#eed6c4]/40 border border-slate-200/80 flex items-center justify-center text-[#6b4f4f] transition-colors shadow-xs"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                </button>
              </div>

              {/* Destination */}
              <div className="sm:col-span-5 relative flex items-center h-[46px] sm:h-auto">
                <Plane className="w-4 h-4 text-[#6b4f4f] shrink-0 mr-1 pointer-events-none rotate-90 ml-1" />
                <input
                  type="text"
                  value={activeAirportField === "destination" ? airportQuery : destination}
                  onFocus={() => {
                    setActiveAirportField("destination");
                    setAirportQuery("");
                  }}
                  onChange={(e) => setAirportQuery(e.target.value)}
                  placeholder="To?"
                  className="w-full px-1 py-2 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent truncate"
                />
                {destination && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDestination("");
                      setDestinationCode("");
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Airport Autocomplete Popover (opens right below active field) */}
              {activeAirportField && (
                <div
                  ref={airportDropdownRef}
                  className={`absolute top-full mt-2 w-full sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 max-h-72 overflow-y-auto ${
                    activeAirportField === "destination"
                      ? "left-0 sm:left-auto sm:right-0"
                      : "left-0"
                  }`}
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

            {/* Departure & Return Dates */}
            <div
              className={`${
                tripType === "return"
                  ? "lg:col-span-4 xl:col-span-4"
                  : "lg:col-span-2 xl:col-span-2"
              } ${
                tripType === "return" ? "grid grid-cols-1 sm:grid-cols-2 gap-2" : ""
              } relative z-10`}
            >
              {/* Departure Date */}
              <div className="bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-2.5 sm:px-3 py-1 relative focus-within:bg-white focus-within:border-[#6b4f4f] focus-within:ring-1 focus-within:ring-[#6b4f4f] transition-all h-[52px] min-h-[52px] flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  <Calendar className="w-3 h-3 text-[#6b4f4f] shrink-0" />
                  <span className="truncate">Departure</span>
                </div>
                <input
                  type="date"
                  value={departureDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setDepartureDate(e.target.value);
                    if (returnDate && returnDate < e.target.value) {
                      setReturnDate(e.target.value);
                    }
                  }}
                  className="w-full text-xs xl:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer p-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:ml-auto"
                />
              </div>

              {/* Return Date (if return trip) */}
              {tripType === "return" && (
                <div className="bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-2.5 sm:px-3 py-1 relative focus-within:bg-white focus-within:border-[#6b4f4f] focus-within:ring-1 focus-within:ring-[#6b4f4f] transition-all h-[52px] min-h-[52px] flex flex-col justify-center">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    <Calendar className="w-3 h-3 text-[#6b4f4f]" />
                    <span className="truncate">Return</span>
                  </div>
                  <input
                    type="date"
                    value={returnDate}
                    min={departureDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full text-xs xl:text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer p-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:ml-auto"
                  />
                </div>
              )}
            </div>

            {/* Passengers & Cabin Class */}
            <div
              className={`${
                tripType === "return"
                  ? "lg:col-span-2 xl:col-span-2"
                  : "lg:col-span-3 xl:col-span-3"
              } relative ${showPassengerDropdown ? "z-50" : "z-20"}`}
            >
              <div
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="w-full h-[52px] min-h-[52px] bg-[#f5f0eb] hover:bg-slate-100 rounded-xl border border-slate-200/80 px-2.5 sm:px-3 py-1 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider leading-none whitespace-nowrap">
                      Travelers
                    </span>
                    <span className="text-xs sm:text-xs xl:text-sm font-semibold text-slate-800 truncate mt-0.5">
                      {passengerSummaryText}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${showPassengerDropdown ? "rotate-180" : ""}`} />
              </div>

              {/* Passenger Dropdown Popover */}
              {showPassengerDropdown && renderPassengerPopover("right-0")}
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2 xl:col-span-2 flex items-center relative z-10">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="w-full h-[52px] min-h-[52px] bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 px-4 shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 whitespace-nowrap"
              >
                {isSearching ? (
                  <svg className="animate-spin w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <Search className="w-4 h-4 shrink-0 text-[#eed6c4]" />
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 items-center"
              >
                {/* Leg From */}
                <div
                  className={`lg:col-span-4 bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-3 py-2 relative ${
                    activeAirportField === `multi-from-${index}` ? "z-50" : "z-10"
                  } focus-within:bg-white focus-within:border-[#6b4f4f] transition-all`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Plane className="w-3.5 h-3.5 text-[#6b4f4f]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      From (Flight {index + 1})
                    </span>
                  </div>
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
                <div
                  className={`lg:col-span-4 bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-3 py-2 relative ${
                    activeAirportField === `multi-to-${index}` ? "z-50" : "z-10"
                  } focus-within:bg-white focus-within:border-[#6b4f4f] transition-all`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Plane className="w-3.5 h-3.5 text-[#6b4f4f] rotate-90" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      To
                    </span>
                  </div>
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
                <div className="lg:col-span-2 bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-3 py-2 focus-within:bg-white focus-within:border-[#6b4f4f] transition-all">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6b4f4f]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Departure
                    </span>
                  </div>
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
                <div className="lg:col-span-1 bg-[#f5f0eb] rounded-xl border border-slate-200/80 px-2 py-1.5 text-center text-xs font-bold text-slate-700 focus-within:bg-white focus-within:border-[#6b4f4f] transition-all">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none mb-0.5">
                    Cabin
                  </span>
                  <select
                    value={leg.cabin || cabin}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMultiCityLegs((prev) => {
                        const copy = [...prev];
                        copy[index] = { ...copy[index], cabin: val };
                        return copy;
                      });
                    }}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer text-center appearance-none hover:text-[#6b4f4f] py-0.5"
                  >
                    <option value="Economy">Economy</option>
                    <option value="PremiumEconomy">Prem Eco</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>

                {/* Remove Leg Button */}
                <div className="lg:col-span-1 flex justify-center">
                  {index >= 2 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveMultiCityLeg(index)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
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
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={handleAddMultiCityLeg}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#6b4f4f] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#6b4f4f]" />
                  <span>Add another flight</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearMultiCity}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown((prev) => !prev)}
                  className="flex items-center gap-1.5 text-[#6b4f4f] bg-[#f5f0eb] hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{passengerSummaryText}</span>
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
                    <Search className="w-4 h-4 shrink-0 text-[#eed6c4]" />
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

      {/* ─── Search Results Section (Only rendered on dedicated flight view page) ─── */}
      {!isHome && (
        <div id="travelport-results-section" className="mt-8 relative z-10">
          {isSearching && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#eed6c4]/40 flex items-center justify-center text-[#6b4f4f] animate-bounce mb-4">
                <Plane className="w-8 h-8 rotate-45" />
              </div>
              <h3 className="font-heading font-black text-xl text-[#382626]">
                Searching Live Flight Fares…
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md">
                Connecting to global airlines for lowest live rates and real-time seat availability.
              </p>
            </div>
          )}

          {!isSearching && hasSearched && searchResults.length > 0 && (
            <FlightResultsView
              flights={searchResults}
              searchCriteria={{
                tripType,
                passengers: { adults, children, infants },
                cabin,
                bags,
                origin,
                destination,
              }}
            />
          )}

          {!isSearching && hasSearched && searchResults.length === 0 && !searchError && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-heading font-black text-[#382626]">
                No Flights Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No flights were found for these exact dates and route. Please adjust your dates or contact our flight specialists for offline discounted fares.
              </p>
              <a
                href="https://wa.me/447888461474"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6b4f4f] text-[#fff3e4] font-bold text-xs hover:bg-[#382626] transition-colors"
              >
                Speak to an Agent on WhatsApp (07888 461474)
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
