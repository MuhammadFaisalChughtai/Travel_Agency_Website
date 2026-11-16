import Link from "next/link";
import {
  PhoneCall,
  ArrowRight,
  RefreshCw,
  Plane,
  Briefcase,
  Calendar,
  Clock,
  ShieldCheck,
  PlaneTakeoff,
  PlaneLanding
} from "lucide-react";
import { FlightEnquireButton } from "./FlightEnquireButton";
import { getAirportCleanName } from "@/lib/airports";

interface FlightListCardProps {
  id: string;
  airline: string;
  airlineCode?: string | null;
  departure: string;
  departureCode: string;
  destination: string;
  destinationCode: string;
  price: string;
  baggage: string;
  month?: string | null;

  duration: string;
  isTransit: boolean;
  transitAirport?: string | null;
  transitDuration?: string | null;

  isReturn: boolean;
  returnAirline?: string | null;
  returnAirlineCode?: string | null;
  returnDuration?: string | null;
  returnIsTransit?: boolean | null;
  returnTransitAirport?: string | null;
  returnTransitDuration?: string | null;
  returnBaggage?: string | null;
  returnAircraft?: string | null;
}

/**
 * Filter out any legacy past months (e.g. November 2023) to keep cards fresh and valid.
 */
function sanitizeMonth(m?: string | null): string | null {
  if (!m) return null;
  const currentYear = new Date().getFullYear();
  const match = m.match(/\b(20\d{2})\b/);
  if (match) {
    const year = parseInt(match[1], 10);
    if (year < currentYear) {
      return null;
    }
  }
  return m;
}

