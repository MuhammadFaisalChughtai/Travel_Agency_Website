import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://terrifictravel.co.uk";

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/admin",
        "/admin/",
        "/login",
        "/forgot-password",
        "/reset-password"
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
