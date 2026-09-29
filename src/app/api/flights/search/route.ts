import { NextRequest, NextResponse } from "next/server";
import { searchTravelportFlights, SearchFlightsParams } from "@/lib/travelport";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripType, legs, passengers, cabin, bags } = body;

    if (!legs || !Array.isArray(legs) || legs.length === 0) {
      return NextResponse.json(
        { success: false, error: "Flight search legs are required." },
        { status: 400 }
      );
    }

    // Validate legs
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      if (!leg.from || !leg.to || !leg.departureDate) {
        return NextResponse.json(
          {
            success: false,
            error: `Leg ${i + 1} is missing origin, destination, or departure date.`,
          },
          { status: 400 }
        );
      }
    }

    const searchParams: SearchFlightsParams = {
      tripType: tripType || "return",
      legs: legs.map((l: any) => ({
        from: l.from.trim(),
        to: l.to.trim(),
        departureDate: l.departureDate.trim(),
      })),
      passengers: {
        adults: passengers?.adults ? parseInt(passengers.adults, 10) : 1,
        children: passengers?.children ? parseInt(passengers.children, 10) : 0,
        infants: passengers?.infants ? parseInt(passengers.infants, 10) : 0,
      },
      cabin: cabin || "Economy",
      bags: bags !== undefined && bags !== null ? parseInt(bags, 10) : 1,
    };

    const result = await searchTravelportFlights(searchParams);

    return NextResponse.json({
      success: result.success,
      flights: result.flights,
      message: result.message,
      searchCriteria: {
        tripType: searchParams.tripType,
        passengers: searchParams.passengers,
        cabin: searchParams.cabin,
        bags: searchParams.bags,
        legs: searchParams.legs,
      },
    });
  } catch (error: any) {
    console.error("[API Flight Search Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to search flights.",
      },
      { status: 500 }
    );
  }
}
