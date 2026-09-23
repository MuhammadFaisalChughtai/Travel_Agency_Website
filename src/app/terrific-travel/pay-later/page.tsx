import type { Metadata } from "next";
import { PayLaterContent } from "@/components/pay-later/PayLaterContent";

export const metadata: Metadata = {
  title: "Book Now, Pay Later | Low Deposit Holidays & Umrah | Terrific Travel Ltd",
  description:
    "Secure your holiday or Umrah package today with a low deposit and pay the balance before you travel in flexible scheduled instalments. 0% interest & ATOL protected.",
  openGraph: {
    title: "Book Now, Pay Later | Terrific Travel Ltd",
    description: "Secure your holiday with a low deposit and pay the balance in instalments before you travel.",
    url: "https://terrifictravel.co.uk/pay-later",
  },
  alternates: {
    canonical: "https://terrifictravel.co.uk/pay-later",
  },
};

export default function PayLaterPage() {
  return <PayLaterContent brand="terrific" brandName="Terrific Travel" />;
}
