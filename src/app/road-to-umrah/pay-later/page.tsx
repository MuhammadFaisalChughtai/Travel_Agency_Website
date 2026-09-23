import type { Metadata } from "next";
import { PayLaterContent } from "@/components/pay-later/PayLaterContent";

export const metadata: Metadata = {
  title: "Book Now, Pay Later | Low Deposit Umrah & Hajj Packages | Road To Umrah",
  description:
    "Secure your sacred Umrah or Hajj pilgrimage today with a low deposit and pay the balance before you travel in flexible scheduled instalments. 0% interest & ATOL protected.",
  openGraph: {
    title: "Book Now, Pay Later | Road To Umrah",
    description: "Secure your pilgrimage with a low deposit and pay the balance in instalments before you travel.",
    url: "https://roadtoumrah.co.uk/pay-later",
  },
  alternates: {
    canonical: "https://roadtoumrah.co.uk/pay-later",
  },
};

export default function PayLaterPage() {
  return <PayLaterContent brand="umrah" brandName="Road To Umrah" />;
}
