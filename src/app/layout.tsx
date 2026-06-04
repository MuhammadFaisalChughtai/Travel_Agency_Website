import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://terrifictravel.co.uk"),
  title: "Terrific Travel Ltd | Discover the World",
  description:
    "Book unforgettable holidays, Umrah, Hajj packages, flights, and premium transport with Terrific Travel Ltd.",
  icons: "/terrific_favicon.png",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical third-party domains to reduce connection latency */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <>
            <link rel="preconnect" href="https://region1.google-analytics.com" />
            <link rel="dns-prefetch" href="https://region1.google-analytics.com" />
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
            <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
            <link rel="preconnect" href="https://ad.doubleclick.net" />
            <link rel="dns-prefetch" href="https://ad.doubleclick.net" />
            <link rel="preconnect" href="https://www.google.com" />
            <link rel="dns-prefetch" href="https://www.google.com" />
            <link rel="preconnect" href="https://www.google.co.uk" />
            <link rel="dns-prefetch" href="https://www.google.co.uk" />
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
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
