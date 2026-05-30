"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/roadtoumrah/ui/Button";
import Link from "next/link";

const faqs = [
  {
    question: "Are your holiday packages ATOL protected?",
    answer:
      "Yes, absolutely. Every flight-inclusive holiday package booked with Road To Umrah is 100% ATOL protected. You will receive an ATOL Certificate upon booking, ensuring your financial security.",
  },
  {
    question: "Can I customize a holiday package to my preferences?",
    answer:
      "Yes! All our holiday packages can be fully customized. You can change the duration, upgrade your flights, select different hotels, and add private tours. Speak to our travel experts to tailor your dream getaway.",
  },
  {
    question: "Do you offer payment plans or deposits?",
    answer:
      "Yes, we offer flexible payment options. You can secure most holidays with a low deposit, allowing you to spread the remaining cost over several months prior to your departure date.",
  },
  {
    question: "What is included in a typical holiday package?",
    answer:
      "Our standard holiday packages typically include return flights, premium accommodation (4 or 5 star), daily breakfast, and private airport transfers. Specific inclusions vary by package, and you can add extras like excursions or full-board dining.",
  },
  {
    question: "How do I make changes to my booking?",
    answer:
      "If you need to amend your dates, passenger details, or accommodation, simply contact our support team. Changes are subject to availability and the terms and conditions of the airlines and hotels involved.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/40 text-[#064e3b] text-[10px] font-extrabold uppercase tracking-widest border border-[#d4af37]">
            Help & Support
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#2a1a1a] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-[#064e3b] font-light max-w-xl mx-auto leading-relaxed">
            Everything you need to know about booking your holiday with us.
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
            Still have questions? Our travel experts are ready to help.
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
