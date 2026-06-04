import type { Metadata } from "next";
import { Navbar } from "@/components/roadtoumrah/Navbar";
import { Footer } from "@/components/roadtoumrah/Footer";
import { TawkToWidget } from "@/components/layout/TawkToWidget";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CookieConsent } from "@/components/roadtoumrah/layout/CookieConsent";
import { getSiteConfig } from "@/lib/siteConfig";
import { SiteProvider } from "@/components/SiteProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://roadtoumrah.co.uk"),
  title: "Road To Umrah | Premium Hajj & Umrah Packages",
  description:
    "Book unforgettable premium Umrah and Hajj packages with Road To Umrah. Your trusted partner for spiritual journeys.",
  icons: "/umrah_favicon.ico",
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
        <TawkToWidget />
        <FloatingActions />
        <CookieConsent />
      </div>
    </SiteProvider>
  );
}
