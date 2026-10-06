"use client";

import React, { useState, useEffect } from "react";
import { Plane } from "lucide-react";

interface AirlineLogoProps {
  carrier?: string | null;
  name?: string | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "prominent";
  variant?: "banner" | "square" | "auto";
}

const LOCAL_LOGOS: Record<string, string> = {
  BA: "/airlines/BRITISH_AIRWAYS_logo.svg",
  EK: "/airlines/Emirates_logo.svg",
  QR: "/airlines/Qatar_Airways_logo.svg",
  TK: "/airlines/Turkish_Airlines_logo_2019_compact.svg",
  WY: "/airlines/oman.svg",
  AF: "/airlines/Air_France_Logo.svg",
  LH: "/airlines/Lufthansa_Logo_2018.svg",
  KL: "/airlines/KLM_logo.svg",
  SQ: "/airlines/Singapore_Airlines_Logo.svg",
  AA: "/airlines/American_Airlines_logo_2013.svg",
  DL: "/airlines/Delta_Air_Lines_logo_1987.svg",
  UA: "/airlines/United_Airlines_logo_(1973_-_2010).svg",
  NH: "/airlines/All_Nippon_Airways_Logo.svg",
  CX: "/airlines/Cathay_Pacific_Ltd._logo.svg",
  QF: "/airlines/Qantas_Empire_Airways_Kangaroo_Service_logo_1944–1947.svg",
};

const SIZE_MAP = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-16 h-10",
  lg: "w-20 h-12",
  prominent: "w-28 sm:w-36 h-12 sm:h-14",
};

export function AirlineLogo({
  carrier,
  name,
  className,
  size = "md",
  variant = "auto",
}: AirlineLogoProps) {
  // Clean carrier code (first 2-3 uppercase letters/numbers, e.g. "9B", "SV", "TK")
  const cleanCode = (carrier || "")
    .trim()
    .split(/[\s,/]+/)[0]
    ?.toUpperCase()
    ?.slice(0, 3);

  const [errorStage, setErrorStage] = useState<number>(0);

  // Reset error stage if carrier changes
  useEffect(() => {
    setErrorStage(0);
  }, [cleanCode]);

  const isSquare =
    variant === "square" ||
    (variant === "auto" && (size === "xs" || size === "sm"));

  // Build the prioritized URL list depending on layout mode (square icon vs wide banner)
  const sources: string[] = [];

  if (cleanCode) {
    if (isSquare) {
      // Square icon priority (sidebar filters, transit leg indicators)
      sources.push(`https://images.kiwi.com/airlines/64x64/${cleanCode}.png`);
      sources.push(`https://pics.avs.io/al_square/64/64/${cleanCode}.png`);
      if (LOCAL_LOGOS[cleanCode]) sources.push(LOCAL_LOGOS[cleanCode]);
      sources.push(`https://pics.avs.io/200/80/${cleanCode}.png`);
      sources.push(`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${cleanCode}.svg`);
    } else {
      // Wide banner priority (prominent flight card headers, modals)
      // 1. Local curated vector SVG if available
      if (LOCAL_LOGOS[cleanCode]) sources.push(LOCAL_LOGOS[cleanCode]);
      // 2. High-res wide banner (200x80@2x) from Aviasales CDN — tightly cropped, fully visible emblem + text
      sources.push(`https://pics.avs.io/200/80/${cleanCode}@2x.png`);
      sources.push(`https://pics.avs.io/200/80/${cleanCode}.png`);
      // 3. Vector SVG from Duffel
      sources.push(`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${cleanCode}.svg`);
      // 4. Square cropped PNG from Kiwi
      sources.push(`https://images.kiwi.com/airlines/64x64/${cleanCode}.png`);
      // 5. Square PNG from Aviasales
      sources.push(`https://pics.avs.io/al_square/64/64/${cleanCode}.png`);
    }
  }

  const defaultClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const containerClasses = className || defaultClasses;
  const hasCustomPadding = /\bp[xytb]?-/.test(containerClasses);
  const paddingClass = hasCustomPadding ? "" : isSquare ? "p-1" : "px-2.5 py-1.5";

  // Fallback to stylized text badge if all CDN stages fail or no carrier code provided
  if (!cleanCode || errorStage >= sources.length) {
    return (
      <div
        className={`${containerClasses} ${paddingClass} rounded-xl bg-[#eed6c4]/30 border border-[#eed6c4]/60 flex items-center justify-center font-black text-xs text-[#6b4f4f] shrink-0 select-none shadow-xs text-center`}
        title={name || carrier || "Airline"}
      >
        <span className="truncate">{cleanCode || <Plane className="w-3.5 h-3.5 text-[#6b4f4f]" />}</span>
      </div>
    );
  }

  const currentSrc = sources[errorStage];

  return (
    <div
      className={`${containerClasses} ${paddingClass} rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shrink-0 overflow-hidden shadow-xs hover:border-[#6b4f4f]/40 transition-colors`}
      title={name || cleanCode}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${cleanCode}-${errorStage}`}
        src={currentSrc}
        alt={name || cleanCode}
        loading="lazy"
        decoding="async"
        onError={() => setErrorStage((prev) => prev + 1)}
        className="w-full h-full max-h-full max-w-full object-contain object-center scale-100"
      />
    </div>
  );
}
