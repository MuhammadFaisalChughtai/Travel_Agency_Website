import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  BookOpen,
  PlaneTakeoff,
  PlaneLanding,
  FileCheck,
  Car,
  Users,
  ShieldCheck,
  MapPin,
  Building2,
  DollarSign,
  Bus,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  Download,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Award,
  Star,
  FileText,
  CalendarDays,
  List,
} from "lucide-react";
import { format } from "date-fns";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteConfig, formatPrice } from "@/lib/siteConfig";
import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/ui/PackageCard";
import { FaqAccordion } from "@/components/holiday/FaqAccordion";
import { EnquirySidebar } from "@/components/view/EnquirySidebar";
import { Hero } from "@/components/ui/Hero";
import { BookingModal } from "@/components/view/BookingModal";

export const revalidate = 0; // Disable static rendering caching to allow dynamic prisma lookups

// ────────────────────────────────────────────────────────────────────────
// HELPER LOOKUP FUNCTIONS (Prisma DB + Static Fallbacks)
// ────────────────────────────────────────────────────────────────────────

async function resolveItem(slug: string) {
  const parseArr = (raw: string | null) => {
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return raw
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  };

  // 1. Try Database: Package
  try {
    const dbPackage = await prisma.package.findUnique({ where: { slug } });
    if (dbPackage) {
      const images = parseArr(dbPackage.images);
      return {
        id: dbPackage.id,
        title: dbPackage.title,
        itemType: "package",
        type: dbPackage.type,
        destination: dbPackage.destination,
        duration: dbPackage.duration,
        price: dbPackage?.priceQuad ?? dbPackage.price,
        priceQuad: dbPackage.priceQuad,
        priceTriple: dbPackage.priceTriple,
        priceDouble: dbPackage.priceDouble,
        imageUrl: images[0] || dbPackage.images,
        description: dbPackage.description,
        includedServices: parseArr(dbPackage.includedServices),
        travelDates: dbPackage.travelDates,
        stars: dbPackage.stars ?? 3,
        isSold: dbPackage.isSold,
        // Accommodation
        meccaHotel: dbPackage.meccaHotel,
        meccaNights: dbPackage.meccaNights,
        meccaRoomType: dbPackage.meccaRoomType,
        medinaHotel: dbPackage.medinaHotel,
        medinaNights: dbPackage.medinaNights,
        medinaRoomType: dbPackage.medinaRoomType,
        // Services
        transportation: parseArr(dbPackage.transportation),
        sightseeing: parseArr(dbPackage.sightseeing),
        visaInfo: parseArr(dbPackage.visaInfo),
        packageFeatures: parseArr(dbPackage.packageFeatures),
        metaTitle: dbPackage.metaTitle,
        metaDescription: dbPackage.metaDescription,
      };
    }
  } catch (e) {
    console.warn("Prisma Package fetch failed");
  }

  // 2. Try Database: Blog
  try {
    const post = await prisma.blog.findUnique({ where: { slug } });
    if (post) {
      return { ...post, isBlog: true, itemType: "blog" };
    }
  } catch (e) {}

  // 3. Try Database: Flight (using slug as ID since flights don't have slugs yet)
  try {
    const dbFlight = await prisma.flight.findUnique({ where: { id: slug } });
    if (dbFlight) {
      return {
        id: dbFlight.id,
        itemType: "flight",
        airline: dbFlight.airline,
        airlineCode:
          dbFlight.airlineCode ||
          dbFlight.airline.substring(0, 2).toUpperCase(),
        departure: dbFlight.departure,
        departureCode: dbFlight.departureCode || "LHR",
        destination: dbFlight.destination,
        destinationCode: dbFlight.destinationCode || "DXB",
        date: "Flexible",
        duration: dbFlight.duration || "7h 00m",
        type: dbFlight.isTransit
          ? `1 Stop (${dbFlight.transitAirport})`
          : "Direct",
        price: dbFlight.price,
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        baggage: dbFlight.baggage || "30kg Checked, 7kg Cabin",
        aircraft: dbFlight.aircraft || "Boeing 777",
        isTransit: dbFlight.isTransit,
        transitAirport: dbFlight.transitAirport,
        transitDuration: dbFlight.transitDuration,

        isReturn: dbFlight.isReturn,
        returnAirline: dbFlight.returnAirline,
        returnAirlineCode: dbFlight.returnAirlineCode,
        returnDate: dbFlight.isReturn ? "Flexible" : null,
        returnDuration: dbFlight.returnDuration,
        returnIsTransit: dbFlight.returnIsTransit,
        returnTransitAirport: dbFlight.returnTransitAirport,
        returnTransitDuration: dbFlight.returnTransitDuration,
        returnBaggage: dbFlight.returnBaggage,
        returnAircraft: dbFlight.returnAircraft,
        metaTitle: dbFlight.metaTitle,
        metaDescription: dbFlight.metaDescription,
      };
    }
  } catch (e) {}

  // 4. Try Database: Visa
  try {
    const dbVisa = await prisma.visaService.findUnique({ where: { slug } });
    if (dbVisa) {
      return {
        ...dbVisa,
        features: parseArr(dbVisa.features),
        documents: parseArr(dbVisa.requiredDocuments),
        itemType: "visa",
      };
    }
  } catch (e) {}

  // 5. Try Database: TransportService
  try {
    const dbTransport = await prisma.transportService.findUnique({
      where: { slug },
    });
    if (dbTransport) {
      return {
        ...dbTransport,
        features: parseArr(dbTransport.features),
        itemType: "transport",
      };
    }
  } catch (e) {}

  return null;
}

