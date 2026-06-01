"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Plane,
  Calendar,
  Building,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const airports = [
  "London Heathrow",
  "London Gatwick",
  "Manchester",
  "London Stansted",
  "London Luton",
  "Edinburgh",
  "Birmingham",
  "Glasgow",
  "Bristol",
  "Liverpool",
  "Newcastle",
  "East Midlands",
  "Aberdeen",
  "London City",
  "Leeds Bradford",
  "Cardiff",
  "Norwich",
  "Humberside",
];

export function UmrahBookingForm({ isHome = false, isModal = false }: { isHome?: boolean; isModal?: boolean }) {
  const [formData, setFormData] = useState({
    airport: "",
    date: "",
    category: "",
    duration: "",
    travelers: "",
    name: "",
    phone: "",
    email: "",
  });
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
Category: ${formData.category}
Flying from: ${formData.airport}
Date: ${formData.date}
Duration: ${formData.duration}
Passengers: ${formData.travelers}
    `.trim();

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || "Umrah Customer",
          email: formData.email,
          phone: formData.phone,
          message: customMessage,
          type: "Umrah",
          airport: formData.airport,
          date: formData.date,
          category: formData.category,
          duration: formData.duration,
          travelers: parseInt(formData.travelers) || formData.travelers,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send enquiry.");
      }
      setStatus("success");
      setFormData({
        airport: "",
        date: "",
        category: "",
        duration: "",
        travelers: "",
        name: "",
        phone: "",
        email: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const fieldClass =
    "w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none font-medium placeholder:text-slate-400";
  const selectClass =
    "w-full pl-10 pr-8 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium";

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
              : "bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-[0_30px_60px_rgba(56,38,38,0.12)] border border-[#eed6c4]/60")
        }
      >
        {!isHome && !isModal && (
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#fff3e4] text-[#6b4f4f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              Free Quote
            </span>
            <h2 className="text-[#6b4f4f] text-xl md:text-2xl font-heading font-black tracking-tight">
              Book Your Umrah Journey
            </h2>
            <div className="h-[2px] w-12 bg-[#6b4f4f]/30 mx-auto mt-2 rounded-full"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Airport Input */}
            <div className="relative">
              <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <input
                type="text"
                name="airport"
                value={formData.airport}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Departure Airport"
                required
              />
            </div>

            {/* Date Input */}
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <input
                type={formData.date ? "date" : "text"}
                onFocus={(e) => { e.target.type = "date"; try { (e.target as any).showPicker(); } catch (err) {} }}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                onClick={(e) => { e.target.type = "date"; try { (e.target as any).showPicker(); } catch (err) {} }}
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Departure Date"
                required
              />
            </div>

            {/* Hotel Input */}
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium"
                required
              >
                <option value="">Hotel Category</option>
                <option value="3 Star">3 Star Standard</option>
                <option value="4 Star">4 Star Premium</option>
                <option value="5 Star">5 Star Luxury</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Duration Input */}
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium"
                required
              >
                <option value="">Duration</option>
                {[...Array(14)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "Night" : "Nights"}
                  </option>
                ))}
                <option value="14+">14+ Nights</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Travelers Input */}
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <select
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium"
                required
              >
                <option value="">Travelers</option>
                {[...Array(14)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
                <option value="14+">14+</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Your Name"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Phone Number"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f5f0eb] text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-1 focus:ring-[#6b4f4f] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 space-y-4">
            {status === "success" && (
              <div className="flex items-center gap-3 bg-[#fff3e4] border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
                <CheckCircle className="w-5 h-5 shrink-0 text-[#fff3e4]0" />
                <p>
                  Thank you! Your enquiry has been sent. Our team will contact
                  you shortly.
                </p>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <p>{errorMsg}</p>
              </div>
            )}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full md:w-2/5 py-6 text-xs font-bold bg-[#6b4f4f] hover:bg-[#382626] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
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
                    Sending…
                  </>
                ) : (
                  <>
                    Request A Free Quote <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
