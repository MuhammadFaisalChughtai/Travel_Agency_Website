"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function TrustpilotHeroBadge({ label = "Pilgrims" }: { label?: string }) {
  const [data, setData] = useState<{ trustScore: number; numberOfReviews: number } | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load Trustpilot score:", err);
      }
    }
    fetchReviews();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300 font-medium">
        <div className="flex gap-0.5 text-[#DFDE7D] opacity-50">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#DFDE7D] stroke-none" />
          ))}
        </div>
        <span className="opacity-50 animate-pulse w-40 h-3 bg-white/10 rounded"></span>
      </div>
    );
  }

  const roundedScore = data.trustScore.toFixed(1);
  const formattedReviews = new Intl.NumberFormat('en-GB').format(data.numberOfReviews);

  return (
    <a
      href="https://uk.trustpilot.com/review/terrifictravel.co.uk"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 pt-1 text-[11px] text-slate-300 font-medium hover:text-white transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5 text-[#00b67a]">
          {/* Trustpilot official green star color instead of tan, to make it clear it's Trustpilot */}
          {[...Array(5)].map((_, i) => {
            const isFull = i < Math.floor(data.trustScore);
            const isHalf = !isFull && i < Math.ceil(data.trustScore);
            return (
              <div key={i} className={`w-3.5 h-3.5 rounded-[1px] flex items-center justify-center text-[8px] font-black ${isFull || isHalf ? 'bg-[#00b67a]' : 'bg-[#dcdce6]'} text-white`}>
                ★
              </div>
            );
          })}
        </div>
        <span>• Rated {roundedScore}/5 on <span className="font-bold group-hover:underline">Trustpilot</span> by {formattedReviews}+ {label}</span>
      </div>
    </a>
  );
}
