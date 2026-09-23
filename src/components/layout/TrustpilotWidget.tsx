"use client";

import { TrustpilotTrustBox } from "@/components/ui/TrustpilotTrustBox";

export function TrustpilotWidget() {
  return (
    <div className="py-2">
      <TrustpilotTrustBox
        templateId="5419b6a8b0d04a076446a9ad"
        height="52px"
        width="100%"
        theme="light"
      />
    </div>
  );
}

