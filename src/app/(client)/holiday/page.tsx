import { Hero } from "@/components/ui/Hero";
import { Plane } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HolidayBookingForm } from "@/components/holiday/HolidayBookingForm";
import { HolidayInfoSection } from "@/components/holiday/HolidayInfoSection";
import { HolidayBlogSection } from "@/components/holiday/HolidayBlogSection";
import { FaqAccordion } from "@/components/holiday/FaqAccordion";
import { PackageCarousel } from "@/components/umrah/PackageCarousel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Packages | Terrific Travel Ltd",
  description:
    "Discover the world's most breathtaking destinations. Handpicked luxury holiday experiences tailored just for you.",
  openGraph: {
    title: "Holiday Packages | Terrific Travel Ltd",
    description: "Discover the world's most breathtaking destinations. Handpicked luxury holiday experiences tailored just for you.",
    url: "https://terrifictravel.co.uk/packages",
  },
  twitter: {
    title: "Holiday Packages | Terrific Travel Ltd",
    description: "Discover the world's most breathtaking destinations. Handpicked luxury holiday experiences tailored just for you.",
  },
};



export default async function PackagesPage() {
  let packages = await prisma.package.findMany({
    where: { type: "HOLIDAY" },
    orderBy: { price: "asc" },
  });

  const formattedPackages = packages.map((pkg) => {
    let image = "";
    try {
      const images = JSON.parse(pkg.images);
      image = images[0] || "";
    } catch {
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

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f0eb]">
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Bespoke Travel Curation"
        badgeIcon={<Plane className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={
          <>
            Tailored{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Holiday
            </span>{" "}
            Packages
          </>
        }
        description="Discover the world's most breathtaking destinations. Handpicked holiday experiences tailored just for you."
        showTrustpilot={true}
        trustpilotLabel="Travellers"
      />

      {/* Floating Booking Form */}
      <HolidayBookingForm />

      <div className="py-8 bg-[#f5f0eb]">
        {/* Packages Carousel */}
        <PackageCarousel
          title="Featured Holiday Packages"
          subtitle="Curated Escapes"
          packages={formattedPackages}
        />
      </div>

      {/* Information Section */}
      <HolidayInfoSection />

      {/* Blog Guides and Journals Section */}
      <HolidayBlogSection blogs={blogs} />

      {/* FAQs Section */}
      <FaqAccordion />
    </div>
  );
}
