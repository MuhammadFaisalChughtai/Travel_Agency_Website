import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // 1. Try flight
    try {
      const flight = await prisma.flight.findUnique({ where: { id }, select: { slug: true } });
      if (flight?.slug) return NextResponse.json({ slug: flight.slug });
    } catch (e) {}

    // 2. Try package
    try {
      const pkg = await prisma.package.findUnique({ where: { id }, select: { slug: true } });
      if (pkg?.slug) return NextResponse.json({ slug: pkg.slug });
    } catch (e) {}

    // 3. Try visa
    try {
      const visa = await prisma.visaService.findUnique({ where: { id }, select: { slug: true } });
      if (visa?.slug) return NextResponse.json({ slug: visa.slug });
    } catch (e) {}

    // 4. Try transport
    try {
      const transport = await prisma.transportService.findUnique({ where: { id }, select: { slug: true } });
      if (transport?.slug) return NextResponse.json({ slug: transport.slug });
    } catch (e) {}

    return NextResponse.json({ slug: null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
