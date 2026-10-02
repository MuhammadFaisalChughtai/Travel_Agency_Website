"use client";

import React, { useState } from "react";
import { Plane } from "lucide-react";

interface AirlineLogoProps {
  carrier?: string | null;
  name?: string | null;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_MAP = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function AirlineLogo({
  carrier,
  name,
  className,
  size = "md",
}: AirlineLogoProps) {
  // Clean carrier code (first 2-3 uppercase letters)
  const cleanCode = (carrier || "")
    .trim()
    .split(/[\s,/]+/)[0]
    ?.toUpperCase()
    ?.slice(0, 3);

  // Stage 0: primary CDN (pics.avs.io)
  // Stage 1: fallback CDN (images.kiwi.com)
  // Stage 2: text badge fallback
  const [errorStage, setErrorStage] = useState<number>(0);

  const sizeClass = className || SIZE_MAP[size] || SIZE_MAP.md;

  if (!cleanCode || errorStage >= 2) {
    return (
      <div
        className={`${sizeClass} rounded-xl bg-[#eed6c4]/30 border border-[#eed6c4]/60 flex items-center justify-center font-black text-xs text-[#6b4f4f] shrink-0 select-none shadow-xs`}
        title={name || carrier || "Airline"}
      >
        {cleanCode || <Plane className="w-3.5 h-3.5 text-[#6b4f4f]" />}
      </div>
    );
  }

  const src =
    errorStage === 0
      ? `https://pics.avs.io/200/200/${cleanCode}.png`
      : `https://images.kiwi.com/airlines/64x64/${cleanCode}.png`;

  return (
    <div
      className={`${sizeClass} rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs`}
      title={name || cleanCode}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name || cleanCode}
        loading="lazy"
        decoding="async"
        onError={() => setErrorStage((prev) => prev + 1)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
