import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBooking = await prisma.booking.create({
      data: {
        packageId: body.packageId,
        flightId: body.flightId,
        travelerDetails: body.travelerDetails, // JSON string
        travelDate: new Date(body.travelDate),
        status: "PENDING",
      },
    });
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        package: true,
        flight: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
