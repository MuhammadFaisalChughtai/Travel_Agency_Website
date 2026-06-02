"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plane, ChevronRight, MapPin, CalendarDays, ArrowRight } from "lucide-react";

type Flight = {
  id: string;
  airline: string;
  destination: string;
  country: string | null;
  slug: string | null;
  price: number;
  month: string | null;
  createdAt: Date;
};

export function FlightDealsSection({ flights }: { flights: Flight[] }) {
  // Extract and group countries
  const countries = useMemo(() => {
    const counts = flights.reduce((acc, flight) => {
      const c = flight.country || "Other";
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count descending, pick top 6
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([country]) => country);
  }, [flights]);

  const [activeCountry, setActiveCountry] = useState(countries[0] || "Other");

  // Filter flights by active country
  const displayedFlights = useMemo(() => {
    return flights.filter(f => (f.country || "Other") === activeCountry).slice(0, 8);
  }, [flights, activeCountry]);

  if (flights.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eed6c4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center md:text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#483434] mb-4 flex items-center justify-center md:justify-start gap-3">
            <Plane className="w-8 h-8 text-[#6b4f4f]" />
            Flight Deals From Major UK Airport
          </h2>
          <p className="text-[#6b4f4f] text-sm md:text-base font-medium max-w-2xl">
            Looking for cheap flights or last minute deals from London? Explore our top hand-picked destinations below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Filters */}
          <div className="lg:col-span-1 space-y-2">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeCountry === country
                    ? "bg-[#483434] text-white shadow-lg shadow-[#483434]/20 scale-[1.02]"
                    : "bg-[#fff3e4]/50 text-[#483434] hover:bg-[#eed6c4]/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${activeCountry === country ? "text-[#eed6c4]" : "text-[#6b4f4f]"}`} />
                  {country} Flights
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeCountry === country ? "text-[#eed6c4]" : "text-slate-400"}`} />
              </button>
            ))}
          </div>

          {/* Table Area */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#eed6c4]/40 rounded-3xl shadow-[0_10px_40px_rgba(72,52,52,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#fff3e4]/80 text-[#6b4f4f] text-[10px] uppercase tracking-widest font-black border-b border-[#eed6c4]/50">
                      <th className="py-5 px-6 font-bold">Destination</th>
                      <th className="py-5 px-6 font-bold">Deal Found</th>
                      <th className="py-5 px-6 font-bold text-right">Fare</th>
                      <th className="py-5 px-6 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedFlights.map((flight, idx) => (
                      <tr 
                        key={flight.id} 
                        className={`group transition-colors hover:bg-[#fff3e4]/30 ${
                          idx !== displayedFlights.length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                      >
                        <td className="py-5 px-6">
                          <p className="font-heading font-black text-[#483434] text-base group-hover:text-[#6b4f4f] transition-colors">
                            {flight.destination}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                            UK to {flight.destination}
                          </p>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <CalendarDays className="w-3.5 h-3.5 text-[#eed6c4]" />
                            {new Date(flight.createdAt).toLocaleDateString("en-GB")}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="inline-flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">fr.</span>
                            <span className="font-heading font-black text-lg text-[#064e3b]">£{flight.price}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <Link
                            href={`/v/${flight.slug || flight.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f0eb] text-[#483434] group-hover:bg-[#483434] group-hover:text-white transition-all duration-300 shadow-sm"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    
                    {displayedFlights.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 px-6 text-center text-slate-500 text-sm">
                          No flights currently available for this country.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {displayedFlights.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Link 
                  href="/flights" 
                  className="text-xs font-bold text-[#6b4f4f] uppercase tracking-widest hover:text-[#483434] flex items-center gap-1.5 transition-colors"
                >
                  View All Flights <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
