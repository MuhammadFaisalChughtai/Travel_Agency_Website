"use client";

import { Star } from "lucide-react";

export function TrustpilotHeroBadge({ label = "Pilgrims" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 pt-1 text-[11px] text-slate-300 font-medium">
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span>• 5-Star Rated Service by 1,000+ {label}</span>
      </div>
    </div>
  );
}
