"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, X, Plane } from "lucide-react";

export function PayLaterBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#483434] via-[#6b4f4f] to-[#483434] text-white text-xs py-2.5 px-4 sticky top-[81px] sm:top-[90px] z-30 shadow-md border-b border-[#eed6c4]/30 animate-fade-in">
      <div className="max-w-7xl mx-auto relative flex items-center justify-center px-6">
        {/* Perfectly Centered Banner Content */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#eed6c4]/20 text-[#fff3e4] border border-[#eed6c4]/40 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
            <Plane className="w-3 h-3 text-[#eed6c4]" /> Low Deposit
          </span>

          <span className="font-bold text-[#fff3e4] text-[11px] sm:text-xs">
            Book now, pay later — secure your holiday with a low deposit and pay
            the balance before you travel
          </span>

          <Link
            href="/pay-later"
            className="inline-flex items-center gap-1 font-extrabold text-[#eed6c4] hover:text-white underline underline-offset-2 transition-colors shrink-0 text-[11px] sm:text-xs group"
          >
            How it works{" "}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Absolute Positioned Dismiss Button on Far Right */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#eed6c4]/70 hover:text-white p-1 transition-colors shrink-0"
          aria-label="Dismiss notice"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
