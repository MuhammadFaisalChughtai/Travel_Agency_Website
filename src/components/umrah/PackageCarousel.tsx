"use client";

import { useState } from "react";
import { PackageCard } from "./PackageCard";

interface PackageItem {
  id: string;
  title: string;
  image: string;
  stars: number;
  price: string;
  detailsUrl: string;
  isSold?: boolean;
  travelDates?: string;
}

interface PackageCarouselProps {
  title: string;
  subtitle: string;
  packages: PackageItem[];
}

export function PackageCarousel({
  title,
  subtitle,
  packages,
}: PackageCarouselProps) {
  const INITIAL_COUNT = 6;
  const LOAD_STEP = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, packages.length));
  };

  const visiblePackages = packages.slice(0, visibleCount);
  const hasMore = visibleCount < packages.length;

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <span className="text-[#483434] font-bold uppercase tracking-[0.2em] text-[11px] bg-[#483434]/10 px-3 py-1 rounded-full mb-2 inline-block">
          {subtitle}
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-black text-[#6b4f4f] flex items-center justify-center gap-3">
          <span className="h-[2px] w-6 bg-[#eed6c4]/40 rounded-full"></span>
          {title}
          <span className="h-[2px] w-6 bg-[#eed6c4]/40 rounded-full"></span>
        </h2>
      </div>

      {/* Grid of Fixed Width Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
        {visiblePackages.map((pkg) => (
          <div key={pkg.id} className="w-full max-w-[360px] flex">
            <PackageCard {...pkg} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="group px-8 py-3.5 bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] text-xs font-black uppercase tracking-widest rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#eed6c4]/40 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Load More Packages</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({visibleCount} of {packages.length})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
