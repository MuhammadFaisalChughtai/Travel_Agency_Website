/**
 * Relevant Image Fetcher for Travel Agency Website
 * Provides high-quality, topic-matched travel photos for Packages, Flights, and Blogs.
 */

export interface ImageResult {
  url: string;
  alt: string;
  source: string;
}

// Curated high-resolution fallback library by topic/destination to guarantee zero broken images
const CURATED_IMAGE_LIBRARY: Record<string, string[]> = {
  makkah: [
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
  ],
  madinah: [
    "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
  ],
  hajj: [
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
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
  const query = (params.destination || params.topic || params.type || "travel").toLowerCase();
  const titleText = params.fallbackTitle || params.topic || "Travel Package";

  // 1. Check Unsplash Source direct keyword URL
  let categoryKey = "holiday";
  if (query.includes("makkah") || query.includes("mecca")) categoryKey = "makkah";
  else if (query.includes("madinah") || query.includes("medina")) categoryKey = "madinah";
  else if (query.includes("hajj")) categoryKey = "hajj";
  else if (query.includes("umrah")) categoryKey = "makkah";
  else if (query.includes("cruise")) categoryKey = "cruise";
  else if (query.includes("flight") || query.includes("airline")) categoryKey = "flight";
  else if (query.includes("maldives")) categoryKey = "maldives";
  else if (query.includes("dubai")) categoryKey = "dubai";
  else if (query.includes("turkey") || query.includes("istanbul")) categoryKey = "turkey";

  const list = CURATED_IMAGE_LIBRARY[categoryKey] || CURATED_IMAGE_LIBRARY["holiday"];
  const selectedUrl = list[Math.floor(Math.random() * list.length)];

  return {
    url: selectedUrl,
    alt: `${titleText} - Premium travel experience with Terrific Travel`,
    source: "Unsplash",
  };
}
