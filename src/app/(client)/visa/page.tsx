import Image from "next/image";
import Link from "next/link";
import {
  FileCheck,
  ShieldCheck,
  Globe,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  PhoneCall,
  AlertCircle,
} from "lucide-react";
import { Hero } from "@/components/ui/Hero";
import { VisaBookingForm } from "@/components/visa/VisaBookingForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visa Services | Terrific Travel Ltd",
  description:
    "Fast-track Saudi Arabia Umrah, UAE Dubai, and worldwide visa processing from the UK. Expert handling, rapid turnaround, IATA & ATOL accredited.",
  openGraph: {
    title: "Visa Services | Terrific Travel Ltd",
    description:
      "Fast-track Saudi Arabia Umrah, UAE Dubai, and worldwide visa processing from the UK. Expert handling, rapid turnaround, IATA & ATOL accredited.",
    url: "https://terrifictravel.co.uk/visa",
  },
  twitter: {
    title: "Visa Services | Terrific Travel Ltd",
    description:
      "Fast-track Saudi Arabia Umrah, UAE Dubai, and worldwide visa processing from the UK. Expert handling, rapid turnaround, IATA & ATOL accredited.",
  },
};

import { prisma } from "@/lib/prisma";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Documents",
    desc: "Send us your passport copy, photo, and any required supporting documents via WhatsApp or email.",
  },
  {
    step: "02",
    title: "We Handle the Processing",
    desc: "Our expert visa team submits and tracks your application with the relevant embassy or authority.",
  },
  {
    step: "03",
    title: "Receive Your Visa",
    desc: "Your approved e-Visa is emailed directly to you within the stated processing time.",
  },
];

export default async function VisaPage() {
  const visas = await prisma.visaService.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ─── Hero ─── */}
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1581451556948-2b8e39f37c35?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Fast-Track Visa Processing"
        badgeIcon={<FileCheck className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={
          <>
            Hassle-Free{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Visa
            </span>{" "}
            Services
          </>
        }
        description="Expert visa processing for Saudi Arabia, UAE, and worldwide destinations. Leave the paperwork to us."
        showTrustpilot={true}
      />

      {/* Floating Booking Form */}
      <VisaBookingForm />

      {/* ─── How It Works ─── */}
      <section className="py-14 bg-[#eed6c4]/10 border-b border-[#eed6c4]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-widest">
              Simple Process
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#483434] tracking-tight mt-3">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#6b4f4f] flex items-center justify-center shadow-lg">
                  <span className="text-xl font-heading font-black text-[#eed6c4]">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-heading font-black text-[#483434] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Visa Cards ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-widest">
              Our Visa Packages
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#483434] tracking-tight">
              Choose Your Visa Type
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
              All prices include our professional handling fee. Government visa
              fees may apply separately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visas.map((visa: any) => {
              let parsedFeatures = [];
              try {
                parsedFeatures = JSON.parse(visa.features || "[]");
              } catch (e) {
                // fallback
              }

              return (
                <Link
                  key={visa.id}
                  href={`/v/${visa?.slug}`}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col group hover:-translate-y-1 relative block ${
                    visa.isPopular
                      ? "border-[#6b4f4f]/40 shadow-[0_15px_45px_rgba(107,79,79,0.12)]"
                      : "border-[#eed6c4]/25 shadow-[0_10px_35px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_45px_rgba(72,52,52,0.08)] hover:border-[#6b4f4f]/30"
                  }`}
                >
                  {visa.isPopular && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1.5 rounded-full bg-[#6b4f4f] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={
                        visa.image ||
                        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={visa.country}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#483434]/60 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                      <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                        <Globe className="w-5 h-5 text-[#eed6c4]" />
                      </div>
                      <div>
                        <p className="text-white font-heading font-black text-sm leading-none">
                          {visa.country}
                        </p>
                        <p className="text-[#eed6c4] text-[10px] font-bold mt-0.5">
                          {visa.visaType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Processing",
                          value: visa.processingTime,
                          icon: <Clock className="w-3 h-3" />,
                        },
                        {
                          label: "Validity",
                          value: visa.validity || "Varies",
                          icon: <Globe className="w-3 h-3" />,
                        },
                        {
                          label: "Entry",
                          value: visa.entries?.split(" ")[0] || "Varies",
                          icon: <FileCheck className="w-3 h-3" />,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-[#eed6c4]/10 rounded-xl p-2.5 text-center"
                        >
                          <div className="flex justify-center mb-1 text-[#6b4f4f]">
                            {stat.icon}
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <p className="text-[10px] font-black text-[#483434] mt-0.5">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 flex-grow">
                      {parsedFeatures.map((feature: string) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-xs text-slate-600 font-light"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price + CTA */}
                    <div className="border-t border-[#eed6c4]/30 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                          From
                        </p>
                        <p className="text-2xl font-heading font-black text-[#483434]">
                          {visa.price}
                        </p>
                        <p className="text-[9px] text-slate-400 font-light">
                          per person
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#6b4f4f] hover:bg-[#483434] text-white text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg group/btn">
                        Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Important Note ─── */}
      <section className="py-10 bg-[#eed6c4]/10 border-t border-[#eed6c4]/30">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-start gap-4 p-6 rounded-3xl border border-[#6b4f4f]/20 bg-white shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#6b4f4f] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-heading font-black text-[#483434] mb-2">
                Important Information
              </h3>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                Government visa fees may be charged separately depending on
                nationality and visa type. Processing times are estimates and
                may vary. A valid passport with a minimum 6 months remaining
                validity is required. Our team will contact you with a full
                document checklist upon enquiry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 bg-white border-t border-[#eed6c4]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="rounded-3xl bg-[#382626] overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1581451556948-2b8e39f37c35?auto=format&fit=crop&w=2000&q=80"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-grow space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/15 border border-[#eed6c4]/30 text-[#eed6c4] text-[9px] font-extrabold uppercase tracking-[0.2em]">
                  Get Started Today
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-black text-white">
                  Need a Different Visa?
                </h2>
                <p className="text-slate-300 text-sm font-light max-w-lg leading-relaxed">
                  We process visas for 50+ countries. Contact our specialists
                  for Turkey, Pakistan, India, Morocco, Egypt, and more.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {["Turkey", "Pakistan", "Morocco", "India"].map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 text-[#eed6c4]/80 text-[10px] font-bold"
                    >
                      <CheckCircle className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-3">
                <a
                  href="https://wa.me/441215291630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-[#6b4f4f] hover:bg-[#eed6c4] hover:text-[#483434] text-white text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 border border-[#eed6c4]/20 hover:border-[#eed6c4] text-center"
                >
                  WhatsApp Us
                </a>
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full border border-[#eed6c4]/40 text-[#eed6c4] hover:bg-[#eed6c4]/10 text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center gap-1.5"
                >
                  Call Us <PhoneCall className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
