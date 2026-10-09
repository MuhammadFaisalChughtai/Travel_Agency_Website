import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const openAiApiKey = process.env.GPT_KEY;
    if (!openAiApiKey) {
      return NextResponse.json(
        { error: "AI service is currently unconfigured." },
        { status: 500 }
      );
    }

    const cleanQuery = message.trim().toLowerCase();

    // 1. Fetch relevant real inventory from DB based on user query
    let relevantPackages: any[] = [];
    let relevantFlights: any[] = [];

    try {
      if (
        cleanQuery.includes("umrah") ||
        cleanQuery.includes("makkah") ||
        cleanQuery.includes("madinah") ||
        cleanQuery.includes("pilgrim") ||
        cleanQuery.includes("hajj")
      ) {
        relevantPackages = await prisma.package.findMany({
          where: {
            availability: true,
            type: { in: ["UMRAH", "HAJJ", "Cruise_Umrah"] },
          },
          take: 4,
          orderBy: { price: "asc" },
          select: {
            title: true,
            duration: true,
            price: true,
            meccaHotel: true,
            medinaHotel: true,
            slug: true,
            type: true,
          },
        });
      } else if (
        cleanQuery.includes("holiday") ||
        cleanQuery.includes("vacation") ||
        cleanQuery.includes("dubai") ||
        cleanQuery.includes("turkey") ||
        cleanQuery.includes("beach") ||
        cleanQuery.includes("resort")
      ) {
        relevantPackages = await prisma.package.findMany({
          where: {
            availability: true,
            type: "HOLIDAY",
          },
          take: 4,
          orderBy: { price: "asc" },
          select: {
            title: true,
            destination: true,
            duration: true,
            price: true,
            slug: true,
          },
        });
      }

      if (
        cleanQuery.includes("flight") ||
        cleanQuery.includes("airline") ||
        cleanQuery.includes("ticket") ||
        cleanQuery.includes("saudia") ||
        cleanQuery.includes("jeddah") ||
        cleanQuery.includes("heathrow") ||
        cleanQuery.includes("manchester")
      ) {
        relevantFlights = await prisma.flight.findMany({
          where: { status: "AVAILABLE" },
          take: 4,
          orderBy: { price: "asc" },
          select: {
            airline: true,
            departure: true,
            destination: true,
            price: true,
            duration: true,
            slug: true,
          },
        });
      }
    } catch (dbErr) {
      console.error("[Voice Assistant DB Search Error]:", dbErr);
    }

    // Format DB context
    const inventoryContext = `
REAL TERRIFIC TRAVEL INVENTORY:
${
  relevantPackages.length > 0
    ? `Available Packages:\n` +
      relevantPackages
        .map(
          (p) =>
            `- "${p.title}" (${p.duration}, From £${p.price}) | Hotels: ${
              p.meccaHotel || ""
            } ${p.medinaHotel ? "& " + p.medinaHotel : ""} | Link: /v/${p.slug}`
        )
        .join("\n")
    : "No exact package match in quick cache."
}

${
  relevantFlights.length > 0
    ? `Available Flights:\n` +
      relevantFlights
        .map(
          (f) =>
            `- ${f.airline}: ${f.departure} to ${f.destination} from £${f.price} (${f.duration})`
        )
        .join("\n")
    : "No exact flight match in quick cache."
}
`;

    // 2. Strict Domain System Prompt
    const systemPrompt = `You are "Sara", the Senior UK Travel Consultant and AI Voice Assistant for Terrific Travel Ltd (terrifictravel.co.uk).
Your telephone is 01215 291630 and WhatsApp is 07888 461474. Your offices are in the UK (ATOL Protected).

=== CRITICAL BOUNDARY & GUARDRAILS (STRICT DOMAIN ONLY) ===
1. EXCLUSIVE SCOPE (TRAVEL & BOOKINGS ONLY):
   - You ONLY assist with travel queries related to Terrific Travel services:
     * Flights: Any flight routes (both UK departures from LHR, LGW, MAN, BHX to destinations worldwide such as Middle East, Asia, Europe, America, Africa, etc., as well as return and multi-city flights). If the user asks for a specific destination (e.g. Slava, Prague, Istanbul, Jeddah, Islamabad, New York, Dubai, etc.), treat it as a valid flight enquiry! Provide helpful guidance, estimated travel/airline options, and suggest using our flight search engine or contacting our flight desk on 01215 291630.
     * Packages: Umrah & Hajj pilgrimage packages, luxury holidays, family vacations, beach resorts.
     * Services: Saudi Umrah/Tourist visas, hotel bookings, airport transfers, ATOL protection.
   - ONLY decline if the user asks completely non-travel queries (e.g. software coding, general school homework, math equations, celebrity gossip, recipes, non-travel trivia):
     "I am your Terrific Travel assistant, so I can only help you with flight deals, Umrah and holiday packages, and visa guidance. How can I help with your journey today?"

2. CONCISE CONVERSATIONAL STYLE:
   - Keep answers very helpful, conversational, warm, British, and concise (2 to 4 sentences).
   - NEVER use raw markdown headers, asterisk bolding (* or **), or HTML in the response so it reads and speaks naturally.
   - Speak prices and routes naturally.

3. INVENTORY & NAVIGATION:
   - When the user asks for flights, direct them to check our live flight search engine at /flights or reach our flight desk on 01215 291630 or WhatsApp 07888 461474.
   - For Umrah or holidays, reference live packages or invite them to browse /umrah or /holiday.

${inventoryContext}
`;

    // Prepare messages history
    const conversationMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (Array.isArray(history)) {
      // Keep last 4 turns for low token footprint and fast latency
      const recentHistory = history.slice(-4);
      for (const turn of recentHistory) {
        if (turn.role === "user" || turn.role === "assistant") {
          conversationMessages.push({
            role: turn.role,
            content: turn.content,
          });
        }
      }
    }

    conversationMessages.push({
      role: "user",
      content: message,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        max_tokens: 180, // Keep token cost low and responses voice-friendly
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Voice Assistant OpenAI Error]:", errText);
      return NextResponse.json(
        { error: "AI voice engine temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const replyText =
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm here to help with your flight, Umrah, and holiday bookings. What destination are you looking for?";

    // Detect if user wants to connect with a human agent or if we should suggest a navigation action
    let suggestedAction: { type: string; url?: string; label?: string } | null = null;
    const isAgentRequest =
      cleanQuery.includes("agent") ||
      cleanQuery.includes("human") ||
      cleanQuery.includes("real person") ||
      cleanQuery.includes("live person") ||
      cleanQuery.includes("talk to someone") ||
      cleanQuery.includes("speak to someone") ||
      cleanQuery.includes("representative") ||
      cleanQuery.includes("operator") ||
      cleanQuery.includes("customer service") ||
      cleanQuery.includes("live chat");

    if (isAgentRequest) {
      suggestedAction = { type: "CONNECT_AGENT", label: "Connect with Live Agent (Tawk.to)" };
    } else if (cleanQuery.includes("flight") || cleanQuery.includes("ticket")) {
      suggestedAction = { type: "NAVIGATE", url: "/flights", label: "Search Flights" };
    } else if (cleanQuery.includes("umrah") || cleanQuery.includes("makkah")) {
      suggestedAction = { type: "NAVIGATE", url: "/umrah", label: "View Umrah Packages" };
    } else if (cleanQuery.includes("holiday") || cleanQuery.includes("dubai")) {
      suggestedAction = { type: "NAVIGATE", url: "/holiday", label: "Explore Holidays" };
    } else if (cleanQuery.includes("visa")) {
      suggestedAction = { type: "NAVIGATE", url: "/visa", label: "Visa Assistance" };
    }

    return NextResponse.json({
      reply: replyText,
      suggestedAction,
      featuredItems: [
        ...relevantPackages.slice(0, 2).map((p) => ({
          title: p.title,
          subtitle: `${p.duration} • From £${p.price}`,
          url: `/v/${p.slug}`,
        })),
        ...relevantFlights.slice(0, 2).map((f) => ({
          title: `${f.airline}: ${f.departure} → ${f.destination}`,
          subtitle: `From £${f.price} • ${f.duration}`,
          url: `/flights`,
        })),
      ],
    });
  } catch (error: any) {
    console.error("[Voice Assistant Error]:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
