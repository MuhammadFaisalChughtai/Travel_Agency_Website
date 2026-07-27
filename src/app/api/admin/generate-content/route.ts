import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type, prompt, currentData } = await req.json();

    const apiKey = process.env.GPT_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key (GPT_KEY) is not configured in environment variables." },
        { status: 500 }
      );
    }

    if (!type || !prompt) {
      return NextResponse.json(
        { error: "Missing required parameters: type and prompt." },
        { status: 400 }
      );
    }

    const rulebook = `
=== WRITING RULEBOOK ===
1. HUMANIZED STYLE: Write in a natural, premium, and professional tone. It must read as if written by an elite travel consultant or human copywriter, not a machine.
2. NO AI JARGON/CLICHÉS: Strictly avoid typical AI vocabulary, transition words, and buzzwords. 
   - DO NOT USE: "embark on a journey", "testament to", "delve", "furthermore", "moreover", "in summary", "discover the magic", "breathtaking", "vibrant", "nestled", "a tapestry of", "look no further".
   - Keep language direct, active, and sophisticated.
3. NO HALLUCINATIONS: Do not invent unrealistic data. Ensure airport codes (e.g. LHR, DXB), airline codes, and duration calculations are realistic.
4. INCORPORATE KEYWORDS & TITLE: Integrate the package/blog/flight title and any initial keywords provided by the user seamlessly and naturally into the content, meta title, meta description, and keywords.
5. CLEAN HTML: Inside descriptions or blog content, output clean structural HTML tags (e.g. <h3>, <strong>, <ul>, <li>, <p>). Do not include any style attributes or code blocks.
`;

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "package") {
      systemPrompt = `You are an expert travel copywriter and SEO specialist. 
Your goal is to generate package data for a travel agency website in a structured JSON format.

${rulebook}

The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Clear and attractive package title",
  "price": "Starting price as a clean number string (e.g. '650')",
  "duration": "Duration in nights/days (e.g. '7 Nights' or '10 Days')",
  "travelDates": "Travel departure details (e.g. 'Departures throughout October 2026')",
  "description": "Engaging, fully-humanized, and detailed package details formatted in HTML. Use standard HTML tags (<h3>, <strong>, <ul>, <li>, <p>).",
  "metaTitle": "SEO meta title (under 60 characters, incorporating main keywords naturally)",
  "metaDescription": "Compelling SEO meta description (under 160 characters, written naturally)",
  "metaKeywords": "5-10 comma-separated keywords optimized for search engines, incorporating the title and input keywords"
}
Ensure the response is strictly JSON and does not contain markdown code blocks.`;

      userPrompt = `Generate a travel package based on the following instructions:
Prompt: ${prompt}

${currentData ? `Current Form Data (to refine/build upon): ${JSON.stringify(currentData)}` : ""}`;

    } else if (type === "blog") {
      systemPrompt = `You are an expert travel blogger and SEO writer. 
Your goal is to generate blog post content for a travel agency website in a structured JSON format.

${rulebook}

The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Catchy, professional blog title",
  "excerpt": "A short, engaging excerpt summarizing the blog post (plain text, under 200 characters)",
  "content": "A detailed, engaging, fully-humanized blog post body formatted in HTML. Use standard HTML tags (<h3>, <strong>, <ul>, <li>, <p>).",
  "metaTitle": "SEO meta title (under 60 characters, incorporating title and main keywords naturally)",
  "metaDescription": "Compelling SEO meta description (under 160 characters, written naturally)",
  "metaKeywords": "5-10 comma-separated keywords optimized for search engines, incorporating the title and input keywords"
}
Ensure the response is strictly JSON and does not contain markdown code blocks.`;

      userPrompt = `Write a travel blog post based on the following instructions:
Prompt: ${prompt}

${currentData ? `Current Form Data (to refine/build upon): ${JSON.stringify(currentData)}` : ""}`;

    } else if (type === "flight") {
      systemPrompt = `You are a travel flight expert and SEO writer.
Your goal is to generate flight deal details in a structured JSON format.

${rulebook}

The output MUST be a valid JSON object matching this schema exactly:
{
  "airline": "Name of the airline (e.g. Emirates)",
  "airlineCode": "2-letter airline code (e.g. EK)",
  "departure": "Departure airport name (e.g. London Heathrow)",
  "departureCode": "3-letter departure airport code (e.g. LHR)",
  "destination": "Destination airport name or city (e.g. Dubai)",
  "destinationCode": "3-letter destination airport code (e.g. DXB)",
  "country": "Destination country (e.g. UAE)",
  "price": 499.00, // Price as a number
  "month": "Valid travel month/season (e.g. October 2026)",
  "duration": "Flight duration (e.g. 7h 00m)",
  "baggage": "Baggage policy details (e.g. '30kg Checked, 7kg Cabin')",
  "aircraft": "Aircraft type (e.g. Boeing 777)",
  "isTransit": false, // boolean representing if there are stops
  "transitAirport": "Transit airport name if isTransit is true, or empty string",
  "transitDuration": "Transit layover duration if isTransit is true, or empty string",
  "metaTitle": "SEO meta title (under 60 characters, incorporating main keywords naturally)",
  "metaDescription": "Compelling SEO meta description (under 160 characters, written naturally)",
  "metaKeywords": "5-10 comma-separated keywords optimized for search engines, incorporating the title and input keywords"
}
Ensure the response is strictly JSON and does not contain markdown code blocks.`;

      userPrompt = `Generate a flight deal based on the following instructions:
Prompt: ${prompt}

${currentData ? `Current Form Data (to refine/build upon): ${JSON.stringify(currentData)}` : ""}`;
    } else {
      return NextResponse.json({ error: "Invalid type specified." }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to contact OpenAI API");
    }

    const responseData = await response.json();
    const resultString = responseData.choices[0].message.content.trim();

    // Parse the JSON to ensure it is valid
    const resultJson = JSON.parse(resultString);

    return NextResponse.json({ result: resultJson });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during content generation." },
      { status: 500 }
    );
  }
}
