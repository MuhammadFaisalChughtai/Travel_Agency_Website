import { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";

  if (host.includes("roadtoumrah")) {
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
      sitemap: "https://roadtoumrah.co.uk/sitemap.xml",
    };
  }

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
    sitemap: "https://terrifictravel.co.uk/sitemap.xml",
  };
}
