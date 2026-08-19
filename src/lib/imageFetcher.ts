/**
 * Relevant Image Fetcher for Travel Agency Website
 * Provides high-quality, topic-matched travel photos for Packages, Flights, and Blogs.
 * Guarantees zero generic stock/wedding images for Umrah & Hajj packages.
 */

export interface ImageResult {
  url: string;
  alt: string;
  source: string;
}

// Curated high-resolution verified library by topic/destination
const CURATED_IMAGE_LIBRARY: Record<string, string[]> = {
  makkah: [
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1200&q=80",
  ],
  madinah: [
    "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
  ],
  hajj: [
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
  ],
  cruise: [
    "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80",
  ],
  flight: [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
  ],
  maldives: [
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
  ],
  dubai: [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  ],
  turkey: [
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  ],
  holiday: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1476514525535-ce74f45814d9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
  ]
};

export async function fetchRelevantImage(params: {
  topic: string;
  destination?: string;
  type?: string;
  fallbackTitle?: string;
}): Promise<ImageResult> {
  const fullText = `${params.type || ""} ${params.fallbackTitle || ""} ${params.topic || ""} ${params.destination || ""}`.toLowerCase();
  const titleText = params.fallbackTitle || params.topic || "Travel Package";

  let categoryKey = "holiday";

  // 1. Strict Religious Priority (Umrah / Hajj / Makkah / Madinah)
  if (
    params.type === "UMRAH" || 
    params.type === "HAJJ" || 
    params.type === "Cruise_Umrah" ||
    fullText.includes("umrah") ||
    fullText.includes("makkah") ||
    fullText.includes("mecca")
  ) {
    if (fullText.includes("madinah") || fullText.includes("medina")) {
      categoryKey = "madinah";
    } else if (params.type === "HAJJ" || fullText.includes("hajj")) {
      categoryKey = "hajj";
    } else {
      categoryKey = "makkah";
    }
  } else if (fullText.includes("madinah") || fullText.includes("medina")) {
    categoryKey = "madinah";
  } else if (fullText.includes("hajj")) {
    categoryKey = "hajj";
  } else if (fullText.includes("cruise") || params.type === "Cruise_Umrah") {
    categoryKey = "cruise";
  } else if (fullText.includes("flight") || fullText.includes("airline")) {
    categoryKey = "flight";
  } else if (fullText.includes("maldives")) {
    categoryKey = "maldives";
  } else if (fullText.includes("dubai")) {
    categoryKey = "dubai";
  } else if (fullText.includes("turkey") || fullText.includes("istanbul")) {
    categoryKey = "turkey";
  }

  const list = CURATED_IMAGE_LIBRARY[categoryKey] || CURATED_IMAGE_LIBRARY["makkah"];
  const selectedUrl = list[Math.floor(Math.random() * list.length)];

  return {
    url: selectedUrl,
    alt: `${titleText} - Authentic holy site pilgrimage experience`,
    source: "Unsplash",
  };
}
