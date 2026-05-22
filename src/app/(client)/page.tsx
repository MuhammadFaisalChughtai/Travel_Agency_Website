import { HeroSection } from "@/components/home/HeroSection";
import { TrustpilotReviews } from "@/components/home/TrustpilotReviews";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { TrendingFlightsSection } from "@/components/flights/TrendingFlightsSection";
import { PackageCard } from "@/components/umrah/PackageCard";
import { prisma } from "@/lib/prisma";

// Utility to shuffle an array
function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
const AIRLINE_PARTNERS = [
  "Emirates",
  "Qatar Airways",
  "British Airways",
  "Saudi Airlines",
  "Turkish Airlines",
  "Etihad",
  "Oman Air",
];
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
      detailsUrl: `/view/package/${pkg.id}`,
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

      {/* Featured Packages Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
              Featured Umrah Packages
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
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

      {/* ─── Airline Partners ─── */}
      <div className="bg-[#382626] py-12 border-b border-[#eed6c4]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 text-center">
          <p className="text-[#eed6c4] text-[10px] font-bold uppercase tracking-[0.3em]">
            Partnering With Top Global Airlines
          </p>
        </div>
        <div className="flex gap-8 md:gap-16 items-center justify-center flex-wrap max-w-6xl mx-auto px-6 opacity-70">
          {AIRLINE_PARTNERS.map((partner) => (
            <span
              key={partner}
              className="text-white font-heading font-black text-xl md:text-2xl tracking-tighter uppercase"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

      {/* Blog Section grouped by Categories */}
      <HomeBlogSection blogsByCategory={blogsByCategory} />
      {/* Trustpilot Reviews Section */}
      <TrustpilotReviews />
    </div>
  );
}
