import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TawkToWidget } from "@/components/layout/TawkToWidget";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getSiteConfig } from "@/lib/siteConfig";
import { SiteProvider } from "@/components/SiteProvider";

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
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig("terrifictravel.co.uk");

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
