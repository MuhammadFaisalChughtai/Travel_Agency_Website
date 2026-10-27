"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function TrustpilotHeroBadge({ label = "Pilgrims" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 pt-1 text-[11px] text-slate-300 font-medium">
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5 text-[#d4af37]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
          ))}
        </div>
        <span>• Rated 5/5 by 500+ {label}</span>
      </div>
    </div>
  );
}
