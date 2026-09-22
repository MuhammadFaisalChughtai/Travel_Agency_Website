"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/components/SiteProvider";

interface TawkToWidgetProps {
  propertyId?: string;
  widgetId?: string;
}

export function TawkToWidget({ propertyId, widgetId }: TawkToWidgetProps = {}) {
  const siteConfig = useSiteConfig();

  useEffect(() => {
    let finalPropertyId = propertyId || process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
    let finalWidgetId = widgetId || process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

    // Multi-tenant automatic fallback if propertyId/widgetId not set
    if (!finalPropertyId || finalPropertyId === "placeholder_property_id") {
      const isRoadToUmrah =
        siteConfig?.domain?.includes("roadtoumrah") ||
        (typeof window !== "undefined" && window.location.hostname.includes("roadtoumrah"));

      if (isRoadToUmrah) {
        finalPropertyId = "66d1556150c10f7a00a1eb2a";
        finalWidgetId = "default";
      } else {
        finalPropertyId = "658f9a8d0ff6374032ba772c";
        finalWidgetId = "1hisf7f6b";
      }
    }

    const loadTawkTo = () => {
      if (!finalPropertyId || !finalWidgetId) return;
      if (document.getElementById("tawkto-script")) return;

      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.id = "tawkto-script";
      s1.async = true;
      s1.src = `https://embed.tawk.to/${finalPropertyId}/${finalWidgetId}`;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.body.appendChild(s1);
      }
    };

    // Defer loading to improve PageSpeed Insights performance
    let loaded = false;
    const timer = setTimeout(() => {
      if (!loaded) {
        loaded = true;
        loadTawkTo();
        clearEvents();
      }
    }, 4000);

    const handleInteraction = () => {
      if (!loaded) {
        loaded = true;
        loadTawkTo();
        clearTimeout(timer);
        clearEvents();
      }
    };

    const events = ["scroll", "mousemove", "touchstart", "keydown"];
    const clearEvents = () =>
      events.forEach((e) => window.removeEventListener(e, handleInteraction));

    events.forEach((e) =>
      window.addEventListener(e, handleInteraction, { once: true })
    );

    return () => {
      clearTimeout(timer);
      clearEvents();
    };
  }, [propertyId, widgetId, siteConfig]);

  return null;
}
