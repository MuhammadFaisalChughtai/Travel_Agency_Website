"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { useSiteConfig } from "@/components/SiteProvider";
import { formatPrice } from "@/lib/siteConfig";

interface FaqItem {
  question: string;
  answer: string | ((config: any) => string);
}

const faqs: FaqItem[] = [
  {
    question: "What is the best time to perform Umrah?",
    answer:
      "Select the ideal time for your Umrah journey—consider the cooler months from October to April for a comfortable visit, or explore the less crowded period of June and August.",
  },
  {
    question: "What are the prices of the Umrah packages for 2026?",
    answer: (config: any) =>
      `The prices of Umrah packages for 2026 depend on the type of package you choose (e.g., budget, standard, luxury) and your preferred accommodation in Makkah and Madinah. We offer budget-friendly Umrah packages starting from ${formatPrice(690, config)} per person, while our 5-star luxury packages with premium experiences start from ${formatPrice(900, config)} per person.`,
  },
  {
    question: "What if I need spiritual guidance during my Umrah?",
    answer:
      "We partner with renowned scholars and Imams who can provide spiritual guidance and are there to answer your questions about the rituals and significance of Umrah.",
  },
  {
    question:
      "I am interested in exploring beyond the holy sites. Do you offer Ziyarat tours?",
    answer:
      "Yes, we do! We offer add-on personalized Ziyarah tours to the important historical and religious sites in Makkah and Madinah. We also have curated cultural immersion experiences that allow you to discover the beauty and traditions of Saudi Arabia.",
  },
  {
    question:
      "I am looking for a luxurious Umrah experience. Do you offer premium services like private guides or VIP access?",
    answer:
      "Absolutely yes! We also cater to travellers seeking a luxurious Umrah experience. We offer exclusive packages with private guides, VIP access to holy sites, and premium accommodation options.",
  },
  {
    question:
      "Are there specific requirements to apply for Umrah through Road To Umrah?",
    answer:
      "There are a few specific requirements that need to be met to apply for Umrah through Road To Umrah or any other agency in UK. You need to have a valid passport with a minimum of six months validity, a valid Umrah visa, and proof of vaccination against meningitis and other required diseases. Road To Umrah's Umrah experts will guide you through the visa processing and approval process.",
  },
  {
    question:
      "Are there particular mobile apps for navigating Makkah and Madinah?",
    answer:
      "Several helpful apps are available, like Google Maps with off-line access, official Umrah guides like Nusuk, and language translation tools. We can recommend the best apps to download before your journey to ensure you are well prepared.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const siteConfig = useSiteConfig();

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-0.5 rounded-full bg-[#F9FAFB] border border-[#d4af37]/30 text-[#064e3b] text-[10px] font-bold tracking-widest uppercase mb-3">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#064e3b]">
            Got Questions? We've Got Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#064e3b]/40 shadow-sm bg-card"
                    : "border-[#d4af37]/30 bg-[#F9FAFB]/40 hover:border-[#064e3b]/35"
                }`}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between focus:outline-none text-left"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold pr-8 text-sm md:text-base ${isOpen ? "text-[#064e3b] font-black" : "text-[#064e3b] font-medium"}`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-[#064e3b] text-white"
                        : "bg-[#d4af37]/20 text-[#064e3b]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "max-h-[500px] opacity-100 pb-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-1.5 border-t border-[#d4af37]/20">
                    <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-light">
                      {typeof faq.answer === "function"
                        ? faq.answer(siteConfig)
                        : faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#064e3b] text-sm mb-4">
            Still have questions? Our travel experts are ready to help.
          </p>
          <Link className="flex justify-center" href="/contact">
            <button className="flex rounded-full gap-2 px-6 py-4 bg-[#064e3b] hover:bg-[#064e3b] text-[#F9FAFB] font-bold text-xs uppercase tracking-widest shadow-md">
              <MessageCircleQuestion className="w-4 h-4" />
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
