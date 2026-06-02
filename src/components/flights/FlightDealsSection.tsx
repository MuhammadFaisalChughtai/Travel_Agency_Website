"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

    // Sort by count descending, pick top 8
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country]) => country);
  }, [flights]);

  const [activeCountry, setActiveCountry] = useState(countries[0] || "Other");

  // Filter flights by active country
  const displayedFlights = useMemo(() => {
    return flights.filter(f => (f.country || "Other") === activeCountry).slice(0, 5);
  }, [flights, activeCountry]);

  if (flights.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#f5f0eb]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Area */}
        <div className="text-center md:text-left mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
            Special Offers
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#483434] mb-3 tracking-tight">
            Flight Deals From Major UK Airports
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl">
            Looking for cheap flights or last minute deals from London?
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar / Filters (Left Side) */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
            {countries.map((country) => {
              const isActive = activeCountry === country;
              return (
                <button
                  key={country}
                  onClick={() => setActiveCountry(country)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#483434] text-white shadow-lg shadow-[#483434]/20"
                      : "bg-transparent text-[#6b4f4f] hover:bg-[#eed6c4]/20"
                  }`}
                >
                  <span>{country} Flights</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#eed6c4]" />}
                </button>
              );
            })}
          </div>

          {/* Table Area (Right Side) */}
          <div className="flex-grow w-full bg-white border border-[#eed6c4]/40 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-heading font-black text-[#382626] mb-6">{activeCountry} Flight Deals</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-[#6b4f4f] text-xs font-extrabold uppercase tracking-widest border-b-2 border-[#eed6c4]">
                    <th className="pb-4 text-left w-1/3">Destination</th>
                    <th className="pb-4 text-center w-1/3">Deal Found</th>
                    <th className="pb-4 text-right w-1/3">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFlights.map((flight, idx) => (
                    <tr 
                      key={flight.id} 
                      className={`group transition-colors hover:bg-[#f5f0eb]/50 ${
                        idx !== displayedFlights.length - 1 ? 'border-b border-[#eed6c4]/30' : ''
                      }`}
                    >
                      <td className="py-5">
                        <Link 
                          href={`/v/${flight.slug || flight.id}`}
                          className="text-[#6b4f4f] font-bold text-base hover:text-[#483434] transition-colors block"
                        >
                          {flight.destination}
                        </Link>
                      </td>
                      <td className="py-5 text-center text-slate-500 text-sm font-medium">
                        {new Date(flight.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-5 text-right">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-1">fr.</span>
                        <span className="font-heading font-black text-xl text-[#382626]">£{flight.price}</span>
                      </td>
                    </tr>
                  ))}
                  
                  {displayedFlights.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-500 text-sm">
                        No flights currently available for this country.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {displayedFlights.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Link 
                  href="/flights" 
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#382626] text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#6b4f4f] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                >
                  View All Flights
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
