"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { TrustpilotHeroBadge } from "@/components/roadtoumrah/umrah/TrustpilotHeroBadge";

interface HeroProps {
  badgeText: string;
  badgeIcon?: ReactNode;
  title: string | ReactNode;
  highlightedTitle?: string;
  description: string;
  backgroundImage: string;
  showTrustpilot?: boolean;
  trustpilotLabel?: string;
  customRatingBadge?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Hero({
  badgeText,
  badgeIcon,
  title,
  highlightedTitle,
  description,
  backgroundImage,
  showTrustpilot = false,
  trustpilotLabel = "Pilgrims",
  customRatingBadge,
  className = "",
  children,
}: HeroProps) {
  return (
    <div
      className={`relative w-full pt-28 pb-16 md:pt-36 md:pb-24 bg-slate-900 overflow-hidden border-b border-[#d4af37]/20 flex items-center ${className}`}
    >
      {/* Background Image with ultra-sleek dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={typeof title === "string" ? title : "Hero Banner"}
          fill
          className="object-cover scale-100 animate-[subtle-zoom_25s_infinite_alternate]"
          priority
        />
        {/* Modern dark luxury overlay to ensure perfect text contrast while keeping the whole image visible */}
        <div className="absolute inset-0 bg-black/60 z-1" />
      </div>

      {/* Sleek Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-2xl text-left space-y-4">
          {/* Elegant Micro-Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tight leading-tight">
            {highlightedTitle ? (
              <>
                {title}{" "}
                <span className="text-[#d4af37] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
                  {highlightedTitle}
                </span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className="text-slate-200/90 text-xs md:text-sm font-light max-w-md leading-relaxed">
            {description}
          </p>

          {/* Rated Badges */}
          {showTrustpilot && (
            <div className="pt-1">
              <TrustpilotHeroBadge label={trustpilotLabel} />
            </div>
          )}
          {customRatingBadge}
        </div>
      </div>
      {children}
    </div>
  );
}
