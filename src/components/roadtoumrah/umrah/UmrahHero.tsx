import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import { TrustpilotHeroBadge } from "./TrustpilotHeroBadge";

export function UmrahHero() {
  return (
    <div className="relative w-full pt-28 pb-16 md:pt-36 md:pb-24 bg-[#382626] overflow-hidden border-b border-[#8c3061]/20 flex items-center">
      {/* Background Image with ultra-sleek dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Umrah Packages"
          fill
          className="object-cover scale-100 animate-[subtle-zoom_25s_infinite_alternate]"
          priority
        />
        {/* Modern dark luxury gradient mask to ensure perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#382626] via-[#382626]/90 to-transparent" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#382626] via-transparent to-black/20" /> */}
      </div>

      {/* Sleek Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-xl text-left space-y-4">
          {/* Elegant Micro-Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c3061]/15 border border-[#8c3061]/30 text-[#8c3061] text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            Sacred Journeys 2026
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tight leading-tight">
            Elite{" "}
            <span className="text-[#8c3061] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Umrah
            </span>{" "}
            Packages
          </h1>

          <p className="text-slate-200/90 text-xs md:text-sm font-light max-w-md leading-relaxed">
            Experience spiritual fulfillment with bespoke travel curation,
            premium accommodations steps from the Haram, and VIP logistics.
          </p>

          {/* Rated Badge */}
          <TrustpilotHeroBadge />
        </div>
      </div>
    </div>
  );
}
