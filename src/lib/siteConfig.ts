export type SiteConfig = {
  domain: string;
  currencySymbol: string;
  currencyCode: string;
  exchangeRate: number; // Multiplier from base database price (GBP) to this currency
  allowedTabs: string[];
  logoUrl: string;
};

export const SITE_CONFIGS: Record<string, SiteConfig> = {
  "terrifictravelltd.com": {
    domain: "terrifictravelltd.com",
    currencySymbol: "$",
    currencyCode: "USD",
    exchangeRate: 1.25, // Base conversion rate to USD
    allowedTabs: ["flight", "holiday", "umrah", "hajj", "visa", "transport"],
    logoUrl: "/Logo.svg",
  },
  "terrifictravel.co.uk": {
    domain: "terrifictravel.co.uk",
    currencySymbol: "£",
    currencyCode: "GBP",
    exchangeRate: 1.0,
    allowedTabs: ["flight", "holiday", "umrah", "hajj", "visa", "transport"],
    logoUrl: "/Logo.svg",
  },
  "roadtoumrah.co.uk": {
    domain: "roadtoumrah.co.uk",
    currencySymbol: "£",
    currencyCode: "GBP",
    exchangeRate: 1.0,
    allowedTabs: ["umrah", "hajj", "visa", "transport"],
    logoUrl: "/roadtoumrah-logo.png", // The user should upload this file to the public folder
  },
};

export const DEFAULT_CONFIG = SITE_CONFIGS["terrifictravel.co.uk"];

export function getSiteConfig(domain: string | null): SiteConfig {
  if (!domain) return DEFAULT_CONFIG;

  // Normalize domain (remove www., port numbers)
  let normalized = domain.toLowerCase().replace(/^www\./, "");
  if (normalized.includes(":")) {
    normalized = normalized.split(":")[0];
  }

  // For testing locally, uncomment the below line to force a specific domain
  // if (normalized === "localhost" || normalized === "127.0.0.1") return SITE_CONFIGS["roadtoumrah.co.uk"];
  // if (normalized === "localhost" || normalized === "127.0.0.1") return SITE_CONFIGS["terrifictravelltd.com"];

  return SITE_CONFIGS[normalized] || DEFAULT_CONFIG;
}

export function formatPrice(
  basePrice: number | string,
  config: SiteConfig,
): string {
  // Extract number if it's a string like "£775"
  const numericPrice =
    typeof basePrice === "string"
      ? parseFloat(basePrice.replace(/[^0-9.]/g, ""))
      : basePrice;
  if (isNaN(numericPrice))
    return typeof basePrice === "string" ? basePrice : "N/A";

  const convertedPrice = numericPrice * config.exchangeRate;

  // Format with commas, no decimals for round numbers, 2 decimals otherwise
  const formattedNumber =
    convertedPrice % 1 === 0
      ? convertedPrice.toLocaleString("en-US")
      : convertedPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return `${config.currencySymbol}${formattedNumber}`;
}
