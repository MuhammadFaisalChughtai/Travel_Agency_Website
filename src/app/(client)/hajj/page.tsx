import { PackageCard } from "@/components/ui/PackageCard";
import { Hero } from "@/components/ui/Hero";
import { Plane } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Hajj Packages | Terrific Travel",
  description: "Fulfill your sacred duty with peace of mind. Our luxury Hajj packages are carefully designed to provide comfort, guidance, and unwavering support.",
};

const MOCK_HAJJ_PACKAGES = [
  {
    id: "hajj-1",
    title: "VIP Non-Shifting Hajj Package",
    destination: "Makkah, Mina, Arafat, Madinah",
    duration: "21 Days",
    price: 8500,
    imageUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    type: "HAJJ"
  },
  {
    id: "hajj-2",
    title: "Standard Shifting Hajj Package",
    destination: "Makkah, Mina, Arafat, Madinah",
    duration: "28 Days",
    price: 6500,
    imageUrl: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    type: "HAJJ"
  }
];

export default async function HajjPage() {
  let packages = await prisma.package.findMany({
    where: { type: "HAJJ" },
    orderBy: { price: "asc" }
  });

  if (packages.length === 0) {
    // Auto-seed database Hajj packages from Mock data
    for (const pkg of MOCK_HAJJ_PACKAGES) {
      try {
        await prisma.package.create({
          data: {
            id: pkg.id,
            title: pkg.title,
            type: "HAJJ",
            destination: pkg.destination,
            duration: pkg.duration,
            price: pkg.price,
            description: "Fulfill your sacred duty with peace of mind. Our Hajj packages are carefully designed to provide comfort, guidance, and unwavering support.",
            includedServices: "[]",
            images: JSON.stringify([pkg.imageUrl]),
            travelDates: "Flexible departures throughout 2026/27",
            availability: true,
            isSold: false,
            stars: 5,
          }
        });
      } catch (err) {
        console.warn(`Seeding package ${pkg.id} failed or already exists:`, err);
      }
    }

    // Refetch packages
    packages = await prisma.package.findMany({
      where: { type: "HAJJ" },
      orderBy: { price: "asc" }
    });
  }

  const formattedPackages = packages.map((pkg) => {
    let imageUrl = "";
    try {
      const images = JSON.parse(pkg.images);
      imageUrl = images[0] || "";
    } catch {
      imageUrl = pkg.images;
    }
    return {
      id: pkg.id,
      title: pkg.title,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      imageUrl,
      type: pkg.type,
      isSold: pkg.isSold,
    };
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Sacred Pilgrimage 2026"
        badgeIcon={<Plane className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={<>Comfort & Guidance <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">Hajj</span> Packages</>}
        description="Fulfill your sacred duty with peace of mind. Our Hajj packages are carefully designed to provide comfort, guidance, and unwavering support."
        showTrustpilot={true}
        trustpilotLabel="Pilgrims"
      />

      {/* Package Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formattedPackages.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}
