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

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
