"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function createTransport(formData: FormData) {
  const featuresString = formData.get("features")?.toString() || "";
  const featuresArray = featuresString.split("\n").map((f) => f.trim()).filter((f) => f);

  const vehicleType = formData.get("vehicleType") as string;
  const type = formData.get("type") as string;
  let customSlug = formData.get("slug") as string;

  let slug = customSlug
    ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    : generateSlug(`${vehicleType}-${type}`);

  const existing = await prisma.transportService.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await prisma.transportService.create({
    data: {
      vehicleType,
      type,
      slug,
      price: parseFloat(formData.get("price") as string),
      capacity: formData.get("capacity") as string,
      description: formData.get("description") as string,
      features: JSON.stringify(featuresArray),
      image: formData.get("image") as string,
      isPopular: formData.get("isPopular") === "on",
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    },
  });

  revalidatePath("/admin/transport");
  revalidatePath("/transport");
}

export async function updateTransport(id: string, formData: FormData) {
  const featuresString = formData.get("features")?.toString() || "";
  const featuresArray = featuresString.split("\n").map((f) => f.trim()).filter((f) => f);

  const vehicleType = formData.get("vehicleType") as string;
  const type = formData.get("type") as string;
  let customSlug = formData.get("slug") as string;

  let slug = customSlug
    ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    : generateSlug(`${vehicleType}-${type}`);

  const existing = await prisma.transportService.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await prisma.transportService.update({
    where: { id },
    data: {
      vehicleType,
      type,
      slug,
      price: parseFloat(formData.get("price") as string),
      capacity: formData.get("capacity") as string,
      description: formData.get("description") as string,
      features: JSON.stringify(featuresArray),
      image: formData.get("image") as string,
      isPopular: formData.get("isPopular") === "on",
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    },
  });

  revalidatePath("/admin/transport");
  revalidatePath("/transport");
}

export async function deleteTransport(id: string) {
  await prisma.transportService.delete({ where: { id } });
  revalidatePath("/admin/transport");
  revalidatePath("/transport");
}
