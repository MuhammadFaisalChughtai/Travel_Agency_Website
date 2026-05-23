import { PrismaClient } from "@prisma/client";
import { blogPostsData } from "../src/lib/blogData";

const prisma = new PrismaClient();

const staticFlights = {
  "f-1": {
    airline: "Emirates",
    airlineCode: "EK",
    departure: "London Heathrow",
    departureCode: "LHR",
    destination: "Dubai",
    destinationCode: "DXB",
    date: "Oct 15, 2026",
    duration: "7h 00m",
    type: "Direct",
    price: 450,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    baggage: "30kg Checked, 7kg Cabin",
    aircraft: "Boeing 777-300ER",
  },
  "f-2": {
    airline: "British Airways",
    airlineCode: "BA",
    departure: "Manchester",
    departureCode: "MAN",
    destination: "Jeddah",
    destinationCode: "JED",
    date: "Nov 02, 2026",
    duration: "6h 35m",
    type: "Direct",
    price: 620,
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
    baggage: "23kg Checked, 23kg Cabin",
    aircraft: "Boeing 787 Dreamliner",
  },
  "f-3": {
    airline: "Qatar Airways",
    airlineCode: "QR",
    departure: "London Gatwick",
    departureCode: "LGW",
    destination: "Maldives",
    destinationCode: "MLE",
    date: "Dec 10, 2026",
    duration: "11h 20m",
    type: "1 Stop (Doha)",
    price: 850,
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
    baggage: "25kg Checked, 7kg Cabin",
    aircraft: "Airbus A350-900",
  },
  "f-4": {
    airline: "Saudi Arabian Airlines",
    airlineCode: "SV",
    departure: "London Heathrow",
    departureCode: "LHR",
    destination: "Madinah",
    destinationCode: "MED",
    date: "Jan 08, 2027",
    duration: "6h 20m",
    type: "Direct",
    price: 530,
    image: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?auto=format&fit=crop&w=1200&q=80",
    baggage: "46kg (2x23kg) Checked, 7kg Cabin",
    aircraft: "Boeing 777-300ER",
  },
  "f-5": {
    airline: "Turkish Airlines",
    airlineCode: "TK",
    departure: "Birmingham",
    departureCode: "BHX",
    destination: "Istanbul",
    destinationCode: "IST",
    date: "Feb 14, 2027",
    duration: "4h 05m",
    type: "Direct",
    price: 290,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    baggage: "20kg Checked, 8kg Cabin",
    aircraft: "Airbus A321neo",
  },
  "f-6": {
    airline: "Oman Air",
    airlineCode: "WY",
    departure: "London Heathrow",
    departureCode: "LHR",
    destination: "Muscat",
    destinationCode: "MCT",
    date: "Mar 20, 2027",
    duration: "7h 45m",
    type: "Direct",
    price: 480,
    image: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?auto=format&fit=crop&w=1200&q=80",
    baggage: "30kg Checked, 7kg Cabin",
    aircraft: "Boeing 787-9 Dreamliner",
  },
};

const staticVisas = {
  "visa-saudi": {
    country: "Saudi Arabia",
    type: "Umrah & Tourist Visa",
    processingTime: "24–48 Hours",
    price: 150,
    requiredDocuments: "Clear passport bio page scan, Passport sized photo, Proof of address",
  },
  "visa-uae": {
    country: "UAE / Dubai",
    type: "30-Day Tourist Visa",
    processingTime: "24–72 Hours",
    price: 120,
    requiredDocuments: "Passport scan, Passport photo, UK Residence permit",
  },
  "visa-uae-60": {
    country: "UAE / Dubai",
    type: "60-Day Tourist Visa",
    processingTime: "24–72 Hours",
    price: 195,
    requiredDocuments: "Passport scan, Passport photo, UK Residence permit",
  },
};

const staticTransports = {
  "t-jed-mak": {
    type: "AIRPORT_TRANSFER",
    vehicleType: "GMC Yukon / Similar (VIP)",
    price: 120,
  },
  "t-mak-med": {
    type: "HOTEL_TRANSFER",
    vehicleType: "GMC Yukon / Similar (VIP)",
    price: 250,
  },
  "t-med-jed": {
    type: "AIRPORT_TRANSFER",
    vehicleType: "GMC Yukon / Similar (VIP)",
    price: 220,
  },
};

async function main() {
  console.log("Seeding static data...");

  // Seed Blogs
  for (const post of blogPostsData) {
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        readTime: post.readTime,
        date: post.date,
        image: post.image,
      },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        readTime: post.readTime,
        date: post.date,
        image: post.image,
      },
    });
  }
  console.log("Seeded blogs");

  // Seed Flights
  for (const [id, f] of Object.entries(staticFlights)) {
    await prisma.flight.upsert({
      where: { id },
      update: {},
      create: {
        id,
        airline: f.airline,
        airlineCode: f.airlineCode,
        departure: f.departure,
        departureCode: f.departureCode,
        destination: f.destination,
        destinationCode: f.destinationCode,
        price: f.price,
        duration: f.duration,
        baggage: f.baggage,
        aircraft: f.aircraft,
        isTransit: f.type.includes("Stop"),
        transitAirport: f.type.includes("Stop") ? f.type.replace("1 Stop (", "").replace(")", "") : null,
      },
    });
  }
  console.log("Seeded flights");

  // Seed Visas
  for (const [id, v] of Object.entries(staticVisas)) {
    await prisma.visaService.upsert({
      where: { id },
      update: {},
      create: {
        id,
        country: v.country,
        visaType: v.type,
        processingTime: v.processingTime,
        price: v.price,
        requiredDocuments: v.requiredDocuments,
      },
    });
  }
  console.log("Seeded visas");

  // Seed Transports
  for (const [id, t] of Object.entries(staticTransports)) {
    await prisma.transportService.upsert({
      where: { id },
      update: {},
      create: {
        id,
        type: t.type,
        vehicleType: t.vehicleType,
        price: t.price,
      },
    });
  }
  console.log("Seeded transports");

  console.log("Static data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