// ────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────

interface ViewPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ViewPageProps) {
  const item = await resolveItem(params.slug);
  if (!item) return { title: "Item Not Found | Terrific Travel Ltd" };

  const type = item.itemType;
  
  // Use the same robust title logic as the page component
  const fallbackTitle = 
    type === "visa"
      ? `${item.country} ${item.visaType || item.type}`
      : type === "transport"
        ? `${item.vehicleType} — ${item.type}`
        : type === "flight"
          ? `${item.airline} flight to ${item.destination}`
          : "Detail View";

  const titleText = item.metaTitle || item.title || fallbackTitle;

  const descText =
    item.metaDescription ||
    item.description ||
    item.excerpt ||
    `Discover ${titleText} with Terrific Travel Ltd. Expert services, great prices, and fully protected bookings.`;

  return {
    title: item.metaTitle ? titleText : `${titleText} | Terrific Travel Ltd`,
    description: descText,
  };
}

export default async function UniversalViewPage({ params }: ViewPageProps) {
  const { slug } = params;
  const item = await resolveItem(slug);

  if (!item) {
    notFound();
  }

  const type = item.itemType; // "package", "blog", "flight", "visa", "transport"
  const id = item.id || slug;

  // Find relevant blogs for SEO interlinking
  let blogCategory = "Travel Guide";
  if (type === "package") {
    blogCategory =
      item.type === "UMRAH" ? "Umrah" : item.type === "HAJJ" ? "Hajj" : "Holiday";
  } else if (type === "visa") {
    blogCategory = "Visa";
  } else if (type === "flight") {
    blogCategory = "Flight";
  } else if (type === "transport") {
    blogCategory = "Transport";
  }

  let relatedArticles = await prisma.blog.findMany({
    where: { 
      slug: { not: slug },
      category: { contains: blogCategory }
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // Fallback to latest blogs if we don't have enough specific ones
  if (relatedArticles.length < 3) {
    const existingIds = relatedArticles.map((a) => a.id);
    const fallbackBlogs = await prisma.blog.findMany({
      where: { 
        slug: { not: slug },
        id: { notIn: existingIds }
      },
      take: 3 - relatedArticles.length,
      orderBy: { createdAt: "desc" },
    });
    relatedArticles = [...relatedArticles, ...fallbackBlogs];
  }

  // Common properties
  const title =
    item.title ||
    (type === "visa"
      ? `${item.country} ${item.visaType || item.type}`
      : type === "transport"
        ? `${item.vehicleType} — ${item.type}`
        : `${item.airline} flight to ${item.destination}`);
  const image =
    item.imageUrl ||
    item.image ||
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80";
  const headersList = headers();
  const domain = headersList.get("x-site-domain");
  const siteConfig = getSiteConfig(domain);

  const price = item.price;
  const displayPrice = price ? formatPrice(price, siteConfig) : "N/A";

  // Strip HTML tags for the hero subtitle to prevent raw HTML rendering
  const cleanDescription = item.description 
    ? item.description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() 
    : "";

  return (
    <div className="flex flex-col min-h-screen bg-background text-[#483434]">
      {/* ─── Hero Header (Umrah Luxury Theme) ─── */}
      <Hero
        backgroundImage={image}
        badgeText={
          type === "package"
            ? "Special Package Deal"
            : type === "flight"
              ? "Verified Airline Routes"
              : type === "visa"
                ? "Accredited Visa Partner"
                : type === "transport"
                  ? "VIP Ground Transport"
                  : type === "blog"
                    ? "Spiritual Journal & Travel Guide"
                    : "Detail View"
        }
        title={title}
        description={
          type === "blog"
            ? item.excerpt || ""
            : cleanDescription.length > 150
              ? cleanDescription.substring(0, 150) + "..."
              : cleanDescription
        }
        showTrustpilot={false}
        customRatingBadge={
          type !== "blog" ? (
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 font-light pt-1">
              {item.destination && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#eed6c4]" />{" "}
                  {item.destination}
                </span>
              )}
              {item.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#eed6c4]" /> {item.duration}
                </span>
              )}
              {item.stars && (
                <div className="flex gap-0.5 text-[#eed6c4]">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#eed6c4] stroke-none"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#eed6c4] font-bold uppercase tracking-widest pt-1">
              <span>{item.category}</span>
              <span>•</span>
              <span>{item.date}</span>
              <span>•</span>
              <span>{item.readTime}</span>
            </div>
          )
        }
      />

      {/* ─── Breadcrumb ─── */}
      <div className="bg-[#fff3e4] border-b border-[#eed6c4]/30 py-3.5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-2 text-xs font-bold text-[#6b4f4f] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#483434]">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link
            href={type === "blog" ? "/umrah#blog" : `/${type}s`}
            className="hover:text-[#483434]"
          >
            {type === "blog" ? "Journals" : `${type}s`}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400 truncate max-w-[200px] md:max-w-xs">
            {title}
          </span>
        </div>
      </div>

      {/* ─── Page Grid Content ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ────────────────────────────────────────────────────────────────── */}
          {/* MAIN DETAIL WINDOW (8 Columns) */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <main className="lg:col-span-8 space-y-12">
            {/* A: BLOG DETAIL LAYOUT */}
            {type === "blog" && (
              <article className="space-y-8">
                <Link
                  href="/umrah"
                  className="inline-flex items-center gap-2 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-widest hover:text-[#483434] transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Umrah Journals
                </Link>

                <p className="text-base md:text-lg font-medium text-[#483434] leading-relaxed border-l-4 border-[#6b4f4f] pl-5 bg-[#eed6c4]/15 py-4.5 pr-4 rounded-r-3xl">
                  {item.excerpt}
                </p>

                <div
                  className="prose-article"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />

                <style>{`
                  .prose-article h1, .prose-article h2, .prose-article h3, .prose-article h4, .prose-article h5, .prose-article h6 {
                    font-family: var(--font-heading);
                    color: #483434;
                    margin-top: 2rem;
                    margin-bottom: 0.8rem;
                    line-height: 1.3;
                    font-weight: 900;
                  }
                  .prose-article h1 { font-size: 1.75rem; }
                  .prose-article h2 { font-size: 1.45rem; }
                  .prose-article h3 { font-size: 1.25rem; font-weight: 800; color: #6b4f4f; }
                  .prose-article h4 { font-size: 1.1rem; font-weight: 800; color: #6b4f4f; }
                  
                  .prose-article p {
                    color: #4b5563;
                    line-height: 1.9;
                    margin-bottom: 1.2rem;
                    font-size: 1rem;
                  }
                  
                  .prose-article ul, .prose-article ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: #4b5563;
                    font-size: 1rem;
                    line-height: 1.9;
                  }
                  .prose-article ul { list-style-type: disc; }
                  .prose-article ol { list-style-type: decimal; }
                  .prose-article li { margin-bottom: 0.5rem; }
                  
                  .prose-article strong { color: #483434; font-weight: 700; }
                  .prose-article em { color: #6b4f4f; font-style: italic; }
                  
                  .prose-article a {
                    color: #6b4f4f;
                    text-decoration: underline;
                    font-weight: 600;
                  }
                  .prose-article a:hover { color: #483434; }
                  
                  .prose-article blockquote {
                    border-left: 4px solid #6b4f4f;
                    padding-left: 1.2rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #483434;
                    background: #eed6c415;
                    padding: 1rem 1.2rem;
                    border-radius: 0 0.5rem 0.5rem 0;
                  }
                  
                  .prose-article img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                    box-shadow: 0 10px 35px rgba(72,52,52,0.06);
                  }
                  
                  .prose-article iframe {
                    width: 100%;
                    min-height: 400px;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                  }
                `}</style>
              </article>
            )}

            {/* B: PACKAGE DETAIL LAYOUT */}
            {type === "package" && (
              <div className="space-y-8">
                {/* ── Always-visible: What's Included Icons ── */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)]">
                  <h2 className="text-xl font-heading font-black text-[#483434] mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#6b4f4f]" /> What's Included
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        icon: (
                          <PlaneTakeoff className="w-7 h-7 text-[#6b4f4f]" />
                        ),
                        label: "Flights",
                        sub: "Return flights from UK",
                      },
                      {
                        icon: <Building2 className="w-7 h-7 text-[#6b4f4f]" />,
                        label: "Hotel",
                        sub: `${item.stars || 3}-Star accommodation`,
                      },
                      {
                        icon: <Car className="w-7 h-7 text-[#6b4f4f]" />,
                        label: "Transport",
                        sub: item.type === "HOLIDAY" ? "Transfers Included" : "Makkah ↔ Madinah",
                      },
                      {
                        icon: <FileCheck className="w-7 h-7 text-[#6b4f4f]" />,
                        label: "Visa",
                        sub: item.type === "HOLIDAY" ? "Tourist Visa" : "Umrah visa included",
                      },
                    ].map(({ icon, label, sub }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center text-center gap-3 bg-[#fff3e4] rounded-2xl p-5 border border-[#eed6c4]/40 hover:border-[#6b4f4f]/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white border border-[#eed6c4]/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          {icon}
                        </div>
                        <div>
                          <p className="font-heading font-black text-[#483434] text-sm">
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
                            {sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Journey Steps ── */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)]">
                  <h2 className="text-xl font-heading font-black text-[#483434] mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#6b4f4f]" /> Your Journey
                  </h2>
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-8 left-8 right-8 h-[2px] bg-gradient-to-r from-[#eed6c4] via-[#6b4f4f]/30 to-[#eed6c4] hidden md:block" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                      {[
                        {
                          step: "01",
                          icon: <PlaneTakeoff className="w-5 h-5" />,
                          label: "Departure",
                          sub: "UK Airport",
                        },
                        {
                          step: "02",
                          icon: <Building2 className="w-5 h-5" />,
                          label: item.type === "HOLIDAY" ? "Arrival" : "Makkah",
                          sub: "Hotel Check-in",
                        },
                        {
                          step: "03",
                          icon: item.type === "HOLIDAY" ? <MapPin className="w-5 h-5" /> : <Bus className="w-5 h-5" />,
                          label: item.type === "HOLIDAY" ? "Relax & Enjoy" : "Madinah",
                          sub: item.type === "HOLIDAY" ? "Your Holiday Stay" : "Transfer & Stay",
                        },
                        {
                          step: "04",
                          icon: <PlaneLanding className="w-5 h-5" />,
                          label: "Return",
                          sub: "Back to UK",
                        },
                      ].map(({ step, icon, label, sub }) => (
                        <div
                          key={step}
                          className="flex flex-col items-center text-center gap-2"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6b4f4f] to-[#483434] flex items-center justify-center text-white shadow-lg shadow-[#6b4f4f]/20 relative">
                            {icon}
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#eed6c4] text-[#483434] text-[9px] font-black flex items-center justify-center border border-white">
                              {step}
                            </span>
                          </div>
                          <p className="font-heading font-black text-[#483434] text-sm mt-1">
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {sub}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── Rich HTML content from editor (if any) ── */}
                {item.description && item.description.trim().length > 0 && (
                  <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)]">
                    <h2 className="text-xl font-heading font-black text-[#483434] mb-5 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#6b4f4f]" /> Package
                      Details
                    </h2>
                    <div
                      className="prose-article"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <style>{`
                      .prose-article h1, .prose-article h2, .prose-article h3, .prose-article h4 {
                        font-family: var(--font-heading);
                        color: #483434;
                        margin-top: 1.8rem;
                        margin-bottom: 0.7rem;
                        font-weight: 900;
                        line-height: 1.3;
                      }
                      .prose-article h1 { font-size: 1.6rem; }
                      .prose-article h2 { font-size: 1.35rem; border-bottom: 2px solid #eed6c4; padding-bottom: 0.4rem; }
                      .prose-article h3 { font-size: 1.15rem; color: #6b4f4f; }
                      .prose-article p { color: #4b5563; line-height: 1.9; margin-bottom: 1rem; font-size: 0.95rem; }
                      .prose-article ul, .prose-article ol { padding-left: 1.5rem; margin-bottom: 1.2rem; color: #4b5563; font-size: 0.95rem; line-height: 1.9; }
                      .prose-article ul { list-style-type: disc; }
                      .prose-article ol { list-style-type: decimal; }
                      .prose-article li { margin-bottom: 0.4rem; }
                      .prose-article strong { color: #483434; font-weight: 700; }
                      .prose-article em { color: #6b4f4f; font-style: italic; }
                      .prose-article blockquote { border-left: 4px solid #6b4f4f; background: #eed6c415; padding: 1rem 1.2rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0; font-style: italic; color: #483434; }
                      .prose-article img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 10px 35px rgba(72,52,52,0.06); }
                      .prose-article a { color: #6b4f4f; text-decoration: underline; font-weight: 600; }
                      .prose-article a:hover { color: #483434; }
                      .prose-article table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
                      .prose-article th { background: #eed6c4; color: #483434; font-weight: 700; padding: 0.6rem 1rem; text-align: left; }
                      .prose-article td { padding: 0.6rem 1rem; border-bottom: 1px solid #eed6c420; color: #4b5563; }
                      .prose-article tr:nth-child(even) td { background: #fffcf9; }
                    `}</style>
                  </section>
                )}

                {/* ── Guarantee note ── */}
                <section className="bg-[#eed6c4]/15 border border-[#eed6c4]/40 rounded-3xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#6b4f4f] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-black text-[#483434] text-base mb-1.5">
                      {item.type === "HOLIDAY" ? "Terrific Holiday Guarantee" : "Sacred Journey Guarantee"}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      All package pricing is based on quad/family accommodation
                      share. Dual, triple, or solo upgrades are fully
                      customizable. Flights originate from London Heathrow,
                      Manchester, or Birmingham. ATOL &amp; IATA backing ensures
                      secure reservations.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* C: FLIGHT DETAIL LAYOUT */}
            {type === "flight" && (
              <div className="space-y-10">
                {/* Outbound Journey Section */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-[#6b4f4f]" /> Outbound
                    Flight Path
                  </h2>

                  {/* Visual Route */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#fff3e4]/50 rounded-2xl border border-[#eed6c4]/40">
                    {/* Departure */}
                    <div className="text-center md:text-left space-y-1 min-w-[120px]">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Departure Airport
                      </p>
                      <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                        {item.departure}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                        {item.departureCode}
                      </span>
                    </div>

                    {/* Timeline connection */}
                    <div className="flex-1 flex flex-col items-center justify-center min-w-[160px] w-full px-4">
                      <span className="text-[10px] font-bold text-[#6b4f4f] uppercase tracking-widest mb-1">
                        {item.duration}
                      </span>

                      {item.isTransit ? (
                        <div className="w-full flex items-center justify-between relative px-2">
                          {/* Connection line */}
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                          {/* Left dot */}
                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                          {/* Transit node */}
                          <div className="flex flex-col items-center bg-white border border-[#eed6c4] px-2 py-0.5 rounded-full z-10 shadow-sm">
                            <span className="text-[9px] font-black text-amber-800 uppercase tracking-tight">
                              {item.transitAirport}
                            </span>
                            {item.transitDuration && (
                              <span className="text-[7px] font-semibold text-slate-400 -mt-0.5 whitespace-nowrap">
                                {item.transitDuration} layover
                              </span>
                            )}
                          </div>

                          {/* Right dot */}
                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-between relative px-2">
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                          {/* Direct marker */}
                          <div className="bg-[#6b4f4f] text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-10 uppercase tracking-widest">
                            Direct
                          </div>

                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="text-center md:text-right space-y-1 min-w-[120px]">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Arrival Destination
                      </p>
                      <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                        {item.destination}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                        {item.destinationCode}
                      </span>
                    </div>
                  </div>

                  {/* Outbound Parameters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Airline
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.airline} ({item.airlineCode})
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Baggage Allowance
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.baggage}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Aircraft Type
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.aircraft}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Departure Date
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Return Journey Section (if enabled) */}
                {item.isReturn && (
                  <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                    <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                      <PlaneLanding className="w-5 h-5 text-[#6b4f4f]" /> Return
                      Flight Path
                    </h2>

                    {/* Visual Route */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#fff3e4]/50 rounded-2xl border border-[#eed6c4]/40">
                      {/* Return Departure (original destination) */}
                      <div className="text-center md:text-left space-y-1 min-w-[120px]">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Departure Airport
                        </p>
                        <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                          {item.destination}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                          {item.destinationCode}
                        </span>
                      </div>

                      {/* Timeline connection */}
                      <div className="flex-1 flex flex-col items-center justify-center min-w-[160px] w-full px-4">
                        <span className="text-[10px] font-bold text-[#6b4f4f] uppercase tracking-widest mb-1">
                          {item.returnDuration || item.duration}
                        </span>

                        {item.returnIsTransit ? (
                          <div className="w-full flex items-center justify-between relative px-2">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                            <div className="flex flex-col items-center bg-white border border-[#eed6c4] px-2 py-0.5 rounded-full z-10 shadow-sm">
                              <span className="text-[9px] font-black text-amber-800 uppercase tracking-tight">
                                {item.returnTransitAirport}
                              </span>
                              {item.returnTransitDuration && (
                                <span className="text-[7px] font-semibold text-slate-400 -mt-0.5 whitespace-nowrap">
                                  {item.returnTransitDuration} layover
                                </span>
                              )}
                            </div>

                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between relative px-2">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                            <div className="bg-[#6b4f4f] text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-10 uppercase tracking-widest">
                              Direct
                            </div>

                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                          </div>
                        )}

                        <span className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                          {item.returnIsTransit
                            ? `1 Stop (${item.returnTransitAirport})`
                            : "Direct Flight"}
                        </span>
                      </div>

                      {/* Return Arrival (original departure) */}
                      <div className="text-center md:text-right space-y-1 min-w-[120px]">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Arrival Destination
                        </p>
                        <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                          {item.departure}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                          {item.departureCode}
                        </span>
                      </div>
                    </div>

                    {/* Return Parameters Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Airline
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnAirline || item.airline} (
                          {item.returnAirlineCode || item.airlineCode})
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Baggage Allowance
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnBaggage || item.baggage}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Aircraft Type
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnAircraft || item.aircraft}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Return Date
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnDate}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <section className="bg-[#eed6c4]/15 border border-[#eed6c4]/40 rounded-3xl p-6.5 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#6b4f4f] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-black text-[#483434] text-base mb-1.5">
                      Airport Information
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      Departure gates close 45 minutes prior to flight time.
                      Travelers should check in online 24 hours prior to
                      departure. Special meal requirements or wheelchair
                      requests must be submitted at least 72 hours before flight
                      takeoff.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* D: VISA DETAIL LAYOUT */}
            {type === "visa" && (
              <div className="space-y-10">
                {/* Main Specs Section */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eed6c4]/20 pb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-black text-[#483434] flex items-center gap-2">
                        <FileCheck className="w-6 h-6 text-[#6b4f4f]" /> Visa Overview
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">Official Immigration &amp; Travel Permits</p>
                    </div>
                    <div className="bg-[#fff3e4] px-4 py-2 rounded-xl border border-[#eed6c4]/40 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#6b4f4f]" />
                      <span className="text-xs font-black text-[#483434] tracking-wider uppercase">Verified Agent</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: <MapPin className="w-5 h-5" />, label: "Country", value: item.country, flag: item.flag },
                      { icon: <Calendar className="w-5 h-5" />, label: "Validity", value: item.validity },
                      { icon: <CheckCircle className="w-5 h-5" />, label: "Entries", value: item.entries },
                      { icon: <Clock className="w-5 h-5" />, label: "Processing", value: item.processingTime },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center hover:bg-[#fff3e4]/50 hover:border-[#eed6c4]/40 transition-colors duration-300 flex flex-col items-center group"
                      >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6b4f4f] shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          {spec.icon}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          {spec.label}
                        </p>
                        <p className="text-sm font-black text-[#483434] flex items-center justify-center gap-1.5">
                          {spec.flag && <span className="text-lg leading-none">{spec.flag}</span>}
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Description or Default Luxury Text */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#6b4f4f]" /> Visa Services
                  </h2>
                  <div className="text-sm text-slate-600 leading-relaxed font-light space-y-4">
                    {item.description ? (
                      item.description.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p>
                        Navigating international travel requirements can be complex, but our expert visa team 
                        is here to ensure a smooth, hassle-free process. We handle the paperwork, compliance checks, 
                        and embassy communications so you can focus on planning your trip. Benefit from our high 
                        approval rates and dedicated support for all your immigration needs.
                      </p>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Required Documents */}
                  <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6 h-full flex flex-col">
                    <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-[#6b4f4f]" /> Required Documents
                    </h2>
                    <div className="space-y-4 flex-1">
                      {item?.documents?.length > 0 ? (
                        item.documents.map((doc: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-[#eed6c4]/10 rounded-2xl border border-[#eed6c4]/20 hover:border-[#6b4f4f]/30 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#6b4f4f] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-md">
                              {idx + 1}
                            </div>
                            <span className="text-sm font-bold text-[#483434] leading-relaxed">
                              {doc}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No specific documents listed. Our team will advise you.</p>
                      )}
                    </div>
                  </section>

                  {/* Key Benefits */}
                  <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6 h-full flex flex-col">
                    <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-[#6b4f4f]" /> Key Benefits
                    </h2>
                    <div className="space-y-3 flex-1">
                      {item?.features?.length > 0 ? (
                        item.features.map((feature: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm text-[#483434] font-medium p-3 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            {feature}
                          </div>
                        ))
                      ) : (
                        <>
                          {[
                            "Expert Document Review", 
                            "Fast-Track Processing", 
                            "High Approval Rate", 
                            "Dedicated Visa Consultant"
                          ].map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 text-sm text-[#483434] font-medium p-3 rounded-xl bg-slate-50 border border-slate-100"
                            >
                              <CheckCircle className="w-5 h-5 text-[#6b4f4f] shrink-0" />
                              {feat}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* E: TRANSPORT DETAIL LAYOUT */}
            {type === "transport" && (
              <div className="space-y-10">
                {/* Main Specs Section */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eed6c4]/20 pb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-black text-[#483434] flex items-center gap-2">
                        <Car className="w-6 h-6 text-[#6b4f4f]" /> Vehicle Overview
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">Premium Ground Transportation Details</p>
                    </div>
                    <div className="bg-[#fff3e4] px-4 py-2 rounded-xl border border-[#eed6c4]/40 flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#6b4f4f] fill-[#6b4f4f]" />
                      <span className="text-xs font-black text-[#483434] tracking-wider uppercase">VIP Standard</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: <Car className="w-5 h-5" />, label: "Vehicle Type", value: item.vehicleType },
                      { icon: <MapPin className="w-5 h-5" />, label: "Service Route", value: item.type },
                      { icon: <Users className="w-5 h-5" />, label: "Max Capacity", value: item.capacity || "N/A" },
                      { icon: <Tag className="w-5 h-5" />, label: "Starting Price", value: displayPrice },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center hover:bg-[#fff3e4]/50 hover:border-[#eed6c4]/40 transition-colors duration-300 flex flex-col items-center group"
                      >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6b4f4f] shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          {spec.icon}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                          {spec.label}
                        </p>
                        <p className="text-sm font-black text-[#483434]">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Description or Default Luxury Text */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#6b4f4f]" /> The Experience
                  </h2>
                  <div className="text-sm text-slate-600 leading-relaxed font-light space-y-4">
                    {item.description ? (
                      item.description.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p>
                        Experience the pinnacle of ground transportation with our premium fleet. 
                        Whether you require a seamless airport transfer, elegant inter-city travel, 
                        or a dedicated chauffeur for Ziyarat, our meticulously maintained vehicles 
                        offer unmatched comfort, privacy, and safety. Sit back, relax, and let our 
                        professional drivers navigate while you enjoy the journey.
                      </p>
                    )}
                  </div>
                </section>

                {/* Features & Amenities (Dynamic + Static Guarantees) */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-[#6b4f4f]" /> Premium Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Database Features */}
                    {item?.features?.length > 0 ? (
                      item.features.map((feature: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm text-[#483434] font-medium p-3 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                          {feature}
                        </div>
                      ))
                    ) : (
                      /* Fallback Standard Features if DB is empty */
                      <>
                        {[
                          "Professional Chauffeur", 
                          "Air-Conditioned Cabin", 
                          "Complimentary Bottled Water", 
                          "Meet & Greet Service",
                          "Flight Tracking included",
                          "Luggage Assistance"
                        ].map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm text-[#483434] font-medium p-3 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <CheckCircle className="w-5 h-5 text-[#6b4f4f] shrink-0" />
                            {feat}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </section>
              </div>
            )}
          </main>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* SIDEBAR WIDGET (4 Columns) */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Sidebar Booking Card */}
              {type !== "blog" && (
                <div className="bg-gradient-to-br from-[#382626] to-[#251717] text-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-2xl space-y-6 relative overflow-hidden">
                  {/* Subtle top ambient glow */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed6c4]/50 to-transparent" />

                  <div>
                    <span className="text-[10px] text-[#eed6c4] font-extrabold uppercase tracking-[0.2em] block mb-1">
                      Rate / Pricing
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                        {displayPrice}
                      </span>
                      {type === "package" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / person
                        </span>
                      )}
                      {type === "transport" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / vehicle
                        </span>
                      )}
                      {type === "flight" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / passenger
                        </span>
                      )}
                      {type === "visa" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / applicant
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-[#eed6c4]/20 pt-5">
                    {/* Availability */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">
                        Availability
                      </span>
                      {item.isSold ? (
                        <span className="flex items-center gap-1.5 text-rose-400 font-extrabold uppercase tracking-wider text-[10px]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                          Sold Out
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold uppercase tracking-wider text-[10px]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Available
                        </span>
                      )}
                    </div>

                    {/* Travel Dates */}
                    {item.travelDates && (
                      <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                        <span className="text-slate-300 text-xs font-medium">
                          Travel Dates
                        </span>
                        <span className="text-[#fff3e4] text-xs font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                          {item.travelDates}
                        </span>
                      </div>
                    )}

                    {/* Accreditation */}
                    <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                      <span className="text-slate-300 font-medium">
                        Protection
                      </span>
                      <span className="text-[#eed6c4] font-extrabold uppercase tracking-widest text-[10px] bg-[#eed6c4]/10 px-2.5 py-1 rounded-md border border-[#eed6c4]/20">
                        IATA &amp; ATOL
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Booking CTA — opens modal with the inquiry form */}
                    <BookingModal
                      type={type}
                      id={id}
                      title={title}
                      isSold={item.isSold}
                    />

                    {/* Enquiry Modal + WhatsApp */}
                    <EnquirySidebar type={type} id={id} packageTitle={title} />
                  </div>

                  <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed px-1">
                    No initial payments are processed online. Our specialist
                    reservations team will contact you to verify details.
                  </p>
                </div>
              )}

              {/* Sidebar Related Articles (for SEO Interlinking) */}
              {relatedArticles.length > 0 && (
                <div className="rounded-3xl border border-[#eed6c4]/25 p-6 bg-white space-y-5">
                  <h3 className="text-xs font-heading font-black text-[#483434] uppercase tracking-[0.2em] mb-4">
                    {type === "blog" ? "Related Articles" : "Travel Guides"}
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related: any) => (
                      <Link
                        key={related.id}
                        href={`/v/${related.slug}`}
                        className="group flex gap-3.5 items-start rounded-2xl p-3 border border-[#eed6c4]/20 hover:border-[#6b4f4f]/40 hover:bg-[#eed6c4]/10 transition-all duration-300"
                      >
                        <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#6b4f4f]">
                            {related.category}
                          </span>
                          <p className="text-xs font-bold text-[#483434] leading-snug mt-0.5 group-hover:text-[#6b4f4f] transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1">
                            {related.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidebar General FAQ / Support Card */}
              <div className="rounded-3xl border border-[#eed6c4]/30 bg-[#eed6c4]/10 p-6 space-y-4">
                <h3 className="text-[10px] font-heading font-black text-[#483434] uppercase tracking-[0.2em]">
                  Our Services
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Umrah Packages",
                      href: "/umrah",
                      icon: <Building2 className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "Flights Catalog",
                      href: "/flights",
                      icon: <PlaneTakeoff className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "Visa Processing",
                      href: "/visa",
                      icon: <FileCheck className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "VIP Transport",
                      href: "/transport",
                      icon: <Car className="w-3.5 h-3.5" />,
                    },
                  ].map((srv, idx) => (
                    <Link
                      key={idx}
                      href={srv.href}
                      className="flex items-center gap-2.5 text-xs font-bold text-[#6b4f4f] hover:text-[#483434] py-1.5 hover:translate-x-0.5 transition-all duration-200"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#eed6c4]/40 flex items-center justify-center shrink-0 text-[#6b4f4f]">
                        {srv.icon}
                      </span>
                      {srv.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
