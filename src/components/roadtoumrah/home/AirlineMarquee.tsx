"use client";

import { useState } from "react";
import { Plane } from "lucide-react";

const AIRLINE_PARTNERS_LOGOS = [
  { name: "Emirates", logo: "/airlines/Emirates_logo.svg" },
  { name: "Qatar Airways", logo: "/airlines/Qatar_Airways_logo.svg" },
  { name: "British Airways", logo: "/airlines/BRITISH_AIRWAYS_logo.svg" },
  { name: "Turkish Airlines", logo: "/airlines/Turkish_Airlines_logo_2019_compact.svg" },
  { name: "Singapore Airlines", logo: "/airlines/Singapore_Airlines_Logo.svg" },
  { name: "Cathay Pacific", logo: "/airlines/Cathay_Pacific_Ltd._logo.svg" },
  { name: "Lufthansa", logo: "/airlines/Lufthansa_Logo_2018.svg" },
  { name: "Air France", logo: "/airlines/Air_France_Logo.svg" },
  { name: "KLM", logo: "/airlines/KLM_logo.svg" },
  { name: "American Airlines", logo: "/airlines/American_Airlines_logo_2013.svg" },
  { name: "Delta", logo: "/airlines/Delta_Air_Lines_logo_1987.svg" },
  { name: "United Airlines", logo: "/airlines/United_Airlines_logo_(1973_-_2010).svg" },
  { name: "ANA", logo: "/airlines/All_Nippon_Airways_Logo.svg" },
  { name: "Qantas", logo: "/airlines/Qantas_Empire_Airways_Kangaroo_Service_logo_1944–1947.svg" },
  { name: "Oman Air", logo: "/airlines/oman.svg" },
];

function AirlineLogo({ partner }: { partner: { name: string; logo: string } }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center gap-2 text-white opacity-60 hover:opacity-100 transition-opacity duration-300">
        <Plane className="w-6 h-6 md:w-8 md:h-8" />
        <span className="font-heading font-black text-xl md:text-2xl tracking-tighter uppercase whitespace-nowrap">
          {partner.name}
        </span>
      </div>
    );
  }

  return (
    <img
      src={partner.logo}
      alt={`${partner.name} Logo`}
      onError={() => setHasError(true)}
      className="max-h-8 md:max-h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 [filter:brightness(0)_invert(1)]"
    />
  );
}

export function AirlineMarquee() {
  return (
    <div className="bg-[#382626] py-12 border-b border-[#D4AF37]/20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 text-center relative z-10">
        <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em]">
          Partnering With Top Global Airlines
        </p>
      </div>

      {/* Marquee Container */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
        {[...AIRLINE_PARTNERS_LOGOS, ...AIRLINE_PARTNERS_LOGOS].map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="flex-shrink-0 w-[200px] md:w-[250px] flex items-center justify-center px-8"
          >
            <AirlineLogo partner={partner} />
          </div>
        ))}
      </div>
    </div>
  );
}
