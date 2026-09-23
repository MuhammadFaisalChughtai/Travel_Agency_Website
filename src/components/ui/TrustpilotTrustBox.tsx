"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface TrustpilotTrustBoxProps {
  templateId?: string;
  height?: string;
  width?: string;
  theme?: "light" | "dark";
  className?: string;
}

export function TrustpilotTrustBox({
  templateId = "5419b6a8b0d04a076446a9ad", // Default TrustBox
  height = "140px",
  width = "100%",
  theme = "light",
  className = "",
}: TrustpilotTrustBoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const loadWidget = () => {
    if (typeof window !== "undefined" && (window as any).Trustpilot && ref.current) {
      (window as any).Trustpilot.loadFromElement(ref.current);
    }
  };

  useEffect(() => {
    loadWidget();
  }, []);

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
        onLoad={loadWidget}
      />
      <div
        ref={ref}
        className="trustpilot-widget w-full flex justify-center"
        data-locale="en-GB"
        data-template-id={templateId}
        data-businessunit-id="657a55d5e9b46f9c9f3be881"
        data-style-height={height}
        data-style-width={width}
        data-theme={theme}
        data-stars="4,5"
        data-review-languages="en"
      >
        <a
          href="https://uk.trustpilot.com/review/terrifictravel.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#00b67a] hover:underline flex items-center gap-1"
        >
          <span>Trustpilot Reviews</span>
        </a>
      </div>
    </div>
  );
}

