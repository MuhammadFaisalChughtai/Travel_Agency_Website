import { RefundCancellationContent } from "@/components/legal/RefundCancellationContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Terrific Travel Ltd",
  description: "Read the full Refund & Cancellation Policy for Terrific Travel Ltd.",
};

export default function RefundCancellationPage() {
  return <RefundCancellationContent brand="terrific" />;
}
