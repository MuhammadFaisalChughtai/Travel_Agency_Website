import rawAirports from "./airportsData.json";

export interface Airport {
  code: string;
  name: string;
  city: string;
  country?: string;
}

export const ALL_AIRPORTS: Airport[] = rawAirports as Airport[];

// Top popular airports shown initially when search box is empty
const PRIORITY_CODES = [
  "MAN", "LHR", "LGW", "BHX", "EDI", "GLA", "STN", "LTN", "NCL", "BFS",
  "DXB", "JED", "MED", "RUH", "DOH", "IST", "ISB", "LHE", "KHI", "DEL",
  "BOM", "MLE", "JFK", "ORD", "LAX", "YYZ", "CDG", "AMS", "FRA"
];

export const POPULAR_AIRPORTS: Airport[] = PRIORITY_CODES.map(
  (code) => ALL_AIRPORTS.find((a) => a.code === code)
).filter(Boolean) as Airport[];

export function searchAirports(query: string): Airport[] {
  if (!query || !query.trim()) {
    return POPULAR_AIRPORTS;
  }

  const q = query.trim().toLowerCase();

  // 1. Exact 3-letter IATA code match
  const exactCode = ALL_AIRPORTS.filter((a) => a.code.toLowerCase() === q);

  // 2. Starts with IATA code
  const codeStarts = ALL_AIRPORTS.filter(
    (a) => a.code.toLowerCase().startsWith(q) && a.code.toLowerCase() !== q
  );

  // 3. City or Name starts with query
  const cityStarts = ALL_AIRPORTS.filter(
    (a) =>
      !a.code.toLowerCase().startsWith(q) &&
      a.city.toLowerCase().startsWith(q)
  );

  // 4. City or Name contains query
  const textContains = ALL_AIRPORTS.filter(
    (a) =>
      !a.code.toLowerCase().startsWith(q) &&
      !a.city.toLowerCase().startsWith(q) &&
      (a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
  );

  const combined = [...exactCode, ...codeStarts, ...cityStarts, ...textContains];

  // If user entered a 3-letter custom code not in list, allow it
  if (q.length === 3 && !combined.some((a) => a.code.toLowerCase() === q)) {
    combined.unshift({
      code: q.toUpperCase(),
      city: q.toUpperCase(),
      name: `${q.toUpperCase()} International Airport`,
    });
  }

  return combined.slice(0, 20);
}

export function formatAirportDisplay(airport: Airport | string): string {
  if (typeof airport === "string") {
    const found = ALL_AIRPORTS.find(
      (a) => a.code.toUpperCase() === airport.toUpperCase()
    );
    if (found) return `${found.city} (${found.code})`;
    return airport;
  }
  return `${airport.city} (${airport.code})`;
}

export function getAirportByCode(code: string): Airport | undefined {
  if (!code) return undefined;
  return ALL_AIRPORTS.find((a) => a.code.toUpperCase() === code.toUpperCase());
}