export function FlightListCard({
  id,
  airline,
  airlineCode,
  departure,
  departureCode,
  destination,
  destinationCode,
  price,
  baggage,
  month,
  duration,
  isTransit,
  transitAirport,
  transitDuration,
  isReturn,
  returnAirline,
  returnAirlineCode,
  returnDuration,
  returnIsTransit,
  returnTransitAirport,
  returnTransitDuration,
  returnBaggage,
}: FlightListCardProps) {
  const validMonth = sanitizeMonth(month);

  // Get human-friendly, proper airport names
  const depAirportName = getAirportCleanName(departureCode, departure || "London Heathrow");
  const destAirportName = getAirportCleanName(destinationCode, destination);
  const transitAirportName = transitAirport ? getAirportCleanName(transitAirport, transitAirport) : "";
  const returnTransitAirportName = returnTransitAirport
    ? getAirportCleanName(returnTransitAirport, returnTransitAirport)
    : "";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-[0_12px_32px_rgba(6,78,59,0.12)] hover:border-[#064e3b]/40 transition-all duration-300 flex flex-col h-full relative">
      <a href={`/v/${id}`} className="absolute inset-0 z-10" aria-label={`View flight to ${destination}`}>
        <span className="sr-only">View Flight</span>
      </a>

      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#032e22] via-[#064e3b] to-[#032e22] px-5 py-3 flex items-center justify-between border-b border-[#d4af37]/20">
        <div className="flex items-center gap-2 min-w-0 pr-3">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 animate-pulse" />
          <h3 className="text-xs md:text-sm text-white font-bold tracking-tight truncate">
            Flights to <span className="text-[#d4af37] font-black">{destination}</span> ({destinationCode})
            <span className="text-white/60 font-normal hidden sm:inline"> • {airline}</span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {validMonth && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-black uppercase tracking-wider">
              <Calendar className="w-3 h-3 text-[#d4af37]" />
              {validMonth}
            </span>
          )}
          {isReturn ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <RefreshCw className="w-3 h-3 text-emerald-400" />
              Return Flight
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[10px] font-black uppercase tracking-wider">
              <ArrowRight className="w-3 h-3 text-slate-300" />
              One Way
            </span>
          )}
        </div>
      </div>

      {/* Main Ticket Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Outbound Journey Block */}
        <div className="rounded-xl bg-slate-50/70 border border-slate-200/80 p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 text-[10px] font-bold text-[#064e3b] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <PlaneTakeoff className="w-3.5 h-3.5 text-[#064e3b]" />
              Outbound Flight
            </span>
            <span className="text-slate-500 font-medium lowercase first-letter:uppercase">
              {isTransit ? `1 Stop (${transitAirportName})` : "Non-stop direct"}
            </span>
          </div>

          <div className="grid grid-cols-12 items-center gap-3">
            {/* Origin Airport */}
            <div className="col-span-4 min-w-0">
              <div className="text-base sm:text-lg font-black text-[#032e22] tracking-tight flex items-baseline gap-1">
                {departureCode}
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">DEP</span>
              </div>
              <p className="text-xs font-bold text-slate-700 truncate" title={depAirportName}>
                {depAirportName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{airline}</p>
            </div>

            {/* Flight Route Indicator */}
            <div className="col-span-4 flex flex-col items-center justify-center px-1">
              <span className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {duration || "Direct"}
              </span>
              <div className="w-full flex items-center gap-1">
                <div className="h-[2px] flex-1 bg-slate-200" />
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-[#064e3b]/30 flex items-center justify-center shrink-0">
                  <Plane className="w-3 h-3 text-[#064e3b]" />
                </div>
                <div className="h-[2px] flex-1 bg-slate-200" />
              </div>
              <span className={`text-[9px] font-bold mt-1 text-center ${isTransit ? "text-amber-700" : "text-emerald-700"}`}>
                {isTransit ? (transitDuration ? `Stop: ${transitDuration}` : "Transit") : "Direct"}
              </span>
            </div>

            {/* Destination Airport */}
            <div className="col-span-4 text-right min-w-0">
              <div className="text-base sm:text-lg font-black text-[#032e22] tracking-tight flex items-baseline justify-end gap-1">
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">ARR</span>
                {destinationCode}
              </div>
              <p className="text-xs font-bold text-slate-700 truncate" title={destAirportName}>
                {destAirportName}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{destination}</p>
            </div>
          </div>
        </div>

        {/* Return Journey Block (if return included) */}
        {isReturn && (
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/80 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 text-[10px] font-bold text-[#064e3b] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <PlaneLanding className="w-3.5 h-3.5 text-[#064e3b]" />
                Inbound Return
              </span>
              <span className="text-slate-500 font-medium lowercase first-letter:uppercase">
                {returnIsTransit ? `1 Stop (${returnTransitAirportName || "Transit"})` : "Non-stop direct"}
              </span>
            </div>

            <div className="grid grid-cols-12 items-center gap-3">
              {/* Return Origin Airport */}
              <div className="col-span-4 min-w-0">
                <div className="text-base sm:text-lg font-black text-[#032e22] tracking-tight">
                  {destinationCode}
                </div>
                <p className="text-xs font-bold text-slate-700 truncate" title={destAirportName}>
                  {destAirportName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{returnAirline || airline}</p>
              </div>

              {/* Flight Route Indicator */}
              <div className="col-span-4 flex flex-col items-center justify-center px-1">
                <span className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {returnDuration || duration || "Direct"}
                </span>
                <div className="w-full flex items-center gap-1">
                  <div className="h-[2px] flex-1 bg-slate-200" />
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-[#064e3b]/30 flex items-center justify-center shrink-0">
                    <Plane className="w-3 h-3 text-[#064e3b] rotate-180" />
                  </div>
                  <div className="h-[2px] flex-1 bg-slate-200" />
                </div>
                <span className={`text-[9px] font-bold mt-1 text-center ${returnIsTransit ? "text-amber-700" : "text-emerald-700"}`}>
                  {returnIsTransit ? (returnTransitDuration ? `Stop: ${returnTransitDuration}` : "Transit") : "Direct"}
                </span>
              </div>

              {/* Return Destination Airport */}
              <div className="col-span-4 text-right min-w-0">
                <div className="text-base sm:text-lg font-black text-[#032e22] tracking-tight">
                  {departureCode}
                </div>
                <p className="text-xs font-bold text-slate-700 truncate" title={depAirportName}>
                  {depAirportName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{departure}</p>
              </div>
            </div>
          </div>
        )}

        {/* Airline Info & Baggage Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-black text-[#064e3b]">
              <Plane className="w-4 h-4 text-[#064e3b]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-extrabold text-[#032e22] block truncate">{airline}</span>
              <span className="text-[10px] text-slate-400 font-medium block">Operated Carrier</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700">
            <Briefcase className="w-3.5 h-3.5 text-[#064e3b]" />
            <span>{baggage || "30kg Checked, 7kg Cabin"}</span>
          </div>
        </div>

        {/* Pricing Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border border-emerald-200/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-black text-[#032e22] block leading-none">ATOL Protected</span>
              <span className="text-[10px] text-slate-500 font-medium">All taxes & fees included</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
              <span className="text-2xl font-heading font-black text-[#064e3b] leading-none">{price}</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mt-0.5">Per Person</span>
          </div>
        </div>

      </div>

      {/* Bottom CTA Bar */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between mb-3 text-[11px]">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#064e3b]" />
            Call for best deal:
          </span>
          <a
            href="tel:+441215291630"
            className="font-black text-[#064e3b] hover:underline transition-colors"
          >
            +44 1215 291630
          </a>
        </div>
        
        <div className="flex gap-2 relative z-20">
          <FlightEnquireButton flightId={id} flightTitle={`Flight to ${destination} (${destinationCode}) with ${airline}`} />
          <a
            href={`/v/${id}`}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#064e3b] text-white font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:bg-[#043427] hover:shadow-md cursor-pointer"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
