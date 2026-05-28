"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getSiteConfig, formatPrice } from "@/lib/siteConfig";

export async function getMoreFlights(skip: number, take: number) {
  const headersList = headers();
  const domain = headersList.get("x-site-domain");
  const siteConfig = getSiteConfig(domain);

  const flightsData = await prisma.flight.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { price: "asc" },
    skip,
    take,
  });

  return flightsData.map((f) => ({
    id: f.id,
    airline: f.airline,
    airlineCode: f.airlineCode,
    departure: f.departure,
    departureCode: f.departureCode || "LHR",
    destination: f.destination,
    destinationCode: f.destinationCode || "DXB",
    price: formatPrice(f.price, siteConfig),
    baggage: f.baggage || "30kg Checked, 7kg Cabin",
    month: f.month,

    duration: f.duration || "7h 00m",
    isTransit: f.isTransit,
    transitAirport: f.transitAirport,
    transitDuration: f.transitDuration,

    isReturn: f.isReturn,
    returnAirline: f.returnAirline,
    returnAirlineCode: f.returnAirlineCode,
    returnDuration: f.returnDuration,
    returnIsTransit: f.returnIsTransit,
    returnTransitAirport: f.returnTransitAirport,
    returnTransitDuration: f.returnTransitDuration,
    returnBaggage: f.returnBaggage,
    returnAircraft: f.returnAircraft,
  }));
}
