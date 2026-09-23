"use client";

import React from "react";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  PhoneCall,
  Mail,
} from "lucide-react";

interface RefundCancellationContentProps {
  brand?: "terrific" | "umrah";
}

export function RefundCancellationContent({
  brand = "terrific",
}: RefundCancellationContentProps) {
  const isUmrah = brand === "umrah";

  const companyName = isUmrah ? "Road to Umrah" : "Terrific Travel Ltd";
  const contactEmail = isUmrah
    ? "inquires@roadtoumrah.co.uk"
    : "inquires@terrifictravel.co.uk";
  const contactPhone = isUmrah ? "+44 1215 291630" : "+44 1215 291630";
  const termsHref = "/terms-and-conditions";

  const brandHeadingColor = isUmrah ? "text-[#064e3b]" : "text-[#483434]";
  const brandSubColor = isUmrah ? "text-[#043e2f]" : "text-[#6b4f4f]";
  const brandAccentColor = isUmrah ? "text-[#d4af37]" : "text-[#eed6c4]";
  const cardBg = isUmrah ? "bg-white" : "bg-[#fff8f0]";
  const borderStyle = isUmrah ? "border-[#d4af37]/30" : "border-[#eed6c4]/60";

  return (
    <div className="bg-[#f5f0eb] min-h-screen pb-24 font-sans text-[#2a1a1a]">
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80"
        badgeText="Policy Document"
        title={
          <>
            Refund &{" "}
            <span
              className={`${brandAccentColor} font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]`}
            >
              Cancellation Policy
            </span>
          </>
        }
        description="Clear, transparent details regarding cancellations, supplier rules, and refund processing."
        showTrustpilot={false}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-12 md:mt-16">
        <div
          className={`${cardBg} rounded-3xl shadow-xl border ${borderStyle} p-6 sm:p-10 md:p-14 space-y-8`}
        >
          {/* Overview */}
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eed6c4]/30 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-wider border border-[#eed6c4]/60">
              <FileText className="w-3.5 h-3.5" />
              Overview
            </div>
            <h1
              className={`text-3xl md:text-4xl font-heading font-extrabold ${brandHeadingColor} leading-tight tracking-tight`}
            >
              <Link
                href="/refund-cancellation"
                className={`underline font-bold ${brandHeadingColor}`}
              >
                Refund & Cancellation policy
              </Link>{" "}
            </h1>
            <p
              className={`${brandSubColor} text-sm md:text-base leading-relaxed font-medium`}
            >
              <strong>{companyName}</strong> acts as a travel agent, arranging
              flights, holidays, and Umrah packages on behalf of Principal
              Suppliers (airlines, hotels, and operators). Because your travel
              contract sits with the supplier, refunds are determined both by
              the supplier’s fare or booking rules and by this policy. This page
              explains, in plain terms, what happens when you cancel, what
              happens when a supplier cancels, and how and when refunds are
              processed. It should be read together with our{" "}
              <Link
                href={termsHref}
                className="underline font-bold text-[#6b4f4f] hover:text-[#483434]"
              >
                Terms & Conditions
              </Link>
              , which govern in full.
            </p>
          </section>

          <hr className="border-[#eed6c4]/50" />

          {/* 1. If you cancel your booking */}
          <section className="space-y-4">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              1. If You Cancel Your Booking
            </h2>

            <div className="bg-[#fff3e4] border border-[#eed6c4] rounded-2xl p-5 text-xs sm:text-sm text-[#483434] space-y-2">
              <p className="font-bold flex items-center gap-2 text-sm text-[#483434]">
                <AlertCircle className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                Agency Administration Fee
              </p>
              <p className="text-[#6b4f4f] leading-relaxed">
                A non-refundable administration fee of{" "}
                <strong>£75 per passenger</strong> applies to all cancellations
                processed by {companyName}. This is separate from, and in
                addition to, any penalties imposed by the Principal Supplier.
                Third-party card-processing costs incurred on your transaction
                are likewise non-refundable, as they are charged to us by the
                payment provider and are not returned to us when a booking is
                cancelled.
              </p>
            </div>

            <p
              className={`${brandSubColor} text-sm leading-relaxed font-medium pt-2`}
            >
              What you can recover depends on what you booked. Cancellation
              terms fall into three main categories:
            </p>

            <ul className="space-y-3 pl-2 text-xs sm:text-sm text-[#6b4f4f]">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#6b4f4f] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#483434]">Global flights:</strong>{" "}
                  Refunds are governed entirely by the airline’s fare rules.
                  Most promotional and contracted (wholesale) fares are 100%
                  non-refundable and non-changeable once tickets are issued.
                  Where the fare rules do permit a refund, a £75 {companyName}{" "}
                  administration fee per passenger applies to processing it.{" "}
                  {companyName} acts only as an agent; if the airline refuses or
                  delays a refund, {companyName} is not financially liable.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#6b4f4f] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#483434]">Tailored holidays:</strong>{" "}
                  Package deposits are non-refundable. Cancellation is subject
                  to tiered charges based on how many days before departure we
                  receive your written notice, rising to a charge equivalent to
                  100% of the total booking value for cancellations within 29
                  days of departure. Please note: many hotel rooms, transfers,
                  excursions, and local activities are 100% non-refundable from
                  the time of booking. Where our suppliers’ cancellation
                  penalties are stricter than our tiered charges, the supplier’s
                  terms will apply and you will be liable for the full cost of
                  those non-refundable elements.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#6b4f4f] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#483434]">Umrah packages:</strong>{" "}
                  Umrah bookings involve non-refundable Saudi visa costs and
                  block ground and accommodation allocations. Deposits used to
                  lock in airfares are strictly non-refundable. The full Umrah
                  terms are set out in section 5.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#6b4f4f] mt-1.5 shrink-0" />
                <div>
                  <strong className="text-[#483434]">
                    No-shows and missed segments:
                  </strong>{" "}
                  If you do not check in for a flight segment, the airline will
                  typically cancel all later segments on the same ticket
                  automatically. No refund is payable in that case, and onward
                  travel must be re-booked at prevailing fares at your own
                  expense.
                </div>
              </li>
            </ul>
          </section>

          {/* 2. If supplier cancels or makes major change */}
          <section className="space-y-3">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              2. If the Airline or Supplier Cancels or Makes a Major Change
            </h2>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              Where a Principal Supplier cancels your flight or holiday, or
              makes a significant change to it, you are entitled to the refund
              of all sums due to you in respect of the cancelled services, less
              any element already provided. We will request that refund from the
              supplier on your behalf and pass it to you as set out in section
              4.
            </p>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              <strong className="text-[#483434]">
                Minor schedule changes:
              </strong>{" "}
              A change to a flight schedule of less than 12 hours from the
              originally confirmed time is treated as a minor change and does
              not, by itself, give rise to a right of refund or cancellation
              without penalty.
            </p>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              <strong className="text-[#483434]">What to do:</strong> If you are
              notified of a cancellation or major change — by us, the airline,
              or the operator — contact us at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="underline font-bold text-[#6b4f4f]"
              >
                {contactEmail}
              </a>{" "}
              or{" "}
              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="underline font-bold text-[#6b4f4f]"
              >
                {contactPhone}
              </a>{" "}
              and we will confirm your options (a refund, or an alternative
              where available) and begin processing without delay.
            </p>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              <strong className="text-[#483434]">
                Supplier default and force majeure:
              </strong>{" "}
              {companyName} accepts no liability for bookings cancelled,
              amended, or delayed due to factors outside our control, including
              supplier insolvency, weather, strikes, or government actions. Any
              refunds in these scenarios are strictly subject to what we
              successfully recover from the Principal Supplier.
            </p>
          </section>

          {/* 3. ATOL Protection */}
          <section className="space-y-3">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              3. ATOL-Protected Bookings
            </h2>
            <div className="flex items-start gap-3 bg-[#fff3e4]/70 border border-[#eed6c4] p-4 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-[#6b4f4f] shrink-0 mt-0.5" />
              <p
                className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
              >
                Where your booking is a flight-inclusive package ATOL protected
                via our licensed ATOL supplier partners, your financial
                protection for that package applies in accordance with the ATOL
                scheme, and your ATOL Certificate sets out what is covered.
              </p>
            </div>
          </section>

          {/* 4. How and when refunds are processed */}
          <section className="space-y-3">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              4. How and When Refunds Are Processed
            </h2>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              Any refund due to you is made to the original payment method.
              Where a refund arises because a package was terminated, we process
              it without undue delay and, in any event, no later than 14 days
              after the contract is terminated, in line with the Package Travel
              and Linked Travel Arrangements Regulations 2018. Where a refund
              depends on first recovering sums from a Principal Supplier, we
              pass the recovered amount to you promptly once it is received.
            </p>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              <strong className="text-[#483434]">
                Book Now, Pay Later & Instalment bookings:
              </strong>{" "}
              If you paid using an instalment facility or low deposit plan, any
              refund recovered is applied against your outstanding balance to
              the extent permitted. Cancelling a trip does not automatically
              cancel the credit agreement or payment schedule, and if a refund
              is less than the balance owed you remain liable for the shortfall.
            </p>
          </section>

          {/* 5. Umrah and specialised religious travel */}
          <section className="space-y-3">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              5. Umrah and Specialised Religious Travel
            </h2>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              Once an Umrah visa application has been submitted on your behalf,
              the visa fee is non-refundable regardless of the outcome. Hotel
              allotments in Makkah and Madinah during peak periods (including
              Ramadan and the December school-holiday window) are sold to us on
              a non-refundable, non-transferable basis and inherit those
              conditions.
            </p>
          </section>

          {/* 6. Disputes and chargebacks */}
          <section className="space-y-3">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              6. Disputes and Chargebacks
            </h2>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              If you have a concern about a booking, fee, or supplier charge,
              please raise it with us in writing first and allow a minimum of 14
              business days for us to investigate and respond before escalating
              to your bank or card issuer. By booking with us you agree not to
              initiate a card chargeback in respect of our agency administration
              fees, non-refundable deposits, or supplier penalties correctly
              passed on to you. Full detail is set out in our{" "}
              <Link
                href={termsHref}
                className="underline font-bold text-[#6b4f4f]"
              >
                Terms & Conditions
              </Link>
              .
            </p>
          </section>

          {/* 7. How to request a refund or cancellation */}
          <section className="space-y-4">
            <h2
              className={`text-xl md:text-2xl font-heading font-black ${brandHeadingColor} tracking-wide uppercase border-b border-[#eed6c4]/40 pb-2`}
            >
              7. How to Request a Refund or Cancellation
            </h2>
            <p
              className={`${brandSubColor} text-xs sm:text-sm leading-relaxed font-medium`}
            >
              To request a cancellation or inquire about refunds, please contact
              our support team with your booking reference:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#eed6c4] shadow-xs hover:border-[#6b4f4f] transition-all"
              >
                <Mail className="w-5 h-5 text-[#6b4f4f] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Email Us
                  </span>
                  <span className="text-xs font-bold text-[#483434]">
                    {contactEmail}
                  </span>
                </div>
              </a>

              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#eed6c4] shadow-xs hover:border-[#6b4f4f] transition-all"
              >
                <PhoneCall className="w-5 h-5 text-[#6b4f4f] shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Call Us
                  </span>
                  <span className="text-xs font-bold text-[#483434]">
                    {contactPhone}
                  </span>
                </div>
              </a>
            </div>

            <p className="text-[11px] text-[#6b4f4f] italic pt-6 border-t border-[#eed6c4]/50">
              {companyName} · Registered in England and Wales · ATOL Protected
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
