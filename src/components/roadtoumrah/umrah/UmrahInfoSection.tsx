"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Compass,
  ShieldCheck,
  Headphones,
  Award,
  Smile,
  Settings,
  Plane,
  Building2,
  Bus,
  FileText,
  Map,
  PhoneCall,
  Sparkles,
} from "lucide-react";

export function UmrahInfoSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "why" | "inclusions">(
    "overview",
  );

  return (
    <div className="py-12 bg-[#F9F6F0]/40 border-t border-[#D4AF37]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Tab Header Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#D4AF37]/10 p-1.5 rounded-2xl border border-[#D4AF37]/20 shadow-inner">
            {[
              { id: "overview", label: "Overview" },
              { id: "inclusions", label: "What's Included" },
              { id: "why", label: "Why Terrific Travel Ltd" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#B8860B] text-[#F9F6F0] shadow-md scale-[1.02]"
                    : "text-slate-700 hover:text-[#B8860B] hover:bg-[#D4AF37]/15"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-card rounded-3xl p-5 md:p-8 shadow-[0_10px_40px_rgba(56,38,38,0.03)] border border-[#D4AF37]/20 transition-all duration-500 min-h-[400px]">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase text-[#B8860B] font-black tracking-wider">
                  All-Inclusive Curation
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-black text-[#B8860B]">
                  Fulfill your Umrah dream with Terrific Travel Ltd
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                  Performing Umrah is a holy obligation, and as the UK's trusted
                  specialist, we offer unbeatable value without compromising on
                  comfort. Our packages cover direct flights, visas, premium
                  hotels, ziyarats, and VIP transfers.
                </p>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                  Choose from standard 3-star deals to absolute 5-star luxury
                  hotels, with durations ranging from 7 to 14 nights, completely
                  tailored to your timeline. As a UK-accredited agency, we hold
                  IATA, ATOL, and Ministry licenses to give you perfect peace of
                  mind.
                </p>

                {/* Micro tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-[#F9F6F0] border border-[#D4AF37]/30 rounded-lg text-[10px] text-[#B8860B] font-bold uppercase tracking-wider">
                    ★ ATOL Protected
                  </span>
                  <span className="px-3 py-1 bg-[#F9F6F0] border border-[#D4AF37]/30 rounded-lg text-[10px] text-[#B8860B] font-bold uppercase tracking-wider">
                    ★ IATA Certified
                  </span>
                  <span className="px-3 py-1 bg-[#F9F6F0] border border-[#D4AF37]/30 rounded-lg text-[10px] text-[#B8860B] font-bold uppercase tracking-wider">
                    ★ Ministry Approved
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Makkah"
                  fill
                  className="object-cover animate-[subtle-zoom_20s_infinite_alternate]"
                />
              </div>
            </div>
          )}

          {/* INCLUSIONS TAB */}
          {activeTab === "inclusions" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-2">
                <h3 className="text-xl font-heading font-black text-[#B8860B]">
                  What is included in our premium package?
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  We handle all technical logistics so you can focus entirely on
                  your prayers.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    icon: FileText,
                    title: "Visa Processing",
                    desc: "Full Umrah visa issuance and document approval.",
                  },
                  {
                    icon: Plane,
                    title: "Flights & Tickets",
                    desc: "Round-trip flights from major airports with flexible dates.",
                  },
                  {
                    icon: Bus,
                    title: "VIP Transport",
                    desc: "Air-conditioned private transfers between cities and hotels.",
                  },
                  {
                    icon: Building2,
                    title: "Elite Lodging",
                    desc: "Premium stays conveniently near Haram and Masjid Nabawi.",
                  },
                  {
                    icon: Map,
                    title: "Ziyarats Guidance",
                    desc: "Guided spiritual historical tours around sacred monuments.",
                  },
                  {
                    icon: PhoneCall,
                    title: "24/7 Concierge",
                    desc: "Dedicated ground coordinators available around the clock.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-[#F9F6F0]/40 rounded-2xl border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-300 flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#B8860B] shrink-0 group-hover:bg-[#B8860B] group-hover:text-white transition-colors duration-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground text-xs md:text-sm mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-slate-700 text-[11px] leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHY CHOOSE US TAB */}
          {activeTab === "why" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-2xl mx-auto mb-2">
                <h3 className="text-xl font-heading font-black text-[#B8860B]">
                  Why Choose Terrific Travel Ltd
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  Trusted ground support and accredited protection at unbeatable
                  rates.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Compass,
                    title: "Pre-Designed Packages",
                    desc: "Carefully designed 3, 4, and 5-star packages matching your travel group size, duration preference, and dynamic budget requirements.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Transparent Pricing",
                    desc: "We ensure all bookings have zero hidden costs, handling fees, or unmentioned administrative rules. Honest numbers guaranteed.",
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Expert Help",
                    desc: "Friendly UK and Saudi-based representatives available around the clock to assist you prior, during, and after your Umrah rituals.",
                  },
                  {
                    icon: Settings,
                    title: "Customized Travel Plans",
                    desc: "Completely customize your travel experience. Change hotel preferences, add custom ziyarats, or extend durations step-by-step.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#F9F6F0]/40 rounded-2xl border border-[#D4AF37]/25 flex items-start gap-3 hover:shadow-sm transition-shadow duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#B8860B] shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-xs md:text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-700 text-[11px] leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
