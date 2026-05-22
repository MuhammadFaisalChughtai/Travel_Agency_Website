import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // HOLIDAY, UMRAH, HAJJ

    const packages = await prisma.package.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPackage = await prisma.package.create({
      data: {
        title: body.title,
        type: body.type,
        destination: body.destination,
        duration: body.duration,
        price: parseFloat(body.price),
        description: body.description,
        includedServices: body.includedServices, // should be JSON string
        images: body.images || "[]",
        travelDates: body.travelDates,
        availability: body.availability ?? true,
      },
    });
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
