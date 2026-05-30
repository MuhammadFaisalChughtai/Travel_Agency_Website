import Link from "next/link";
import { PhoneCall, ArrowRight, RefreshCw, PlaneTakeoff, PlaneLanding, Briefcase, Calendar } from "lucide-react";
import { FlightEnquireButton } from "./FlightEnquireButton";

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
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#eed6c4]/40 shadow-sm hover:shadow-md hover:border-[#6b4f4f]/30 transition-all duration-300 flex flex-col h-full">
      
      {/* Top Bar */}
      <div className="bg-[#382626] px-4 py-2.5 flex items-center justify-between">
        <h3 className="text-[11px] md:text-xs text-white font-semibold tracking-wide truncate pr-4">
          Flights to {destination} ({destinationCode}) with {airline}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {month && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eed6c4]/20 text-[#eed6c4] text-[9px] font-black uppercase tracking-wider">
              <Calendar className="w-2.5 h-2.5" />
              {month}
            </span>
          )}
          {isReturn ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fff3e4]0/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
              <RefreshCw className="w-2.5 h-2.5" />
              Return Included
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f5f0eb]0/20 text-slate-300 text-[9px] font-black uppercase tracking-wider">
              <ArrowRight className="w-2.5 h-2.5" />
              One Way
            </span>
          )}
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 border-b border-slate-100 bg-[#f5f0eb]/50">
        <div className="col-span-5 text-[9px] md:text-[10px] text-[#6b4f4f] font-bold uppercase tracking-widest text-left">Route & Airline</div>
        <div className="col-span-4 text-[9px] md:text-[10px] text-[#6b4f4f] font-bold uppercase tracking-widest text-left">Transit / Connection</div>
        <div className="col-span-3 text-[9px] md:text-[10px] text-[#6b4f4f] font-bold uppercase tracking-widest text-right truncate">Baggage & Fare</div>
      </div>

      {/* Table Body */}
      <div className="p-4 flex-1 flex flex-col justify-center space-y-4">
        
        {/* Outbound Row */}
        <div className="grid grid-cols-12 items-center gap-2">
          {/* Col 1: Route & Airline */}
          <div className="col-span-5 flex items-start gap-2">
            <PlaneTakeoff className="w-4 h-4 text-[#6b4f4f] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#382626]">{departureCode}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-[#382626]">{destinationCode}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">{airline}</p>
            </div>
          </div>

          {/* Col 2: Transit */}
          <div className="col-span-4 text-xs">
            {isTransit ? (
              <div className="text-amber-800 font-semibold flex flex-col">
                <span className="text-[11px]">Transit ({transitAirport})</span>
                {transitDuration && <span className="text-[9px] text-slate-400 font-medium">Layover: {transitDuration}</span>}
              </div>
            ) : (
              <div className="text-slate-600 font-semibold flex flex-col">
                <span className="text-[11px]">Direct Flight</span>
                <span className="text-[9px] text-slate-400 font-medium">Duration: {duration}</span>
              </div>
            )}
          </div>

          {/* Col 3: Baggage */}
          <div className="col-span-3 text-right text-[11px] text-[#f5f0eb]0 font-bold flex flex-col">
            <span className="truncate">{baggage}</span>
            <span className="text-[9px] text-slate-400 font-medium">Outbound</span>
          </div>
        </div>

        {/* Return Row (if applicable) */}
        {isReturn && (
          <div className="grid grid-cols-12 items-center gap-2 pt-3 border-t border-dashed border-slate-100">
            {/* Col 1: Route & Airline */}
            <div className="col-span-5 flex items-start gap-2">
              <PlaneLanding className="w-4 h-4 text-[#6b4f4f] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#382626]">{destinationCode}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-[#382626]">{departureCode}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">{returnAirline || airline}</p>
              </div>
            </div>

            {/* Col 2: Transit */}
            <div className="col-span-4 text-xs">
              {returnIsTransit ? (
                <div className="text-amber-800 font-semibold flex flex-col">
                  <span className="text-[11px]">Transit ({returnTransitAirport})</span>
                  {returnTransitDuration && <span className="text-[9px] text-slate-400 font-medium">Layover: {returnTransitDuration}</span>}
                </div>
              ) : (
                <div className="text-slate-600 font-semibold flex flex-col">
                  <span className="text-[11px]">Direct Flight</span>
                  <span className="text-[9px] text-slate-400 font-medium">Duration: {returnDuration || duration}</span>
                </div>
              )}
            </div>

            {/* Col 3: Baggage */}
            <div className="col-span-3 text-right text-[11px] text-[#f5f0eb]0 font-bold flex flex-col">
              <span className="truncate">{returnBaggage || baggage}</span>
              <span className="text-[9px] text-slate-400 font-medium">Return</span>
            </div>
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[#6b4f4f] text-[10px] font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Cabin + Checked Baggage Incl.</span>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="bg-[#6b4f4f] text-white px-3 py-1 rounded-lg shadow-sm">
              <span className="text-lg md:text-xl font-heading font-black">{price}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Inc. Taxes & Fees</span>
          </div>
        </div>

      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 bg-[#fcfaf8] border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#eed6c4]/30 flex items-center justify-center">
            <PhoneCall className="w-3 h-3 text-[#6b4f4f]" />
          </div>
          <span className="text-[11px] text-[#f5f0eb]0 font-medium mr-auto">We are open 24/7</span>
          <a href="tel:+441215291630" className="text-[11px] md:text-xs font-black text-[#6b4f4f] hover:text-[#382626] transition-colors">
            +44 1215 291630
          </a>
        </div>
        
        <div className="flex gap-2">
          <FlightEnquireButton flightId={id} flightTitle={`Flight to ${destination} with ${airline}`} />
          <Link
            href={`/v/${id}`}
            className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl bg-[#6b4f4f] text-white font-heading font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:bg-[#483434] hover:shadow-md"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
