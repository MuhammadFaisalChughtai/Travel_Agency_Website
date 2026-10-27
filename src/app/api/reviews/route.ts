import { NextResponse } from "next/server";

const BUSINESS_UNIT_ID =
  process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID ||
  "657a55d5e9b46f9c9f3be881";
const API_KEY = process.env.TRUSTPILOT_API_KEY;

// In-memory cache (30 minutes)
interface CacheData {
  data: any;
  timestamp: number;
}
let cache: CacheData | null = null;
const CACHE_TTL = 30 * 60 * 1000;

// Up-to-date real reviews from Trustpilot for offline / emergency fallback
const FALLBACK_REVIEWS = [
  {
    id: "6a8d970eb26cfacf3674e848",
    author: "Aminul Islam",
    location: "GB",
    rating: 5,
    date: "Aug 2026",
    title: "Clear concise instructions",
    text: "Clear concise instructions throughout the booking process. Really satisfied with the customer service and prompt responses.",
    tag: "5-Star Experience",
  },
  {
    id: "6a85ada044bdba6be0938e8c",
    author: "Rosemary McCloskey",
    location: "GB",
    rating: 5,
    date: "Aug 2026",
    title: "Rayan responded to a request I had made…",
    text: "Rayan responded to a request I had made for future prices from Dublin to Harare. I needed a return flight booked from Lusaka to Harare and was finding it difficult, so asked him if he could help. He had the patience of a saint and got me a better deal than I could have managed. I could not rate his service more highly. One great guy! Thank you Rayan.",
    tag: "5-Star Experience",
  },
  {
    id: "6a6f3f4756422c7a902fb007",
    author: "Brother Aly Reviewer",
    location: "GB",
    rating: 5,
    date: "Jul 2026",
    title: "Umrah & Dubai",
    text: "Before we travelled to Makkah, Madinah and Dubai, we got in touch with Terrific Travel Ltd to arrange our flights and hotels. From start to finish, everything went so smoothly. A special thank you to brother Aly, who was brilliant throughout the whole process. Even while I was in Saudi, he always got back to me quickly and was there to advise and help with everything.",
    tag: "Umrah Package",
  },
  {
    id: "6a67c7d67fe8a5d5d483410f",
    author: "Satisfied Traveller",
    location: "GB",
    rating: 5,
    date: "Jul 2026",
    title: "I have been using terrific travels ltd past 4 years",
    text: "I have been using terrific travels ltd past 4 years it is one of the best companies, best prices in the whole of Birmingham. Hussnain and Hamza brother are very helpful they will fulfill your needs with brilliant service seriously I would recommend them to all family and friends.",
    tag: "Repeat Customer",
  },
  {
    id: "6a675ed6aae09c82305f7bbe",
    author: "Umrah Pilgrim",
    location: "GB",
    rating: 5,
    date: "Jul 2026",
    title: "Excellent customer service",
    text: "I would like to take a moment to sincerely appreciate Muhammad R for his exceptional service. From the very first conversation, he showed genuine patience, kindness, and professionalism. He took the time to answer every question thoroughly and made sure I had all the information I needed.",
    tag: "Customer Service",
  },
  {
    id: "6a62006efff836eb10f44596",
    author: "Verified Pilgrim",
    location: "GB",
    rating: 5,
    date: "Jul 2026",
    title: "Very helpful travel agent Hamza Chaudhry",
    text: "Very helpful travel agent Hamza Chaudhry. Was very good explaining the process of Umrah visas and Umrah packages. Very trustworthy and reliable will use again in future.",
    tag: "Umrah Package",
  },
  {
    id: "6a5a63b0905dbf8c579d19b3",
    author: "Family Pilgrim",
    location: "GB",
    rating: 5,
    date: "Jul 2026",
    title: "Umrah package with flexible payment plan",
    text: "I have an excellent experience with the Terrific travel agency, especially with Muhammad Rayan who arranged an Umrah package for my family and me. He offered me a very affordable and flexible payment plan on installments that was tailored to my needs, making the whole process stress-free.",
    tag: "5-Star Experience",
  },
  {
    id: "6a46be398eb09d78409a9b9d",
    author: "Happy Pilgrim",
    location: "GB",
    rating: 5,
    date: "Jul 2026",
    title: "Best Umrah package & unbeatable prices",
    text: "We booked our Umrah package and India tickets through Terrific Travel, and Muhammad Rayan made all the difference. He secured us the best deal by far—and I know because I compared multiple agencies before deciding. Terrific Travel’s pricing was simply unbeatable.",
    tag: "Umrah Package",
  },
];

export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh (30 mins)
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  // 1. Try official API if key is configured
  if (API_KEY) {
    try {
      const [summaryRes, reviewsRes] = await Promise.all([
        fetch(
          `https://api.trustpilot.com/v1/business-units/${BUSINESS_UNIT_ID}?apikey=${API_KEY}`,
          { next: { revalidate: 1800 } }
        ),
        fetch(
          `https://api.trustpilot.com/v1/business-units/${BUSINESS_UNIT_ID}/reviews?apikey=${API_KEY}&perPage=20&orderBy=recency`,
          { next: { revalidate: 1800 } }
        ),
      ]);

      if (summaryRes.ok && reviewsRes.ok) {
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
          trustScore: summary.score?.trustScore || 4.6,
          numberOfReviews: summary.numberOfReviews?.total || 46,
          reviews: reviews.length > 0 ? reviews : FALLBACK_REVIEWS,
          source: "live-api",
        };

        cache = { data: responseData, timestamp: now };
        return NextResponse.json(responseData);
      }
    } catch (err: any) {
      console.warn("[reviews] Trustpilot API key error, falling back:", err.message);
    }
  }

  // 3. Fallback with realistic 4.6 TrustScore and 43 reviews
  const fallbackData = {
    stars: 4.5,
    trustScore: 4.6,
    numberOfReviews: 43,
    reviews: FALLBACK_REVIEWS,
    source: "fallback",
  };
  return NextResponse.json(fallbackData);
}
