/**
 * Schema.org JSON-LD Generator for SEO Compliance
 * Supports TouristTrip (Umrah, Hajj, Holiday, Cruise), Flight, and BlogPosting/FAQPage.
 */

export interface PackageSchemaData {
  title: string;
  description: string;
  slug: string;
  price: number;
  type: string;
  destination: string;
  duration: string;
  imageUrl?: string;
  meccaHotel?: string | null;
  meccaNights?: number | null;
  medinaHotel?: string | null;
  medinaNights?: number | null;
  faqs?: Array<{ question: string; answer: string }>;
  domainUrl?: string;
}

export interface FlightSchemaData {
  airline: string;
  airlineCode?: string | null;
  departure: string;
  departureCode?: string | null;
  destination: string;
  destinationCode?: string | null;
  price: number;
  duration?: string | null;
  isTransit?: boolean;
  slug?: string | null;
  domainUrl?: string;
}

export interface BlogSchemaData {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  imageUrl?: string;
  faqs?: Array<{ question: string; answer: string }>;
  domainUrl?: string;
}

export function generatePackageSchema(data: PackageSchemaData) {
  const baseUrl = data.domainUrl || "https://terrifictravel.co.uk";
  const pageUrl = `${baseUrl}/v/${data.slug}`;
  const isReligious = data.type === "UMRAH" || data.type === "HAJJ" || data.type === "Cruise_Umrah";

  const itinerarySteps = [];

  if (isReligious) {
    itinerarySteps.push({
      "@type": "Day",
      "name": "Day 1: UK Departure & Arrival in Saudi Arabia",
      "description": "Flight departure from UK airport (LHR/LGW/MAN/BHX), airport transfer and hotel check-in.",
    });

    if (data.meccaHotel && data.meccaNights) {
      itinerarySteps.push({
        "@type": "TouristAttraction",
        "name": `Makkah Stay: ${data.meccaNights} Nights at ${data.meccaHotel}`,
        "description": `Stay in Makkah for ${data.meccaNights} nights at ${data.meccaHotel} with convenient access to Masjid al-Haram, guided Ziyarat, and Ihram support.`,
      });
    }

    if (data.medinaHotel && data.medinaNights) {
      itinerarySteps.push({
        "@type": "TouristAttraction",
        "name": `Madinah Stay: ${data.medinaNights} Nights at ${data.medinaHotel}`,
        "description": `Stay in Madinah for ${data.medinaNights} nights at ${data.medinaHotel} near Masjid an-Nabawi with Rawdah visits and holy site tours.`,
      });
    }

    itinerarySteps.push({
      "@type": "Day",
      "name": "Final Day: Return Flight to UK",
      "description": "Private transfer to airport for scheduled return flight back to the United Kingdom.",
    });
  }

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": data.title,
    "description": data.description.replace(/<[^>]*>/g, "").substring(0, 300),
    "url": pageUrl,
    "image": data.imageUrl || `${baseUrl}/images/placeholder.jpg`,
    "touristType": isReligious ? ["Pilgrim", "Spiritual Traveler"] : ["Holiday Traveler", "Leisure"],
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": pageUrl,
      "validFrom": new Date().toISOString(),
      "seller": {
        "@type": "TravelAgency",
        "name": "Terrific Travel Ltd",
        "url": baseUrl,
      },
    },
    "provider": {
      "@type": "TravelAgency",
      "name": "Terrific Travel Ltd",
      "url": baseUrl,
      "telephone": "+441215291630",
    },
  };

  if (itinerarySteps.length > 0) {
    schema["itinerary"] = itinerarySteps;
  }

  const result: any[] = [schema];

  if (data.faqs && data.faqs.length > 0) {
    result.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    });
  }

  return result;
}

export function generateFlightSchema(data: FlightSchemaData) {
  const baseUrl = data.domainUrl || "https://terrifictravel.co.uk";
  const pageUrl = data.slug ? `${baseUrl}/v/${data.slug}` : baseUrl;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": `${data.airline} Flight ${data.departure} to ${data.destination}`,
      "provider": {
        "@type": "Airline",
        "name": data.airline,
        "iataCode": data.airlineCode || undefined,
      },
      "departureAirport": {
        "@type": "Airport",
        "name": data.departure,
        "iataCode": data.departureCode || undefined,
      },
      "arrivalAirport": {
        "@type": "Airport",
        "name": data.destination,
        "iataCode": data.destinationCode || undefined,
      },
      "offers": {
        "@type": "Offer",
        "price": data.price,
        "priceCurrency": "GBP",
        "url": pageUrl,
        "seller": {
          "@type": "TravelAgency",
          "name": "Terrific Travel Ltd",
        },
      },
    },
  ];
}

export function generateBlogSchema(data: BlogSchemaData) {
  const baseUrl = data.domainUrl || "https://terrifictravel.co.uk";
  const pageUrl = `${baseUrl}/blog/${data.slug}`;

  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.title,
      "description": data.excerpt,
      "url": pageUrl,
      "image": data.imageUrl || `${baseUrl}/images/blog-placeholder.jpg`,
      "datePublished": data.date,
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "Terrific Travel Editorial Team",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Terrific Travel Ltd",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
        },
      },
    },
  ];

  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    });
  }

  return schemas;
}
