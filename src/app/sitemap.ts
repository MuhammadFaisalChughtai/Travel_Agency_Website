import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://terrifictravel.co.uk";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/flights",
    "/hajj",
    "/holiday",
    "/umrah",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes
  const packages = await prisma.package.findMany({
    select: { slug: true, id: true, createdAt: true },
  });
  const blogs = await prisma.blog.findMany({
    select: { slug: true, id: true, updatedAt: true },
  });

  const dynamicRoutes = [
    ...packages.map((pkg) => ({
      url: `${baseUrl}/v/${pkg.slug || pkg.id}`,
      lastModified: pkg.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogs.map((blog) => ({
      url: `${baseUrl}/v/${blog.slug || blog.id}`,
      lastModified: blog.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}

