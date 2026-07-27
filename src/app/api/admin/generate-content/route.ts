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

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "package") {
      systemPrompt = `You are an expert travel copywriter and SEO specialist. 
Your goal is to generate package data for a travel agency website in a structured JSON format.
The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Clear and attractive package title",
  "price": "Starting price as a clean number string (e.g. '650')",
  "duration": "Duration in nights/days (e.g. '7 Nights' or '10 Days')",
  "travelDates": "Travel departure details (e.g. 'Departures throughout October 2026')",
  "description": "Engaging and rich package details formatted in HTML. Use standard HTML tags (<h3>, <strong>, <ul>, <li>, <p>). Do not include any external CSS or classes. Just clean structural tags.",
  "metaTitle": "SEO meta title (under 60 characters)",
  "metaDescription": "Compelling SEO meta description (under 160 characters)",
  "metaKeywords": "5-10 comma-separated keywords optimized for search engines"
}
Ensure the response is strictly JSON and does not contain markdown code blocks (like \`\`\`json).`;

      userPrompt = `Generate a package based on the following instructions:
Prompt: ${prompt}

${currentData ? `Current Form Data (to refine/build upon): ${JSON.stringify(currentData)}` : ""}`;

    } else if (type === "blog") {
      systemPrompt = `You are an expert travel blogger and SEO writer. 
Your goal is to generate blog post content for a travel agency website in a structured JSON format.
The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Catchy and informative blog title",
  "excerpt": "A short, engaging excerpt summarizing the blog post (plain text, under 200 characters)",
  "content": "A detailed, engaging, and well-researched blog post body formatted in HTML. Use standard HTML tags (<h3>, <strong>, <ul>, <li>, <p>). Make it look professional and clean.",
  "metaTitle": "SEO meta title (under 60 characters)",
  "metaDescription": "Compelling SEO meta description (under 160 characters)",
  "metaKeywords": "5-10 comma-separated keywords optimized for search engines"
}
Ensure the response is strictly JSON and does not contain markdown code blocks.`;

      userPrompt = `Write a blog post based on the following instructions:
Prompt: ${prompt}

${currentData ? `Current Form Data (to refine/build upon): ${JSON.stringify(currentData)}` : ""}`;

    } else if (type === "flight") {
      systemPrompt = `You are a travel flight expert and SEO writer.
Your goal is to generate flight deal details in a structured JSON format.
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
  "metaTitle": "SEO meta title (under 60 characters)",
  "metaDescription": "Compelling SEO meta description (under 160 characters)",
  "metaKeywords": "5-10 comma-separated keywords optimized for search engines"
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
