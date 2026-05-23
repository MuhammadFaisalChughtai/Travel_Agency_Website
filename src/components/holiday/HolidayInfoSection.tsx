"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Compass,
  ShieldCheck,
  Headphones,
  Award,
  Globe,
  Settings,
  Plane,
  Building2,
  Car,
  Map,
  Camera,
  Coffee
} from "lucide-react";

export function HolidayInfoSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "why" | "inclusions">(
    "overview",
  );

  return (
    <div className="py-12 bg-[#fff3e4]/40 border-t border-[#eed6c4]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#eed6c4]/10 p-1.5 rounded-2xl border border-[#eed6c4]/20 shadow-inner">
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
                    ? "bg-[#6b4f4f] text-[#fff3e4] shadow-md scale-[1.02]"
                    : "text-slate-700 hover:text-[#6b4f4f] hover:bg-[#eed6c4]/15"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-5 md:p-8 shadow-[0_10px_40px_rgba(56,38,38,0.03)] border border-[#eed6c4]/20 transition-all duration-500 min-h-[400px]">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase text-[#6b4f4f] font-black tracking-wider">
                  World-Class Escapes
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-black text-[#6b4f4f]">
                  Discover the world's most breathtaking destinations
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                  From the pristine beaches of the Maldives to the bustling streets of Tokyo, Terrific Travel Ltd brings you handpicked holiday experiences. Our packages are designed to give you the perfect balance of relaxation and adventure, all tailored strictly to your preferences.
                </p>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                  Whether you are planning a romantic honeymoon, an unforgettable family getaway, or a solo expedition, we leverage our global network of premium airlines and luxury resorts to curate the ultimate itinerary. Your dream holiday awaits.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-[#fff3e4] border border-[#eed6c4]/30 rounded-lg text-[10px] text-[#6b4f4f] font-bold uppercase tracking-wider">
                    ★ ATOL Protected
                  </span>
                  <span className="px-3 py-1 bg-[#fff3e4] border border-[#eed6c4]/30 rounded-lg text-[10px] text-[#6b4f4f] font-bold uppercase tracking-wider">
                    ★ Premium Resorts
                  </span>
                  <span className="px-3 py-1 bg-[#fff3e4] border border-[#eed6c4]/30 rounded-lg text-[10px] text-[#6b4f4f] font-bold uppercase tracking-wider">
                    ★ 24/7 Support
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Beautiful beach holiday"
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
                <h3 className="text-xl font-heading font-black text-[#6b4f4f]">
                  What's included in our holiday packages?
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  We handle the logistics so you can simply relax and enjoy your trip.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    icon: Plane,
                    title: "Return Flights",
                    desc: "Premium economy or business class flights from top global airlines.",
                  },
                  {
                    icon: Building2,
                    title: "Luxury Accommodation",
                    desc: "Handpicked 4 and 5-star hotels, resorts, and private villas.",
                  },
                  {
                    icon: Car,
                    title: "Private Transfers",
                    desc: "Seamless airport pickups and drop-offs in air-conditioned vehicles.",
                  },
                  {
                    icon: Coffee,
                    title: "Daily Breakfast",
                    desc: "Enjoy complimentary gourmet breakfasts to start your day right.",
                  },
                  {
                    icon: Camera,
                    title: "Exclusive Excursions",
                    desc: "Guided tours and activities curated by local experts.",
                  },
                  {
                    icon: Settings,
                    title: "Tailored Itineraries",
                    desc: "Every day planned exactly the way you want it.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-[#fff3e4]/40 rounded-2xl border border-[#eed6c4]/25 hover:border-[#eed6c4] transition-all duration-300 flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#eed6c4]/15 flex items-center justify-center text-[#6b4f4f] shrink-0 group-hover:bg-[#6b4f4f] group-hover:text-white transition-colors duration-300">
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
                <h3 className="text-xl font-heading font-black text-[#6b4f4f]">
                  Why Choose Terrific Travel Ltd
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  Your journey is our passion. We deliver perfection.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "100% Financial Protection",
                    desc: "Book with absolute confidence. All of our flight-inclusive holiday packages are fully ATOL protected.",
                  },
                  {
                    icon: Globe,
                    title: "Global Network",
                    desc: "Thanks to our strong partnerships with airlines and hotels, we can offer you exclusive rates and complimentary upgrades.",
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Concierge",
                    desc: "From the moment you depart until you arrive back home, our expert team is available around the clock.",
                  },
                  {
                    icon: Award,
                    title: "Award-Winning Service",
                    desc: "Rated 5-stars by hundreds of happy travelers on Trustpilot. We never compromise on the quality of your trip.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#fff3e4]/40 rounded-2xl border border-[#eed6c4]/25 flex items-start gap-3 hover:shadow-sm transition-shadow duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#eed6c4]/20 flex items-center justify-center text-[#6b4f4f] shrink-0">
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
