"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Flame } from "lucide-react";

const PAGE_SIZE = 4;

export function TrendingFlightsSection({ routes }: { routes: any[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const loadMore = () =>
    setVisible((v) => Math.min(v + PAGE_SIZE, routes.length));
  const hasMore = visible < routes.length;

  if (routes.length === 0) return null;

  return (
    <section className="py-20 bg-[#f5f0eb]/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 flex flex-col items-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
            Popular Destinations
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#483434] tracking-tight">
            Trending Flights
          </h2>
          <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover our most popular flight routes at unbeatable prices.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.slice(0, visible).map((route, idx) => {
            const price = route.price || 0;
            const originalPrice = route.originalPrice || route.price;
            return (
              <Link
                key={route.id || idx}
                href={`/book?type=flight&destination=${encodeURIComponent((route.destination || route.dest).split(",")[0])}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group cursor-pointer block"
              >
                {/* Image Section */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={route.image || route.img}
                    alt={route.destination || route.dest}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10" />

                  {route.tag && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-[#eed6c4] text-[#382626] text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        {route.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-5 flex items-end justify-between bg-white z-20 relative">
                  <div>
                    <h3 className="text-[#382626] font-bold text-lg leading-tight mb-1">
                      {(route.destination || route.dest).split(",")[0]}
                    </h3>
                    <p className="text-[#6b4f4f] font-black text-2xl leading-none">
                      {price}
                    </p>
                  </div>
                  {route.originalPrice && (
                    <div className="text-slate-400 font-bold text-sm line-through pb-0.5">
                      {originalPrice}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#382626] text-white text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#6b4f4f] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Load More Destinations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="mt-3 text-xs text-slate-400">
              Showing {Math.min(visible, routes.length)} of {routes.length}{" "}
              destinations
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
