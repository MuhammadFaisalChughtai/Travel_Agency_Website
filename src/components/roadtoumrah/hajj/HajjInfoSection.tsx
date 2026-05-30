"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Compass,
  ShieldCheck,
  Headphones,
  MapPin,
  Settings,
  Plane,
  Building2,
  Bus,
  FileText,
  Map,
  Tent,
  HeartHandshake
} from "lucide-react";

export function HajjInfoSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "why" | "inclusions">(
    "overview",
  );

  return (
    <div className="py-12 bg-emerald-50/40 border-t border-[#d4af37]/40/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#d4af37]/10 p-1.5 rounded-2xl border border-[#d4af37]/40/20 shadow-inner">
            {[
              { id: "overview", label: "Overview" },
              { id: "inclusions", label: "What's Included" },
              { id: "why", label: "Why Road To Umrah" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#064e3b] text-emerald-50 shadow-md scale-[1.02]"
                    : "text-slate-700 hover:text-[#064e3b] hover:bg-[#d4af37]/15"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-5 md:p-8 shadow-[0_10px_40px_rgba(56,38,38,0.03)] border border-[#d4af37]/40/20 transition-all duration-500 min-h-[400px]">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase text-[#064e3b] font-black tracking-wider">
                  The Journey of a Lifetime
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-black text-[#064e3b]">
                  Fulfill your Hajj obligation with absolute peace of mind
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                  Hajj is the fifth pillar of Islam, an profound spiritual journey that every able Muslim must undertake. At Road To Umrah, we recognize the immense significance of this obligation and have dedicated our expertise to ensuring your pilgrimage is seamless, comfortable, and spiritually enriching.
                </p>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                  We offer both Shifting and Non-Shifting VIP packages. Whether you require the ultimate convenience of staying near the Haram throughout, or prefer the cost-effective shifting model with stays in Aziziya, our Ministry-approved packages cover all essential logistics—from Hajj visas and premium flights to Mina camps and Arafat transport.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-emerald-50 border border-[#d4af37]/40/30 rounded-lg text-[10px] text-[#064e3b] font-bold uppercase tracking-wider">
                    ★ Ministry Approved
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 border border-[#d4af37]/40/30 rounded-lg text-[10px] text-[#064e3b] font-bold uppercase tracking-wider">
                    ★ VIP Mina Tents
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 border border-[#d4af37]/40/30 rounded-lg text-[10px] text-[#064e3b] font-bold uppercase tracking-wider">
                    ★ Guided by Scholars
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Kaaba during Hajj"
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
                <h3 className="text-xl font-heading font-black text-[#064e3b]">
                  Comprehensive Hajj Logistics
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  We meticulously manage every detail so you can devote yourself entirely to worship.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    icon: FileText,
                    title: "Hajj Visa & Drafts",
                    desc: "Complete processing of your Hajj visa and mandatory Ministry of Hajj drafts.",
                  },
                  {
                    icon: Plane,
                    title: "Return Flights",
                    desc: "Scheduled direct or one-stop flights from major UK airports to Jeddah/Madinah.",
                  },
                  {
                    icon: Tent,
                    title: "Mina & Arafat Camps",
                    desc: "Comfortable, air-conditioned VIP tents in Mina and Arafat with full board meals.",
                  },
                  {
                    icon: Building2,
                    title: "Makkah & Madinah Hotels",
                    desc: "Premium 4 and 5-star accommodation conveniently located near the Harams.",
                  },
                  {
                    icon: Bus,
                    title: "Moallim Transport",
                    desc: "Air-conditioned coaches for all inter-city travel and the days of Hajj (Mina, Arafat, Muzdalifah).",
                  },
                  {
                    icon: HeartHandshake,
                    title: "Qurbani & Ziyarats",
                    desc: "We arrange your Qurbani (sacrifice) and offer guided Ziyarat tours in Madinah.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-emerald-50/40 rounded-2xl border border-[#d4af37]/40/25 hover:border-[#d4af37]/40 transition-all duration-300 flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#064e3b] shrink-0 group-hover:bg-[#064e3b] group-hover:text-white transition-colors duration-300">
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
                <h3 className="text-xl font-heading font-black text-[#064e3b]">
                  Why Perform Hajj with Us?
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  Decades of experience facilitating the sacred journey for UK pilgrims.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Ministry Approved & ATOL Protected",
                    desc: "We are an officially licensed Hajj operator recognized by the Saudi Ministry of Hajj & Umrah, and your funds are 100% ATOL protected.",
                  },
                  {
                    icon: MapPin,
                    title: "Expert Ground Team",
                    desc: "Our dedicated Saudi-based ground staff and group leaders accompany you every step of the way, especially during the crowded days of Hajj.",
                  },
                  {
                    icon: Headphones,
                    title: "Spiritual Guidance",
                    desc: "We travel with respected Islamic scholars who conduct regular seminars, answer queries, and guide you through the intricate rituals of Hajj.",
                  },
                  {
                    icon: Settings,
                    title: "Pre-Hajj Seminars",
                    desc: "We host comprehensive training seminars in the UK prior to departure to ensure you are mentally, physically, and spiritually prepared.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-emerald-50/40 rounded-2xl border border-[#d4af37]/40/25 flex items-start gap-3 hover:shadow-sm transition-shadow duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#064e3b] shrink-0">
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
