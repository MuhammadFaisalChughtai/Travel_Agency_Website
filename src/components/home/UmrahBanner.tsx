"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function UmrahBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link 
          href="/umrah"
          className="group block relative overflow-hidden rounded-3xl bg-[#483434] text-white shadow-[0_20px_40px_rgba(72,52,52,0.12)] border border-[#eed6c4]/30 hover:border-[#6b4f4f]/50 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(72,52,52,0.2)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
            {/* Left Image Section */}
            <div className="relative col-span-1 lg:col-span-4 h-64 lg:h-auto overflow-hidden bg-slate-100">
              <Image
                src="/uploads/family.jpg"
                alt="Family performing Umrah"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#483434]/20 lg:to-[#483434] lg:from-transparent" />
            </div>

            {/* Middle Content Section */}
            <div className="col-span-1 lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/30 text-[#eed6c4] text-[9px] font-black uppercase tracking-widest leading-none">
                  Family Pilgrimage Deals
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-[#fff3e4] tracking-tight leading-tight">
                  Book Now, Pay Later
                </h3>
                <p className="text-xs text-[#eed6c4]/80 font-medium">
                  Plan your next sacred family journey today with absolute ease and flexibility.
                </p>
              </div>

              <ul className="space-y-2.5">
                {[
                  "Split your payment into 01 to 06 instalments",
                  "Pay conveniently—weekly, fortnightly, or monthly",
                  "No hidden fees or extra charges",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-[#fff3e4]/90 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#eed6c4] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Badge / CTA Section */}
            <div className="col-span-1 lg:col-span-3 p-8 lg:p-12 bg-[#382626] flex flex-col justify-center items-center text-center border-t lg:border-t-0 lg:border-l border-[#eed6c4]/15 relative">
              <div className="space-y-4">
                <div className="bg-[#fff3e4] text-[#483434] p-5 rounded-2xl border border-[#eed6c4] shadow-sm transform group-hover:scale-105 transition-transform duration-500">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#6b4f4f] block mb-1">Exclusive Offer</span>
                  <p className="text-sm font-black leading-snug">
                    Lock in your package with a <span className="text-[#6b4f4f] underline decoration-2">SMALL DEPOSIT</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#eed6c4] group-hover:text-white transition-colors duration-300">
                  <span>View Umrah Packages</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
