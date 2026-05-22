import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  BookOpen,
  PlaneTakeoff,
  PlaneLanding,
  FileCheck,
  Car,
  Users,
  ShieldCheck,
  MapPin,
  Building2,
  DollarSign,
  Bus,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Award,
  Star,
} from "lucide-react";
import { getBlogBySlug, blogPostsData } from "@/lib/blogData";
import { prisma } from "@/lib/prisma";
import { UmrahBookingForm } from "@/components/umrah/UmrahBookingForm";
import { EnquirySidebar } from "@/components/view/EnquirySidebar";
import { Hero } from "@/components/ui/Hero";

export const revalidate = 0; // Disable static rendering caching to allow dynamic prisma lookups

// ────────────────────────────────────────────────────────────────────────
// MOCK DATA FALLBACKS
// ────────────────────────────────────────────────────────────────────────

const staticPackages: Record<string, any> = {
  // 3 Star Umrah
  "3star-7": {
    title: "7 Nights 3 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "7 Nights, 8 Days",
    price: 590,
    imageUrl:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Our basic 7 Nights 3 Star Umrah package is designed for pilgrims seeking a comfortable and budget-friendly spiritual journey. This package includes accommodation close to the holy mosques, airport transfers, and visa processing.",
    includedServices: [
      "3-Star Hotel in Makkah (4 Nights)",
      "3-Star Hotel in Madinah (3 Nights)",
      "Umrah Visa Processing",
      "Ziyarat Tours in Makkah & Madinah",
      "Ground Transport in VIP Buses",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 3,
  },
  "3star-10": {
    title: "10 Nights 3 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "10 Nights, 11 Days",
    price: 630,
    imageUrl:
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Enjoy a balanced 10-night pilgrimage with our budget-friendly 3-star package. Take your time to pray in Masjid al-Haram and Masjid al-Nabawi with hotels located within short walking distance.",
    includedServices: [
      "3-Star Hotel in Makkah (6 Nights)",
      "3-Star Hotel in Madinah (4 Nights)",
      "Umrah Visa Processing",
      "Ziyarat Tours in Makkah & Madinah",
      "Ground Transport in VIP Buses",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 3,
  },
  "3star-14": {
    title: "14 Nights 3 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "14 Nights, 15 Days",
    price: 730,
    imageUrl:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Spend a full two weeks in the holy land. Our 14 Nights 3 Star Umrah package offers ample time for devotion, Quran completion, and visiting historical ziyarat sites.",
    includedServices: [
      "3-Star Hotel in Makkah (8 Nights)",
      "3-Star Hotel in Madinah (6 Nights)",
      "Umrah Visa Processing",
      "Ziyarat Tours in both holy cities",
      "Ground Transport in VIP Buses",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 3,
  },
  "3star-12": {
    title: "12 Nights 3 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "12 Nights, 13 Days",
    price: 725,
    imageUrl:
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80",
    description:
      "A perfect 12-night spiritual retreat. Features all essential logistics arranged beforehand so you can focus entirely on your worship and prayers.",
    includedServices: [
      "3-Star Hotel in Makkah (7 Nights)",
      "3-Star Hotel in Madinah (5 Nights)",
      "Umrah Visa Processing",
      "Ziyarat Tours",
      "Ground Transport in VIP Buses",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 3,
  },
  "3star-family": {
    title: "3 Star Family Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "10-14 Nights",
    price: 920,
    imageUrl:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Customized specifically for families traveling with children or elderly members. Features adjoining rooms, family-friendly transport, and expert guides.",
    includedServices: [
      "Adjoining 3-Star Family Rooms",
      "Umrah Visa Processing",
      "Private Family Transport",
      "Guided Ziyarat Tours",
      "Kids Activity Booklet & Gifts",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 3,
  },
  // 4 Star Umrah
  "4star-7": {
    title: "7 Nights 4 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "7 Nights, 8 Days",
    price: 570,
    imageUrl:
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Experience extra comfort with our 4-star Umrah package. Enjoy premium hotels with shuttle services or short walks, outstanding buffet breakfasts, and VIP transport.",
    includedServices: [
      "4-Star Hotel in Makkah (4 Nights)",
      "4-Star Hotel in Madinah (3 Nights)",
      "Daily Buffet Breakfast",
      "Umrah Visa Processing",
      "Private SUV Airport Transfer",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 4,
  },
  "4star-5": {
    title: "5 Nights 4 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "5 Nights, 6 Days",
    price: 620,
    imageUrl:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Short on time? Perform your Umrah with ease over 5 nights in premium 4-star properties located directly on the main roads to the holy sites.",
    includedServices: [
      "4-Star Hotel in Makkah (3 Nights)",
      "4-Star Hotel in Madinah (2 Nights)",
      "Daily Buffet Breakfast",
      "Umrah e-Visa Processing",
      "Ground Transport in SUV",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 4,
  },
  "4star-14": {
    title: "14 Nights 4 Star Umrah Package",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "14 Nights, 15 Days",
    price: 755,
    imageUrl:
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Treat your family to a beautiful two-week Umrah journey. Rest in well-appointed 4-star hotels and travel between the holy cities in comfort.",
    includedServices: [
      "4-Star Hotel in Makkah (8 Nights)",
      "4-Star Hotel in Madinah (6 Nights)",
      "Daily Buffet Breakfast",
      "Umrah Visa Processing",
      "Ziyarat Tours in Makkah & Madinah",
      "VIP Transport",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 4,
  },
  // 5 Star Umrah
  "5star-7": {
    title: "7 Nights 5 Star Luxury Umrah",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "7 Nights, 8 Days",
    price: 775,
    imageUrl:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Indulge in premium comfort with luxury hotels overlooking the holy sites. Direct access to Haram courtyards, exceptional service, and VIP bullet train tickets included.",
    includedServices: [
      "5-Star Fairmont Clock Tower Makkah (4 Nights)",
      "5-Star Oberoi Madinah (3 Nights)",
      "Gourmet Daily Buffet Breakfast",
      "VIP Umrah Visa Processing",
      "Haramain High-Speed Train Tickets (First Class)",
      "VIP Chauffeur Transport",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 5,
  },
  "5star-12": {
    title: "12 Nights 5 Star Luxury Umrah",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "12 Nights, 13 Days",
    price: 950,
    imageUrl:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    description:
      "An extraordinary 12-night pilgrimage. Elevate your spiritual journey with world-class dining, luxury suites, and scholar-led historical tours.",
    includedServices: [
      "5-Star Swissôtel Makkah (7 Nights)",
      "5-Star Pullman Zamzam Madinah (5 Nights)",
      "Daily Buffet Breakfast & Dinner",
      "VIP Umrah Visa",
      "Haramain Train First Class Tickets",
      "Guided by Prominent Scholars",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 5,
  },
  "5star-14": {
    title: "14 Nights 5 Star Premium Umrah",
    type: "UMRAH",
    destination: "Makkah & Madinah",
    duration: "14 Nights, 15 Days",
    price: 1150,
    imageUrl:
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Our ultimate, all-inclusive luxury Umrah package. Experience the holy cities with maximum comfort, premium accommodations, and bespoke private tours.",
    includedServices: [
      "5-Star Pullman Zamzam Makkah (8 Nights)",
      "5-Star Anwar Al Madinah Mövenpick (6 Nights)",
      "Daily Buffet Breakfast & Dinner",
      "VIP Visa Processing",
      "Private Luxury GMC Transport",
      "Full Historical Ziyarat Tours",
    ],
    travelDates: "Flexible departures throughout 2026/27",
    stars: 5,
  },
  // Holidays
  "pkg-1": {
    title: "Maldives Luxury Escape",
    type: "HOLIDAY",
    destination: "Maldives",
    duration: "7 Days, 6 Nights",
    price: 1299,
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Escape to a paradise of white sand beaches, crystal clear lagoons, and luxurious overwater villas. Perfect for honeymoons or pure relaxation.",
    includedServices: [
      "Overwater Villa Stay (6 Nights)",
      "Speedboat Airport Transfer",
      "All-Inclusive Dining & Drinks",
      "Snorkeling Tour & Equipment",
      "24/7 Resort Assistance",
    ],
    travelDates: "Nov 2026 - April 2027 departures",
    stars: 5,
  },
  "pkg-2": {
    title: "Dubai City Break",
    type: "HOLIDAY",
    destination: "Dubai, UAE",
    duration: "5 Days, 4 Nights",
    price: 899,
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Experience the glittering cityscape of Dubai. From upscale shopping at Dubai Mall to desert safaris and historic souks.",
    includedServices: [
      "4-Star Hotel Stay (4 Nights)",
      "Daily Breakfast",
      "Burj Khalifa Entry Ticket",
      "Desert Safari with BBQ Dinner",
      "Private Airport Transfers",
    ],
    travelDates: "Year-round departures available",
    stars: 4,
  },
  "pkg-3": {
    title: "Swiss Alps Adventure",
    type: "HOLIDAY",
    destination: "Switzerland",
    duration: "10 Days, 9 Nights",
    price: 1599,
    imageUrl:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Explore the majestic peaks of Switzerland. Enjoy scenic train rides, mountain hikes, and chocolate tours in beautiful alpine villages.",
    includedServices: [
      "Boutique Alpine Hotels (9 Nights)",
      "Swiss Travel Pass (Unlimited Trains)",
      "Guided Mountain Hike",
      "Lake Lucerne Boat Cruise",
      "Chocolate Factory Tour",
    ],
    travelDates: "June 2026 - Sept 2026 departures",
    stars: 4,
  },
};

const staticFlights: Record<string, any> = {
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
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?auto=format&fit=crop&w=1200&q=80",
    baggage: "30kg Checked, 7kg Cabin",
    aircraft: "Boeing 787-9 Dreamliner",
  },
};

const staticVisas: Record<string, any> = {
  "visa-saudi": {
    country: "Saudi Arabia",
    type: "Umrah & Tourist Visa",
    flag: "",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    processingTime: "24–48 Hours",
    price: 150,
    validity: "1 Year",
    entries: "Multiple Entry",
    features: [
      "Electronic e-Visa processing",
      "Health insurance included",
      "Multiple entry permitted",
      "Valid for Umrah & tourism",
      "Expert document guidance",
    ],
    documents: [
      "Clear passport bio page scan",
      "Passport sized photo (white background)",
      "Proof of address (UK)",
    ],
  },
  "visa-uae": {
    country: "UAE / Dubai",
    type: "30-Day Tourist Visa",
    flag: "",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    processingTime: "24–72 Hours",
    price: 120,
    validity: "30 Days",
    entries: "Single Entry",
    features: [
      "Fast e-Visa issuance",
      "Minimal documentation",
      "Extension available",
      "Ideal for holidays & stopovers",
      "Dedicated visa team",
    ],
    documents: [
      "Passport scan (min 6 months validity)",
      "Passport photo",
      "UK Residence permit (if non-UK passport)",
    ],
  },
  "visa-uae-60": {
    country: "UAE / Dubai",
    type: "60-Day Tourist Visa",
    flag: "",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    processingTime: "24–72 Hours",
    price: 195,
    validity: "60 Days",
    entries: "Multiple Entry",
    features: [
      "Extended stay option",
      "Multiple re-entries allowed",
      "Business & leisure use",
      "Quick online processing",
      "24/7 support available",
    ],
    documents: [
      "Passport scan (min 6 months validity)",
      "Passport photo",
      "UK Residence permit (if applicable)",
    ],
  },
};

const staticTransports: Record<string, any> = {
  "trans-sedan": {
    title: "Private Car (Sedan)",
    type: "Private Transfer",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?auto=format&fit=crop&w=1200&q=80",
    vehicleType: "Toyota Camry / Hyundai Sonata or similar",
    price: 90,
    capacity: "Up to 3 Guests",
    features: [
      "Professional English-speaking driver",
      "Air-conditioned premium vehicle",
      "Meet & greet at arrival hall",
      "Flight tracking for delays",
      "Free 60 minutes waiting time",
      "Seats 3 comfortably with 3 bags",
    ],
  },
  "trans-suv": {
    title: "Premium GMC / SUV",
    type: "VIP Transfer",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    vehicleType: "GMC Yukon / Chevrolet Suburban or similar",
    price: 150,
    capacity: "Up to 7 Guests",
    features: [
      "VIP service with premium luxury SUV",
      "Spacious leather seating",
      "Ample room for up to 7 suitcases",
      "Complimentary water & wipes",
      "Ideal for large families",
      "Meet & greet included",
    ],
    popular: true,
  },
  "trans-minibus": {
    title: "Minibus (Coaster)",
    type: "Group Transfer",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    vehicleType: "Toyota Coaster / Hyundai H1 or similar",
    price: 290,
    capacity: "Up to 20 Guests",
    features: [
      "Designed for group Ziyarat tours",
      "Separate compartment for bags",
      "Dedicated coordinator support",
      "Customizable stopovers allowed",
      "Ideal for group packages",
      "Full AC and PA speaker system",
    ],
  },
};

// ────────────────────────────────────────────────────────────────────────
// HELPER LOOKUP FUNCTIONS (Prisma DB + Static Fallbacks)
// ────────────────────────────────────────────────────────────────────────

async function resolveItem(type: string, id: string) {
  if (type === "package") {
    // Attempt database first
    try {
      const dbPackage = await prisma.package.findUnique({ where: { id } });
      if (dbPackage) {
        const parseArr = (raw: string | null) => {
          if (!raw) return [];
          try {
            return JSON.parse(raw);
          } catch {
            return raw
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
          }
        };
        const images = parseArr(dbPackage.images);
        return {
          id: dbPackage.id,
          title: dbPackage.title,
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
          // Accommodation
          meccaHotel: dbPackage.meccaHotel,
          meccaNights: dbPackage.meccaNights,
          meccaRoomType: dbPackage.meccaRoomType,
          medinaHotel: dbPackage.medinaHotel,
          medinaNights: dbPackage.medinaNights,
          medinaRoomType: dbPackage.medinaRoomType,
          // Services
          transportation: parseArr(dbPackage.transportation),
          sightseeing: parseArr(dbPackage.sightseeing),
          visaInfo: parseArr(dbPackage.visaInfo),
          packageFeatures: parseArr(dbPackage.packageFeatures),
          metaTitle: dbPackage.metaTitle,
          metaDescription: dbPackage.metaDescription,
        };
      }
    } catch (e) {
      console.warn(
        "Prisma Package fetch failed, falling back to static mock data",
      );
    }
    const fallbackPkg = staticPackages[id] || staticPackages["5star-7"];
    return fallbackPkg
      ? { ...fallbackPkg, isSold: fallbackPkg.isSold || false }
      : null;
  }

  if (type === "flight") {
    try {
      const dbFlight = await prisma.flight.findUnique({ where: { id } });
      if (dbFlight) {
        return {
          id: dbFlight.id,
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
    } catch (e) {
      console.warn(
        "Prisma Flight fetch failed, falling back to static mock data",
      );
    }
    return staticFlights[id] || staticFlights["f-1"];
  }

  if (type === "visa") {
    return staticVisas[id] || staticVisas["visa-saudi"];
  }

  if (type === "transport") {
    return staticTransports[id] || staticTransports["trans-sedan"];
  }

  if (type === "blog") {
    let post = null;
    try {
      post = await prisma.blog.findUnique({ where: { slug: id } });
    } catch (e) {
      console.error(e);
    }
    if (!post) {
      post = getBlogBySlug(id) || blogPostsData.find((p) => p.id === id);
    }
    return post ? { ...post, isBlog: true } : null;
  }

  return null;
}

// ────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────

interface ViewPageProps {
  params: {
    type: string;
    id: string;
  };
}

export async function generateMetadata({ params }: ViewPageProps) {
  const item = await resolveItem(params.type, params.id);
  if (!item) return { title: "Item Not Found | Terrific Travel Ltd" };

  const titleText =
    item.metaTitle ||
    item.title ||
    item.country ||
    item.airline ||
    "Detail View";
  const descText =
    item.metaDescription ||
    item.description ||
    item.excerpt ||
    `Detailed view for ${titleText} with Terrific Travel Ltd UK.`;

  return {
    title: item.metaTitle ? titleText : `${titleText} | Terrific Travel Ltd`,
    description: descText,
  };
}

export default async function UniversalViewPage({ params }: ViewPageProps) {
  const { type, id } = params;
  const item = await resolveItem(type, id);

  if (!item) {
    notFound();
  }

  // Common properties
  const title =
    item.title ||
    (type === "visa"
      ? `${item.country} ${item.type}`
      : `${item.airline} flight to ${item.destination}`);
  const image =
    item.imageUrl ||
    item.image ||
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80";
  const price = item.price;
  const displayPrice = typeof price === "number" ? `£${price}` : price;

  return (
    <div className="flex flex-col min-h-screen bg-background text-[#483434]">
      {/* ─── Hero Header (Umrah Luxury Theme) ─── */}
      <Hero
        backgroundImage={image}
        badgeText={
          type === "package"
            ? "Special Package Deal"
            : type === "flight"
              ? "Verified Airline Routes"
              : type === "visa"
                ? "Accredited Visa Partner"
                : type === "transport"
                  ? "VIP Ground Transport"
                  : type === "blog"
                    ? "Spiritual Journal & Travel Guide"
                    : "Detail View"
        }
        title={title}
        description={
          type === "blog"
            ? item.excerpt || ""
            : item.description
              ? item.description.length > 150
                ? item.description.substring(0, 150) + "..."
                : item.description
              : ""
        }
        showTrustpilot={false}
        customRatingBadge={
          type !== "blog" ? (
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 font-light pt-1">
              {item.destination && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#eed6c4]" />{" "}
                  {item.destination}
                </span>
              )}
              {item.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#eed6c4]" /> {item.duration}
                </span>
              )}
              {item.stars && (
                <div className="flex gap-0.5 text-[#eed6c4]">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#eed6c4] stroke-none"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#eed6c4] font-bold uppercase tracking-widest pt-1">
              <span>{item.category}</span>
              <span>•</span>
              <span>{item.date}</span>
              <span>•</span>
              <span>{item.readTime}</span>
            </div>
          )
        }
      />

      {/* ─── Breadcrumb ─── */}
      <div className="bg-[#fff3e4] border-b border-[#eed6c4]/30 py-3.5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-2 text-xs font-bold text-[#6b4f4f] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#483434]">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link
            href={type === "blog" ? "/umrah#blog" : `/${type}s`}
            className="hover:text-[#483434]"
          >
            {type === "blog" ? "Journals" : `${type}s`}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400 truncate max-w-[200px] md:max-w-xs">
            {title}
          </span>
        </div>
      </div>

      {/* ─── Page Grid Content ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ────────────────────────────────────────────────────────────────── */}
          {/* MAIN DETAIL WINDOW (8 Columns) */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <main className="lg:col-span-8 space-y-12">
            {/* A: BLOG DETAIL LAYOUT */}
            {type === "blog" && (
              <article className="space-y-8">
                <Link
                  href="/umrah"
                  className="inline-flex items-center gap-2 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-widest hover:text-[#483434] transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Umrah Journals
                </Link>

                <p className="text-base md:text-lg font-medium text-[#483434] leading-relaxed border-l-4 border-[#6b4f4f] pl-5 bg-[#eed6c4]/15 py-4.5 pr-4 rounded-r-3xl">
                  {item.excerpt}
                </p>

                <div
                  className="prose-article"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />

                <style>{`
                  .prose-article h1, .prose-article h2, .prose-article h3, .prose-article h4, .prose-article h5, .prose-article h6 {
                    font-family: var(--font-heading);
                    color: #483434;
                    margin-top: 2rem;
                    margin-bottom: 0.8rem;
                    line-height: 1.3;
                    font-weight: 900;
                  }
                  .prose-article h1 { font-size: 1.75rem; }
                  .prose-article h2 { font-size: 1.45rem; }
                  .prose-article h3 { font-size: 1.25rem; font-weight: 800; color: #6b4f4f; }
                  .prose-article h4 { font-size: 1.1rem; font-weight: 800; color: #6b4f4f; }
                  
                  .prose-article p {
                    color: #4b5563;
                    line-height: 1.9;
                    margin-bottom: 1.2rem;
                    font-size: 1rem;
                  }
                  
                  .prose-article ul, .prose-article ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: #4b5563;
                    font-size: 1rem;
                    line-height: 1.9;
                  }
                  .prose-article ul { list-style-type: disc; }
                  .prose-article ol { list-style-type: decimal; }
                  .prose-article li { margin-bottom: 0.5rem; }
                  
                  .prose-article strong { color: #483434; font-weight: 700; }
                  .prose-article em { color: #6b4f4f; font-style: italic; }
                  
                  .prose-article a {
                    color: #6b4f4f;
                    text-decoration: underline;
                    font-weight: 600;
                  }
                  .prose-article a:hover { color: #483434; }
                  
                  .prose-article blockquote {
                    border-left: 4px solid #6b4f4f;
                    padding-left: 1.2rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #483434;
                    background: #eed6c415;
                    padding: 1rem 1.2rem;
                    border-radius: 0 0.5rem 0.5rem 0;
                  }
                  
                  .prose-article img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                    box-shadow: 0 10px 35px rgba(72,52,52,0.06);
                  }
                  
                  .prose-article iframe {
                    width: 100%;
                    min-height: 400px;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                  }
                `}</style>
              </article>
            )}

            {/* B: PACKAGE DETAIL LAYOUT */}
            {type === "package" && (
              <div className="space-y-8">
                {/* ── Always-visible: What's Included Icons ── */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)]">
                  <h2 className="text-xl font-heading font-black text-[#483434] mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#6b4f4f]" /> What's Included
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        icon: (
                          <PlaneTakeoff className="w-7 h-7 text-[#6b4f4f]" />
                        ),
                        label: "Flights",
                        sub: "Return flights from UK",
                      },
                      {
                        icon: <Building2 className="w-7 h-7 text-[#6b4f4f]" />,
                        label: "Hotel",
                        sub: `${item.stars || 3}-Star accommodation`,
                      },
                      {
                        icon: <Car className="w-7 h-7 text-[#6b4f4f]" />,
                        label: "Transport",
                        sub: "Makkah ↔ Madinah",
                      },
                      {
                        icon: <FileCheck className="w-7 h-7 text-[#6b4f4f]" />,
                        label: "Visa",
                        sub: "Umrah visa included",
                      },
                    ].map(({ icon, label, sub }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center text-center gap-3 bg-[#fff3e4] rounded-2xl p-5 border border-[#eed6c4]/40 hover:border-[#6b4f4f]/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white border border-[#eed6c4]/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          {icon}
                        </div>
                        <div>
                          <p className="font-heading font-black text-[#483434] text-sm">
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
                            {sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Journey Steps ── */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)]">
                  <h2 className="text-xl font-heading font-black text-[#483434] mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#6b4f4f]" /> Your Journey
                  </h2>
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-8 left-8 right-8 h-[2px] bg-gradient-to-r from-[#eed6c4] via-[#6b4f4f]/30 to-[#eed6c4] hidden md:block" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                      {[
                        {
                          step: "01",
                          icon: <PlaneTakeoff className="w-5 h-5" />,
                          label: "Departure",
                          sub: "UK Airport",
                        },
                        {
                          step: "02",
                          icon: <Building2 className="w-5 h-5" />,
                          label: "Makkah",
                          sub: "Hotel Check-in",
                        },
                        {
                          step: "03",
                          icon: <Bus className="w-5 h-5" />,
                          label: "Madinah",
                          sub: "Transfer & Stay",
                        },
                        {
                          step: "04",
                          icon: <PlaneLanding className="w-5 h-5" />,
                          label: "Return",
                          sub: "Back to UK",
                        },
                      ].map(({ step, icon, label, sub }) => (
                        <div
                          key={step}
                          className="flex flex-col items-center text-center gap-2"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6b4f4f] to-[#483434] flex items-center justify-center text-white shadow-lg shadow-[#6b4f4f]/20 relative">
                            {icon}
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#eed6c4] text-[#483434] text-[9px] font-black flex items-center justify-center border border-white">
                              {step}
                            </span>
                          </div>
                          <p className="font-heading font-black text-[#483434] text-sm mt-1">
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {sub}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── Rich HTML content from editor (if any) ── */}
                {item.description && item.description.trim().length > 0 && (
                  <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)]">
                    <h2 className="text-xl font-heading font-black text-[#483434] mb-5 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#6b4f4f]" /> Package
                      Details
                    </h2>
                    <div
                      className="prose-article"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <style>{`
                      .prose-article h1, .prose-article h2, .prose-article h3, .prose-article h4 {
                        font-family: var(--font-heading);
                        color: #483434;
                        margin-top: 1.8rem;
                        margin-bottom: 0.7rem;
                        font-weight: 900;
                        line-height: 1.3;
                      }
                      .prose-article h1 { font-size: 1.6rem; }
                      .prose-article h2 { font-size: 1.35rem; border-bottom: 2px solid #eed6c4; padding-bottom: 0.4rem; }
                      .prose-article h3 { font-size: 1.15rem; color: #6b4f4f; }
                      .prose-article p { color: #4b5563; line-height: 1.9; margin-bottom: 1rem; font-size: 0.95rem; }
                      .prose-article ul, .prose-article ol { padding-left: 1.5rem; margin-bottom: 1.2rem; color: #4b5563; font-size: 0.95rem; line-height: 1.9; }
                      .prose-article ul { list-style-type: disc; }
                      .prose-article ol { list-style-type: decimal; }
                      .prose-article li { margin-bottom: 0.4rem; }
                      .prose-article strong { color: #483434; font-weight: 700; }
                      .prose-article em { color: #6b4f4f; font-style: italic; }
                      .prose-article blockquote { border-left: 4px solid #6b4f4f; background: #eed6c415; padding: 1rem 1.2rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0; font-style: italic; color: #483434; }
                      .prose-article img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 10px 35px rgba(72,52,52,0.06); }
                      .prose-article a { color: #6b4f4f; text-decoration: underline; font-weight: 600; }
                      .prose-article a:hover { color: #483434; }
                      .prose-article table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
                      .prose-article th { background: #eed6c4; color: #483434; font-weight: 700; padding: 0.6rem 1rem; text-align: left; }
                      .prose-article td { padding: 0.6rem 1rem; border-bottom: 1px solid #eed6c420; color: #4b5563; }
                      .prose-article tr:nth-child(even) td { background: #fffcf9; }
                    `}</style>
                  </section>
                )}

                {/* ── Guarantee note ── */}
                <section className="bg-[#eed6c4]/15 border border-[#eed6c4]/40 rounded-3xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#6b4f4f] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-black text-[#483434] text-base mb-1.5">
                      Sacred Journey Guarantee
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      All package pricing is based on quad/family accommodation
                      share. Dual, triple, or solo upgrades are fully
                      customizable. Flights originate from London Heathrow,
                      Manchester, or Birmingham. ATOL &amp; IATA backing ensures
                      secure reservations.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* C: FLIGHT DETAIL LAYOUT */}
            {type === "flight" && (
              <div className="space-y-10">
                {/* Outbound Journey Section */}
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-[#6b4f4f]" /> Outbound
                    Flight Path
                  </h2>

                  {/* Visual Route */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#fff3e4]/50 rounded-2xl border border-[#eed6c4]/40">
                    {/* Departure */}
                    <div className="text-center md:text-left space-y-1 min-w-[120px]">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Departure Airport
                      </p>
                      <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                        {item.departure}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                        {item.departureCode}
                      </span>
                    </div>

                    {/* Timeline connection */}
                    <div className="flex-1 flex flex-col items-center justify-center min-w-[160px] w-full px-4">
                      <span className="text-[10px] font-bold text-[#6b4f4f] uppercase tracking-widest mb-1">
                        {item.duration}
                      </span>

                      {item.isTransit ? (
                        <div className="w-full flex items-center justify-between relative px-2">
                          {/* Connection line */}
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                          {/* Left dot */}
                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                          {/* Transit node */}
                          <div className="flex flex-col items-center bg-white border border-[#eed6c4] px-2 py-0.5 rounded-full z-10 shadow-sm">
                            <span className="text-[9px] font-black text-amber-800 uppercase tracking-tight">
                              {item.transitAirport}
                            </span>
                            {item.transitDuration && (
                              <span className="text-[7px] font-semibold text-slate-400 -mt-0.5 whitespace-nowrap">
                                {item.transitDuration} layover
                              </span>
                            )}
                          </div>

                          {/* Right dot */}
                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-between relative px-2">
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                          {/* Direct marker */}
                          <div className="bg-[#6b4f4f] text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-10 uppercase tracking-widest">
                            Direct
                          </div>

                          <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="text-center md:text-right space-y-1 min-w-[120px]">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Arrival Destination
                      </p>
                      <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                        {item.destination}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                        {item.destinationCode}
                      </span>
                    </div>
                  </div>

                  {/* Outbound Parameters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Airline
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.airline} ({item.airlineCode})
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Baggage Allowance
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.baggage}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Aircraft Type
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.aircraft}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Departure Date
                      </p>
                      <p className="text-xs font-black text-[#483434] mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Return Journey Section (if enabled) */}
                {item.isReturn && (
                  <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                    <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                      <PlaneLanding className="w-5 h-5 text-[#6b4f4f]" /> Return
                      Flight Path
                    </h2>

                    {/* Visual Route */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#fff3e4]/50 rounded-2xl border border-[#eed6c4]/40">
                      {/* Return Departure (original destination) */}
                      <div className="text-center md:text-left space-y-1 min-w-[120px]">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Departure Airport
                        </p>
                        <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                          {item.destination}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                          {item.destinationCode}
                        </span>
                      </div>

                      {/* Timeline connection */}
                      <div className="flex-1 flex flex-col items-center justify-center min-w-[160px] w-full px-4">
                        <span className="text-[10px] font-bold text-[#6b4f4f] uppercase tracking-widest mb-1">
                          {item.returnDuration || item.duration}
                        </span>

                        {item.returnIsTransit ? (
                          <div className="w-full flex items-center justify-between relative px-2">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                            <div className="flex flex-col items-center bg-white border border-[#eed6c4] px-2 py-0.5 rounded-full z-10 shadow-sm">
                              <span className="text-[9px] font-black text-amber-800 uppercase tracking-tight">
                                {item.returnTransitAirport}
                              </span>
                              {item.returnTransitDuration && (
                                <span className="text-[7px] font-semibold text-slate-400 -mt-0.5 whitespace-nowrap">
                                  {item.returnTransitDuration} layover
                                </span>
                              )}
                            </div>

                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between relative px-2">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#eed6c4] z-0" />
                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />

                            <div className="bg-[#6b4f4f] text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-10 uppercase tracking-widest">
                              Direct
                            </div>

                            <div className="w-3 h-3 rounded-full border-2 border-[#6b4f4f] bg-white z-10" />
                          </div>
                        )}

                        <span className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                          {item.returnIsTransit
                            ? `1 Stop (${item.returnTransitAirport})`
                            : "Direct Flight"}
                        </span>
                      </div>

                      {/* Return Arrival (original departure) */}
                      <div className="text-center md:text-right space-y-1 min-w-[120px]">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Arrival Destination
                        </p>
                        <p className="text-sm font-heading font-black text-[#483434] leading-tight">
                          {item.departure}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 bg-[#6b4f4f] text-white text-[10px] font-black rounded-lg uppercase">
                          {item.departureCode}
                        </span>
                      </div>
                    </div>

                    {/* Return Parameters Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Airline
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnAirline || item.airline} (
                          {item.returnAirlineCode || item.airlineCode})
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Baggage Allowance
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnBaggage || item.baggage}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Aircraft Type
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnAircraft || item.aircraft}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          Return Date
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1">
                          {item.returnDate}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <section className="bg-[#eed6c4]/15 border border-[#eed6c4]/40 rounded-3xl p-6.5 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-[#6b4f4f] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-black text-[#483434] text-base mb-1.5">
                      Airport Information
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      Departure gates close 45 minutes prior to flight time.
                      Travelers should check in online 24 hours prior to
                      departure. Special meal requirements or wheelchair
                      requests must be submitted at least 72 hours before flight
                      takeoff.
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* D: VISA DETAIL LAYOUT */}
            {type === "visa" && (
              <div className="space-y-10">
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#6b4f4f]" /> Visa
                    Specifications
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Country",
                        value: item.country,
                        flag: item.flag,
                      },
                      { label: "Validity", value: item.validity },
                      { label: "Entries", value: item.entries },
                      { label: "Processing Time", value: item.processingTime },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="bg-[#fff3e4] rounded-2xl p-4 border border-[#eed6c4]/40 text-center"
                      >
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {spec.label}
                        </p>
                        <p className="text-xs font-black text-[#483434] mt-1.5 flex items-center justify-center gap-1">
                          {spec.flag && (
                            <span className="text-base leading-none">
                              {spec.flag}
                            </span>
                          )}
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-heading font-black text-[#483434] pt-4">
                    Key Benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {item.features.map((feature: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-600 font-light"
                      >
                        <CheckCircle className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-4">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#6b4f4f]" /> Required
                    Documents
                  </h2>
                  <div className="space-y-3">
                    {item.documents.map((doc: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-[#eed6c4]/10 rounded-xl border border-[#eed6c4]/20"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#6b4f4f] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-xs font-bold text-[#483434] leading-relaxed">
                          {doc}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* E: TRANSPORT DETAIL LAYOUT */}
            {type === "transport" && (
              <div className="space-y-10">
                <section className="bg-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-[0_10px_35px_rgba(72,52,52,0.03)] space-y-6">
                  <h2 className="text-xl font-heading font-black text-[#483434] flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#6b4f4f]" /> Vehicle Details
                  </h2>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-[#fff3e4]/50 rounded-2xl border border-[#eed6c4]/40">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Service Category
                      </p>
                      <h3 className="text-lg font-heading font-black text-[#483434]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-light mt-0.5">
                        {item.vehicleType}
                      </p>
                    </div>
                    <div className="bg-[#6b4f4f] px-4 py-2 rounded-2xl text-[#fff3e4] text-center flex items-center gap-2 shrink-0">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        {item.capacity}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-heading font-black text-[#483434] pt-4">
                    Service Inclusions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {item.features.map((feature: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-600 font-light"
                      >
                        <CheckCircle className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </main>

          {/* ────────────────────────────────────────────────────────────────── */}
          {/* SIDEBAR WIDGET (4 Columns) */}
          {/* ────────────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Sidebar Booking Card */}
              {type !== "blog" && (
                <div className="bg-gradient-to-br from-[#382626] to-[#251717] text-white rounded-3xl p-8 border border-[#eed6c4]/30 shadow-2xl space-y-6 relative overflow-hidden">
                  {/* Subtle top ambient glow */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#eed6c4]/50 to-transparent" />

                  <div>
                    <span className="text-[10px] text-[#eed6c4] font-extrabold uppercase tracking-[0.2em] block mb-1">
                      Rate / Pricing
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
                        {displayPrice}
                      </span>
                      {type === "package" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / person
                        </span>
                      )}
                      {type === "transport" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / vehicle
                        </span>
                      )}
                      {type === "flight" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / passenger
                        </span>
                      )}
                      {type === "visa" && (
                        <span className="text-xs text-[#eed6c4]/70 font-medium">
                          / applicant
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-[#eed6c4]/20 pt-5">
                    {/* Availability */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">
                        Availability
                      </span>
                      {item.isSold ? (
                        <span className="flex items-center gap-1.5 text-rose-400 font-extrabold uppercase tracking-wider text-[10px]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                          Sold Out
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold uppercase tracking-wider text-[10px]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Available
                        </span>
                      )}
                    </div>

                    {/* Travel Dates */}
                    {item.travelDates && (
                      <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                        <span className="text-slate-300 text-xs font-medium">
                          Travel Dates
                        </span>
                        <span className="text-[#fff3e4] text-xs font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                          {item.travelDates}
                        </span>
                      </div>
                    )}

                    {/* Accreditation */}
                    <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                      <span className="text-slate-300 font-medium">
                        Protection
                      </span>
                      <span className="text-[#eed6c4] font-extrabold uppercase tracking-widest text-[10px] bg-[#eed6c4]/10 px-2.5 py-1 rounded-md border border-[#eed6c4]/20">
                        IATA &amp; ATOL
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Booking Link / CTA */}
                    {item.isSold ? (
                      <span className="flex items-center justify-center w-full h-12 rounded-2xl bg-slate-700/50 text-slate-400 font-heading font-black text-xs uppercase tracking-[0.15em] border border-slate-600/30 cursor-not-allowed select-none">
                        Sold Out
                      </span>
                    ) : (
                      <a
                        href={`/book?type=${type}&id=${id}`}
                        className="flex items-center justify-center w-full h-12 rounded-2xl bg-gradient-to-r from-[#eed6c4] to-[#f5e6d8] hover:from-[#fff3e4] hover:to-[#eed6c4] text-[#382626] font-heading font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-lg shadow-[#eed6c4]/5 hover:shadow-[#eed6c4]/15 hover:-translate-y-0.5 cursor-pointer"
                      >
                        Book This {type}
                      </a>
                    )}

                    {/* Enquiry Modal + WhatsApp */}
                    <EnquirySidebar type={type} id={id} packageTitle={title} />
                  </div>

                  <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed px-1">
                    No initial payments are processed online. Our specialist
                    reservations team will contact you to verify details.
                  </p>
                </div>
              )}

              {/* Sidebar Related Articles (for Blog) */}
              {type === "blog" && (
                <div className="rounded-3xl border border-[#eed6c4]/25 p-6 bg-white space-y-5">
                  <h3 className="text-xs font-heading font-black text-[#483434] uppercase tracking-[0.2em] mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {blogPostsData
                      .filter((p) => p.slug !== id)
                      .slice(0, 3)
                      .map((related) => (
                        <Link
                          key={related.id}
                          href={`/view/blog/${related.slug}`}
                          className="group flex gap-3.5 items-start rounded-2xl p-3 border border-[#eed6c4]/20 hover:border-[#6b4f4f]/40 hover:bg-[#eed6c4]/10 transition-all duration-300"
                        >
                          <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={related.image}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#6b4f4f]">
                              {related.category}
                            </span>
                            <p className="text-xs font-bold text-[#483434] leading-snug mt-0.5 group-hover:text-[#6b4f4f] transition-colors line-clamp-2">
                              {related.title}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1">
                              {related.readTime}
                            </p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Sidebar General FAQ / Support Card */}
              <div className="rounded-3xl border border-[#eed6c4]/30 bg-[#eed6c4]/10 p-6 space-y-4">
                <h3 className="text-[10px] font-heading font-black text-[#483434] uppercase tracking-[0.2em]">
                  Our Services
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Umrah Packages",
                      href: "/umrah",
                      icon: <Building2 className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "Flights Catalog",
                      href: "/flights",
                      icon: <PlaneTakeoff className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "Visa Processing",
                      href: "/visa",
                      icon: <FileCheck className="w-3.5 h-3.5" />,
                    },
                    {
                      label: "VIP Transport",
                      href: "/transport",
                      icon: <Car className="w-3.5 h-3.5" />,
                    },
                  ].map((srv, idx) => (
                    <Link
                      key={idx}
                      href={srv.href}
                      className="flex items-center gap-2.5 text-xs font-bold text-[#6b4f4f] hover:text-[#483434] py-1.5 hover:translate-x-0.5 transition-all duration-200"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#eed6c4]/40 flex items-center justify-center shrink-0 text-[#6b4f4f]">
                        {srv.icon}
                      </span>
                      {srv.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
