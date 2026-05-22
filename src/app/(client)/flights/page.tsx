import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  Globe,
  PhoneCall,
  Armchair,
  Coffee,
  Crown,
} from "lucide-react";
import { FlightBookingForm } from "@/components/flights/FlightBookingForm";
import { FlightListCard } from "@/components/flights/FlightListCard";
import { FlightBlogSection } from "@/components/flights/FlightBlogSection";
import { TrendingFlightsSection } from "@/components/flights/TrendingFlightsSection";
import { Hero } from "@/components/ui/Hero";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Flights | Terrific Travel",
  description:
    "Book direct and connecting flights from the UK to Jeddah, Madinah, Dubai, and worldwide destinations. Best prices guaranteed with IATA-accredited Terrific Travel.",
};

const WHY_US = [
  {
    label: "IATA & ATOL Accredited",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  { label: "Price Match Guarantee", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "24 / 7 Support", icon: <CheckCircle className="w-5 h-5" /> },
  { label: "Flexible Date Changes", icon: <CheckCircle className="w-5 h-5" /> },
];

const POPULAR_ROUTES = [
  {
    dest: "Dubai, UAE",
    img: "https://images.unsplash.com/photo-1512453979436-5a50c8115191?auto=format&fit=crop&w=800&q=80",
    price: "£350",
  },
  {
    dest: "Jeddah, KSA",
    img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80",
    price: "£420",
  },
  {
    dest: "Male, Maldives",
    img: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80",
    price: "£650",
  },
  {
    dest: "Istanbul, Turkey",
    img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
    price: "£199",
  },
];

export default async function FlightsPage() {
  let trendingFlights = await (prisma as any).trendingFlight.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (trendingFlights.length === 0) {
    for (const route of POPULAR_ROUTES) {
      try {
        const existing = await (prisma as any).trendingFlight.findFirst({
          where: { destination: route.dest },
        });
        if (!existing) {
          await (prisma as any).trendingFlight.create({
            data: {
              destination: route.dest,
              image: route.img,
              price: parseFloat(route.price.replace("£", "")),
              tag: route.dest.includes("Dubai") ? "Most Popular" : null,
            },
          });
        }
      } catch (err) {
        console.warn(`Seeding trending flight failed:`, err);
      }
    }
    trendingFlights = await (prisma as any).trendingFlight.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  const flightsData = await prisma.flight.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { price: "asc" },
  });

  const flights = flightsData.map((f) => ({
    id: f.id,
    airline: f.airline,
    airlineCode: f.airlineCode,
    departure: f.departure,
    departureCode: f.departureCode || "LHR",
    destination: f.destination,
    destinationCode: f.destinationCode || "DXB",
    price: `£${f.price}`,
    baggage: f.baggage || "30kg Checked, 7kg Cabin",
    month: f.month,

    duration: f.duration || "7h 00m",
    isTransit: f.isTransit,
    transitAirport: f.transitAirport,
    transitDuration: f.transitDuration,

    isReturn: f.isReturn,
    returnAirline: f.returnAirline,
    returnAirlineCode: f.returnAirlineCode,
    returnDuration: f.returnDuration,
    returnIsTransit: f.returnIsTransit,
    returnTransitAirport: f.returnTransitAirport,
    returnTransitDuration: f.returnTransitDuration,
    returnBaggage: f.returnBaggage,
    returnAircraft: f.returnAircraft,
  }));

  const blogs = await prisma.blog.findMany({
    where: { category: "Flights" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ─── Hero ─── */}
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Worldwide Departures 2026 / 27"
        badgeIcon={<Globe className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={
          <>
            Book{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Flights
            </span>{" "}
            Worldwide
          </>
        }
        description="Direct and connecting flights from UK airports to Saudi Arabia, UAE, Maldives & beyond. Best prices, flexible dates."
        showTrustpilot={true}
        trustpilotLabel="Travellers"
      />

      {/* ─── Flight Booking Form (Overlaps Hero) ─── */}
      <FlightBookingForm />

      {/* ─── Why Us bar ─── */}
      <div className="bg-[#eed6c4]/10 border-y border-[#eed6c4]/30 py-6 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap justify-center gap-8 md:gap-12">
          {WHY_US.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-[#6b4f4f] text-xs md:text-sm font-bold tracking-wide"
            >
              <span className="text-[#6b4f4f]/80">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Popular Flight Routes ─── */}
      <TrendingFlightsSection routes={trendingFlights} />

      {/* ─── The Premium Travel Experience ─── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-2xl md:text-4xl font-heading font-black text-[#382626] tracking-tight">
              Elevate Your Journey
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Whether you are travelling for business, leisure, or pilgrimage,
              we offer unparalleled comfort across all cabin classes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#eed6c4]/20 flex items-center justify-center mb-6">
                <Armchair className="w-6 h-6 text-[#6b4f4f]" />
              </div>
              <h3 className="text-xl font-black text-[#483434] mb-3 font-heading">
                Premium Economy
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Extra legroom, priority boarding, and enhanced dining options. A
                perfect balance of comfort and value for longer flights.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[#6b4f4f]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Up to 38" seat pitch
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Dedicated cabin
                </li>
              </ul>
            </div>

            <div className="bg-[#382626] p-8 rounded-3xl border border-[#eed6c4]/40 shadow-xl relative overflow-hidden transform scale-100 md:scale-105 z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eed6c4]/10 rounded-bl-[100px] pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-[#eed6c4]/20 flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-[#eed6c4]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 font-heading">
                Business Class
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Arrive refreshed with lie-flat beds, exquisite à la carte
                dining, and exclusive airport lounge access worldwide.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[#eed6c4]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Fully flat beds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Premium lounge access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Fast-track security
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#eed6c4]/20 flex items-center justify-center mb-6">
                <Coffee className="w-6 h-6 text-[#6b4f4f]" />
              </div>
              <h3 className="text-xl font-black text-[#483434] mb-3 font-heading">
                First Class
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                The ultimate luxury experience. Private suites, caviar service,
                onboard showers (selected airlines), and chauffeur service.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[#6b4f4f]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Private enclosed suite
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Fine dining on demand
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Flight Listings (Deals) ─── */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#382626] tracking-tight">
              Flights - Top Deals
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
            {flights.map((flight) => (
              <FlightListCard key={flight.id} {...flight} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Blog Section ─── */}
      <FlightBlogSection blogs={blogs} />

      {/* ─── Custom Flight Request ─── */}
      <section className="py-16 bg-[#eed6c4]/10 border-t border-[#eed6c4]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="rounded-3xl bg-[#382626] overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-grow space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/15 border border-[#eed6c4]/30 text-[#eed6c4] text-[9px] font-extrabold uppercase tracking-[0.2em]">
                  Custom Request
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-black text-white">
                  Can&apos;t Find Your Flight?
                </h2>
                <p className="text-slate-300 text-sm font-light max-w-lg leading-relaxed">
                  Our flight specialists can search across all major airlines
                  and GDS systems to find the perfect route, date, and price for
                  your journey.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    "Group Bookings",
                    "Charter Flights",
                    "Flexible Dates",
                    "Multi-City Routes",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 text-[#eed6c4]/80 text-[10px] font-bold"
                    >
                      <CheckCircle className="w-3 h-3" /> {tag}
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
                  className="px-8 py-4 rounded-full border border-[#eed6c4]/40 text-[#eed6c4] hover:bg-[#eed6c4]/10 text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 text-center"
                >
                  Call Us
                  <PhoneCall className="inline-block w-3 h-3 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
