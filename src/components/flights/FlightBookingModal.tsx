"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MathChallenge } from "@/components/ui/MathChallenge";
import { PhoneInput } from "@/components/ui/PhoneInput";
import {
  Mail,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  X,
  Plane,
  Calendar,
  Clock,
  Briefcase,
  Users,
  ArrowRight,
  ShieldCheck,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import { FlightSearchResultItem } from "@/lib/travelport";

interface FlightBookingModalProps {
  flight: FlightSearchResultItem | null;
  isOpen: boolean;
  onClose: () => void;
  searchCriteria?: {
    tripType: string;
    passengers: { adults: number; children?: number; infants?: number };
    cabin?: string;
    bags?: number;
  };
}

export function FlightBookingModal({
  flight,
  isOpen,
  onClose,
  searchCriteria,
}: FlightBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isMathValid, setIsMathValid] = useState(false);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [resetMathKey, setResetMathKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setErrorMsg("");
      setIsMathValid(false);
      setResetMathKey((prev) => prev + 1);
    }
  }, [isOpen]);

  if (!isOpen || !flight || !mounted) return null;

  const totalPassengers =
    (searchCriteria?.passengers?.adults || 1) +
    (searchCriteria?.passengers?.children || 0) +
    (searchCriteria?.passengers?.infants || 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    if (!isMathValid) {
      setErrorMsg("Please solve the anti-spam verification problem correctly.");
      setStatus("error");
      return;
    }

    try {
      const outboundSegmentsDetail = flight.outbound.segments
        .map(
          (s, idx) =>
            `  * Segment ${idx + 1}: ${s.flightNumber} (${s.airline}, ${s.aircraft || "Aircraft"}) ${s.departureAirport} (${s.departureAirportName || s.departureAirport}${s.departureTerminal ? `, T${s.departureTerminal}` : ""}) ${s.departureTime.slice(0, 5)} -> ${s.arrivalAirport} (${s.arrivalAirportName || s.arrivalAirport}${s.arrivalTerminal ? `, T${s.arrivalTerminal}` : ""}) ${s.arrivalTime.slice(0, 5)}${s.connectionDuration ? ` [Transit / Layover: ${s.connectionDuration}]` : ""}`
        )
        .join("\n");

      const inboundSegmentsDetail = flight.inbound
        ? flight.inbound.segments
            .map(
              (s, idx) =>
                `  * Segment ${idx + 1}: ${s.flightNumber} (${s.airline}, ${s.aircraft || "Aircraft"}) ${s.departureAirport} (${s.departureAirportName || s.departureAirport}${s.departureTerminal ? `, T${s.departureTerminal}` : ""}) ${s.departureTime.slice(0, 5)} -> ${s.arrivalAirport} (${s.arrivalAirportName || s.arrivalAirport}${s.arrivalTerminal ? `, T${s.arrivalTerminal}` : ""}) ${s.arrivalTime.slice(0, 5)}${s.connectionDuration ? ` [Transit / Layover: ${s.connectionDuration}]` : ""}`
            )
            .join("\n")
        : "";

      const multiCityLegsDetail =
        flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
          ? flight.legs
              .map((leg, lIdx) => {
                const segs = leg.segments
                  .map(
                    (s, idx) =>
                      `    * Segment ${idx + 1}: ${s.flightNumber} (${s.airline}, ${s.aircraft || "Aircraft"}) ${s.departureAirport} (${s.departureAirportName || s.departureAirport}${s.departureTerminal ? `, T${s.departureTerminal}` : ""}) ${s.departureTime.slice(0, 5)} -> ${s.arrivalAirport} (${s.arrivalAirportName || s.arrivalAirport}${s.arrivalTerminal ? `, T${s.arrivalTerminal}` : ""}) ${s.arrivalTime.slice(0, 5)}${s.connectionDuration ? ` [Transit / Layover: ${s.connectionDuration}]` : ""}`
                  )
                  .join("\n");
                return `Flight ${lIdx + 1}:
- Route: ${leg.departureAirportName || leg.departureAirport} to ${leg.arrivalAirportName || leg.arrivalAirport}
- Flight(s): ${leg.flightNumbers}
- Departure: ${leg.departureDate} at ${leg.departureTime}
- Arrival: ${leg.arrivalDate} at ${leg.arrivalTime}
- Duration: ${leg.totalDuration} (${leg.isDirect ? "Direct" : `${leg.stopsCount} stop(s)`})
Segments:
${segs}`;
              })
              .join("\n\n")
          : "";

      const flightDetailsMessage = `
Selected Flight: ${flight.airline} (${flight.carrier})
Trip Type: ${flight.tripType.toUpperCase()}
Total Rate: £${flight.price.toFixed(2)} ${flight.currency}
Cabin: ${flight.cabin}
Baggage: ${flight.baggage}

${
  flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
    ? multiCityLegsDetail
    : `Outbound Flight:
- Route: ${flight.outbound.departureAirportName || flight.outbound.departureAirport} to ${flight.outbound.arrivalAirportName || flight.outbound.arrivalAirport}
- Flight(s): ${flight.outbound.flightNumbers}
- Departure: ${flight.outbound.departureDate} at ${flight.outbound.departureTime}
- Arrival: ${flight.outbound.arrivalDate} at ${flight.outbound.arrivalTime}
- Duration: ${flight.outbound.totalDuration} (${flight.outbound.isDirect ? "Direct" : `${flight.outbound.stopsCount} stop(s)`})
Segments:
${outboundSegmentsDetail}
${
  flight.inbound
    ? `
Return Flight:
- Route: ${flight.inbound.departureAirportName || flight.inbound.departureAirport} to ${flight.inbound.arrivalAirportName || flight.inbound.arrivalAirport}
- Flight(s): ${flight.inbound.flightNumbers}
- Departure: ${flight.inbound.departureDate} at ${flight.inbound.departureTime}
- Arrival: ${flight.inbound.arrivalDate} at ${flight.inbound.arrivalTime}
- Duration: ${flight.inbound.totalDuration} (${flight.inbound.isDirect ? "Direct" : `${flight.inbound.stopsCount} stop(s)`})
Segments:
${inboundSegmentsDetail}
`
    : ""
}`
}
Passengers: ${totalPassengers} (${searchCriteria?.passengers?.adults || 1} Adult(s)${searchCriteria?.passengers?.children ? `, ${searchCriteria.passengers.children} Child(ren)` : ""}${searchCriteria?.passengers?.infants ? `, ${searchCriteria.passengers.infants} Infant(s)` : ""})

Customer Notes:
${form.message || "None"}
      `.trim();

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: challengeData,
          name: form.name,
          email: form.email,
          phone: form.phone,
          type: "Flight Booking",
          airport:
            flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
              ? flight.legs.map((l) => `${l.departureAirport} to ${l.arrivalAirport}`).join(" | ")
              : `${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport}`,
          date: flight.outbound.departureDate,
          returnDate:
            flight.tripType === "multi-city" && flight.legs && flight.legs.length > 1
              ? flight.legs[flight.legs.length - 1].departureDate
              : flight.inbound?.departureDate || "N/A",
          airline: flight.airline,
          flightNumber:
            flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
              ? flight.legs.map((l) => l.flightNumbers).filter(Boolean).join(" | ")
              : flight.outbound.flightNumbers,
          quotedRate: `£${flight.price.toFixed(2)}`,
          travelers: totalPassengers,
          cabin: flight.cabin,
          message: flightDetailsMessage,
          source: "Travelport GDS",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit booking inquiry.");
      }

      setStatus("success");
      setResetMathKey((prev) => prev + 1);
      setIsMathValid(false);
    } catch (err: any) {
      console.error("[Booking Inquiry Error]", err);
      setStatus("error");
      setErrorMsg(
        err.message ?? "Something went wrong. Please try again or call us directly."
      );
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#eed6c4]/70 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#382626] to-[#6b4f4f] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#eed6c4]">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg tracking-tight">
                Flight Booking Enquiry
              </h2>
              <p className="text-[#eed6c4]/80 text-xs">
                Best Price Guarantee &bull; IATA & ATOL Accredited
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Flight Summary Card */}
        <div className="bg-[#f5f0eb]/70 p-4 sm:p-5 border-b border-[#eed6c4]/40">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-[#382626]">
                  {flight.airline}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {flight.cabin}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Total Rate
                </span>
                <span className="text-lg sm:text-xl font-heading font-black text-[#6b4f4f]">
                  £{flight.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Multi-City or Outbound/Inbound Flight Rows */}
            {flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0 ? (
              <div className="space-y-3">
                {flight.legs.map((leg, legIdx) => (
                  <div
                    key={legIdx}
                    className={legIdx > 0 ? "pt-2.5 border-t border-dashed border-slate-200" : ""}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#eed6c4]/40 text-[#6b4f4f]">
                        Flight {legIdx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">
                        {leg.departureAirport} → {leg.arrivalAirport}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {leg.departureDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        {legIdx === 0 ? (
                          <PlaneTakeoff className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                        ) : legIdx === flight.legs!.length - 1 ? (
                          <PlaneLanding className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                        ) : (
                          <Plane className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-800">
                            {leg.departureTime.slice(0, 5)} {leg.departureAirport}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {leg.departureAirportName || leg.departureAirport}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {leg.totalDuration}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <ArrowRight className="w-3 h-3 text-[#6b4f4f]" />
                          <span>
                            {leg.isDirect
                              ? "Direct"
                              : `${leg.stopsCount} stop (${leg.segments[0]?.arrivalAirport}${
                                  leg.segments[0]?.connectionDuration
                                    ? ` • ${leg.segments[0].connectionDuration}`
                                    : ""
                                })`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-800">
                          {leg.arrivalTime.slice(0, 5)} {leg.arrivalAirport}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {leg.arrivalAirportName || leg.arrivalAirport}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Outbound Row */}
                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">
                        {flight.outbound.departureTime.slice(0, 5)} {flight.outbound.departureAirport}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {flight.outbound.departureDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {flight.outbound.totalDuration}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <ArrowRight className="w-3 h-3 text-[#6b4f4f]" />
                      <span>
                        {flight.outbound.isDirect
                          ? "Direct"
                          : `${flight.outbound.stopsCount} stop (${flight.outbound.segments[0]?.arrivalAirport}${
                              flight.outbound.segments[0]?.connectionDuration
                                ? ` • ${flight.outbound.segments[0].connectionDuration}`
                                : ""
                            })`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">
                      {flight.outbound.arrivalTime.slice(0, 5)} {flight.outbound.arrivalAirport}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {flight.outbound.arrivalDate}
                    </p>
                  </div>
                </div>

                {/* Inbound Row (if return) */}
                {flight.inbound && (
                  <div className="flex items-center justify-between gap-4 text-xs sm:text-sm pt-2 border-t border-dashed border-slate-100">
                    <div className="flex items-center gap-2">
                      <PlaneLanding className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">
                          {flight.inbound.departureTime.slice(0, 5)} {flight.inbound.departureAirport}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {flight.inbound.departureDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {flight.inbound.totalDuration}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <ArrowRight className="w-3 h-3 text-[#6b4f4f]" />
                        <span>
                          {flight.inbound.isDirect
                            ? "Direct"
                            : `${flight.inbound.stopsCount} stop (${flight.inbound.segments[0]?.arrivalAirport}${
                                flight.inbound.segments[0]?.connectionDuration
                                  ? ` • ${flight.inbound.segments[0].connectionDuration}`
                                  : ""
                              })`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">
                        {flight.inbound.arrivalTime.slice(0, 5)} {flight.inbound.arrivalAirport}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {flight.inbound.arrivalDate}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
              <span
                className={`flex items-center gap-1 font-semibold ${
                  flight.baggage.toLowerCase().includes("no checked") || flight.baggage.toLowerCase().includes("0 checked")
                    ? "text-slate-600"
                    : "text-emerald-700"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                {flight.baggage}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#6b4f4f]" />
                {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1 text-slate-400 ml-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Instant Agent Callback
              </span>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {status === "success" ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-black text-[#382626] text-xl">
                  Booking Enquiry Received!
                </h3>
                <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-[#382626]">{form.name}</strong>. Your flight enquiry for{" "}
                  <strong>{flight.airline}</strong> ({flight.outbound.departureAirport} &rarr; {flight.outbound.arrivalAirport}) has been logged in our system.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Our ticketing desk will call you at <strong className="text-[#6b4f4f]">{form.phone}</strong> shortly to confirm seat reservations and final ticket issuance.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-8 py-2.5 rounded-xl bg-[#6b4f4f] hover:bg-[#382626] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {errorMsg}
                </div>
              )}

              {/* WhatsApp Fast Booking Option */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Prefer to chat on WhatsApp?</span>
                    <span className="text-[11px] text-slate-500">Connect directly with our flight booking desk</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/447888461474?text=${encodeURIComponent(
                    `Hello Terrific Travel, I would like to book the ${flight.airline} flight (${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport}) on ${flight.outbound.departureDate} for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs ml-auto"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                Or enter your details below. Our team will verify live availability, lock this price, and contact you immediately to issue your e-tickets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Lead Passenger Full Name *"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] outline-none transition-all font-medium placeholder-slate-400"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address (for e-ticket) *"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] outline-none transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  value={form.phone}
                  onChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
                  brand="tt"
                />
              </div>

              {/* Notes */}
              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Special requests (e.g. meal preference, wheelchair, seat selection)…"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] outline-none transition-all font-medium placeholder-slate-400 resize-none"
                />
              </div>

              {/* Math Anti-Spam Challenge */}
              <div className="pt-1">
                <MathChallenge
                  onValidChange={(valid, data) => {
                    setIsMathValid(valid);
                    setChallengeData(data);
                  }}
                  resetKey={resetMathKey}
                  brand="tt"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#6b4f4f] to-[#382626] hover:from-[#382626] hover:to-[#251717] text-[#fff3e4] font-heading font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Locking Fare &amp; Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Book Now &bull; £{flight.price.toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                <span>Official Airline Booking</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/447888461474?text=${encodeURIComponent(
                      flight.tripType === "multi-city" && flight.legs && flight.legs.length > 0
                        ? `Hello Terrific Travel, I would like to book the multi-city flight with ${flight.airline} (${flight.legs.map((l, i) => `Flight ${i + 1}: ${l.departureAirport} to ${l.arrivalAirport} on ${l.departureDate}`).join(", ")}) for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                        : flight.inbound
                        ? `Hello Terrific Travel, I would like to book the return flight with ${flight.airline} (${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport} on ${flight.outbound.departureDate}, returning ${flight.inbound.departureDate}) for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                        : `Hello Terrific Travel, I would like to book the ${flight.airline} flight (${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport}) on ${flight.outbound.departureDate} for £${flight.price.toFixed(2)}. Baggage: ${flight.baggage}. Please assist me with booking.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>WhatsApp: 07888 461474</span>
                  </a>
                  <span>Call: +44 1215 291630</span>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
