/**
 * Travelport+ (v11) API Service
 * Integration for Air Catalog Search, Pricing, and Booking Inquiries
 */

const TRAVELPORT_CLIENT_ID =
  process.env.TRAVELPORT_CLIENT_ID || "2C9uuTkO7EC96maT3ewQLANt6tag6knC";
const TRAVELPORT_CLIENT_SECRET =
  process.env.TRAVELPORT_CLIENT_SECRET ||
  "WfZbPITTd66c4EgtmHiRmCk1EuTzZQmaROQv0fG-twd0PTcZ_4v86AHN6yuIzDtx";
const TRAVELPORT_USERNAME =
  process.env.TRAVELPORT_USERNAME || "TP92105605";
const TRAVELPORT_PASSWORD =
  process.env.TRAVELPORT_PASSWORD || "$VPod}!k<)6[q";
const TRAVELPORT_PCC = process.env.TRAVELPORT_PCC || "7K99_1G";

const TRAVELPORT_AUTH_URL =
  process.env.TRAVELPORT_AUTH_URL ||
  "https://auth.pp.travelport.com/oauth/token";
const TRAVELPORT_AIR_SEARCH_URL =
  process.env.TRAVELPORT_AIR_SEARCH_URL ||
  "https://api.pp.travelport.net/11/air/catalog/search/catalogproductofferings";

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getTravelportAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 300000) {
    // Return cached token if valid for at least another 5 minutes
    return cachedToken;
  }

  const basicAuth = Buffer.from(
    `${TRAVELPORT_CLIENT_ID}:${TRAVELPORT_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", TRAVELPORT_USERNAME);
  params.append("password", TRAVELPORT_PASSWORD);

  const res = await fetch(TRAVELPORT_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[Travelport Auth Error]", res.status, errorText);
    throw new Error(`Travelport authentication failed: ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  const expiresIn = data.expires_in || 86400;
  tokenExpiresAt = now + expiresIn * 1000;

  return cachedToken!;
}

export interface FlightSegmentDetail {
  flightNumber: string;
  carrier: string;
  airline: string;
  departureAirport: string;
  departureTerminal?: string;
  departureDate: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTerminal?: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  connectionDuration?: string;
}

export interface FlightLegDetail {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  airline: string;
  carrier: string;
  flightNumbers: string;
  totalDuration: string;
  stopsCount: number;
  isDirect: boolean;
  segments: FlightSegmentDetail[];
  cabin: string;
}

export interface FlightSearchResultItem {
  id: string;
  tripType: "one-way" | "return" | "multi-city";
  price: number;
  currency: string;
  airline: string;
  carrier: string;
  outbound: FlightLegDetail;
  inbound?: FlightLegDetail;
  legs?: FlightLegDetail[];
  baggage: string;
  cabin: string;
  source: string;
}

export interface SearchFlightsParams {
  tripType: "one-way" | "return" | "multi-city";
  legs: Array<{
    from: string;
    to: string;
    departureDate: string;
  }>;
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabin?: "Economy" | "PremiumEconomy" | "Business" | "First";
  bags?: number;
}

function parseDuration(pt?: string): string {
  if (!pt) return "";
  const match = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return pt;
  const h = match[1] ? `${match[1]}h` : "";
  const m = match[2] ? `${match[2]}m` : "";
  return [h, m].filter(Boolean).join(" ");
}

const AIRLINES_MAP: Record<string, string> = {
  TP: "TAP Air Portugal",
  BA: "British Airways",
  EK: "Emirates",
  SV: "Saudia",
  QR: "Qatar Airways",
  TK: "Turkish Airlines",
  PK: "Pakistan International Airlines",
  EY: "Etihad Airways",
  GF: "Gulf Air",
  WY: "Oman Air",
  KU: "Kuwait Airways",
  MS: "EgyptAir",
  RJ: "Royal Jordanian",
  UA: "United Airlines",
  AA: "American Airlines",
  DL: "Delta Air Lines",
  VS: "Virgin Atlantic",
  LH: "Lufthansa",
  AF: "Air France",
  KL: "KLM",
  AI: "Air India",
  SQ: "Singapore Airlines",
  MH: "Malaysia Airlines",
  TG: "Thai Airways",
  CX: "Cathay Pacific",
  AC: "Air Canada",
  LX: "Swiss International Air Lines",
  OS: "Austrian Airlines",
  IB: "Iberia",
  AZ: "ITA Airways",
};

export function getAirlineName(code: string): string {
  if (!code) return "Airline";
  return AIRLINES_MAP[code.toUpperCase()] || `${code.toUpperCase()} Airlines`;
}

