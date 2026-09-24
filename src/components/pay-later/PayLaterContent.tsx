"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowDown,
  Tag,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Compass,
  CreditCard,
  CalendarClock,
  UserCheck,
  Award,
} from "lucide-react";
import { PayLaterForm } from "./PayLaterForm";
import { SharedFaqAccordion } from "@/components/ui/FaqAccordion";

interface PayLaterContentProps {
  brand?: "terrific" | "umrah";
  brandName?: string;
}

export function PayLaterContent({
  brand = "terrific",
  brandName = "Terrific Travel",
}: PayLaterContentProps) {
  const isUmrah = brand === "umrah";

  const brandHeadingColor = isUmrah ? "text-[#064e3b]" : "text-[#483434]";
  const brandSubtextColor = isUmrah ? "text-[#064e3b]/80" : "text-[#6b4f4f]";
  const brandAccentColor = isUmrah ? "text-[#d4af37]" : "text-[#eed6c4]";
  const brandBadgeBg = isUmrah
    ? "bg-[#d4af37]/15 border-[#d4af37]/30 text-[#d4af37]"
    : "bg-[#eed6c4]/15 border-[#eed6c4]/30 text-[#eed6c4]";
  const brandPillBadgeBg = isUmrah
    ? "bg-[#d4af37]/15 border-[#d4af37]/30 text-[#064e3b]"
    : "bg-[#eed6c4]/20 border-[#eed6c4]/45 text-[#6b4f4f]";
  const brandDividerBg = isUmrah ? "bg-[#064e3b]/30" : "bg-[#6b4f4f]/30";
  const brandBorderColor = isUmrah ? "border-[#d4af37]/40" : "border-[#eed6c4]/60";
  const brandStepBadge = isUmrah
    ? "bg-[#d4af37]/20 border-[#d4af37]/40 text-[#064e3b]"
    : "bg-[#eed6c4]/25 border-[#eed6c4]/45 text-[#6b4f4f]";
  const brandIconBox = isUmrah
    ? "bg-[#064e3b]/10 border-[#064e3b]/20 text-[#064e3b] group-hover:bg-[#064e3b] group-hover:text-white"
    : "bg-[#fff3e4] border-[#eed6c4]/60 text-[#6b4f4f] group-hover:bg-[#6b4f4f] group-hover:text-[#fff3e4]";

  const primaryBtnStyle = isUmrah
    ? "px-6 py-3.5 rounded-full bg-[#064e3b] hover:bg-[#043e2f] text-white border border-[#d4af37]/40 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2"
    : "px-6 py-3.5 rounded-full bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] border border-[#eed6c4]/40 hover:border-[#eed6c4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2";

  const secondaryBtnStyle = isUmrah
    ? "px-6 py-3.5 rounded-full bg-[#d4af37]/15 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/30 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2"
    : "px-6 py-3.5 rounded-full bg-[#eed6c4]/15 hover:bg-[#eed6c4]/30 text-[#eed6c4] border border-[#eed6c4]/30 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2";

  const formBgSection = isUmrah
    ? "bg-gradient-to-r from-[#064e3b] via-[#043e2f] to-[#064e3b]"
    : "bg-gradient-to-r from-[#2a1a1a] via-[#382626] to-[#483434]";

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      question: "How does Book Now, Pay Later work?",
      answer:
        "It's a simple payment schedule arranged directly with us — you pay a deposit to secure your booking and the balance in instalments before you travel. There's no third party and nothing to apply for.",
    },
    {
      question: "How much deposit do I need to pay?",
      answer:
        "Flights are secured with a £50 per-passenger seat deposit. Holiday packages are secured with a low per-package deposit, and the exact amount is shown on each holiday package page.",
    },
    {
      question: "When do I have to pay the balance?",
      answer:
        "Your balance must be cleared before you travel. We'll agree a payment schedule with you at the time of booking so the timing is clear from the start.",
    },
    {
      question: "What happens if I cancel?",
      answer:
        "Deposits are non-refundable, and our standard cancellation terms apply, consistent with the fees set out in our cancellation policy.",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: COMPACT & BALANCED HERO SECTION (MATCHING FLIGHT/UMRAH HERO STYLE) */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full pt-28 pb-16 md:pt-36 md:pb-20 bg-[#2a1a1a] overflow-hidden border-b border-[#eed6c4]/20 flex items-center">
        {/* Background Image with dark luxury overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
            alt="Pay Later Hero"
            fill
            className="object-cover scale-100 animate-[subtle-zoom_25s_infinite_alternate]"
            priority
          />
          <div
            className={`absolute inset-0 ${isUmrah ? "bg-gradient-to-r from-[#032a1f] via-[#064e3b]/95 to-[#064e3b]/75" : "bg-gradient-to-r from-[#1c1212] via-[#2a1a1a]/95 to-[#2a1a1a]/75"} z-10`}
          />
        </div>

        {/* Compact Hero Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl text-left space-y-4">
            {/* Elegant Micro-Tag Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md ${brandBadgeBg}`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Flexible Payment Plans</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tight leading-tight">
              Secure Your Trip With A Deposit —{" "}
              <span
                className={`${brandAccentColor} font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]`}
              >
                Pay Later
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-slate-200/90 text-xs md:text-sm font-light max-w-xl leading-relaxed">
              Pay a deposit to secure your booking today and settle the balance
              in scheduled instalments before you travel. No third party, no
              application — just a flexible payment plan arranged directly with
              our UK team.
            </p>

            {/* Checkbox Bullets */}
            <div className="space-y-2 text-xs md:text-sm font-medium text-slate-100 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                </div>
                <span>
                  <strong className="text-white">Flights:</strong> £50pp secures
                  your seat.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                </div>
                <span>
                  <strong className="text-white">Holidays:</strong> a low
                  deposit secures your booking — the exact amount is shown on
                  each holiday package.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => scrollToSection("quote-form")}
                className={primaryBtnStyle}
              >
                Get My Free Quote <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className={secondaryBtnStyle}
              >
                See How It Works <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Footnote */}
            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 space-y-1">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                ATOL Protected · IATA Accredited
              </p>
              <p className="text-slate-300/80 max-w-xl leading-relaxed text-[10px]">
                T&Cs apply. A deposit secures your booking and the remaining
                balance is paid in scheduled instalments before you travel.
                Deposits are non-refundable in line with our cancellation
                policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: HOW IT WORKS */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-24 bg-gradient-to-b from-[#fff3e4]/30 to-white border-t border-[#eed6c4]/45 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] border ${brandPillBadgeBg} mb-3`}>
              Simple 4-Step Process
            </span>
            <h2 className={`text-3xl md:text-4xl font-heading font-black ${brandHeadingColor} tracking-tight`}>
              A Deposit Secures Your Booking
            </h2>
            <p className={`${brandSubtextColor} text-xs md:text-sm font-medium mt-1 max-w-xl`}>
              Pay the balance before you travel with flexible, stress-free instalments.
            </p>
            <div className={`h-[2px] w-12 ${brandDividerBg} my-4 rounded-full`}></div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className={`bg-white rounded-3xl p-7 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors duration-300 ${brandIconBox}`}>
                    <Compass className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${brandStepBadge}`}>
                    Step 01
                  </span>
                </div>
                <h3 className={`font-heading font-black text-base ${brandHeadingColor} mb-2`}>
                  Choose your trip
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pick your flights or holiday package and tell our UK team when you'd like to travel.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`bg-white rounded-3xl p-7 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors duration-300 ${brandIconBox}`}>
                    <CreditCard className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${brandStepBadge}`}>
                    Step 02
                  </span>
                </div>
                <h3 className={`font-heading font-black text-base ${brandHeadingColor} mb-2`}>
                  Pay a deposit to secure it
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Flights are held with a £50 per-passenger seat deposit. Holiday packages are secured with a low deposit shown on each package.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`bg-white rounded-3xl p-7 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors duration-300 ${brandIconBox}`}>
                    <CalendarClock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${brandStepBadge}`}>
                    Step 03
                  </span>
                </div>
                <h3 className={`font-heading font-black text-base ${brandHeadingColor} mb-2`}>
                  Spread the balance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Settle the remaining balance across a payment schedule that suits you, finishing before departure. No third party, no credit check.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`bg-white rounded-3xl p-7 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors duration-300 ${brandIconBox}`}>
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${brandStepBadge}`}>
                    Step 04
                  </span>
                </div>
                <h3 className={`font-heading font-black text-base ${brandHeadingColor} mb-2`}>
                  Travel with peace of mind
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Once your balance is cleared you're all set — fully ATOL Protected, arranged by an IATA Accredited UK agency.
                </p>
              </div>
            </div>
          </div>

          {/* Clean disclaimer note */}
          <div className="p-4 rounded-2xl bg-[#fff3e4]/60 border border-[#eed6c4]/50 flex items-center justify-center text-center text-xs text-[#6b4f4f] max-w-3xl mx-auto">
            <span>
              <strong className="text-[#483434]">T&Cs apply:</strong> A deposit secures your booking and the remaining balance is paid in scheduled instalments before you travel. Deposits are non-refundable in line with our cancellation policy.
            </span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: WHY BOOK WITH A DEPOSIT */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-white via-[#fff3e4]/30 to-[#fff3e4]/50 border-t border-[#eed6c4]/45">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] border ${brandPillBadgeBg} mb-3`}>
              Customer First
            </span>
            <h2 className={`text-3xl md:text-4xl font-heading font-black ${brandHeadingColor} tracking-tight`}>
              Why Book With A Deposit?
            </h2>
            <p className={`${brandSubtextColor} text-xs md:text-sm font-medium mt-1 max-w-xl`}>
              Designed to give you flexibility, financial security, and total peace of mind.
            </p>
            <div className={`h-[2px] w-12 ${brandDividerBg} my-4 rounded-full`}></div>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className={`bg-white rounded-3xl p-8 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-colors duration-300 ${brandIconBox}`}>
                  <UserCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className={`font-heading font-black text-lg ${brandHeadingColor} mb-2.5`}>
                  No application, no third party
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  Your plan is arranged directly with {brandName} — there's nothing to apply for, no hard credit checks, and no separate loan company involved.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`bg-white rounded-3xl p-8 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-colors duration-300 ${brandIconBox}`}>
                  <CalendarClock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className={`font-heading font-black text-lg ${brandHeadingColor} mb-2.5`}>
                  A schedule that suits you
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  Spread the balance over flexible instalments that work for your budget, as long as the full balance is cleared before you travel.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`bg-white rounded-3xl p-8 border ${brandBorderColor} shadow-[0_10px_30px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}>
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-colors duration-300 ${brandIconBox}`}>
                  <Award className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className={`font-heading font-black text-lg ${brandHeadingColor} mb-2.5`}>
                  ATOL Protected · IATA Accredited
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  Every eligible booking is financially protected with ATOL, and your flights and travel arrangements are booked with an accredited UK travel agent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4: GOOD TO KNOW / FAQ (REUSED SHARED COMPONENT) */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <SharedFaqAccordion
        items={faqs}
        title="Good to know"
        badgeText="Payment FAQs"
        subtitle="Transparent details about our deposit and instalment schedule."
        brand={brand}
        showContactButton={false}
      />

      <div className="bg-white py-4 border-b border-[#eed6c4]/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-3 text-[11px] text-slate-500">
          <p>
            Deposits are non-refundable, and standard cancellation terms apply.
            See our{" "}
            <Link
              href="/refund-cancellation"
              className={`underline font-bold ${brandHeadingColor}`}
            >
              Refund & Cancellation policy
            </Link>{" "}
            for full details.
          </p>

          <p className="text-[10px] text-slate-400">
            T&Cs apply. A deposit secures your booking and the remaining balance
            is paid in scheduled instalments before you travel. Deposits are
            non-refundable in line with our{" "}
            <Link
              href="/refund-cancellation"
              className={`underline font-bold ${brandHeadingColor}`}
            >
              Refund & Cancellation policy
            </Link>{" "}
            .
          </p>

          <p className="font-bold text-slate-600 text-[11px] uppercase tracking-wider pt-2">
            ATOL Protected · IATA Accredited
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 5: GET YOUR FREE QUOTE / FORM */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <section id="quote-form" className={`py-20 ${formBgSection} text-white`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#eed6c4] block">
                SPREAD THE COST
              </span>

              <h2 className="text-3xl sm:text-5xl font-heading font-black text-white leading-tight tracking-tight">
                Ready to secure your trip with a deposit?
              </h2>

              <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-xl">
                Send us your trip and a UK expert will reply with a tailored
                price and a simple deposit-and-balance payment schedule that
                suits you.
              </p>
            </div>

            <div className="lg:col-span-6">
              <PayLaterForm brand={brand} />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* SECTION 6: NEED DIRECT ASSISTANCE / WHY BOOK WITH US */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#fff3e4]/60 border-t border-[#eed6c4]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#eed6c4]/30 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-[0.2em] border border-[#eed6c4]/60">
              Need Direct Assistance?
            </span>
            <h2
              className={`text-2xl sm:text-4xl font-heading font-black ${brandHeadingColor} tracking-tight`}
            >
              Prefer to speak directly with a UK Travel Specialist?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Our experienced team is on hand 7 days a week to customize your
              payment schedule, check live flight seats, or assist with package
              options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Phone / Contact */}
            <div className="bg-white rounded-3xl p-8 border border-[#eed6c4]/60 shadow-xs space-y-4 hover:border-[#6b4f4f]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fff3e4] border border-[#eed6c4] flex items-center justify-center text-[#6b4f4f]">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3
                  className={`font-heading font-bold text-lg ${brandHeadingColor}`}
                >
                  Call or WhatsApp Us
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Speak directly with an expert advisor to get instant quotes
                  and check availability for your preferred travel dates.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <a
                  href="https://wa.me/447888461474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:shadow-md ${
                    isUmrah
                      ? "bg-[#064e3b] hover:bg-[#043e2f] text-white"
                      : "bg-[#25D366] hover:bg-[#20ba5a] text-white"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp 07888 461474
                </a>
                <a
                  href="tel:+441215291630"
                  className={`inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                    isUmrah
                      ? "border-[#064e3b]/30 text-[#064e3b] hover:bg-[#064e3b]/5"
                      : "border-[#6b4f4f]/30 text-[#6b4f4f] hover:bg-[#6b4f4f]/5"
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call +44 1215 291630
                </a>
              </div>
            </div>

            {/* Card 2: 100% Financial Protection */}
            <div className="bg-white rounded-3xl p-8 border border-[#eed6c4]/60 shadow-xs space-y-4 hover:border-[#6b4f4f]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fff3e4] border border-[#eed6c4] flex items-center justify-center text-[#6b4f4f]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3
                  className={`font-heading font-bold text-lg ${brandHeadingColor}`}
                >
                  100% Financial Protection
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book with complete peace of mind. Every flight and holiday
                  package is fully ATOL Protected and backed by IATA
                  accreditation.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#f5f0eb] text-[#483434] border border-[#eed6c4]">
                  ATOL Protected
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#f5f0eb] text-[#483434] border border-[#eed6c4]">
                  IATA Accredited
                </span>
              </div>
            </div>

            {/* Card 3: Transparent Terms */}
            <div className="bg-white rounded-3xl p-8 border border-[#eed6c4]/60 shadow-xs space-y-4 hover:border-[#6b4f4f]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#fff3e4] border border-[#eed6c4] flex items-center justify-center text-[#6b4f4f]">
                  <Check className="w-5 h-5" />
                </div>
                <h3
                  className={`font-heading font-bold text-lg ${brandHeadingColor}`}
                >
                  Clear & Fair Conditions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No hidden fees, interest charges, or third-party credit
                  checks. Pay your agreed deposit now and manage the rest
                  hassle-free.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#6b4f4f] bg-[#eed6c4]/20 px-3 py-1 rounded-full border border-[#eed6c4]/40">
                  Direct arrangements · Zero Interest
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
