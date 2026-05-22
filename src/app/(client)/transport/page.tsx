import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Bus,
  Users,
  ShieldCheck,
  ArrowRight,
  Star,
  PhoneCall,
} from "lucide-react";
import { Hero } from "@/components/ui/Hero";

export const metadata = {
  title: "Transport Services | Terrific Travel Ltd",
  description:
    "VIP ground transport and airport transfers in Saudi Arabia, Dubai, and the UK. Premium Sedan, SUV, and coach vehicles with professional chauffeurs.",
};

const TRANSPORT_VEHICLES = [
  {
    id: "trans-sedan",
    title: "Private Car (Sedan)",
    type: "Private Transfer",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&w=600&q=80",
    vehicleType: "Toyota Camry / Hyundai Sonata or similar",
    price: "£90",
    capacity: "Up to 3 Guests",
    description:
      "Comfortable and efficient, our sedan category is ideal for single travelers, couples, or small families with light luggage.",
    features: [
      "Professional English-speaking driver",
      "Air-conditioned premium vehicle",
      "Flight tracking for airport delays",
      "Free 60 mins waiting at arrivals",
    ],
    popular: false,
  },
  {
    id: "trans-suv",
    title: "Premium GMC / SUV",
    type: "VIP Transfer",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    vehicleType: "GMC Yukon / Chevrolet Suburban or similar",
    price: "£150",
    capacity: "Up to 7 Guests",
    description:
      "Perfect for families. Premium comfort, spacious leather seating, and ample room for bags and strollers.",
    features: [
      "VIP service & leather interior",
      "Spacious luggage capacity",
      "Complimentary water & wipes",
      "Ideal for family packages",
    ],
    popular: true,
  },
  {
    id: "trans-minibus",
    title: "Minibus (Coaster)",
    type: "Group Transfer",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    vehicleType: "Toyota Coaster / Hyundai H1 or similar",
    price: "£290",
    capacity: "Up to 20 Guests",
    description:
      "Designed for group Ziyarat tours or large families wishing to travel together in air-conditioned comfort.",
    features: [
      "Separate luggage compartment",
      "Full AC and PA speaker system",
      "Customizable stopovers permitted",
      "Dedicated coordinator support",
    ],
    popular: false,
  },
];

export default function TransportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ─── Hero ─── */}
      {/* Hero Banner */}
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

      {/* ─── Vehicle Selection ─── */}
      <section className="py-16 bg-white animate-fade-in">
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
              customized full-day Ziyarat tours in Saudi Arabia, UAE, and the
              UK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRANSPORT_VEHICLES.map((vehicle) => (
              <article
                key={vehicle.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col group hover:-translate-y-1.5 relative ${
                  vehicle.popular
                    ? "border-[#6b4f4f]/40 shadow-[0_15px_45px_rgba(107,79,79,0.12)]"
                    : "border-[#eed6c4]/25 shadow-[0_10px_35px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_45px_rgba(72,52,52,0.08)]"
                }`}
              >
                {vehicle.popular && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1.5 rounded-full bg-[#6b4f4f] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Card Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#483434]/60 to-transparent" />

                  {/* Category and capacity */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-heading font-black text-sm leading-none">
                        {vehicle.title}
                      </p>
                      <p className="text-[#eed6c4] text-[10px] font-bold mt-0.5">
                        {vehicle.type}
                      </p>
                    </div>
                    <div className="bg-[#6b4f4f] px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#eed6c4]" />
                      <span>{vehicle.capacity}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <p className="text-xs text-[#483434]/80 font-bold uppercase tracking-wider font-heading leading-tight">
                    {vehicle.vehicleType}
                  </p>

                  <p className="text-xs text-slate-500 font-light leading-relaxed flex-grow">
                    {vehicle.description}
                  </p>

                  <ul className="space-y-2 border-t border-[#eed6c4]/20 pt-4">
                    {vehicle.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-slate-600 font-light"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#6b4f4f] shrink-0" />
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
                        {vehicle.price}
                      </p>
                      <p className="text-[9px] text-slate-400 font-light">
                        inclusive of VAT
                      </p>
                    </div>

                    <Link
                      href={`/view/transport/${vehicle.id}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#6b4f4f] hover:bg-[#483434] text-white text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                    >
                      Details
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Extra custom transport info CTA ─── */}
      <section className="py-16 bg-[#eed6c4]/10 border-t border-[#eed6c4]/30">
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
                  For groups exceeding 20 passengers, luxury bullet train
                  reservations, or bespoke private drivers for multi-day
                  ziyarats, contact our logistics coordinators.
                </p>
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
