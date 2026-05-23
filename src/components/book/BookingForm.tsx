"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Plane, Calendar, Building, Clock, Users,
  User, Phone, Mail, ArrowRight, CheckCircle, AlertCircle, PlaneTakeoff, PlaneLanding
} from "lucide-react";

const airports = [
  "London Heathrow", "London Gatwick", "Manchester", "London Stansted",
  "London Luton", "Edinburgh", "Birmingham", "Glasgow", "Bristol",
  "Liverpool", "Newcastle", "East Midlands", "Aberdeen", "London City",
  "Leeds Bradford", "Cardiff", "Norwich", "Humberside"
];

function BookingContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "package";
  const id = searchParams.get("id") || "";

  const isFlight = type === "flight";
  const isHajj = id.toLowerCase().includes("hajj");

  const [formData, setFormData] = useState({
    airport: "", destination: "", date: "", category: "", duration: "",
    packageType: "",
    travelers: "", name: "", phone: "", email: "",
    // Flight specific
    returnDate: "", travelClass: "", tripType: "Round Trip"
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fix for Next.js hydration issues with useSearchParams
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTripType = (type: string) => {
    setFormData(prev => ({ ...prev, tripType: type, returnDate: type === "One Way" ? "" : prev.returnDate }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          type: isFlight ? "Flight Booking" : isHajj ? "Hajj Package" : "Umrah Package",
          packageId: id
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send enquiry.");
      }
      setStatus("success");
      setFormData({ airport: "", destination: "", date: "", category: "", duration: "", packageType: "", travelers: "", name: "", phone: "", email: "", returnDate: "", travelClass: "", tripType: "Round Trip" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const fieldClass = "w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-2 focus:ring-[#6b4f4f]/20 transition-all duration-300 outline-none font-medium placeholder-slate-400";
  const selectClass = "w-full pl-10 pr-8 py-3.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#6b4f4f] focus:ring-2 focus:ring-[#6b4f4f]/20 transition-all duration-300 outline-none appearance-none cursor-pointer font-medium";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e4] via-white to-[#fff3e4] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#fff3e4] text-[#6b4f4f] text-[10px] font-bold uppercase tracking-[0.25em] mb-3 border border-[#eed6c4]/60">
            {isFlight ? "Worldwide Travel" : "Tailor-Made Pilgrimage"}
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-[#382626] tracking-tight mb-3">
            {isFlight ? "Secure Your Flight Booking" : "Plan Your Sacred Journey"}
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {isFlight 
              ? "Submit your passenger details below and our team will finalize your flight reservation."
              : "Fill in your preferences below and our team will prepare a personalised free quote for you."}
          </p>
          <div className="h-[2px] w-12 bg-[#6b4f4f]/30 mx-auto mt-5 rounded-full" />
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_30px_60px_rgba(56,38,38,0.10)] border border-[#eed6c4]/60 p-6 md:p-10">
          <form onSubmit={handleSubmit}>

            {/* Row 1: Details based on Type */}
            {isFlight && (
              <div className="flex justify-center mb-6">
                <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200/60 shadow-inner">
                  <button
                    type="button"
                    onClick={() => handleTripType("Round Trip")}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      formData.tripType === "Round Trip"
                        ? "bg-white text-[#382626] shadow-sm"
                        : "text-slate-500 hover:text-[#382626]"
                    }`}
                  >
                    Round Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTripType("One Way")}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      formData.tripType === "One Way"
                        ? "bg-white text-[#382626] shadow-sm"
                        : "text-slate-500 hover:text-[#382626]"
                    }`}
                  >
                    One Way
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              
              {isFlight ? (
                // Flight Specific Fields
                <>
                  <div className="relative">
                    <PlaneTakeoff className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <input type="text" name="airport" value={formData.airport} onChange={handleChange} className={fieldClass} placeholder="Flying From (e.g. London)" required />
                  </div>

                  <div className="relative">
                    <PlaneLanding className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} className={fieldClass} placeholder="Flying To (e.g. Dubai)" required />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className={fieldClass} required aria-label="Departure Date" />
                  </div>

                  <div className="relative">
                    <Calendar className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${formData.tripType === "One Way" ? "text-slate-300" : "text-[#6b4f4f]"}`} />
                    <input 
                      type="date" 
                      name="returnDate" 
                      value={formData.returnDate} 
                      onChange={handleChange} 
                      className={`${fieldClass} ${formData.tripType === "One Way" ? "opacity-50 cursor-not-allowed bg-slate-100" : ""}`} 
                      placeholder="Return Date" 
                      aria-label="Return Date" 
                      disabled={formData.tripType === "One Way"}
                      required={formData.tripType === "Round Trip"}
                    />
                  </div>
                </>
              ) : isHajj ? (
                // Hajj Specific Fields
                <>
                  <div className="relative">
                    <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <input type="text" name="airport" value={formData.airport} onChange={handleChange} className={fieldClass} placeholder="Departure Airport" required />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <select name="date" value={formData.date} onChange={handleChange} className={selectClass} required>
                      <option value="">Hajj Year</option>
                      <option value="Hajj 2026">Hajj 2026</option>
                      <option value="Hajj 2027">Hajj 2027</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                  </div>

                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <select name="packageType" value={formData.packageType} onChange={handleChange} className={selectClass} required>
                      <option value="">Package Type</option>
                      <option value="Non-Shifting VIP">Non-Shifting (VIP)</option>
                      <option value="Shifting Standard">Shifting (Standard)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                  </div>

                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <select name="duration" value={formData.duration} onChange={handleChange} className={selectClass} required>
                      <option value="">Duration</option>
                      <option value="14 Days">14 Days</option>
                      <option value="21 Days">21 Days</option>
                      <option value="28 Days">28 Days</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                  </div>
                </>
              ) : (
                // Umrah Specific Fields
                <>
                  <div className="relative">
                    <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <input type="text" name="airport" value={formData.airport} onChange={handleChange} className={fieldClass} placeholder="Departure Airport" required />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className={fieldClass} required />
                  </div>

                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <select name="category" value={formData.category} onChange={handleChange} className={selectClass} required>
                      <option value="">Hotel Category</option>
                      <option value="3 Star">3 Star Standard</option>
                      <option value="4 Star">4 Star Premium</option>
                      <option value="5 Star">5 Star Luxury</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                  </div>

                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                    <select name="duration" value={formData.duration} onChange={handleChange} className={selectClass} required>
                      <option value="">Duration</option>
                      {[...Array(14)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "Night" : "Nights"}</option>
                      ))}
                      <option value="14+">14+ Nights</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                  </div>
                </>
              )}

            </div>

            {/* Row 2: Contact Details */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isFlight ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 mb-6`}>

              {/* Travelers */}
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                <select name="travelers" value={formData.travelers} onChange={handleChange} className={selectClass} required>
                  <option value="">Travelers</option>
                  {[...Array(14)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "Person" : "People"}</option>
                  ))}
                  <option value="14+">14+</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>

              {/* Cabin Class (Flight Only) */}
              {isFlight && (
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                  <select name="travelClass" value={formData.travelClass} onChange={handleChange} className={selectClass} required>
                    <option value="">Cabin Class</option>
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                    <option value="First">First Class</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              )}

              {/* Full Name */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={fieldClass} placeholder="Your Full Name" required />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={fieldClass} placeholder="Phone Number" required />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b4f4f] pointer-events-none" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass} placeholder="Email Address" required />
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-4 mb-4">
              {status === "success" && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold max-w-lg mx-auto w-full">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                  <p>Thank you! Your enquiry has been sent. Our team will contact you shortly.</p>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm font-semibold max-w-lg mx-auto w-full">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <p>{errorMsg}</p>
                </div>
              )}
            </div>


            {/* Submit */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-12 py-5 text-xs font-bold bg-[#6b4f4f] hover:bg-[#382626] text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    {isFlight ? "Confirm Booking Details" : "Request A Free Quote"} 
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Reassurance strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
          {[
            "No payment required",
            isFlight ? "Instant routing checks" : "Free quote within 24 hours",
            "No obligation",
          ].map((text) => (
            <span key={text} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
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
    <Suspense fallback={
      <div className="min-h-screen bg-[#fff3e4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#6b4f4f]">
          <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="font-heading font-black text-sm uppercase tracking-widest">Loading Booking...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
