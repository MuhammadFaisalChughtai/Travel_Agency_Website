import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://terrifictravel.co.uk"),
  title: "Terrific Travel Ltd | Discover the World",
  description:
    "Book unforgettable holidays, Umrah, Hajj packages, flights, and premium transport with Terrific Travel Ltd.",
  openGraph: {
    title: "Terrific Travel Ltd | Discover the World",
    description: "Book unforgettable holidays, Umrah, Hajj packages, flights, and premium transport with Terrific Travel Ltd.",
    url: "https://terrifictravel.co.uk",
    siteName: "Terrific Travel",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terrific Travel Ltd | Discover the World",
    description: "Book unforgettable holidays, Umrah, Hajj packages, flights, and premium transport with Terrific Travel Ltd.",
  },
};

import { headers } from "next/headers";
import { getSiteConfig } from "@/lib/siteConfig";
import { SiteProvider } from "@/components/SiteProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const domain = headersList.get("x-site-domain");
  const siteConfig = getSiteConfig(domain);

  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical third-party domains to reduce connection latency */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                 
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <SiteProvider config={siteConfig}>
          {children}
          <GoogleAnalytics />
        </SiteProvider>
      </body>
    </html>
  );
}
