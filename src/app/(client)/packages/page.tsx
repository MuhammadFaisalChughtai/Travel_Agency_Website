import { PackageCard } from "@/components/ui/PackageCard";
import { Hero } from "@/components/ui/Hero";
import { Plane } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Holiday Packages | Terrific Travel",
  description: "Discover the world's most breathtaking destinations. Handpicked luxury holiday experiences tailored just for you.",
};

const MOCK_PACKAGES = [
  {
    id: "pkg-1",
    title: "Maldives Luxury Escape",
    destination: "Maldives",
    duration: "7 Days, 6 Nights",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    type: "HOLIDAY"
  },
  {
    id: "pkg-2",
    title: "Dubai City Break",
    destination: "Dubai, UAE",
    duration: "5 Days, 4 Nights",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    type: "HOLIDAY"
  },
  {
    id: "pkg-3",
    title: "Swiss Alps Adventure",
    destination: "Switzerland",
    duration: "10 Days, 9 Nights",
    price: 1599,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    type: "HOLIDAY"
  }
];

export default async function PackagesPage() {
  let packages = await prisma.package.findMany({
    where: { type: "HOLIDAY" },
    orderBy: { price: "asc" }
  });

  if (packages.length === 0) {
    // Auto-seed Holiday packages in database from Mock data
    for (const pkg of MOCK_PACKAGES) {
      try {
        await prisma.package.create({
          data: {
            id: pkg.id,
            title: pkg.title,
            type: "HOLIDAY",
            destination: pkg.destination,
            duration: pkg.duration,
            price: pkg.price,
            description: "Discover the world's most breathtaking destinations. Handpicked holiday experiences tailored just for you.",
            includedServices: "[]",
            images: JSON.stringify([pkg.imageUrl]),
            travelDates: "Flexible departures throughout 2026/27",
            availability: true,
            isSold: false,
            stars: 5,
          }
        });
      } catch (err) {
        console.warn(`Seeding holiday package ${pkg.id} failed or already exists:`, err);
      }
    }

    // Refetch packages
    packages = await prisma.package.findMany({
      where: { type: "HOLIDAY" },
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
        backgroundImage="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Bespoke Travel Curation"
        badgeIcon={<Plane className="w-3.5 h-3.5 text-[#eed6c4]" />}
        title={<>Tailored <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">Holiday</span> Packages</>}
        description="Discover the world's most breathtaking destinations. Handpicked holiday experiences tailored just for you."
        showTrustpilot={true}
        trustpilotLabel="Travellers"
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
