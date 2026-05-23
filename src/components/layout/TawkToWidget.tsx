"use client";

import { useEffect } from "react";

export function TawkToWidget() {
  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

    let finalPropertyId = propertyId;
    let finalWidgetId = widgetId;

    if (!propertyId || propertyId === "placeholder_property_id") {
      finalPropertyId = "66d1556150c10f7a00a1eb2a";
    }
    if (!widgetId || widgetId === "placeholder_widget_id") {
      finalWidgetId = "default";
    }

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
    s0.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}
