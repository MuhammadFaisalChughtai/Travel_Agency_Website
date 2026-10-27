"use client";

import { Star } from "lucide-react";

export function TrustpilotWidget() {
  return (
    <div className="flex flex-col items-start justify-center py-2">
      <div className="flex items-center gap-1.5 justify-center mb-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
        <span className="text-xs font-bold text-white tracking-tight">
          5.0 Rating
        </span>
        <div className="flex gap-0.5 text-[#d4af37]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
          ))}
        </div>
      </div>
      <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest pl-1">
        Verified Pilgrim Satisfaction
      </p>
    </div>
  );
}
