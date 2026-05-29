"use client";

import { useRef } from "react";
import { PackageCard } from "./PackageCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PackageItem {
  id: string;
  title: string;
  image: string;
  stars: number;
  price: string;
  detailsUrl: string;
  isSold?: boolean;
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-6 relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <span className="text-[#064e3b] font-bold uppercase tracking-[0.2em] text-[11px] bg-[#064e3b]/10 px-3 py-1 rounded-full mb-2 inline-block">
          {subtitle}
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-black text-[#064e3b] flex items-center justify-center gap-3">
          <span className="h-[2px] w-6 bg-[#d4af37]/40 rounded-full"></span>
          {title}
          <span className="h-[2px] w-6 bg-[#d4af37]/40 rounded-full"></span>
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white text-[#064e3b] border border-[#d4af37]/50 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#064e3b] hover:text-[#F9FAFB] hover:border-[#064e3b] disabled:opacity-0 focus:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar pt-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {packages.map((pkg) => (
            <div key={pkg.id} className="snap-start shrink-0">
              <PackageCard {...pkg} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white text-[#064e3b] border border-[#d4af37]/50 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#064e3b] hover:text-[#F9FAFB] hover:border-[#064e3b] disabled:opacity-0 focus:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
