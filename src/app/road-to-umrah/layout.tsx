import type { Metadata } from "next";
import { Navbar } from "@/components/roadtoumrah/Navbar";
import { Footer } from "@/components/roadtoumrah/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CookieConsent } from "@/components/roadtoumrah/layout/CookieConsent";
import { getSiteConfig } from "@/lib/siteConfig";
import { SiteProvider } from "@/components/SiteProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://roadtoumrah.co.uk"),
  title: "Road To Umrah | Premium Hajj & Umrah Packages",
  description:
    "Book unforgettable premium Umrah and Hajj packages with Road To Umrah. Your trusted partner for spiritual journeys.",
  icons: {
    icon: [
      { url: "/umrah_favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Road To Umrah | Premium Hajj & Umrah Packages",
    description: "Book unforgettable premium Umrah and Hajj packages with Road To Umrah.",
    url: "https://roadtoumrah.co.uk",
    siteName: "Road To Umrah",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Road To Umrah | Premium Hajj & Umrah Packages",
    description: "Book unforgettable premium Umrah and Hajj packages with Road To Umrah.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig("roadtoumrah.co.uk");

  return (
    <SiteProvider config={siteConfig}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
        <CookieConsent />
      </div>
    </SiteProvider>
  );
}
