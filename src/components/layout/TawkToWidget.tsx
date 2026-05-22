"use client";

import { useEffect } from "react";

export function TawkToWidget() {
  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

    // Don't load if still on placeholder values
    if (
      !propertyId ||
      !widgetId ||
      propertyId === "placeholder_property_id" ||
      widgetId === "placeholder_widget_id"
    ) {
      return;
    }

    // Prevent duplicate script injection
    if (document.getElementById("tawkto-script")) return;

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}
