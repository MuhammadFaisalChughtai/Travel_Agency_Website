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
  "Birmingham",
  "Glasgow",
];

export function HajjBookingForm({ isHome = false }: { isHome?: boolean }) {
  const [formData, setFormData] = useState({
    airport: "",
    date: "",
    packageType: "",
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
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "hajj" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send enquiry.");
      }
      setStatus("success");
      setFormData({
        airport: "",
        date: "",
        packageType: "",
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

  return (
    <div
      id="enquiry"
      className={`w-full max-w-5xl mx-auto px-4 relative z-20 ${isHome ? 'mt-2' : '-mt-12 md:-mt-20'}`}
    >
      <div
        className={
          isHome
            ? "bg-white/20 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/30"
            : "bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-[0_30px_60px_rgba(56,38,38,0.12)] border border-[#d4af37]/40"
        }
      >
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            2026/2027 Registration
          </span>
          <h2 className="text-[#064e3b] text-xl md:text-2xl font-heading font-black tracking-tight">
            Begin Your Sacred Hajj Journey
          </h2>
          <div className="h-[2px] w-12 bg-[#064e3b]/30 mx-auto mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Airport Input */}
            <div className="relative">
              <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="text"
                name="airport"
                value={formData.airport}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Departure Airport"
                required
              />
            </div>

            {/* Date Input */}
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <select
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium"
                required
              >
                <option value="" className="text-slate-500">
                  Hajj Year
                </option>
                <option value="Hajj 2026">Hajj 2026</option>
                <option value="Hajj 2027">Hajj 2027</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Package Type */}
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium"
                required
              >
                <option value="">Package Type</option>
                <option value="Non-Shifting VIP">Non-Shifting (VIP)</option>
                <option value="Shifting Standard">Shifting (Standard)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Travelers Input */}
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <select
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none appearance-none cursor-pointer font-medium"
                required
              >
                <option value="">Travelers</option>
                {[...Array(14)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {/* Name Input */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Your Name"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Phone Number"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative lg:col-span-2">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs md:text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-all duration-300 outline-none font-medium placeholder-slate-400"
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {status === "success" && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                <p>
                  Thank you! Your registration has been received. Our Hajj team will contact you shortly.
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
                className="w-full md:w-2/5 py-6 text-xs font-bold bg-[#064e3b] hover:bg-[#043427] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    Register Interest <ArrowRight className="w-4 h-4" />
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
