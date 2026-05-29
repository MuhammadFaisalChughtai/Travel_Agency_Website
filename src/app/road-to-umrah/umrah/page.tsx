import { Hero } from "@/components/ui/Hero";
import { Sparkles } from "lucide-react";
import { UmrahBookingForm } from "@/components/roadtoumrah/umrah/UmrahBookingForm";
import { PackageCarousel } from "@/components/roadtoumrah/umrah/PackageCarousel";
import { UmrahInfoSection } from "@/components/roadtoumrah/umrah/UmrahInfoSection";
import { UmrahBlogSection } from "@/components/roadtoumrah/umrah/UmrahBlogSection";
import { FaqAccordion } from "@/components/roadtoumrah/umrah/FaqAccordion";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getSiteConfig, formatPrice } from "@/lib/siteConfig";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Umrah Packages | Terrific Travel Ltd",
  description:
    "Affordable Umrah packages from the UK for families, groups, and individuals. Our all-inclusive deals cover flights, hotels, visas, and transport.",
  openGraph: {
    title: "Umrah Packages | Terrific Travel Ltd",
    description: "Affordable Umrah packages from the UK for families, groups, and individuals. Our all-inclusive deals cover flights, hotels, visas, and transport.",
    url: "https://terrifictravel.co.uk/umrah",
  },
  twitter: {
    title: "Umrah Packages | Terrific Travel Ltd",
    description: "Affordable Umrah packages from the UK for families, groups, and individuals. Our all-inclusive deals cover flights, hotels, visas, and transport.",
  },
};

export default async function UmrahPage() {
  const headersList = headers();
  const domain = headersList.get("x-site-domain");
  const siteConfig = getSiteConfig(domain);

  const allPackages = await prisma.package.findMany({
    where: { type: "UMRAH" },
    orderBy: { price: "asc" },
  });

  const formatPackages = (stars: number) => {
    return allPackages
      .filter((pkg) => pkg.stars === stars)
      .map((pkg) => {
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
        };
      });
  };

  const threeStarPackages = formatPackages(3);
  const fourStarPackages = formatPackages(4);
  const fiveStarPackages = formatPackages(5);

  let blogs = await prisma.blog.findMany({
    where: { category: { contains: "Umrah" } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (blogs.length < 3) {
    const existingIds = blogs.map((b) => b.id);
    const fallbackBlogs = await prisma.blog.findMany({
      where: { id: { notIn: existingIds } },
      take: 3 - blogs.length,
      orderBy: { createdAt: "desc" },
    });
    blogs = [...blogs, ...fallbackBlogs];
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Sacred Journeys 2026"
        badgeIcon={<Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />}
        title={
          <>
            Elite{" "}
            <span className="text-[#D4AF37] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Umrah
            </span>{" "}
            Packages
          </>
        }
        description="Experience spiritual fulfillment with bespoke travel curation, premium accommodations steps from the Haram, and VIP logistics."
        showTrustpilot={true}
      />

      {/* Floating Booking Form */}
      <UmrahBookingForm />

      <div className="py-8 bg-background">
        {/* 3 Star Packages Carousel */}
        <PackageCarousel
          title="3 Star Umrah Packages"
          subtitle="All-Inclusive"
          packages={threeStarPackages}
        />

        {/* 4 Star Packages Carousel */}
        <div className="mt-8 bg-accent-light py-8 border-y border-accent/20">
          <PackageCarousel
            title="4 Star Umrah Packages"
            subtitle="All-Inclusive"
            packages={fourStarPackages}
          />
        </div>

        {/* 5 Star Packages Carousel */}
        <div className="mt-8 py-8 bg-background">
          <PackageCarousel
            title="5 Star Umrah Packages"
            subtitle="Premium All-Inclusive"
            packages={fiveStarPackages}
          />
        </div>
      </div>

      {/* Information Section */}
      <UmrahInfoSection />

      {/* Blog Guides and Journals Section */}
      <UmrahBlogSection blogs={blogs} />

      {/* FAQs Section */}
      <FaqAccordion />
    </div>
  );
}
