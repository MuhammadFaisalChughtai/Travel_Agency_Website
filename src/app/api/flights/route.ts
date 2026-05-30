import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const flights = await prisma.flight.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(flights);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFlight = await prisma.flight.create({
      data: {
        airline: body.airline,
        departure: body.departure,
        destination: body.destination,
        price: parseFloat(body.price),
        status: body.status || "AVAILABLE",
      },
    });
    return NextResponse.json(newFlight, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create flight" },
      { status: 500 },
    );
  }
}
