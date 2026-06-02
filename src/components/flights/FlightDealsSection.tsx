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
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#5B5CE1] text-white shadow-md"
                      : "bg-transparent text-[#5B5CE1] hover:bg-[#5B5CE1]/10"
                  }`}
                >
                  <span>{country} Flights</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-white opacity-70" />}
                </button>
              );
            })}
          </div>

          {/* Table Area (Right Side) */}
          <div className="flex-grow w-full bg-[#FAFAFA] rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">{activeCountry} Flight Deals</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="text-slate-600 text-sm border-b border-slate-800/80">
                    <th className="pb-3 font-medium">Destination</th>
                    <th className="pb-3 font-medium">Deal Found</th>
                    <th className="pb-3 font-medium text-right">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFlights.map((flight, idx) => (
                    <tr 
                      key={flight.id} 
                      className={`group transition-colors hover:bg-slate-100 ${
                        idx !== displayedFlights.length - 1 ? 'border-b border-slate-200' : ''
                      }`}
                    >
                      <td className="py-4">
                        <Link 
                          href={`/v/${flight.slug || flight.id}`}
                          className="text-[#5B5CE1] hover:underline font-medium block"
                        >
                          {flight.destination}
                        </Link>
                      </td>
                      <td className="py-4 text-slate-600 text-sm">
                        {new Date(flight.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-slate-500 text-sm font-medium mr-1">fr.</span>
                        <span className="font-bold text-slate-900">£{flight.price}</span>
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
                  className="px-6 py-2.5 rounded-md bg-[#5B5CE1] text-white text-sm font-medium hover:bg-[#4a4bd1] transition-colors shadow-sm"
                >
                  View More
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
