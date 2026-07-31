import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type, prompt, currentData, keywords, length, mode } = await req.json();

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
6. UK DEPARTURES ONLY: Since this travel agency services the UK market, all generated flight departures must originate from a United Kingdom airport (e.g. London Heathrow/LHR, Manchester/MAN, Birmingham/BHX, London Gatwick/LGW) and all return flights must return back to the UK. Never generate flight deals starting from other countries (e.g. USA, Canada, India, Saudi Arabia) to the UK or between non-UK countries.
`;

    // Dynamic length and keyword guidelines
    let lengthInstruction = "";
    if (length === "short") {
      lengthInstruction = "The generated HTML description or content body must be short and concise, approximately 150-300 words.";
    } else if (length === "long") {
      lengthInstruction = "The generated HTML description or content body must be detailed, comprehensive, and exhaustive, approximately 600-1000 words.";
    } else {
      lengthInstruction = "The generated HTML description or content body must be of medium length, approximately 300-600 words.";
    }

    let keywordInstruction = "";
    if (keywords && keywords.trim() !== "") {
      keywordInstruction = `Target Keywords to integrate naturally and emphasize: "${keywords}". Ensure these keywords are seamlessly woven into the content copy, meta title, and are added to the generated metaKeywords output list.`;
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "improve") {
      let schemaText = "";
      if (type === "package") {
        schemaText = `{
  "title": "Clear and attractive package title",
  "price": "Starting price as a clean number string (e.g. '1250')",
  "duration": "Duration in nights/days (e.g. '7 Nights')",
  "travelDates": "Travel departure details (e.g. 'Departures throughout October 2026')",
  "description": "Improved/Updated HTML description using standard tags (<h3>, <strong>, <ul>, <li>, <p>)",
  "metaTitle": "Updated SEO meta title",
  "metaDescription": "Updated SEO meta description",
  "metaKeywords": "Updated comma-separated keywords"
}`;
      } else if (type === "blog") {
        schemaText = `{
  "title": "Catchy, professional blog title",
  "excerpt": "A short, engaging excerpt (under 200 characters)",
  "content": "Improved/Updated HTML blog body using standard tags (<h3>, <strong>, <ul>, <li>, <p>)",
  "metaTitle": "Updated SEO meta title",
  "metaDescription": "Updated SEO meta description",
  "metaKeywords": "Updated comma-separated keywords"
}`;
      } else if (type === "flight") {
        schemaText = `{
  "airline": "Airline name",
  "airlineCode": "2-letter code",
  "departure": "Departure airport name",
  "departureCode": "3-letter code",
  "destination": "Destination airport name",
  "destinationCode": "3-letter code",
  "country": "Destination country",
  "price": 499.00,
  "month": "Travel month",
  "duration": "Flight duration",
  "baggage": "Baggage details",
  "aircraft": "Aircraft type",
  "isTransit": false,
  "transitAirport": "Transit airport name or empty",
  "transitDuration": "Transit duration or empty",
  "metaTitle": "Updated SEO meta title",
  "metaDescription": "Updated SEO meta description",
  "metaKeywords": "Updated comma-separated keywords"
}`;
      }

      systemPrompt = `You are an expert travel editor and SEO refiner.
Your goal is to improve the existing details of a travel agency ${type}.

${rulebook}

${lengthInstruction}
${keywordInstruction}

=== EDITING AND REFINEMENT INSTRUCTIONS ===
1. Analyze the current form values provided in the "Current Form Data" block.
2. Apply the requested improvements or edits specified in the user's prompt (e.g. changing tone, adding details, correcting typos, improving SEO keywords).
3. Do not rewrite from scratch unless requested. Enhance the existing title, descriptions, excerpt, meta tags, and prices.
4. Output a JSON object containing the modified and improved fields. Keep unchanged fields close to their original values if they do not require edits.

The output MUST be a valid JSON object matching this schema exactly:
${schemaText}
Ensure the response is strictly JSON and does not contain markdown code blocks.`;

      userPrompt = `Please improve the existing ${type} details based on these instructions:
Improvement Prompt: ${prompt}

Current Form Data (to improve/edit):
${JSON.stringify(currentData || {})}`;

    } else {
      // DEFAULT GENERATION MODE
      if (type === "package") {
        systemPrompt = `You are an expert travel copywriter and SEO specialist. 
Your goal is to generate package data for a travel agency website in a structured JSON format.

${rulebook}

${lengthInstruction}
${keywordInstruction}

=== STEP-BY-STEP PACKAGE ASSEMBLY LOGIC ===
When generating the package, you must follow this logical step-by-step planning process:
1. FLIGHT: Select a realistic, premium airline (e.g. British Airways, Emirates, Saudia), flight route, flight duration, and baggage allowance.
2. HOTELS (ACCOMMODATION):
   - IF the package is an UMRAH package: Select 1 hotel in Makkah (e.g., Swissotel, Fairmont Clock Royal Tower, Pullman Zamzam Makkah) and 1 hotel in Medina (e.g., Oberoi Madinah, Pullman Zamzam Madinah, Madinah Hilton). Both hotels must ideally be premium 5-star properties, or realistic 4-star properties, with clear star ratings and distances/details.
   - IF the package is a general HOLIDAY package: Select premium hotel(s) specifically located inside the target city/destination specified in the prompt.
3. TRANSPORT: Select/define local transit options (e.g., private air-conditioned GMC, high-speed Haramain Train transfers between Makkah and Medina, or luxury private airport transfers).
4. VISA: Define the visa processing inclusions (e.g. eVisa, tourist visa processing assistance).
5. COMBINED PRICE CALCULATION: Calculate a realistic, all-inclusive package price by summing up the estimated costs of the flight, hotels, transport, and visa selected. Return this sum as a clean number string in the "price" field.

=== DESCRIPTION HTML STRUCTURE ===
Your HTML "description" field must contain a fully-humanized, engaging write-up that clearly highlights and breaks down the selected items:
- <h3>Package Highlights</h3> (A premium summary of the all-inclusive experience)
- <h3>Flight Details</h3> (Airline, route, cabin baggage)
- <h3>Premium Accommodation</h3> (For Umrah, list the Makkah hotel and Medina hotel with star ratings; for Holiday, list the destination hotels)
- <h3>Transportation & Transfers</h3> (Private transfers, Haramain train details)
- <h3>Visa & Inclusions</h3> (Visa processing details, guided support)
Use structural HTML tags (<h3>, <strong>, <ul>, <li>, <p>). Do not include any inline styles or custom attributes.

The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Clear and attractive package title",
  "price": "Starting price as a clean number string (e.g. '1250')",
  "duration": "Duration in nights/days (e.g. '7 Nights' or '10 Days')",
  "travelDates": "Travel departure details (e.g. 'Departures throughout October 2026')",
  "description": "The structured package details formatted in HTML as described above.",
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

${lengthInstruction}
${keywordInstruction}

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

${lengthInstruction}
${keywordInstruction}

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
