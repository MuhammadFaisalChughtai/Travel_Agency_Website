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
      const flightDetailsMessage = `
Selected Flight: ${flight.airline} (${flight.carrier})
Trip Type: ${flight.tripType.toUpperCase()}
Total Rate: £${flight.price.toFixed(2)} ${flight.currency}
Cabin: ${flight.cabin}
Baggage: ${flight.baggage}

Outbound Flight:
- Route: ${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport}
- Flight(s): ${flight.outbound.flightNumbers}
- Departure: ${flight.outbound.departureDate} at ${flight.outbound.departureTime}
- Arrival: ${flight.outbound.arrivalDate} at ${flight.outbound.arrivalTime}
- Duration: ${flight.outbound.totalDuration} (${flight.outbound.isDirect ? "Direct" : `${flight.outbound.stopsCount} stop(s)`})
${
  flight.inbound
    ? `
Return Flight:
- Route: ${flight.inbound.departureAirport} to ${flight.inbound.arrivalAirport}
- Flight(s): ${flight.inbound.flightNumbers}
- Departure: ${flight.inbound.departureDate} at ${flight.inbound.departureTime}
- Arrival: ${flight.inbound.arrivalDate} at ${flight.inbound.arrivalTime}
- Duration: ${flight.inbound.totalDuration} (${flight.inbound.isDirect ? "Direct" : `${flight.inbound.stopsCount} stop(s)`})
`
    : ""
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
          airport: `${flight.outbound.departureAirport} to ${flight.outbound.arrivalAirport}`,
          date: flight.outbound.departureDate,
          returnDate: flight.inbound?.departureDate || "N/A",
          airline: flight.airline,
          flightNumber: flight.outbound.flightNumbers,
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
                Travelport Live Rate Guarantee &bull; IATA & ATOL Accredited
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
                      : `${flight.outbound.stopsCount} stop`}
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
                        : `${flight.inbound.stopsCount} stop`}
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

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
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

              <p className="text-xs text-slate-600 font-medium">
                Please enter your contact details. Our team will verify live availability on the Travelport system, lock this price, and contact you immediately to issue your e-tickets.
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

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Direct GDS integration</span>
                <span>Call support: +44 1215 291630</span>
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
