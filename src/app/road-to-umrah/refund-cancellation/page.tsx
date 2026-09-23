import { RefundCancellationContent } from "@/components/legal/RefundCancellationContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Road to Umrah",
  description: "Read the full Refund & Cancellation Policy for Road to Umrah.",
};

export default function RefundCancellationPage() {
  return <RefundCancellationContent brand="umrah" />;
}
