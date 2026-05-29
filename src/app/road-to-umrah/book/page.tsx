import { BookingForm } from "@/components/book/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Now | Road To Umrah",
  description:
    "Secure your flight, request a free Umrah quote, or plan your next custom journey with Road To Umrah. We offer flexible options and 24/7 support.",
  openGraph: {
    title: "Book Now | Road To Umrah",
    description:
      "Secure your flight, request a free Umrah quote, or plan your next custom journey with Road To Umrah. We offer flexible options and 24/7 support.",
    url: "https://roadtoumrah.co.uk/book",
  },
  twitter: {
    title: "Book Now | Road To Umrah",
    description:
      "Secure your flight, request a free Umrah quote, or plan your next custom journey with Road To Umrah.",
  },
};

export default function BookingPage() {
  return <BookingForm />;
}
