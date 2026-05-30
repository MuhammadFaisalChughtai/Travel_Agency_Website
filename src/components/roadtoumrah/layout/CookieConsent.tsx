"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    // We just hide it for the current session/page load.
    // It will show up again on next page reload since we don't store the preference.
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-[#0f172a] border border-[#064e3b] shadow-2xl rounded-2xl p-5 md:p-6 text-slate-200">
        <h3 className="text-lg font-bold text-[#d4af37] mb-2 font-heading tracking-wide">
          We use cookies 🍪
        </h3>
        <p className="text-sm text-[#e2e8f0] mb-5 leading-relaxed">
          We use cookies to enhance your browsing experience, serve personalized
          ads or content, and analyze our traffic. By clicking "Accept All", you
          consent to our use of cookies. Read our{" "}
          <Link href="/privacy-policy" className="text-[#d4af37] underline hover:text-white transition-colors">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAccept}
            className="flex-1 bg-[#064e3b] text-white hover:bg-[#064e3b]/90 border border-[#d4af37]/30"
          >
            Accept All
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
