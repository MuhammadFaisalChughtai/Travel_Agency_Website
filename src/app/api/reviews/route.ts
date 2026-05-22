import { NextResponse } from "next/server";

const BUSINESS_UNIT_ID =
  process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID ||
  "657a55d5e9b46f9c9f3be881";
const API_KEY = process.env.TRUSTPILOT_API_KEY; // Set this in your .env file

// In-memory cache (30 minutes)
interface CacheData {
  data: any;
  timestamp: number;
}
let cache: CacheData | null = null;
const CACHE_TTL = 30 * 60 * 1000;

const FALLBACK_REVIEWS = [
  {
    id: "r1",
    author: "Mina",
    location: "UK",
    rating: 5,
    date: "Apr 2026",
    title: "Faultless & responsive",
    text: "Hasnain has been very helpful & responsive to all our queries throughout the booking process. He made sure all our requests were dealt with in a timely manner & managed to find us a very decent package. Absolutely recommend.",
    tag: "Customer Service",
  },
  {
    id: "r2",
    author: "Farzana",
    location: "UK",
    rating: 5,
    date: "Mar 2026",
    title: "Best opportunity to perform Umrah",
    text: "Terrific Travel Ltds gave us the best opportunity to perform Umrah. We had a great experience. Hotels, flights and taxi services were also incredible. I was at peace of mind because everything was done by Terrific Travel Ltds.",
    tag: "Umrah Package",
  },
  {
    id: "r3",
    author: "Mariama",
    location: "UK",
    rating: 4,
    date: "May 2026",
    title: "Amazing time and good communication",
    text: "Alhamdulillah, I and my cousin came back from Umrah. We had a great time and good communication with Terrific Travel Ltd Ltd throughout our journey. Very good drivers taking us from the airport to the hotel.",
    tag: "Umrah Trip",
  },
  {
    id: "r4",
    author: "Maria",
    location: "UK",
    rating: 5,
    date: "Apr 2026",
    title: "Highly recommend this company",
    text: "My family just came back from Umrah and had an amazing experience. From start to finish communication was really prompt. Highly recommend this company. Very reasonably priced too.",
    tag: "Umrah Package",
  },
  {
    id: "r5",
    author: "Afzaal Hussain",
    location: "UK",
    rating: 5,
    date: "Mar 2026",
    title: "Always go above and beyond",
    text: "I have used Terrific Travel Ltd multiple times now, they never fail to disappoint! Always go above and beyond for me and ensure I have a stress free and peaceful journey/holiday. They always find the best prices on the market.",
    tag: "Flights & Holidays",
  },
  {
    id: "r6",
    author: "sajad ali",
    location: "UK",
    rating: 5,
    date: "Feb 2026",
    title: "1000% perfect service",
    text: "I started using them 2 years ago. Service is 1000% perfect from customer service to hotel, transport and everything. I will be using them for all my future trips. Prices are very competitive and affordable.",
    tag: "Repeat Customer",
  },
];

export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  // If no API key configured, return fallback immediately
  if (!API_KEY) {
    console.warn(
      "[reviews] No TRUSTPILOT_API_KEY set — returning fallback reviews. Add it to .env to get live data.",
    );
    return NextResponse.json({
      stars: 4.5,
      trustScore: 4.5,
      numberOfReviews: 29,
      reviews: FALLBACK_REVIEWS,
      source: "fallback",
    });
  }

  try {
    // Fetch business unit summary and reviews in parallel
    const [summaryRes, reviewsRes] = await Promise.all([
      fetch(
        `https://api.trustpilot.com/v1/business-units/${BUSINESS_UNIT_ID}?apikey=${API_KEY}`,
        { next: { revalidate: 1800 } },
      ),
      fetch(
        `https://api.trustpilot.com/v1/business-units/${BUSINESS_UNIT_ID}/reviews?apikey=${API_KEY}&perPage=20&orderBy=recency`,
        { next: { revalidate: 1800 } },
      ),
    ]);

    if (!summaryRes.ok || !reviewsRes.ok) {
      throw new Error(
        `Trustpilot API error: summary=${summaryRes.status} reviews=${reviewsRes.status}`,
      );
    }

    const summary = await summaryRes.json();
    const reviewsJson = await reviewsRes.json();

    const reviews = (reviewsJson.reviews || []).map((r: any) => ({
      id: r.id,
      author: r.consumer?.displayName || "Verified Customer",
      location: r.consumer?.countryCode || "UK",
      rating: r.stars,
      date: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          })
        : "Recently",
      title: r.title || "",
      text: r.text || "",
      tag: r.stars >= 4 ? "Verified Review" : "Verified",
    }));

    const responseData = {
      stars: summary.score?.stars || 4.5,
      trustScore: summary.score?.trustScore || 4.5,
      numberOfReviews: summary.numberOfReviews?.total || 29,
      reviews: reviews.length > 0 ? reviews : FALLBACK_REVIEWS,
      source: "live",
    };

    cache = { data: responseData, timestamp: now };
    return NextResponse.json(responseData);
  } catch (err: any) {
    console.error("[reviews] Trustpilot API fetch failed:", err.message);
    return NextResponse.json({
      stars: 4.5,
      trustScore: 4.5,
      numberOfReviews: 29,
      reviews: FALLBACK_REVIEWS,
      source: "fallback",
    });
  }
}
