import { Navbar } from "@/components/roadtoumrah/Navbar";
import { Footer } from "@/components/roadtoumrah/Footer";
import { TawkToWidget } from "@/components/layout/TawkToWidget";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <TawkToWidget />
      <FloatingActions />
      <CookieConsent />
    </div>
  );
}
