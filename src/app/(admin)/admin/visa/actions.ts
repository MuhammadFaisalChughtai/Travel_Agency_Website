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

export async function createVisa(formData: FormData) {
  const featuresString = formData.get("features")?.toString() || "";
  const featuresArray = featuresString.split("\n").map(f => f.trim()).filter(f => f);

  const country = formData.get("country") as string;
  const visaType = formData.get("visaType") as string;
  let customSlug = formData.get("slug") as string;
  
  let slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : generateSlug(`${country}-${visaType}`);
  
  const existing = await prisma.visaService.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await prisma.visaService.create({
    data: {
      country,
      visaType,
      slug,
      processingTime: formData.get("processingTime") as string,
      validity: formData.get("validity") as string,
      entries: formData.get("entries") as string,
      requiredDocuments: formData.get("requiredDocuments") as string,
      price: parseFloat(formData.get("price") as string),
      features: JSON.stringify(featuresArray),
      image: formData.get("image") as string,
      isPopular: formData.get("isPopular") === "on",
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    }
  });

  revalidatePath("/admin/visa");
  revalidatePath("/visa");
}

export async function updateVisa(id: string, formData: FormData) {
  const featuresString = formData.get("features")?.toString() || "";
  const featuresArray = featuresString.split("\n").map(f => f.trim()).filter(f => f);

  const country = formData.get("country") as string;
  const visaType = formData.get("visaType") as string;
  let customSlug = formData.get("slug") as string;
  
  let slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : generateSlug(`${country}-${visaType}`);

  const existing = await prisma.visaService.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  await prisma.visaService.update({
    where: { id },
    data: {
      country,
      visaType,
      slug,
      processingTime: formData.get("processingTime") as string,
      validity: formData.get("validity") as string,
      entries: formData.get("entries") as string,
      requiredDocuments: formData.get("requiredDocuments") as string,
      price: parseFloat(formData.get("price") as string),
      features: JSON.stringify(featuresArray),
      image: formData.get("image") as string,
      isPopular: formData.get("isPopular") === "on",
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    }
  });

  revalidatePath("/admin/visa");
  revalidatePath("/visa");
}


export async function deleteVisa(id: string) {
  await prisma.visaService.delete({ where: { id } });
  revalidatePath("/admin/visa");
  revalidatePath("/visa");
}