export async function searchTravelportFlights(
  params: SearchFlightsParams
): Promise<{
  success: boolean;
  flights: FlightSearchResultItem[];
  message?: string;
}> {
  try {
    const token = await getTravelportAccessToken();

    // Build passenger criteria
    const passengerCriteria: any[] = [];
    const adults = Math.max(1, params.passengers?.adults || 1);
    passengerCriteria.push({
      value: "ADT",
      number: adults,
    });
    if (params.passengers?.children && params.passengers.children > 0) {
      passengerCriteria.push({
        value: "CHD",
        number: params.passengers.children,
      });
    }
    if (params.passengers?.infants && params.passengers.infants > 0) {
      passengerCriteria.push({
        value: "INF",
        number: params.passengers.infants,
      });
    }

    // Build search flight criteria
    const searchCriteriaFlight = params.legs.map((leg) => ({
      departureDate: leg.departureDate,
      From: { value: leg.from.toUpperCase().trim() },
      To: { value: leg.to.toUpperCase().trim() },
    }));

    const requestBody = {
      CatalogProductOfferingsQueryRequest: {
        CatalogProductOfferingsRequest: {
          "@type": "CatalogProductOfferingsRequestAir",
          maxOfferings: 30,
          contentSourceList: ["GDS"],
          PassengerCriteria: passengerCriteria,
          SearchCriteriaFlight: searchCriteriaFlight,
        },
      },
    };

    const res = await fetch(TRAVELPORT_AIR_SEARCH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "TVP-PCC-Core": TRAVELPORT_PCC,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Travelport Search HTTP Error]", res.status, errText);
      return {
        success: false,
        flights: [],
        message: `Travelport search error: ${res.statusText}`,
      };
    }

    const data = await res.json();
    const cpoResp = data.CatalogProductOfferingsResponse;

    if (!cpoResp) {
      return {
        success: false,
        flights: [],
        message: "Invalid response from Travelport.",
      };
    }

    // Check for Travelport GDS error
    if (cpoResp.Result?.Error?.length > 0) {
      const firstErr = cpoResp.Result.Error[0];
      console.warn("[Travelport Search Result Error]", firstErr);
      // If no offers found in the channel (e.g. PP test sandbox route)
      if (firstErr.SourceCode === "9000" || firstErr.Message?.includes("NO OFFERS")) {
        return {
          success: true,
          flights: [],
          message:
            "No direct offers were found in GDS for this specific route and dates. Please try other dates or contact us for private offline fares.",
        };
      }
    }

    const flights = parseTravelportOfferings(data, params);
    return {
      success: true,
      flights,
    };
  } catch (error: any) {
    console.error("[Travelport Search Exception]", error);
    return {
      success: false,
      flights: [],
      message: error.message || "Failed to search flights on Travelport.",
    };
  }
}

