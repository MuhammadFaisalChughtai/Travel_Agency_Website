"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  badgeText?: string;
  subtitle?: string;
  brand?: "terrific" | "umrah";
  showContactButton?: boolean;
}

export function SharedFaqAccordion({
  items,
  title = "Good to know",
  badgeText = "Help & Support",
  subtitle = "Important details and answers to your questions.",
  brand = "terrific",
  showContactButton = true,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isUmrah = brand === "umrah";
  const primaryTextColor = isUmrah ? "text-[#064e3b]" : "text-[#2a1a1a]";
  const secondaryTextColor = isUmrah ? "text-[#043e2f]" : "text-[#6b4f4f]";
  const badgeBg = isUmrah ? "bg-[#d4af37]/20 border-[#d4af37]/40 text-[#064e3b]" : "bg-[#eed6c4]/30 border-[#eed6c4]/50 text-[#6b4f4f]";
  const activeIconBg = isUmrah ? "bg-[#064e3b] text-white" : "bg-[#6b4f4f] text-white";
  const inactiveIconBg = isUmrah ? "bg-[#d4af37]/20 text-[#064e3b]" : "bg-[#eed6c4]/20 text-[#6b4f4f]";

  return (
    <div className="py-16 bg-[#fff3e4]/30 border-t border-[#eed6c4]/20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          {badgeText && (
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${badgeBg}`}>
              {badgeText}
            </span>
          )}
          <h2 className={`text-2xl md:text-3xl font-heading font-black tracking-tight ${primaryTextColor}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-xs md:text-sm font-light max-w-xl mx-auto leading-relaxed ${secondaryTextColor}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-[#eed6c4] shadow-md"
                    : "border-[#eed6c4]/40 hover:border-[#eed6c4]/80 shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group"
                >
                  <span className={`font-bold text-sm md:text-base transition-colors ${isOpen ? secondaryTextColor : primaryTextColor}`}>
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? `${activeIconBg} rotate-180`
                        : `${inactiveIconBg} group-hover:opacity-80`
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className={`p-5 md:p-6 pt-0 text-xs md:text-sm leading-relaxed font-light border-t border-[#eed6c4]/20 mt-2 ${secondaryTextColor}`}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional contact button */}
        {showContactButton && (
          <div className="mt-10 text-center">
            <p className={`text-sm mb-4 ${secondaryTextColor}`}>
              Still have questions? Our travel specialists are ready to help.
            </p>
            <Link href="/contact">
              <Button className={`rounded-full gap-2 px-6 py-5 font-bold text-xs uppercase tracking-widest shadow-md ${
                isUmrah ? "bg-[#064e3b] hover:bg-[#043e2f] text-white" : "bg-[#2a1a1a] hover:bg-[#483434] text-[#fff3e4]"
              }`}>
                <MessageCircleQuestion className="w-4 h-4" />
                Contact Support
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
