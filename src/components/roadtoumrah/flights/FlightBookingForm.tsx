"use client";

import { useState } from "react";
import {
  Plane,
  Calendar,
  Users,
  Phone,
  Mail,
  CheckCircle,
  MapPin,
  AlertCircle,
  User,
} from "lucide-react";

import { useEffect } from "react";

export function FlightBookingForm({ isHome = false, isModal = false }: { isHome?: boolean; isModal?: boolean }) {
  const [formData, setFormData] = useState({
    journeyType: "Round Trip",
    from: "",
    to: "",
    departure: "",
    returnDate: "",
    travelers: "1",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const departureQuery = params.get("departure");
      const destinationQuery = params.get("destination");
      if (departureQuery || destinationQuery) {
        setFormData((prev) => ({
          ...prev,
          from: departureQuery || prev.from,
          to: destinationQuery || prev.to,
        }));
      }
    }
  }, []);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const customMessage = `
Journey: ${formData.journeyType}
From: ${formData.from} to ${formData.to}
Departure: ${formData.departure} | Return: ${formData.returnDate || "N/A"}
Passengers: ${formData.travelers}
    `.trim();

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || "Flight Customer",
          email: formData.email,
          phone: formData.phone,
          airport: formData.from,
          date: formData.departure,
          travelers: parseInt(formData.travelers) || formData.travelers,
          message: customMessage,
          type: "Flight",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send enquiry.");
      }
      setStatus("success");
      setFormData({
        journeyType: "Round Trip",
        from: "",
        to: "",
        departure: "",
        returnDate: "",
        travelers: "1",
        name: "",
        email: "",
        phone: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const fieldClass =
    "w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none font-medium placeholder:text-slate-400";
  const selectClass =
    "w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium";

  return (
    <div
      id="enquiry"
      className={`w-full max-w-5xl mx-auto ${isModal ? 'px-0' : 'px-4'} relative z-20 ${isModal ? '' : (isHome ? 'mt-2' : '-mt-12 md:-mt-20')}`}
    >
      <div
        className={
          isModal
            ? "p-2 sm:p-4"
            : (isHome
              ? "bg-white/20 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/30"
              : "bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-[0_30px_60px_rgba(56,38,38,0.12)] border border-[#d4af37]/60")
        }
      >
        {!isHome && !isModal && (
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Quick Quote
            </span>
            <h2 className="text-[#064e3b] text-xl md:text-2xl font-heading font-black tracking-tight">
              Find Your Flight
            </h2>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200/60 shadow-inner">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    journeyType: "Round Trip",
                  }))
                }
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  formData.journeyType === "Round Trip"
                    ? "bg-white text-[#064e3b] shadow-sm"
                    : "text-slate-500 hover:text-[#064e3b]"
                }`}
              >
                Round Trip
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    journeyType: "One Way",
                    returnDate: "",
                  }))
                }
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  formData.journeyType === "One Way"
                    ? "bg-white text-[#064e3b] shadow-sm"
                    : "text-slate-500 hover:text-[#064e3b]"
                }`}
              >
                One Way
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Flying From */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Flying From (e.g. London)"
                className={fieldClass}
                required
              />
            </div>

            {/* Flying To */}
            <div className="relative">
              <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="Flying To (e.g. Dubai)"
                className={fieldClass}
                required
              />
            </div>

            {/* Departure Date */}
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type={formData.departure ? "date" : "text"}
                onFocus={(e) => { e.target.type = "date"; try { (e.target as any).showPicker(); } catch (err) {} }}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onClick={(e) => { e.target.type = "date"; try { (e.target as any).showPicker(); } catch (err) {} }}
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                placeholder="Departure Date"
                className={fieldClass}
                required
                aria-label="Departure Date"
              />
            </div>

            {/* Return Date - Only show for Round Trip */}
            {formData.journeyType === "Round Trip" && (
              <div className="relative animate-in fade-in zoom-in-95 duration-300">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
                <input
                  type={formData.returnDate ? "date" : "text"}
                  onFocus={(e) => { e.target.type = "date"; try { (e.target as any).showPicker(); } catch (err) {} }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onClick={(e) => { e.target.type = "date"; try { (e.target as any).showPicker(); } catch (err) {} }}
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                  placeholder="Return Date"
                  aria-label="Return Date"
                />
              </div>
            )}

            {/* Travelers */}
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <select
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                className={selectClass}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} Traveler{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={fieldClass}
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className={fieldClass}
                required
              />
            </div>

            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {status === "success" && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold max-w-lg mx-auto mb-4 w-full">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                <p>
                  Thank you! Your flight enquiry has been sent. Our team will
                  contact you shortly.
                </p>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm font-semibold max-w-lg mx-auto mb-4 w-full">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-12 py-5 text-xs font-bold bg-[#064e3b] hover:bg-[#043427] text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 mr-2"
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
                    Sending…
                  </>
                ) : (
                  "Confirm Booking Details"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
