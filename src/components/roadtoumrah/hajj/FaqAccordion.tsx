"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/roadtoumrah/ui/Button";
import Link from "next/link";

const faqs = [
  {
    question: "What is the difference between Shifting and Non-Shifting Hajj?",
    answer:
      "A Non-Shifting (VIP) package means you will keep your hotel room in Makkah (near the Haram) throughout the days of Hajj. In a Shifting package, you will check out of your Makkah hotel before the Hajj days and move to standard accommodation in Aziziya, before proceeding to Mina. Shifting packages are generally more affordable.",
  },
  {
    question: "Is Qurbani (animal sacrifice) included in your Hajj packages?",
    answer:
      "Yes, Qurbani is included in all of our Road To Umrah Hajj packages. Our team will arrange the sacrifice on your behalf in accordance with Sunnah during the designated days of Eid al-Adha.",
  },
  {
    question: "Do you provide Hajj visa processing?",
    answer:
      "Yes. Once you register and secure your booking with us, our dedicated visa team handles the entire Hajj visa process on your behalf, including the Ministry of Hajj drafts.",
  },
  {
    question: "What type of tents are provided in Mina and Arafat?",
    answer:
      "We provide premium VIP, air-conditioned European tents in Mina, equipped with sofa beds, blankets, and full board catering (buffet meals). Our tents are located in exclusive zones relatively close to the Jamarat.",
  },
  {
    question: "Is there support for the elderly or disabled?",
    answer:
      "Yes, we offer wheelchair assistance upon prior request. We also provide dedicated ground staff to assist the elderly during the crowded rituals. Please notify us of any medical requirements during booking.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/40 text-[#064e3b] text-[10px] font-extrabold uppercase tracking-widest border border-[#d4af37]/40">
            Hajj Support
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#2a1a1a] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-[#064e3b] font-light max-w-xl mx-auto leading-relaxed">
            Everything you need to know about booking and performing Hajj with us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-[#d4af37]/40 shadow-md"
                  : "border-[#d4af37]/40/40 hover:border-[#d4af37]/40/80 shadow-sm hover:shadow-md"
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
                <div className="p-5 md:p-6 pt-0 text-xs md:text-sm text-[#064e3b] leading-relaxed font-light border-t border-[#d4af37]/40/20 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#064e3b] text-sm mb-4">
            Still have questions? Our Hajj experts are ready to help.
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
