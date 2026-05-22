"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTrendingFlight(formData: FormData) {
  const destination = formData.get("destination") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string;
  const tag = (formData.get("tag") as string) || null;

  await (prisma as any).trendingFlight.create({
    data: { destination, price, image, tag },
  });

  revalidatePath("/admin/flights");
  revalidatePath("/flights");
}

export async function deleteTrendingFlight(id: string) {
  await (prisma as any).trendingFlight.delete({ where: { id } });
  revalidatePath("/admin/flights");
  revalidatePath("/flights");
}
