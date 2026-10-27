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
        <div className="flex gap-0.5 text-[#eed6c4] opacity-50">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#eed6c4] stroke-none" />
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
        <div className="flex gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.round(data.trustScore)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-white/20 text-white/20"
              }`}
            />
          ))}
        </div>
        <span>• Rated {roundedScore}/5 on <span className="font-bold group-hover:underline text-[#00b67a]">Trustpilot</span> ({formattedReviews}+ reviews)</span>
      </div>
    </a>
  );
}
