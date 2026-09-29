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

  // Sanitize password in case dotenv included quotes or expanded $VPod
  let pass = (TRAVELPORT_PASSWORD || "$VPod}!k<)6[q").trim();
  if ((pass.startsWith("'") && pass.endsWith("'")) || (pass.startsWith('"') && pass.endsWith('"'))) {
    pass = pass.slice(1, -1);
  }
  if (!pass.startsWith("$VPod") || pass.endsWith("!k<)6[q")) {
    pass = "$VPod}!k<)6[q";
  }

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", (TRAVELPORT_USERNAME || "TP92105605").trim());
  params.append("password", pass);
  params.append("client_id", (TRAVELPORT_CLIENT_ID || "2C9uuTkO7EC96maT3ewQLANt6tag6knC").trim());
  params.append("client_secret", (TRAVELPORT_CLIENT_SECRET || "WfZbPITTd66c4EgtmHiRmCk1EuTzZQmaROQv0fG-twd0PTcZ_4v86AHN6yuIzDtx").trim());

  const res = await fetch(TRAVELPORT_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
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

import { getAirportByCode } from "./airports";

export interface FlightSegmentDetail {
  flightNumber: string;
  carrier: string;
  airline: string;
  aircraft?: string;
  departureAirport: string;
  departureAirportName?: string;
  departureTerminal?: string;
  departureDate: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalAirportName?: string;
  arrivalTerminal?: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  connectionDuration?: string;
}

export interface FlightLegDetail {
  productRef?: string;
  departureAirport: string;
  departureAirportName?: string;
  arrivalAirport: string;
  arrivalAirportName?: string;
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
  PC: "Pegasus Airlines",
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
  FZ: "flydubai",
  XY: "Flynas",
  J9: "Jazeera Airways",
  G9: "Air Arabia",
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
  ET: "Ethiopian Airlines",
  ME: "Middle East Airlines",
  AT: "Royal Air Maroc",
  SN: "Brussels Airlines",
  AY: "Finnair",
  SK: "SAS Scandinavian Airlines",
  EI: "Aer Lingus",
  W6: "Wizz Air",
  U2: "easyJet",
  FR: "Ryanair",
};

export const AIRCRAFT_MAP: Record<string, string> = {
  "777": "Boeing 777",
  "77W": "Boeing 777-300ER",
  "772": "Boeing 777-200",
  "788": "Boeing 787-8 Dreamliner",
  "789": "Boeing 787-9 Dreamliner",
  "78X": "Boeing 787-10 Dreamliner",
  "738": "Boeing 737-800",
  "739": "Boeing 737-900",
  "73H": "Boeing 737-800 Winglets",
  "7M8": "Boeing 737 MAX 8",
  "7M9": "Boeing 737 MAX 9",
  "320": "Airbus A320",
  "32A": "Airbus A320 (Sharklets)",
  "32N": "Airbus A320neo",
  "321": "Airbus A321",
  "32B": "Airbus A321 (Sharklets)",
  "32Q": "Airbus A321neo",
  "319": "Airbus A319",
  "330": "Airbus A330",
  "332": "Airbus A330-200",
  "333": "Airbus A330-300",
  "339": "Airbus A330-900neo",
  "359": "Airbus A350-900",
  "351": "Airbus A350-1000",
  "388": "Airbus A380-800",
  "E90": "Embraer 190",
  "E95": "Embraer 195",
};

export function getAircraftName(code?: string): string {
  if (!code) return "Commercial Jet";
  return AIRCRAFT_MAP[code.toUpperCase()] || `Aircraft ${code.toUpperCase()}`;
}

export function getAirlineName(code: string): string {
  if (!code) return "Airline";
  return AIRLINES_MAP[code.toUpperCase()] || `${code.toUpperCase()} Airlines`;
}

export function formatBaggageAllowance(bags?: number): string {
  if (bags === 0) {
    return "Cabin: 1x 8kg (No Checked Bag)";
  }
  if (bags === 1) {
    return "Checked: 1x 23kg, Cabin: 1x 8kg";
  }
  if (bags === 2) {
    return "Checked: 2x 23kg, Cabin: 1x 8kg";
  }
  if (bags && bags >= 3) {
    return `Checked: ${bags}x 23kg, Cabin: 1x 8kg`;
  }
  // Default is 1 checked bag
  return "Checked: 1x 23kg, Cabin: 1x 8kg";
}

export function extractBaggageAllowanceFromTerms(
  productRefs: string | string[],
  termsList: any[],
  defaultBags?: number
): string {
  const refs = Array.isArray(productRefs) ? productRefs : [productRefs];
  const checkedParts: string[] = [];
  const carryOnParts: string[] = [];

  for (const terms of termsList || []) {
    const allowances = terms.BaggageAllowance || [];
    for (const ba of allowances) {
      const baRefs = Array.isArray(ba.ProductRef)
        ? ba.ProductRef
        : ba.ProductRef
        ? [ba.ProductRef]
        : [];
      const matches = refs.some((r) => baRefs.includes(r));
      if (!matches) continue;

      const items = ba.BaggageItem || [];
      for (const item of items) {
        if (item.includedInOfferPrice === "No") continue;

        let desc = "";
        const weight = item.Measurement?.find((m: any) => m.measurementType === "Weight");
        if (weight) {
          desc = `${weight.value}${weight.unit === "Kilograms" ? "kg" : weight.unit}`;
        } else if (item.quantity) {
          const text = item.Text || "";
          const matchKg = text.match(/(\d+)\s*K(?:G|GS)/i);
          if (matchKg) {
            desc = `${item.quantity > 1 ? `${item.quantity}x ` : ""}${matchKg[1]}kg`;
          } else {
            desc = `${item.quantity} Piece${item.quantity > 1 ? "s" : ""}`;
          }
        } else if (item.Text) {
          const matchKg = item.Text.match(/(\d+)\s*K(?:G|GS)/i);
          if (matchKg) {
            desc = `${matchKg[1]}kg`;
          }
        }

        if (ba.baggageType === "CarryOn") {
          if (desc && !carryOnParts.includes(desc)) carryOnParts.push(desc);
        } else if (
          ba.baggageType === "FirstCheckedBag" ||
          ba.baggageType === "SecondCheckedBag" ||
          ba.baggageType === "CheckedBag"
        ) {
          if (desc && !checkedParts.includes(desc)) checkedParts.push(desc);
        }
      }
    }
  }

  if (checkedParts.length > 0 || carryOnParts.length > 0) {
    const checkedStr =
      checkedParts.length > 0
        ? `Checked: ${checkedParts.join(", ")}`
        : "No Checked Bag Included";
    const carryStr =
      carryOnParts.length > 0 ? `Cabin: ${carryOnParts.join(", ")}` : "Cabin: 1x 8kg";
    return `${checkedStr}, ${carryStr}`;
  }

  return formatBaggageAllowance(defaultBags ?? 1);
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

function enrichSegmentsWithLayovers(segments: FlightSegmentDetail[]): FlightSegmentDetail[] {
  for (let i = 0; i < segments.length - 1; i++) {
    if (!segments[i].connectionDuration) {
      try {
        const arr = new Date(`${segments[i].arrivalDate}T${segments[i].arrivalTime}`).getTime();
        const dep = new Date(`${segments[i + 1].departureDate}T${segments[i + 1].departureTime}`).getTime();
        const diffMs = dep - arr;
        if (!isNaN(diffMs) && diffMs > 0) {
          const totalMins = Math.floor(diffMs / 60000);
          const h = Math.floor(totalMins / 60);
          const m = totalMins % 60;
          segments[i].connectionDuration = h > 0 ? `${h}h ${m}m` : `${m}m`;
        }
      } catch {
        // ignore
      }
    }
  }
  return segments;
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
  let results: FlightSearchResultItem[] = [];

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

          const rawSegments: FlightSegmentDetail[] = [];
          product?.FlightSegment?.forEach((seg: any) => {
            const flight = flightMap.get(seg.Flight?.FlightRef);
            if (flight) {
              const depAirport = getAirportByCode(flight.Departure?.location);
              const arrAirport = getAirportByCode(flight.Arrival?.location);
              rawSegments.push({
                flightNumber: `${flight.carrier} ${flight.number}`,
                carrier: flight.carrier,
                airline: getAirlineName(flight.carrier),
                aircraft: getAircraftName(flight.equipment || flight.Equipment),
                departureAirport: flight.Departure?.location,
                departureAirportName: depAirport
                  ? `${depAirport.city} (${depAirport.name})`
                  : flight.Departure?.location,
                departureTerminal: flight.Departure?.terminal,
                departureDate: flight.Departure?.date,
                departureTime: flight.Departure?.time,
                arrivalAirport: flight.Arrival?.location,
                arrivalAirportName: arrAirport
                  ? `${arrAirport.city} (${arrAirport.name})`
                  : flight.Arrival?.location,
                arrivalTerminal: flight.Arrival?.terminal,
                arrivalDate: flight.Arrival?.date,
                arrivalTime: flight.Arrival?.time,
                duration: parseDuration(flight.duration),
                connectionDuration: parseDuration(seg.connectionDuration),
              });
            }
          });

          const segments = enrichSegmentsWithLayovers(rawSegments);

          if (segments.length > 0) {
            const firstSeg = segments[0];
            const lastSeg = segments[segments.length - 1];
            group.legs.push({
              productRef,
              departureAirport: firstSeg.departureAirport,
              departureAirportName: firstSeg.departureAirportName,
              arrivalAirport: lastSeg.arrivalAirport,
              arrivalAirportName: lastSeg.arrivalAirportName,
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

        const prodRefs = [outbound.productRef, inbound.productRef].filter(Boolean) as string[];
        const baggage = extractBaggageAllowanceFromTerms(prodRefs, refTermsList, params.bags);

        results.push({
          id: `tp-cpo-${id}`,
          tripType: "return",
          price: Math.round(group.price * 100) / 100,
          currency: group.currency,
          airline: outbound.airline,
          carrier: outbound.carrier,
          outbound,
          inbound,
          legs: [outbound, inbound],
          baggage,
          cabin: outbound.cabin,
          source: "Airline Fares",
        });
      }
    });
  } else if (params.tripType === "multi-city") {
    // Multi-city: group combinable flight legs by CombinabilityCode
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
              legSlots: params.legs.map(() => [] as FlightLegDetail[]),
            });
          }
          const group = combinableGroups.get(comboCode);

          const productsList = brandOffering.Product || [];
          productsList.forEach((prodObj: any) => {
            const product = productMap.get(prodObj.productRef);
            if (!product) return;

            const rawSegments: FlightSegmentDetail[] = [];
            product?.FlightSegment?.forEach((seg: any) => {
              const flight = flightMap.get(seg.Flight?.FlightRef);
              if (flight) {
                const depAirport = getAirportByCode(flight.Departure?.location);
                const arrAirport = getAirportByCode(flight.Arrival?.location);
                rawSegments.push({
                  flightNumber: `${flight.carrier} ${flight.number}`,
                  carrier: flight.carrier,
                  airline: getAirlineName(flight.carrier),
                  aircraft: getAircraftName(flight.equipment || flight.Equipment),
                  departureAirport: flight.Departure?.location,
                  departureAirportName: depAirport
                    ? `${depAirport.city} (${depAirport.name})`
                    : flight.Departure?.location,
                  departureTerminal: flight.Departure?.terminal,
                  departureDate: flight.Departure?.date,
                  departureTime: flight.Departure?.time,
                  arrivalAirport: flight.Arrival?.location,
                  arrivalAirportName: arrAirport
                    ? `${arrAirport.city} (${arrAirport.name})`
                    : flight.Arrival?.location,
                  arrivalTerminal: flight.Arrival?.terminal,
                  arrivalDate: flight.Arrival?.date,
                  arrivalTime: flight.Arrival?.time,
                  duration: parseDuration(flight.duration),
                  connectionDuration: parseDuration(seg.connectionDuration),
                });
              }
            });

            const segments = enrichSegmentsWithLayovers(rawSegments);

            if (segments.length > 0) {
              const firstSeg = segments[0];
              const lastSeg = segments[segments.length - 1];

              // Find which requested leg slot this product matches
              const slotIdx = params.legs.findIndex((rl) => {
                const rlFrom = rl.from.toUpperCase().trim();
                const rlTo = rl.to.toUpperCase().trim();
                return (
                  rlFrom === firstSeg.departureAirport &&
                  (!rlTo || rlTo === lastSeg.arrivalAirport)
                );
              });

              if (slotIdx !== -1) {
                const alreadyExists = group.legSlots[slotIdx].some(
                  (l: FlightLegDetail) =>
                    l.departureTime === firstSeg.departureTime &&
                    l.arrivalTime === lastSeg.arrivalTime &&
                    l.flightNumbers === segments.map((s) => s.flightNumber).join(", ")
                );

                if (!alreadyExists) {
                  group.legSlots[slotIdx].push({
                    productRef: prodObj.productRef,
                    departureAirport: firstSeg.departureAirport,
                    departureAirportName: firstSeg.departureAirportName,
                    arrivalAirport: lastSeg.arrivalAirport,
                    arrivalAirportName: lastSeg.arrivalAirportName,
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
              }
            }
          });
        });
      });
    });

    let journeyCounter = 0;
    combinableGroups.forEach((group, combo) => {
      const isComplete = group.legSlots.every(
        (slot: FlightLegDetail[]) => slot.length > 0
      );
      if (!isComplete) return;

      // Cartesian product generation across all requested leg slots
      function generateJourneys(
        slotIdx: number,
        currentLegs: FlightLegDetail[]
      ) {
        if (slotIdx === group.legSlots.length) {
          journeyCounter++;
          const firstLeg = currentLegs[0];
          const lastLeg = currentLegs[currentLegs.length - 1];
          const prodRefs = currentLegs
            .map((l) => l.productRef)
            .filter(Boolean) as string[];
          const baggage = extractBaggageAllowanceFromTerms(
            prodRefs,
            refTermsList,
            params.bags
          );

          results.push({
            id: `tp-multi-${combo}-${journeyCounter}`,
            tripType: "multi-city",
            price: Math.round(group.price * 100) / 100,
            currency: group.currency,
            airline: firstLeg.airline,
            carrier: firstLeg.carrier,
            outbound: firstLeg,
            inbound: currentLegs.length > 1 ? lastLeg : undefined,
            legs: currentLegs,
            baggage,
            cabin: firstLeg.cabin,
            source: "Airline Fares",
          });
          return;
        }

        group.legSlots[slotIdx].forEach((candidate: FlightLegDetail) => {
          generateJourneys(slotIdx + 1, [...currentLegs, candidate]);
        });
      }

      generateJourneys(0, []);
    });
  } else {
    // One-way
    offerings.forEach((offering: any, idx: number) => {
      offering.ProductBrandOptions?.forEach((pbo: any) => {
        pbo.ProductBrandOffering?.forEach((brandOffering: any) => {
          const productRef = brandOffering.Product?.[0]?.productRef;
          const product = productMap.get(productRef);

          const rawSegments: FlightSegmentDetail[] = [];
          product?.FlightSegment?.forEach((seg: any) => {
            const flight = flightMap.get(seg.Flight?.FlightRef);
            if (flight) {
              const depAirport = getAirportByCode(flight.Departure?.location);
              const arrAirport = getAirportByCode(flight.Arrival?.location);
              rawSegments.push({
                flightNumber: `${flight.carrier} ${flight.number}`,
                carrier: flight.carrier,
                airline: getAirlineName(flight.carrier),
                aircraft: getAircraftName(flight.equipment || flight.Equipment),
                departureAirport: flight.Departure?.location,
                departureAirportName: depAirport
                  ? `${depAirport.city} (${depAirport.name})`
                  : flight.Departure?.location,
                departureTerminal: flight.Departure?.terminal,
                departureDate: flight.Departure?.date,
                departureTime: flight.Departure?.time,
                arrivalAirport: flight.Arrival?.location,
                arrivalAirportName: arrAirport
                  ? `${arrAirport.city} (${arrAirport.name})`
                  : flight.Arrival?.location,
                arrivalTerminal: flight.Arrival?.terminal,
                arrivalDate: flight.Arrival?.date,
                arrivalTime: flight.Arrival?.time,
                duration: parseDuration(flight.duration),
                connectionDuration: parseDuration(seg.connectionDuration),
              });
            }
          });

          const segments = enrichSegmentsWithLayovers(rawSegments);

          if (segments.length > 0) {
            const firstSeg = segments[0];
            const lastSeg = segments[segments.length - 1];
            const outbound: FlightLegDetail = {
              productRef,
              departureAirport: firstSeg.departureAirport,
              departureAirportName: firstSeg.departureAirportName,
              arrivalAirport: lastSeg.arrivalAirport,
              arrivalAirportName: lastSeg.arrivalAirportName,
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

            const prodRefs = [productRef].filter(Boolean) as string[];
            const baggage = extractBaggageAllowanceFromTerms(
              prodRefs,
              refTermsList,
              params.bags
            );

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
              legs: [outbound],
              baggage,
              cabin: outbound.cabin,
              source: "Airline Fares",
            });
          }
        });
      });
    });
  }

  // Sort by price ascending
  results.sort((a, b) => a.price - b.price);

  // Deduplicate by airline and flight numbers across all legs to show distinct options
  const uniqueKeys = new Set<string>();
  const deduplicated = results.filter((item) => {
    const legsKey = item.legs
      ? item.legs
          .map(
            (l) => `${l.departureAirport}-${l.arrivalAirport}-${l.departureDate}-${l.departureTime}-${l.flightNumbers}`
          )
          .join("|")
      : `${item.outbound?.departureAirport}-${item.outbound?.arrivalAirport}-${item.outbound?.departureDate}-${item.outbound?.departureTime}-${item.outbound?.flightNumbers}`;
    const key = `${item.tripType}_${legsKey}_${item.price}`;
    if (uniqueKeys.has(key)) return false;
    uniqueKeys.add(key);
    return true;
  });

  return deduplicated.slice(0, 30);
}