function parseTravelportOfferings(
  data: any,
  params: SearchFlightsParams
): FlightSearchResultItem[] {
  const resp = data?.CatalogProductOfferingsResponse;
  if (!resp || !resp.CatalogProductOfferings) return [];

  const refFlightsList =
    resp.ReferenceList?.find((r: any) => r["@type"] === "ReferenceListFlight")
      ?.Flight || [];
  const refProductsList =
    resp.ReferenceList?.find((r: any) => r["@type"] === "ReferenceListProduct")
      ?.Product || [];
  const refTermsList =
    resp.ReferenceList?.find(
      (r: any) => r["@type"] === "ReferenceListTermsAndConditions"
    )?.TermsAndConditions || [];

  const flightMap = new Map<string, any>();
  refFlightsList.forEach((f: any) => flightMap.set(f.id, f));

  const productMap = new Map<string, any>();
  refProductsList.forEach((p: any) => productMap.set(p.id, p));

  const termsMap = new Map<string, any>();
  refTermsList.forEach((t: any) => termsMap.set(t.id, t));

  const offerings =
    resp.CatalogProductOfferings.CatalogProductOffering || [];
  const results: FlightSearchResultItem[] = [];

  const originCode = params.legs[0]?.from?.toUpperCase().trim();

  if (params.tripType === "return") {
    // In return trips, group by CombinabilityCode
    const combinableGroups = new Map<string, any>();

    offerings.forEach((offering: any) => {
      offering.ProductBrandOptions?.forEach((pbo: any) => {
        pbo.ProductBrandOffering?.forEach((brandOffering: any) => {
          const comboCode =
            brandOffering.CombinabilityCode?.[0] || offering.id;
          if (!combinableGroups.has(comboCode)) {
            combinableGroups.set(comboCode, {
              comboCode,
              price: brandOffering.BestCombinablePrice?.TotalPrice || 0,
              currency:
                brandOffering.BestCombinablePrice?.CurrencyCode?.value || "GBP",
              legs: [] as FlightLegDetail[],
            });
          }
          const group = combinableGroups.get(comboCode);

          const productRef = brandOffering.Product?.[0]?.productRef;
          const product = productMap.get(productRef);

          const segments: FlightSegmentDetail[] = [];
          product?.FlightSegment?.forEach((seg: any) => {
            const flight = flightMap.get(seg.Flight?.FlightRef);
            if (flight) {
              segments.push({
                flightNumber: `${flight.carrier} ${flight.number}`,
                carrier: flight.carrier,
                airline: getAirlineName(flight.carrier),
                departureAirport: flight.Departure?.location,
                departureTerminal: flight.Departure?.terminal,
                departureDate: flight.Departure?.date,
                departureTime: flight.Departure?.time,
                arrivalAirport: flight.Arrival?.location,
                arrivalTerminal: flight.Arrival?.terminal,
                arrivalDate: flight.Arrival?.date,
                arrivalTime: flight.Arrival?.time,
                duration: parseDuration(flight.duration),
                connectionDuration: parseDuration(seg.connectionDuration),
              });
            }
          });

          if (segments.length > 0) {
            const firstSeg = segments[0];
            const lastSeg = segments[segments.length - 1];
            group.legs.push({
              departureAirport: firstSeg.departureAirport,
              arrivalAirport: lastSeg.arrivalAirport,
              departureDate: firstSeg.departureDate,
              departureTime: firstSeg.departureTime,
              arrivalDate: lastSeg.arrivalDate,
              arrivalTime: lastSeg.arrivalTime,
              airline: firstSeg.airline,
              carrier: firstSeg.carrier,
              flightNumbers: segments.map((s) => s.flightNumber).join(", "),
              totalDuration: parseDuration(product?.totalDuration),
              stopsCount: segments.length - 1,
              isDirect: segments.length === 1,
              segments,
              cabin:
                product?.PassengerFlight?.[0]?.FlightProduct?.[0]?.cabin ||
                params.cabin ||
                "Economy",
            });
          }
        });
      });
    });

    combinableGroups.forEach((group, id) => {
      if (group.legs.length >= 2) {
        // Ensure outbound is the leg from origin, inbound is the return
        let outbound = group.legs[0];
        let inbound = group.legs[1];

        if (
          originCode &&
          inbound.departureAirport === originCode &&
          outbound.departureAirport !== originCode
        ) {
          outbound = group.legs[1];
          inbound = group.legs[0];
        }

        results.push({
          id: `tp-cpo-${id}`,
          tripType: "return",
          price: Math.round(group.price * 100) / 100,
          currency: group.currency,
          airline: outbound.airline,
          carrier: outbound.carrier,
          outbound,
          inbound,
          baggage: "Checked: 1x 23kg, Cabin: 1x 8kg",
          cabin: outbound.cabin,
          source: "Travelport GDS",
        });
      }
    });
  } else if (params.tripType === "multi-city") {
    // Multi-city
    offerings.forEach((offering: any, idx: number) => {
      offering.ProductBrandOptions?.forEach((pbo: any) => {
        pbo.ProductBrandOffering?.forEach((brandOffering: any) => {
          const productRef = brandOffering.Product?.[0]?.productRef;
          const product = productMap.get(productRef);

          const segments: FlightSegmentDetail[] = [];
          product?.FlightSegment?.forEach((seg: any) => {
            const flight = flightMap.get(seg.Flight?.FlightRef);
            if (flight) {
              segments.push({
                flightNumber: `${flight.carrier} ${flight.number}`,
                carrier: flight.carrier,
                airline: getAirlineName(flight.carrier),
                departureAirport: flight.Departure?.location,
                departureTerminal: flight.Departure?.terminal,
                departureDate: flight.Departure?.date,
                departureTime: flight.Departure?.time,
                arrivalAirport: flight.Arrival?.location,
                arrivalTerminal: flight.Arrival?.terminal,
                arrivalDate: flight.Arrival?.date,
                arrivalTime: flight.Arrival?.time,
                duration: parseDuration(flight.duration),
                connectionDuration: parseDuration(seg.connectionDuration),
              });
            }
          });

          if (segments.length > 0) {
            const firstSeg = segments[0];
            const lastSeg = segments[segments.length - 1];
            const legDetail: FlightLegDetail = {
              departureAirport: firstSeg.departureAirport,
              arrivalAirport: lastSeg.arrivalAirport,
              departureDate: firstSeg.departureDate,
              departureTime: firstSeg.departureTime,
              arrivalDate: lastSeg.arrivalDate,
              arrivalTime: lastSeg.arrivalTime,
              airline: firstSeg.airline,
              carrier: firstSeg.carrier,
              flightNumbers: segments.map((s) => s.flightNumber).join(", "),
              totalDuration: parseDuration(product?.totalDuration),
              stopsCount: segments.length - 1,
              isDirect: segments.length === 1,
              segments,
              cabin:
                product?.PassengerFlight?.[0]?.FlightProduct?.[0]?.cabin ||
                params.cabin ||
                "Economy",
            };

            results.push({
              id: `tp-multi-${offering.id}-${idx}`,
              tripType: "multi-city",
              price:
                Math.round(
                  (brandOffering.BestCombinablePrice?.TotalPrice || 0) * 100
                ) / 100,
              currency:
                brandOffering.BestCombinablePrice?.CurrencyCode?.value || "GBP",
              airline: firstSeg.airline,
              carrier: firstSeg.carrier,
              outbound: legDetail,
              legs: [legDetail],
              baggage: "Checked: 1x 23kg, Cabin: 1x 8kg",
              cabin: legDetail.cabin,
              source: "Travelport GDS",
            });
          }
        });
      });
    });
  } else {
    // One-way
    offerings.forEach((offering: any, idx: number) => {
      offering.ProductBrandOptions?.forEach((pbo: any) => {
        pbo.ProductBrandOffering?.forEach((brandOffering: any) => {
          const productRef = brandOffering.Product?.[0]?.productRef;
          const product = productMap.get(productRef);

          const segments: FlightSegmentDetail[] = [];
          product?.FlightSegment?.forEach((seg: any) => {
            const flight = flightMap.get(seg.Flight?.FlightRef);
            if (flight) {
              segments.push({
                flightNumber: `${flight.carrier} ${flight.number}`,
                carrier: flight.carrier,
                airline: getAirlineName(flight.carrier),
                departureAirport: flight.Departure?.location,
                departureTerminal: flight.Departure?.terminal,
                departureDate: flight.Departure?.date,
                departureTime: flight.Departure?.time,
                arrivalAirport: flight.Arrival?.location,
                arrivalTerminal: flight.Arrival?.terminal,
                arrivalDate: flight.Arrival?.date,
                arrivalTime: flight.Arrival?.time,
                duration: parseDuration(flight.duration),
                connectionDuration: parseDuration(seg.connectionDuration),
              });
            }
          });

          if (segments.length > 0) {
            const firstSeg = segments[0];
            const lastSeg = segments[segments.length - 1];
            const outbound: FlightLegDetail = {
              departureAirport: firstSeg.departureAirport,
              arrivalAirport: lastSeg.arrivalAirport,
              departureDate: firstSeg.departureDate,
              departureTime: firstSeg.departureTime,
              arrivalDate: lastSeg.arrivalDate,
              arrivalTime: lastSeg.arrivalTime,
              airline: firstSeg.airline,
              carrier: firstSeg.carrier,
              flightNumbers: segments.map((s) => s.flightNumber).join(", "),
              totalDuration: parseDuration(product?.totalDuration),
              stopsCount: segments.length - 1,
              isDirect: segments.length === 1,
              segments,
              cabin:
                product?.PassengerFlight?.[0]?.FlightProduct?.[0]?.cabin ||
                params.cabin ||
                "Economy",
            };

            results.push({
              id: `tp-oneway-${offering.id}-${idx}`,
              tripType: "one-way",
              price:
                Math.round(
                  (brandOffering.BestCombinablePrice?.TotalPrice || 0) * 100
                ) / 100,
              currency:
                brandOffering.BestCombinablePrice?.CurrencyCode?.value || "GBP",
              airline: firstSeg.airline,
              carrier: firstSeg.carrier,
              outbound,
              baggage: "Checked: 1x 23kg, Cabin: 1x 8kg",
              cabin: outbound.cabin,
              source: "Travelport GDS",
            });
          }
        });
      });
    });
  }

  // Sort by price ascending
  results.sort((a, b) => a.price - b.price);

  // Deduplicate by airline and flight numbers to show distinct flight options
  const uniqueKeys = new Set<string>();
  const deduplicated = results.filter((item) => {
    const key = `${item.airline}-${item.outbound?.flightNumbers}-${item.inbound?.flightNumbers || ""}-${item.price}`;
    if (uniqueKeys.has(key)) return false;
    uniqueKeys.add(key);
    return true;
  });

  return deduplicated.slice(0, 30);
}
