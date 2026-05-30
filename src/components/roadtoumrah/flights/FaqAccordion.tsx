"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/roadtoumrah/ui/Button";
import Link from "next/link";

const faqs = [
  {
    question: "Do you offer ATOL protection on flights?",
    answer:
      "Yes, when you book a flight-inclusive holiday or a flight combined with other travel services through Road To Umrah, your booking is fully ATOL protected.",
  },
  {
    question: "Can I book multi-city flights or round-the-world tickets?",
    answer:
      "Absolutely. Our experienced travel agents specialize in complex itineraries, including multi-city stops, open-jaw tickets, and round-the-world trips. Contact us directly for a custom quote.",
  },
  {
    question: "Are your flight prices guaranteed?",
    answer:
      "Flight prices can fluctuate rapidly based on airline availability. The price is only guaranteed once the booking is confirmed and ticketed. We recommend securing your quote as early as possible.",
  },
  {
    question: "How do I amend or cancel my flight?",
    answer:
      "Amendments and cancellations depend entirely on the fare rules set by the airline. If you booked a flexible ticket, changes can often be made. Please contact our support team immediately if you need to alter your booking.",
  },
  {
    question: "What is my baggage allowance?",
    answer:
      "Baggage allowances vary significantly between airlines, routes, and cabin classes. Your specific baggage allowance will be clearly stated on your quote and e-ticket. We can also assist in purchasing extra baggage if needed.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16 bg-emerald-50/30 border-t border-[#d4af37]/20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/30 text-[#064e3b] text-[10px] font-extrabold uppercase tracking-widest border border-[#d4af37]/50">
            Flight Support
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#2a1a1a] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-[#064e3b] font-light max-w-xl mx-auto leading-relaxed">
            Important details about your flight bookings and policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-[#d4af37] shadow-md"
                  : "border-[#d4af37]/40 hover:border-[#d4af37]/80 shadow-sm hover:shadow-md"
              }`}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group"
              >
                <span className="font-bold text-[#2a1a1a] text-sm md:text-base group-hover:text-[#064e3b] transition-colors">
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    openIndex === index
                      ? "bg-[#064e3b] text-white rotate-180"
                      : "bg-[#d4af37]/20 text-[#064e3b] group-hover:bg-[#d4af37]/40"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="p-5 md:p-6 pt-0 text-xs md:text-sm text-[#064e3b] leading-relaxed font-light border-t border-[#d4af37]/20 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#064e3b] text-sm mb-4">
            Still have questions? Our ticketing agents are ready to help.
          </p>
          <Link href="/contact">
            <Button className="rounded-full gap-2 px-6 py-5 bg-[#2a1a1a] hover:bg-[#483434] text-emerald-50 font-bold text-xs uppercase tracking-widest shadow-md">
              <MessageCircleQuestion className="w-4 h-4" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
