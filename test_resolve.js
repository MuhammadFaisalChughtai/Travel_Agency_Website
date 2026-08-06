const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function resolveItem(slug) {
  const parseArr = (raw) => {
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return raw
        .split(",")
        .map((s) => s.trim())
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
        slug: dbPackage.slug,
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
        meccaHotel: dbPackage.meccaHotel,
        meccaNights: dbPackage.meccaNights,
        meccaRoomType: dbPackage.meccaRoomType,
        medinaHotel: dbPackage.medinaHotel,
        medinaNights: dbPackage.medinaNights,
        medinaRoomType: dbPackage.medinaRoomType,
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

  // 3. Try Database: Flight (by slug or ID)
  try {
    let dbFlight = await prisma.flight.findUnique({ where: { slug } });
    if (!dbFlight) {
      dbFlight = await prisma.flight.findUnique({ where: { id: slug } });
    }
    if (dbFlight) {
      return {
        id: dbFlight.id,
        itemType: "flight",
        slug: dbFlight.slug,
        country: dbFlight.country,
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

  return null;
}

async function run() {
  const res = await resolveItem("079ff3bd-6014-11f1-8249-6afcf4d04328");
  console.log("resolveItem result:");
  console.log(res);
}

run();
