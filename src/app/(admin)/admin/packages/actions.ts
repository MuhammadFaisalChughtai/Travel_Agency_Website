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

export async function deletePackage(id: string) {
  await requireAuth();
  await prisma.package.delete({ where: { id } });
  revalidatePath("/admin/packages");
  revalidatePath("/umrah");
  revalidatePath("/hajj");
}

export async function createPackage(formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const type = (formData.get("type") as string) || "UMRAH";
  const stars = parseInt(formData.get("stars") as string) || 3;
  const price = parseFloat(formData.get("price") as string) || 0;
  const duration = formData.get("duration") as string;
  const travelDates = (formData.get("travelDates") as string) || "Flexible";
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const isSold = formData.get("isSold") === "true";
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const customSlug = formData.get("slug") as string;

  let slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  let existing = await prisma.package.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.floor(Math.random() * 1000)}`;

  await prisma.package.create({
    data: {
      title,
      type,
      destination: (type === "UMRAH" || type === "Cruise_Umrah" || type === "HAJJ") ? "Makkah & Madinah" : "Various",
      duration,
      price,
      description: description || "",
      includedServices: "[]",
      images: JSON.stringify([image]),
      travelDates,
      availability: true,
      isSold,
      stars,
      metaTitle,
      metaDescription,
      slug,
    }
  });

  revalidatePath("/admin/packages");
  revalidatePath("/umrah");
  revalidatePath("/hajj");
}

export async function updatePackage(id: string, formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const type = (formData.get("type") as string) || "UMRAH";
  const stars = parseInt(formData.get("stars") as string) || 3;
  const price = parseFloat(formData.get("price") as string) || 0;
  const duration = formData.get("duration") as string;
  const travelDates = (formData.get("travelDates") as string) || "Flexible";
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const isSold = formData.get("isSold") === "true";
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const customSlug = formData.get("slug") as string;

  let slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  let existing = await prisma.package.findUnique({ where: { slug } });
  if (existing && existing.id !== id) slug = `${slug}-${Math.floor(Math.random() * 1000)}`;

  const updateData: any = {
    title,
    type,
    duration,
    price,
    description,
    travelDates,
    stars,
    isSold,
    metaTitle,
    metaDescription,
    slug,
  };

  if (image) {
    updateData.images = JSON.stringify([image]);
  }

  await prisma.package.update({ where: { id }, data: updateData });

  revalidatePath("/admin/packages");
  revalidatePath("/umrah");
  revalidatePath("/hajj");
}
