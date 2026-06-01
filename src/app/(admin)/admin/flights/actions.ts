"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function deleteFlight(id: string) {
  await requireAuth();
  await prisma.flight.delete({ where: { id } });
  revalidatePath("/admin/flights");
  revalidatePath("/flights");
}

export async function createFlight(formData: FormData) {
  await requireAuth();
  const airline = formData.get("airline") as string;
  const airlineCode = formData.get("airlineCode") as string || null;
  const departure = formData.get("departure") as string;
  const departureCode = formData.get("departureCode") as string || null;
  const destination = formData.get("destination") as string;
  const destinationCode = formData.get("destinationCode") as string || null;
  const price = parseFloat(formData.get("price") as string);
  const month = formData.get("month") as string || null;
  const metaTitle = formData.get("metaTitle") as string || null;
  const metaDescription = formData.get("metaDescription") as string || null;

  const isTransit = formData.get("isTransit") === "true";
  const transitAirport = isTransit ? (formData.get("transitAirport") as string || null) : null;
  const transitDuration = isTransit ? (formData.get("transitDuration") as string || null) : null;
  
  const duration = formData.get("duration") as string || "7h 00m";
  const baggage = formData.get("baggage") as string || "30kg Checked, 7kg Cabin";
  const aircraft = formData.get("aircraft") as string || "Boeing 777";

  const isReturn = formData.get("isReturn") === "true";
  
  let returnAirline = null;
  let returnAirlineCode = null;
  let returnDuration = null;
  let returnIsTransit = false;
  let returnTransitAirport = null;
  let returnTransitDuration = null;
  let returnBaggage = null;
  let returnAircraft = null;

  if (isReturn) {
    returnAirline = formData.get("returnAirline") as string || airline;
    returnAirlineCode = formData.get("returnAirlineCode") as string || airlineCode;
    
    returnDuration = formData.get("returnDuration") as string || duration;
    returnIsTransit = formData.get("returnIsTransit") === "true";
    
    if (returnIsTransit) {
      returnTransitAirport = formData.get("returnTransitAirport") as string || null;
      returnTransitDuration = formData.get("returnTransitDuration") as string || null;
    }
    
    returnBaggage = formData.get("returnBaggage") as string || baggage;
    returnAircraft = formData.get("returnAircraft") as string || aircraft;
  }

  await prisma.flight.create({
    data: {
      airline,
      airlineCode,
      departure,
      departureCode,
      destination,
      destinationCode,
      price,
      status: "AVAILABLE",
      month,
      
      isTransit,
      transitAirport,
      transitDuration,
      duration,
      baggage,
      aircraft,
      
      isReturn,
      returnAirline,
      returnAirlineCode,
      returnDuration,
      returnIsTransit,
      returnTransitAirport,
      returnTransitDuration,
      returnBaggage,
      returnAircraft,
      metaTitle,
      metaDescription,
    }
  });

  revalidatePath("/admin/flights");
  revalidatePath("/flights");
}

export async function updateFlight(id: string, formData: FormData) {
  await requireAuth();
  const airline = formData.get("airline") as string;
  const airlineCode = formData.get("airlineCode") as string || null;
  const departure = formData.get("departure") as string;
  const departureCode = formData.get("departureCode") as string || null;
  const destination = formData.get("destination") as string;
  const destinationCode = formData.get("destinationCode") as string || null;
  const price = parseFloat(formData.get("price") as string);
  const month = formData.get("month") as string || null;
  const metaTitle = formData.get("metaTitle") as string || null;
  const metaDescription = formData.get("metaDescription") as string || null;

  const isTransit = formData.get("isTransit") === "true";
  const transitAirport = isTransit ? (formData.get("transitAirport") as string || null) : null;
  const transitDuration = isTransit ? (formData.get("transitDuration") as string || null) : null;
  
  const duration = formData.get("duration") as string || "7h 00m";
  const baggage = formData.get("baggage") as string || "30kg Checked, 7kg Cabin";
  const aircraft = formData.get("aircraft") as string || "Boeing 777";

  const isReturn = formData.get("isReturn") === "true";
  
  let returnAirline = null;
  let returnAirlineCode = null;
  let returnDuration = null;
  let returnIsTransit = false;
  let returnTransitAirport = null;
  let returnTransitDuration = null;
  let returnBaggage = null;
  let returnAircraft = null;

  if (isReturn) {
    returnAirline = formData.get("returnAirline") as string || airline;
    returnAirlineCode = formData.get("returnAirlineCode") as string || airlineCode;
    
    returnDuration = formData.get("returnDuration") as string || duration;
    returnIsTransit = formData.get("returnIsTransit") === "true";
    
    if (returnIsTransit) {
      returnTransitAirport = formData.get("returnTransitAirport") as string || null;
      returnTransitDuration = formData.get("returnTransitDuration") as string || null;
    }
    
    returnBaggage = formData.get("returnBaggage") as string || baggage;
    returnAircraft = formData.get("returnAircraft") as string || aircraft;
  }

  await prisma.flight.update({
    where: { id },
    data: {
      airline,
      airlineCode,
      departure,
      departureCode,
      destination,
      destinationCode,
      price,
      month,
      
      isTransit,
      transitAirport,
      transitDuration,
      duration,
      baggage,
      aircraft,
      
      isReturn,
      returnAirline,
      returnAirlineCode,
      returnDuration,
      returnIsTransit,
      returnTransitAirport,
      returnTransitDuration,
      returnBaggage,
      returnAircraft,
      metaTitle,
      metaDescription,
    }
  });

  revalidatePath("/admin/flights");
  revalidatePath("/flights");
}
