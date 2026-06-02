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
    return flights.filter(f => (f.country || "Other") === activeCountry).slice(0, 8);
  }, [flights, activeCountry]);

  if (flights.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar / Filters (Left Side) */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
            {countries.map((country) => {
              const isActive = activeCountry === country;
              return (
                <button
                  key={country}
                  onClick={() => setActiveCountry(country)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#483434] text-white shadow-lg shadow-[#483434]/20"
                      : "bg-transparent text-[#6b4f4f] hover:bg-[#fff3e4]/50"
                  }`}
                >
                  <span>{country} Flights</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#eed6c4]" />}
                </button>
              );
            })}
          </div>

          {/* Table Area (Right Side) */}
          <div className="flex-grow w-full bg-[#fcf9f6] border border-[#eed6c4]/40 rounded-xl p-8 shadow-[0_10px_40px_rgba(72,52,52,0.03)]">
            <h3 className="text-2xl font-heading font-bold text-[#483434] mb-6">{activeCountry} Flight Deals</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-[#6b4f4f] text-sm border-b border-[#eed6c4] font-semibold">
                    <th className="pb-3 font-semibold">Destination</th>
                    <th className="pb-3 font-semibold">Deal Found</th>
                    <th className="pb-3 font-semibold text-right">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFlights.map((flight, idx) => (
                    <tr 
                      key={flight.id} 
                      className={`group transition-colors hover:bg-[#fff3e4]/40 ${
                        idx !== displayedFlights.length - 1 ? 'border-b border-[#eed6c4]/40' : ''
                      }`}
                    >
                      <td className="py-4">
                        <Link 
                          href={`/v/${flight.slug || flight.id}`}
                          className="text-[#6b4f4f] font-bold hover:text-[#483434] transition-colors block"
                        >
                          {flight.destination}
                        </Link>
                      </td>
                      <td className="py-4 text-slate-500 text-sm font-medium">
                        {new Date(flight.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-1">fr.</span>
                        <span className="font-heading font-black text-lg text-[#064e3b]">£{flight.price}</span>
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
              <div className="mt-8 flex justify-center">
                <Link 
                  href="/flights" 
                  className="px-8 py-3 rounded-full bg-[#382626] text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#6b4f4f] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
