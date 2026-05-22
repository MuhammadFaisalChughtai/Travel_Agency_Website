import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TawkToWidget } from "@/components/layout/TawkToWidget";
import { FloatingActions } from "@/components/layout/FloatingActions";

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
    </div>
  );
}
