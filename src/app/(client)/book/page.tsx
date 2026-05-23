import { BookingForm } from "@/components/book/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Now | Terrific Travel Ltd",
  description: "Secure your flight, request a free Umrah quote, or plan your next custom journey with Terrific Travel Ltd. We offer flexible options and 24/7 support.",
  openGraph: {
    title: "Book Now | Terrific Travel Ltd",
    description: "Secure your flight, request a free Umrah quote, or plan your next custom journey with Terrific Travel Ltd. We offer flexible options and 24/7 support.",
    url: "https://terrifictravel.co.uk/book",
  },
  twitter: {
    title: "Book Now | Terrific Travel Ltd",
    description: "Secure your flight, request a free Umrah quote, or plan your next custom journey with Terrific Travel Ltd.",
  },
};

export default function BookingPage() {
  return <BookingForm />;
}
