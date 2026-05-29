"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EssentialServicesSection({ siteConfig }: { siteConfig: any }) {
  if (
    !siteConfig.allowedTabs.includes("visa") &&
    !siteConfig.allowedTabs.includes("transport")
  ) {
    return null;
  }

  return (
    <section className="py-24 bg-slate-50 border-y border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16 flex flex-col items-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#064e3b] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
            Essential Services
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#064e3b] tracking-tight">
            Complete Your Journey
          </h2>
          <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            From fast-track visa processing to premium private transfers, we
            handle every detail so you can focus on your spiritual journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visa Card */}
          {siteConfig.allowedTabs.includes("visa") && (
            <div className="bg-white rounded-3xl overflow-hidden border border-[#d4af37]/20 shadow-lg group hover:shadow-xl hover:border-[#064e3b]/30 transition-all duration-300 flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581451556948-2b8e39f37c35?auto=format&fit=crop&w=800&q=80"
                  alt="Visa Services"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#064e3b]/80 to-transparent" />
              </div>
              <div className="p-8 sm:w-3/5 flex flex-col justify-center bg-white relative">
                <h3 className="text-2xl font-heading font-black text-[#064e3b] mb-3">
                  Fast-Track Visa
                </h3>
                <p className="text-sm text-slate-600 mb-6 font-light leading-relaxed">
                  Expert processing for Saudi Umrah Visas, UAE Tourist Visas, and
                  over 50 worldwide destinations. We handle the paperwork.
                </p>
                <Link
                  href="/visa"
                  className="inline-flex items-center gap-2 text-[#d4af37] font-extrabold text-[10px] uppercase tracking-widest hover:text-[#064e3b] transition-colors group/link"
                >
                  Explore Visas{" "}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* Transport Card */}
          {siteConfig.allowedTabs.includes("transport") && (
            <div className="bg-white rounded-3xl overflow-hidden border border-[#d4af37]/20 shadow-lg group hover:shadow-xl hover:border-[#064e3b]/30 transition-all duration-300 flex flex-col sm:flex-row">
              <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                  alt="Transport Services"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#064e3b]/80 to-transparent" />
              </div>
              <div className="p-8 sm:w-3/5 flex flex-col justify-center bg-white relative">
                <h3 className="text-2xl font-heading font-black text-[#064e3b] mb-3">
                  Premium Transfers
                </h3>
                <p className="text-sm text-slate-600 mb-6 font-light leading-relaxed">
                  Travel in comfort between Makkah, Madinah, and Jeddah with our
                  fleet of high-end vehicles and professional drivers.
                </p>
                <Link
                  href="/transport"
                  className="inline-flex items-center gap-2 text-[#d4af37] font-extrabold text-[10px] uppercase tracking-widest hover:text-[#064e3b] transition-colors group/link"
                >
                  Book Transport{" "}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
