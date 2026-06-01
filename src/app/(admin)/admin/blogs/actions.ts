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

export async function deleteBlog(id: string) {
  await requireAuth();
  await prisma.blog.delete({ where: { id } });
  revalidatePath("/admin/blogs");
}

export async function createBlog(formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const customSlug = formData.get("slug") as string;
  const slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const readTime = formData.get("readTime") as string || "5 min read";
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  await prisma.blog.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category,
      image,
      readTime,
      date,
      metaTitle,
      metaDescription
    }
  });

  revalidatePath("/admin/blogs");
}

export async function updateBlog(id: string, formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const customSlug = formData.get("slug") as string;
  const slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;

  const updateData: any = {
    title,
    slug,
    excerpt,
    content,
    category,
    metaTitle,
    metaDescription
  };

  if (image) {
    updateData.image = image;
  }

  await prisma.blog.update({
    where: { id },
    data: updateData
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
}
