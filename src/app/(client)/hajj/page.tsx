import { Hero } from "@/components/ui/Hero";
import { Plane } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HajjBookingForm } from "@/components/hajj/HajjBookingForm";
import { HajjInfoSection } from "@/components/hajj/HajjInfoSection";
import { HajjBlogSection } from "@/components/hajj/HajjBlogSection";
import { FaqAccordion } from "@/components/hajj/FaqAccordion";
import { PackageCarousel } from "@/components/umrah/PackageCarousel";
import { headers } from "next/headers";
import { getSiteConfig, formatPrice } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hajj Packages | Terrific Travel Ltd",
  description:
    "Fulfill your sacred duty with peace of mind. Our luxury Hajj packages are carefully designed to provide comfort, guidance, and unwavering support.",
  openGraph: {
    title: "Hajj Packages | Terrific Travel Ltd",
    description: "Fulfill your sacred duty with peace of mind. Our luxury Hajj packages are carefully designed to provide comfort, guidance, and unwavering support.",
    url: "https://terrifictravel.co.uk/hajj",
  },
  twitter: {
    title: "Hajj Packages | Terrific Travel Ltd",
    description: "Fulfill your sacred duty with peace of mind. Our luxury Hajj packages are carefully designed to provide comfort, guidance, and unwavering support.",
  },
};

export const dynamic = "force-dynamic";

export default async function HajjPage() {
  const headersList = headers();
  const domain = headersList.get("x-site-domain");
  const siteConfig = getSiteConfig(domain);

  let packages = await prisma.package.findMany({
    where: { type: "HAJJ" },
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
      stars: pkg.stars || 5,
      price: formatPrice(pkg.price, siteConfig),
      detailsUrl: `/v/${pkg.slug || pkg.id}`,
      isSold: pkg.isSold,
    };
  });

  let blogs = await prisma.blog.findMany({
    where: { category: { contains: "Hajj" } },
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
    <div className="flex flex-col min-h-screen bg-[#f5f0eb]">
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Sacred Pilgrimage 2026 / 2027"
        badgeIcon={<Plane className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={
          <>
            Comfort & Guidance{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Hajj
            </span>{" "}
            Packages
          </>
        }
        description="Fulfill your sacred duty with peace of mind. Our Hajj packages are carefully designed to provide comfort, guidance, and unwavering support."
        showTrustpilot={true}
        trustpilotLabel="Pilgrims"
      />

      {/* Floating Booking Form */}
      <HajjBookingForm />

      <div className="py-8 bg-[#f5f0eb]">
        {/* Packages Carousel */}
        <PackageCarousel
          title="Featured Hajj Packages"
          subtitle="Ministry Approved"
          packages={formattedPackages}
        />
      </div>

      {/* Information Section */}
      <HajjInfoSection />

      {/* Blog Guides and Journals Section */}
      <HajjBlogSection blogs={blogs} />

      {/* FAQs Section */}
      <FaqAccordion />
    </div>
  );
}
