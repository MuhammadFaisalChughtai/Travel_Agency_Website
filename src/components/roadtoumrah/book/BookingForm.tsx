"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FlightBookingForm } from "@/components/roadtoumrah/flights/FlightBookingForm";
import { UmrahBookingForm } from "@/components/roadtoumrah/umrah/UmrahBookingForm";
import { VisaBookingForm } from "@/components/roadtoumrah/visa/VisaBookingForm";
import { HolidaysBookingForm } from "@/components/roadtoumrah/holiday/HolidaysBookingForm";
import { TransportBookingForm } from "@/components/roadtoumrah/transport/TransportBookingForm";
import { CheckCircle } from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "package";
  const id = searchParams.get("id") || "";

  const isFlight = type === "flight";
  const isVisa = type === "visa";
  const isTransport = type === "transport";
  const isHoliday = type === "holiday";
  const isHajj = type === "hajj" || id.toLowerCase().includes("hajj");

  const labels: Record<string, { badge: string; title: string; desc: string }> = {
    flight: {
      badge: "Worldwide Travel",
      title: "Secure Your Flight Booking",
      desc: "Submit your passenger details and our team will finalise your flight reservation.",
    },
    visa: {
      badge: "Visa Services",
      title: "Request a Visa Quote",
      desc: "Fill in your details and our visa specialists will get back to you within 24 hours.",
    },
    transport: {
      badge: "Transport Services",
      title: "Book Your Transfer",
      desc: "Tell us your journey details and we'll confirm your booking within 24 hours.",
    },
    holiday: {
      badge: "Holiday Packages",
      title: "Plan Your Dream Holiday",
      desc: "Fill in your preferences and we'll prepare a personalised free quote for you.",
    },
    hajj: {
      badge: "Hajj Packages",
      title: "Plan Your Hajj Journey",
      desc: "Fill in your preferences and our specialist team will prepare a free tailored quote.",
    },
    package: {
      badge: "Tailor-Made Pilgrimage",
      title: "Plan Your Sacred Journey",
      desc: "Fill in your preferences and our team will prepare a personalised free quote for you.",
    },
  };

  const label = labels[isHajj ? "hajj" : isHoliday ? "holiday" : type] ?? labels.package;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-5">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-bold uppercase tracking-[0.25em] mb-3 border border-[#d4af37]/60">
            {label.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-[#064e3b] tracking-tight mb-3">
            {label.title}
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">{label.desc}</p>
          <div className="h-[2px] w-12 bg-[#064e3b]/30 mx-auto mt-5 rounded-full" />
        </div>

        {/* Render the correct existing form — isHome=false gives the white card style */}
        {isFlight && <FlightBookingForm isHome={false} />}
        {isVisa && <VisaBookingForm isHome={false} packageId={id} />}
        {isTransport && <TransportBookingForm isHome={false} packageId={id} />}
        {isHoliday && <HolidaysBookingForm isHome={false} />}
        {(isHajj || (!isFlight && !isVisa && !isTransport && !isHoliday)) && (
          <UmrahBookingForm isHome={false} />
        )}

        {/* Reassurance strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
          {[
            "No payment required",
            isFlight ? "Instant routing checks" : "Free quote within 24 hours",
            "No obligation",
          ].map((text) => (
            <span
              key={text}
              className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BookingForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-[#064e3b]">
            <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="font-heading font-black text-sm uppercase tracking-widest">Loading…</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
