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

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existingPackage = await prisma.package.findUnique({
      where: { slug },
    });

    if (existingPackage) {
      return NextResponse.json(
        { error: "A package with this name already exists. Please insert a different name." },
        { status: 400 }
      );
    }

    const newPackage = await prisma.package.create({
      data: {
        title: body.title,
        slug: slug,
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
