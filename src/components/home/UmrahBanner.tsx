"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import { UmrahBookingForm } from "@/components/umrah/UmrahBookingForm";

export function UmrahBanner() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer group block relative overflow-hidden rounded-3xl bg-[#483434] text-white shadow-[0_20px_40px_rgba(72,52,52,0.12)] border border-[#eed6c4]/30 hover:border-[#6b4f4f]/50 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(72,52,52,0.2)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
            {/* Left Image Section */}
            <div className="relative col-span-1 lg:col-span-4 h-64 lg:h-auto overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Family Travel"
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
                  Family Travel Deals
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-[#fff3e4] tracking-tight leading-tight">
                  Book Now, Pay Later
                </h3>
                <p className="text-xs text-[#eed6c4]/80 font-medium">
                  Plan your next family journey today with absolute ease
                  and flexibility.
                </p>
              </div>

              <ul className="space-y-2.5">
                {[
                  "Split your payment into 01 to 06 instalments",
                  "Pay conveniently—weekly, fortnightly, or monthly",
                  "No hidden fees or extra charges",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-xs text-[#fff3e4]/90 font-bold"
                  >
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
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#6b4f4f] block mb-1">
                    Exclusive Offer
                  </span>
                  <p className="text-sm font-black leading-snug">
                    Lock in your package with a{" "}
                    <span className="text-[#6b4f4f] underline decoration-2">
                      SMALL DEPOSIT
                    </span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#eed6c4] group-hover:text-white transition-colors duration-300">
                  <span>View Packages</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General Query Modal */}
      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
        >
          {/* Modal Panel */}
          <div
            className="relative bg-white w-full sm:max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#382626] to-[#6b4f4f] px-6 py-5 flex items-start justify-between rounded-t-3xl">
              <div>
                <h2 className="text-white font-heading font-black text-lg tracking-tight">
                  Request a Free Quote
                </h2>
                <p className="text-[#eed6c4]/80 text-xs mt-0.5">
                  Fill in your travel preferences and our team will prepare a personalised quote for you.
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                className="ml-4 mt-0.5 shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Form Body */}
            <div className="pb-6 px-2 sm:px-4">
              <UmrahBookingForm isHome={false} isModal={true} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
