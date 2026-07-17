"use client";

import { useState } from "react";
import { PackageCard } from "./PackageCard";

interface Package {
  id: string;
  title: string;
  image: string;
  stars: number;
  price: string;
  detailsUrl: string;
  isSold?: boolean;
  travelDates?: string;
}

interface CruisePackagesGridProps {
  packages: Package[];
}

export function CruisePackagesGrid({ packages }: CruisePackagesGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visiblePackages = packages.slice(0, visibleCount);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 lg:px-8">
        {visiblePackages.map((pkg) => (
          <PackageCard key={pkg.id} {...pkg} />
        ))}
      </div>

      {visibleCount < packages.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-[#064e3b] hover:bg-[#043427] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg border border-[#d4af37]/30 outline-none"
          >
            Load More Packages
          </button>
        </div>
      )}
    </div>
  );
}
