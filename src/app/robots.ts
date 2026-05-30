import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/admin",
        "/admin/",
        "/login",
        "/forgot-password",
        "/reset-password"
      ],
      disallow: [
        "/blog",
        "/blog/",
        "/umrah/blog",
        "/umrah/blog/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
