import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Users,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle,
  PhoneCall,
  AlertCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { Hero } from "@/components/ui/Hero";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transport Services | Terrific Travel Ltd",
  description:
    "VIP ground transport and airport transfers in Saudi Arabia, Dubai, and the UK. Premium Sedan, SUV, and coach vehicles with professional chauffeurs.",
  openGraph: {
    title: "Transport Services | Terrific Travel Ltd",
    description:
      "VIP ground transport and airport transfers in Saudi Arabia, Dubai, and the UK. Premium Sedan, SUV, and coach vehicles with professional chauffeurs.",
    url: "https://terrifictravel.co.uk/transport",
  },
  twitter: {
    title: "Transport Services | Terrific Travel Ltd",
    description:
      "VIP ground transport and airport transfers in Saudi Arabia, Dubai, and the UK. Premium Sedan, SUV, and coach vehicles with professional chauffeurs.",
  },
};

import { prisma } from "@/lib/prisma";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Vehicle",
    desc: "Browse our fleet and select the vehicle class that best suits your group size and comfort requirements.",
  },
  {
    step: "02",
    title: "Send Your Details",
    desc: "Share your pickup location, destination, date, and time via WhatsApp or our enquiry form.",
  },
  {
    step: "03",
    title: "Sit Back & Relax",
    desc: "Our professional chauffeur will greet you on time and transport you in style to your destination.",
  },
];

export default async function TransportPage() {
  const transports = await prisma.transportService.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ─── Hero ─── */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Chauffeur & Airport Services"
        badgeIcon={<Car className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={
          <>
            VIP{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Transport
            </span>{" "}
            Services
          </>
        }
        description="Experience maximum comfort with our private transfer services between airports, hotels, and Ziyarat sites."
        showTrustpilot={false}
        customRatingBadge={
          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#eed6c4] font-medium">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[#eed6c4] stroke-none"
                />
              ))}
            </div>
            <span className="text-slate-300 font-light">
              • Professional Drivers &amp; Modern Fleet
            </span>
          </div>
        }
      />

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

      {/* ─── Transport Cards ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-widest">
              Available Fleet
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#483434] tracking-tight">
              Select Your Class of Comfort
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
              We offer pre-booked airport transfers, inter-city rides, and
              customized full-day Ziyarat tours in Saudi Arabia, UAE, and the UK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transports.map((vehicle: any) => {
              let parsedFeatures: string[] = [];
              try {
                parsedFeatures = JSON.parse(vehicle.features || "[]");
              } catch (e) {
                // fallback
              }

              const hasSlug = !!vehicle.slug;
              return (
                <Link
                  key={vehicle.id}
                  href={hasSlug ? `/v/${vehicle.slug}` : '#'}
                  onClick={!hasSlug ? (e) => e.preventDefault() : undefined}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col group ${hasSlug ? 'hover:-translate-y-1 cursor-pointer' : 'opacity-75 cursor-default'} relative block ${
                    vehicle.isPopular
                      ? "border-[#6b4f4f]/40 shadow-[0_15px_45px_rgba(107,79,79,0.12)]"
                      : "border-[#eed6c4]/25 shadow-[0_10px_35px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_45px_rgba(72,52,52,0.08)] hover:border-[#6b4f4f]/30"
                  }`}
                >
                  {vehicle.isPopular && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1.5 rounded-full bg-[#6b4f4f] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {!hasSlug && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1.5 rounded-full bg-slate-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={
                        vehicle.image ||
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={vehicle.vehicleType}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#483434]/60 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                      <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                        <Car className="w-5 h-5 text-[#eed6c4]" />
                      </div>
                      <div>
                        <p className="text-white font-heading font-black text-sm leading-none">
                          {vehicle.vehicleType}
                        </p>
                        <p className="text-[#eed6c4] text-[10px] font-bold mt-0.5">
                          {vehicle.type}
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
                          label: "Capacity",
                          value: vehicle.capacity || "N/A",
                          icon: <Users className="w-3 h-3" />,
                        },
                        {
                          label: "Service",
                          value: vehicle.type || "Transfer",
                          icon: <MapPin className="w-3 h-3" />,
                        },
                        {
                          label: "Booking",
                          value: "Pre-Book",
                          icon: <Clock className="w-3 h-3" />,
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
                          <p className="text-[10px] font-black text-[#483434] mt-0.5 truncate">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 flex-grow">
                      {parsedFeatures.slice(0, 4).map((feature: string) => (
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
                          One-Way from
                        </p>
                        <p className="text-2xl font-heading font-black text-[#483434]">
                          £{vehicle.price}
                        </p>
                        <p className="text-[9px] text-slate-400 font-light">
                          inclusive of VAT
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
                All transfers must be pre-booked at least 24 hours in advance.
                Prices shown are one-way and may vary based on exact pickup/drop-off
                locations. For groups of 20+ passengers, coach hire, or bespoke
                multi-day Ziyarat tours, please contact our logistics team directly.
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
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&w=2000&q=80"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-grow space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/15 border border-[#eed6c4]/30 text-[#eed6c4] text-[9px] font-extrabold uppercase tracking-[0.2em]">
                  Custom Transfers
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-black text-white">
                  Need a Coach or Luxury Limousine?
                </h2>
                <p className="text-slate-300 text-sm font-light max-w-lg leading-relaxed">
                  For groups exceeding 20 passengers, luxury limousine hire, or
                  bespoke private drivers for multi-day Ziyarats, contact our
                  logistics coordinators.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {["Makkah", "Madinah", "Dubai", "London"].map((c) => (
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
