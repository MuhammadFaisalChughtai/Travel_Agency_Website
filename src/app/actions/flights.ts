"use server";

import { prisma } from "@/lib/prisma";

export async function getMoreFlights(skip: number, take: number) {
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
    price: `£${f.price}`,
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
