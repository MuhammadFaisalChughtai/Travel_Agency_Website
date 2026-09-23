"use client";

import React, { useState } from "react";
import { CheckCircle, AlertCircle, Plus, Minus, Calendar } from "lucide-react";
import Link from "next/link";
import { MathChallenge } from "@/components/ui/MathChallenge";

export function PayLaterForm({ brand = "terrific" }: { brand?: "terrific" | "umrah" }) {
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [youth, setYouth] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [isMathValid, setIsMathValid] = useState(false);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [resetMathKey, setResetMathKey] = useState(0);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isUmrah = brand === "umrah";

  // Dynamic Theme Colors
  const btnBg = isUmrah
    ? "bg-[#064e3b] hover:bg-[#043e2f] text-white"
    : "bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4]";

  const inputFocusStyle = isUmrah
    ? "focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]"
    : "focus:ring-2 focus:ring-[#6b4f4f]/20 focus:border-[#6b4f4f]";

  const iconColor = isUmrah ? "text-[#064e3b]" : "text-[#6b4f4f]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!departureDate || !arrivalDate) {
      setStatus("error");
      setErrorMsg("Please select both departure and arrival dates.");
      return;
    }

    if (!isMathValid) {
      setStatus("error");
      setErrorMsg("Please solve the human verification math problem correctly.");
      return;
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: challengeData,
          name,
          email,
          phone,
          message: `[Pay Later Quote Request]\nDeparture Date: ${departureDate}\nArrival Date: ${arrivalDate}\nTravellers: ${adults} Adults (15+), ${youth} Youth (12-15), ${children} Children (2-12), ${infants} Infants (0-2)\nNotes: ${notes || "None"}`,
          departureDate,
          arrivalDate,
          adults: `${adults} (15+)`,
          youth: `${youth} (12-15)`,
          children: `${children} (2-12)`,
          infants: `${infants} (0-2)`,
          type: "pay-later-quote",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit quote request.");
      }

      setStatus("success");
      setDepartureDate("");
      setArrivalDate("");
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setYouth(0);
      setChildren(0);
      setInfants(0);
      setResetMathKey((prev) => prev + 1);
      setIsMathValid(false);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 text-[#2a1a1a] shadow-2xl border border-[#eed6c4]/40">
      <div className="mb-6 space-y-1">
        <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#483434]">
          Get your free quote
        </h3>
        <p className="text-xs text-[#6b4f4f] font-medium">
          Tell us your trip — no obligation, just a clear payment schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Departure & Arrival Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#483434]">
              Departure Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor} pointer-events-none`} />
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                  if (arrivalDate && e.target.value > arrivalDate) {
                    setArrivalDate(e.target.value);
                  }
                }}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-[#483434] focus:outline-none ${inputFocusStyle} transition-all font-medium`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#483434]">
              Arrival / Return Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor} pointer-events-none`} />
              <input
                type="date"
                required
                value={arrivalDate}
                min={departureDate || undefined}
                onChange={(e) => setArrivalDate(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-[#483434] focus:outline-none ${inputFocusStyle} transition-all font-medium`}
              />
            </div>
          </div>
        </div>

        {/* Travellers Counter */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#483434]">
            How many travellers?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f5f0eb]/40 p-4 rounded-2xl border border-[#eed6c4]/50">
            {/* Adults Counter */}
            <div className="flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-[#eed6c4]/30">
              <div>
                <span className="block text-xs font-bold text-[#483434]">Adults</span>
                <span className="block text-[10px] text-slate-500 font-medium">Aged 15+</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs disabled:opacity-40"
                  disabled={adults <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-[#483434]">
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Youth Counter */}
            <div className="flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-[#eed6c4]/30">
              <div>
                <span className="block text-xs font-bold text-[#483434]">Youth</span>
                <span className="block text-[10px] text-slate-500 font-medium">Aged 12-15</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setYouth(Math.max(0, youth - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs disabled:opacity-40"
                  disabled={youth <= 0}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-[#483434]">
                  {youth}
                </span>
                <button
                  type="button"
                  onClick={() => setYouth(youth + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Children Counter */}
            <div className="flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-[#eed6c4]/30">
              <div>
                <span className="block text-xs font-bold text-[#483434]">Child</span>
                <span className="block text-[10px] text-slate-500 font-medium">Aged 2-12</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs disabled:opacity-40"
                  disabled={children <= 0}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-[#483434]">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Infant Counter */}
            <div className="flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-[#eed6c4]/30">
              <div>
                <span className="block text-xs font-bold text-[#483434]">Infant</span>
                <span className="block text-[10px] text-slate-500 font-medium">Aged 0-2</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInfants(Math.max(0, infants - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs disabled:opacity-40"
                  disabled={infants <= 0}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-xs font-bold text-[#483434]">
                  {infants}
                </span>
                <button
                  type="button"
                  onClick={() => setInfants(infants + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-[#eed6c4] flex items-center justify-center text-[#483434] hover:bg-[#fff3e4] transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#483434]">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-[#483434] placeholder:text-slate-400 focus:outline-none ${inputFocusStyle} transition-all font-medium`}
          />
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#483434]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-[#483434] placeholder:text-slate-400 focus:outline-none ${inputFocusStyle} transition-all font-medium`}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#483434]">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-[#483434] placeholder:text-slate-400 focus:outline-none ${inputFocusStyle} transition-all font-medium`}
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#483434]">
            Any requests or special requirements?{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. specific hotel, dietary needs, accessibility requirements..."
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-[#483434] placeholder:text-slate-400 focus:outline-none ${inputFocusStyle} transition-all resize-none font-medium`}
          />
        </div>

        {/* Human Verification */}
        <MathChallenge
          onValidChange={(valid, data) => {
            setIsMathValid(valid);
            setChallengeData(data);
          }}
          resetKey={resetMathKey}
          brand={isUmrah ? "rtu" : "tt"}
        />

        {/* Feedback Messages */}
        {status === "success" && (
          <div className="flex items-center gap-3 bg-[#fff3e4] border border-emerald-300 text-emerald-800 rounded-xl p-3.5 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your quote request has been sent. Our team will contact you shortly.</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full py-4 px-6 rounded-full font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${btnBg} disabled:opacity-50`}
        >
          {status === "loading" ? "Submitting..." : "Send Enquiry"}
        </button>

        {/* Privacy Note */}
        <p className="text-[11px] text-[#6b4f4f] text-center leading-relaxed font-medium">
          We'll use your details to respond to your enquiry only — in line with our{" "}
          <Link href="/privacy-policy" className="underline hover:text-[#483434]">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}


