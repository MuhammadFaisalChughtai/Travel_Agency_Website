import { HeroSection } from "@/components/roadtoumrah/home/HeroSection";
import { TrustpilotReviews } from "@/components/roadtoumrah/home/TrustpilotReviews";
import { HomeBlogSection } from "@/components/roadtoumrah/home/HomeBlogSection";
import { EssentialServicesSection } from "@/components/roadtoumrah/home/EssentialServicesSection";
import { TrendingFlightsSection } from "@/components/roadtoumrah/flights/TrendingFlightsSection";
import { PackageCard } from "@/components/roadtoumrah/umrah/PackageCard";
import { prisma } from "@/lib/prisma";
import { AirlineMarquee } from "@/components/roadtoumrah/home/AirlineMarquee";
import { headers } from "next/headers";
import { getSiteConfig, formatPrice } from "@/lib/siteConfig";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const UmrahBanner = dynamic(
  () => import("@/components/roadtoumrah/home/UmrahBanner").then((mod) => mod.UmrahBanner),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Road To Umrah | Holidays, Umrah & Flights from the UK",
  description:
    "Book unforgettable holidays, low-cost Umrah and Hajj packages, global flights, and premium transport with Road To Umrah. ATOL protected.",
  openGraph: {
    title: "Road To Umrah | Holidays, Umrah & Flights from the UK",
    description:
      "Book unforgettable holidays, low-cost Umrah and Hajj packages, global flights, and premium transport with Road To Umrah. ATOL protected.",
    url: "https://roadtoumrah.co.uk",
  },
  twitter: {
    title: "Road To Umrah | Holidays, Umrah & Flights from the UK",
    description:
      "Book unforgettable holidays, low-cost Umrah and Hajj packages, global flights, and premium transport with Road To Umrah. ATOL protected.",
  },
};

// Utility to shuffle an array
function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
export default async function Home() {
  const headersList = headers();
  const domain = headersList.get("x-site-domain");
  const siteConfig = getSiteConfig(domain);

  const rawTrendingFlights = siteConfig.allowedTabs.includes("flight")
    ? await (prisma as any).trendingFlight.findMany({
        orderBy: { createdAt: "desc" },
      })
    : [];

  const trendingFlights = rawTrendingFlights.map((flight: any) => ({
    ...flight,
    price: formatPrice(flight.price, siteConfig),
    originalPrice: formatPrice(flight.price * 1.25, siteConfig),
  }));

  const featuredUmrahPackages = siteConfig.allowedTabs.includes("umrah")
    ? await prisma.package.findMany({
        where: { type: { in: ["UMRAH", "Cruise_Umrah"] } },
        orderBy: { createdAt: "desc" },
        take: 6,
      })
    : [];

  const formattedUmrahPackages = featuredUmrahPackages.map((pkg: any) => {
    let image = "";
    try {
      const images = JSON.parse(pkg.images);
      image = images[0] || "";
    } catch (e) {
      image = pkg.images;
    }

    return {
      id: pkg.id,
      title: pkg.title,
      image,
      stars: pkg.stars || 3,
      price: formatPrice(pkg.price, siteConfig),
      detailsUrl: `/v/${pkg.slug || pkg.id}`,
      isSold: pkg.isSold,
      travelDates: pkg.travelDates,
    };
  });

  const featuredHolidayPackages = siteConfig.allowedTabs.includes("holiday")
    ? await prisma.package.findMany({
        where: { type: "HOLIDAY" },
        orderBy: { createdAt: "desc" },
        take: 6,
      })
    : [];

  const formattedHolidayPackages = featuredHolidayPackages.map((pkg: any) => {
    let image = "";
    try {
      const images = JSON.parse(pkg.images);
      image = images[0] || "";
    } catch (e) {
      image = pkg.images;
    }

    return {
      id: pkg.id,
      title: pkg.title,
      image,
      stars: pkg.stars || 4,
      price: formatPrice(pkg.price, siteConfig),
      detailsUrl: `/v/${pkg.slug || pkg.id}`,
      isSold: pkg.isSold,
      travelDates: pkg.travelDates,
    };
  });

  // Fetch all blogs
  const allBlogs = await prisma.blog.findMany();
  //
  // Group by category and take up to 6 random blogs per category
  const blogsByCategory: Record<string, any[]> = {};
  allBlogs.forEach((blog: any) => {
    if (!blogsByCategory[blog.category]) {
      blogsByCategory[blog.category] = [];
    }
    blogsByCategory[blog.category].push(blog);
  });

  // Shuffle and slice
  for (const cat in blogsByCategory) {
    blogsByCategory[cat] = shuffleArray(blogsByCategory[cat]).slice(0, 6);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Trending Flights Section */}
      {siteConfig.allowedTabs.includes("flight") &&
        trendingFlights.length > 0 && (
          <div className="pt-12 bg-white">
            <TrendingFlightsSection routes={trendingFlights} />
          </div>
        )}

      {/* Featured Holiday Packages Section */}
      {siteConfig.allowedTabs.includes("holiday") &&
        formattedHolidayPackages.length > 0 && (
          <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16 flex flex-col items-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#064e3b] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
                  Luxury Getaways
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-black text-[#064e3b] tracking-tight">
                  Featured Holiday Packages
                </h2>
                <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                  Discover breathtaking destinations and handpicked luxury
                  holiday experiences.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formattedHolidayPackages.map((pkg: any) => (
                  <PackageCard
                    key={pkg.id}
                    title={pkg.title}
                    image={pkg.image}
                    stars={pkg.stars}
                    price={pkg.price}
                    detailsUrl={pkg.detailsUrl}
                    isSold={pkg.isSold}
                    travelDates={pkg.travelDates}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Featured Packages Section */}
      {siteConfig.allowedTabs.includes("umrah") &&
        formattedUmrahPackages.length > 0 && (
          <>
            <UmrahBanner />
            <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16 flex flex-col items-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#064e3b] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
                  Spiritual Journeys
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-black text-[#064e3b] tracking-tight">
                  Featured Umrah Packages
                </h2>
                <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                  Explore our handpicked selection of premium spiritual journeys
                  at the lowest prices.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formattedUmrahPackages.map((pkg: any) => (
                  <PackageCard
                    key={pkg.id}
                    title={pkg.title}
                    image={pkg.image}
                    stars={pkg.stars}
                    price={pkg.price}
                    detailsUrl={pkg.detailsUrl}
                    isSold={pkg.isSold}
                    travelDates={pkg.travelDates}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-12">
                <Link
                  href="/umrah"
                  className="px-8 py-3.5 bg-[#064e3b] hover:bg-[#043427] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg border border-[#d4af37]/30 flex items-center gap-2"
                >
                  <span>View All Umrah Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
          </>
        )}

      <EssentialServicesSection siteConfig={siteConfig} />

      {/* Blog Section grouped by Categories */}
      <HomeBlogSection blogsByCategory={blogsByCategory} />

      {/* Airline Partners */}
      {siteConfig.allowedTabs.includes("flight") && <AirlineMarquee />}

      {/* Trustpilot Reviews Section */}
      <TrustpilotReviews />
    </div>
  );
}
