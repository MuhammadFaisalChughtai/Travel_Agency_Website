import { HeroSection } from "@/components/home/HeroSection";
import { TrustpilotReviews } from "@/components/home/TrustpilotReviews";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { TrendingFlightsSection } from "@/components/flights/TrendingFlightsSection";
import { PackageCard } from "@/components/umrah/PackageCard";
import { prisma } from "@/lib/prisma";
import { AirlineMarquee } from "@/components/home/AirlineMarquee";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terrific Travel Ltd | Holidays, Umrah & Flights from the UK",
  description:
    "Book unforgettable holidays, low-cost Umrah and Hajj packages, global flights, and premium transport with Terrific Travel Ltd. ATOL protected.",
  openGraph: {
    title: "Terrific Travel Ltd | Holidays, Umrah & Flights from the UK",
    description:
      "Book unforgettable holidays, low-cost Umrah and Hajj packages, global flights, and premium transport with Terrific Travel Ltd. ATOL protected.",
    url: "https://terrifictravel.co.uk",
  },
  twitter: {
    title: "Terrific Travel Ltd | Holidays, Umrah & Flights from the UK",
    description:
      "Book unforgettable holidays, low-cost Umrah and Hajj packages, global flights, and premium transport with Terrific Travel Ltd. ATOL protected.",
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
  const trendingFlights = await (prisma as any).trendingFlight.findMany({
    orderBy: { createdAt: "desc" },
  });

  const featuredUmrahPackages = await prisma.package.findMany({
    where: { type: "UMRAH" },
    orderBy: { price: "asc" },
    take: 6,
  });

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
      price: `£${pkg.price}`,
      detailsUrl: `/v/${pkg.slug || pkg.id}`,
      isSold: pkg.isSold,
    };
  });

  const featuredHolidayPackages = await prisma.package.findMany({
    where: { type: "HOLIDAY" },
    orderBy: { price: "asc" },
    take: 6,
  });

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
      price: `£${pkg.price}`,
      detailsUrl: `/v/${pkg.slug || pkg.id}`,
      isSold: pkg.isSold,
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
      <div className="pt-12 bg-white">
        <TrendingFlightsSection routes={trendingFlights} />
      </div>

      {/* Featured Holiday Packages Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 flex flex-col items-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
              Luxury Getaways
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#483434] tracking-tight">
              Featured Holiday Packages
            </h2>
            <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Discover breathtaking destinations and handpicked luxury holiday
              experiences.
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 flex flex-col items-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
              Spiritual Journeys
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#483434] tracking-tight">
              Featured Umrah Packages
            </h2>
            <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Explore our handpicked selection of premium spiritual journeys at
              the lowest prices.
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section grouped by Categories */}
      <HomeBlogSection blogsByCategory={blogsByCategory} />
      {/* ─── Airline Partners ─── */}
      <AirlineMarquee />
      {/* Trustpilot Reviews Section */}
      <TrustpilotReviews />
    </div>
  );
}
