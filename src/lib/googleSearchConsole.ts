import { JWT } from "google-auth-library";
import { prisma } from "@/lib/prisma";

export interface GscSearchRow {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscCredentials {
  clientEmail: string;
  privateKey: string;
  siteUrl: string;
}

export interface GscOpportunities {
  allQueries: GscSearchRow[];
  strikingDistance: GscSearchRow[]; // Positions 4.0 - 20.0: quickest wins to reach top 3
  highImpressionLowCtr: GscSearchRow[]; // High impressions but low CTR: meta rewrite needed
  topPerformers: GscSearchRow[]; // Positions 1-3: preserve and protect
  pageQueryMap: Record<string, GscSearchRow[]>; // Maps page URL -> queries
}

/**
 * Retrieve Google Search Console credentials from:
 * 1. Environment variables (GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY, GSC_SITE_URL)
 * 2. Raw JSON environment variable (GSC_SERVICE_ACCOUNT_JSON)
 * 3. Database SystemSetting table (gsc_client_email, gsc_private_key, gsc_site_url)
 */
export async function getGscCredentials(): Promise<GscCredentials | null> {
  // Option A: Raw JSON env var
  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
      const siteUrl = process.env.GSC_SITE_URL || parsed.site_url || "sc-domain:terrifictravel.co.uk";
      if (parsed.client_email && parsed.private_key) {
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key,
          siteUrl,
        };
      }
    } catch (e) {
      console.error("[GSC] Failed to parse GSC_SERVICE_ACCOUNT_JSON:", e);
    }
  }

  // Option B: Discrete env vars
  const envEmail = process.env.GSC_CLIENT_EMAIL;
  const envKey = process.env.GSC_PRIVATE_KEY;
  const envSite = process.env.GSC_SITE_URL;

  if (envEmail && envKey && envSite) {
    return {
      clientEmail: envEmail.trim(),
      privateKey: envKey.replace(/\\n/g, "\n").trim(),
      siteUrl: envSite.trim(),
    };
  }

  // Option C: Database SystemSetting table
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ["gsc_client_email", "gsc_private_key", "gsc_site_url"],
        },
      },
    });

    const config: Record<string, string> = {};
    settings.forEach((s) => {
      config[s.key] = s.value;
    });

    if (config.gsc_client_email && config.gsc_private_key && config.gsc_site_url) {
      return {
        clientEmail: config.gsc_client_email.trim(),
        privateKey: config.gsc_private_key.replace(/\\n/g, "\n").trim(),
        siteUrl: config.gsc_site_url.trim(),
      };
    }
  } catch (err) {
    console.error("[GSC] Error loading credentials from database:", err);
  }

  return null;
}

/**
 * Generate a short-lived OAuth 2.0 Bearer access token using Google Service Account JWT.
 */
export async function getGscAccessToken(credentials: GscCredentials): Promise<string> {
  const jwt = new JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const res = await jwt.getAccessToken();
  if (!res.token) {
    throw new Error("Failed to generate Google Search Console access token.");
  }
  return res.token;
}

/**
 * Fetch search analytics from Google Search Console for a given date range.
 * Default is the last 28 days (ending 2 days ago due to GSC data latency).
 */
export async function fetchSearchConsoleAnalytics(options?: {
  daysBack?: number;
  rowLimit?: number;
  siteUrlOverride?: string;
}): Promise<GscSearchRow[]> {
  const credentials = await getGscCredentials();
  if (!credentials) {
    throw new Error(
      "Google Search Console credentials not configured. Please set GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY, and GSC_SITE_URL."
    );
  }

  const siteUrl = options?.siteUrlOverride || credentials.siteUrl;
  const token = await getGscAccessToken(credentials);

  // Compute dates: GSC has a 2-day data lag
  const daysBack = options?.daysBack || 28;
  const endDateObj = new Date();
  endDateObj.setDate(endDateObj.getDate() - 2);

  const startDateObj = new Date(endDateObj);
  startDateObj.setDate(startDateObj.getDate() - daysBack);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const startDate = formatDate(startDateObj);
  const endDate = formatDate(endDateObj);

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl
  )}/searchAnalytics/query`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["query", "page"],
      rowLimit: options?.rowLimit || 1000,
      aggregationType: "auto",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Search Console API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.rows || !Array.isArray(data.rows)) {
    return [];
  }

  return data.rows.map((row: any) => ({
    query: (row.keys?.[0] || "").toLowerCase().trim(),
    page: row.keys?.[1] || "",
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
    ctr: Number(row.ctr || 0),
    position: Number(row.position ? row.position.toFixed(1) : 0),
  }));
}

/**
 * Filter and categorize GSC queries into actionable high-intent SEO opportunities.
 */
export function analyzeSearchConsoleOpportunities(rows: GscSearchRow[]): GscOpportunities {
  const pageQueryMap: Record<string, GscSearchRow[]> = {};

  rows.forEach((r) => {
    if (!pageQueryMap[r.page]) {
      pageQueryMap[r.page] = [];
    }
    pageQueryMap[r.page].push(r);
  });

  // Striking distance: positions 4.0 through 20.0 with at least 5 impressions
  const strikingDistance = rows
    .filter((r) => r.position >= 4.0 && r.position <= 20.0 && r.impressions >= 5)
    .sort((a, b) => b.impressions - a.impressions);

  // High impression but low CTR (less than 3%) on positions <= 15: needs title/meta tag boost
  const highImpressionLowCtr = rows
    .filter((r) => r.impressions >= 25 && r.ctr < 0.03 && r.position <= 15.0)
    .sort((a, b) => b.impressions - a.impressions);

  // Top performers: already in top 3
  const topPerformers = rows
    .filter((r) => r.position < 4.0 && r.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks);

  return {
    allQueries: rows,
    strikingDistance,
    highImpressionLowCtr,
    topPerformers,
    pageQueryMap,
  };
}

/**
 * Test the GSC connection and return status information.
 */
export async function testSearchConsoleConnection(): Promise<{
  success: boolean;
  message: string;
  siteUrl?: string;
  rowCount?: number;
  sampleQueries?: string[];
}> {
  try {
    const credentials = await getGscCredentials();
    if (!credentials) {
      return {
        success: false,
        message: "No credentials found. Set GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY, and GSC_SITE_URL in .env or admin settings.",
      };
    }

    const rows = await fetchSearchConsoleAnalytics({ daysBack: 7, rowLimit: 10 });
    const sampleQueries = rows.map((r) => `"${r.query}" (Pos ${r.position}, ${r.impressions} imps)`).slice(0, 5);

    return {
      success: true,
      message: `Successfully connected to Google Search Console for '${credentials.siteUrl}'!`,
      siteUrl: credentials.siteUrl,
      rowCount: rows.length,
      sampleQueries,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to connect to Google Search Console API.",
    };
  }
}