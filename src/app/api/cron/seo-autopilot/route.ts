import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleAdsApi } from "google-ads-api";
import { fetchRelevantImage } from "@/lib/imageFetcher";

export async function POST(req: Request) {
  const executionLogs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    executionLogs.push(`[${new Date().toISOString()}] ${msg}`);
  };

  try {
    // 1. Security check - verify CRON_SECRET or check if manually triggered by admin
    const authHeader = req.headers.get("Authorization");
    const isCronSecretValid = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
    // Also allow request if there is a query param manual=true
    const url = new URL(req.url);
    const isManual = url.searchParams.get("manual") === "true";

    if (!isCronSecretValid && !isManual) {
      return NextResponse.json({ error: "Unauthorized access. Invalid CRON_SECRET." }, { status: 401 });
    }

    log("Starting SEO Autopilot execution cycle...");

    // 2. Load settings from database SystemSettings
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "seo_autopilot_enabled",
            "seo_autopilot_mode",
            "seo_autopilot_limit",
            "seo_autopilot_seed_keywords",
            "seo_autopilot_package_type",
            "seo_autopilot_content_type"
          ]
        }
      }
    });

    const config = {
      enabled: "false",
      mode: "optimize_existing",
      limit: "10",
      seedKeywords: "",
      packageType: "ALL",
      contentType: "ALL"
    };

    for (const s of settings) {
      if (s.key === "seo_autopilot_enabled") config.enabled = s.value;
      if (s.key === "seo_autopilot_mode") config.mode = s.value;
      if (s.key === "seo_autopilot_limit") config.limit = s.value;
      if (s.key === "seo_autopilot_seed_keywords") config.seedKeywords = s.value;
      if (s.key === "seo_autopilot_package_type") config.packageType = s.value;
      if (s.key === "seo_autopilot_content_type") config.contentType = s.value;
    }

    // If autopilot is disabled and this is NOT a manual trigger, exit
    if (config.enabled !== "true" && !isManual) {
      log("SEO Autopilot is disabled in settings. Skipping run.");
      return NextResponse.json({ message: "Autopilot is disabled. Run skipped.", logs: executionLogs });
    }

    const limitCount = Math.max(1, Math.min(100, Number(config.limit) || 10));
    log(`Autopilot configured: mode=${config.mode}, limit=${limitCount}, contentType=${config.contentType}, packageType=${config.packageType}, seeds='${config.seedKeywords}'`);

    // 3. Setup Google Ads API credentials
    const developerToken = process.env['GOOGLE_ADS_DEVELOPER_TOKEN'];
    const rawCustomerId = process.env['GOOGLE_ADS_CUSTOMER_ID'] || "";
    const customerId = rawCustomerId.replace(/[^0-9]/g, ""); // Strip any dashes, spaces, or quotes
    const client_id = process.env['GOOGLE_ADS_CLIENT_ID'];
    const client_secret = process.env['GOOGLE_ADS_CLIENT_SECRET'];
    const refresh_token = process.env['GOOGLE_ADS_REFRESH_TOKEN'];
    const openAiApiKey = process.env['GPT_KEY'];

    log(`[DEBUG] rawCustomerId='${rawCustomerId}' | customerId='${customerId}' | client_id='${client_id ? "SET" : "MISSING"}' | refresh_token='${refresh_token ? "SET" : "MISSING"}' | openAiApiKey='${openAiApiKey ? "SET" : "MISSING"}'`);

    const missingVars: string[] = [];
    if (!developerToken) missingVars.push("GOOGLE_ADS_DEVELOPER_TOKEN");
    if (!customerId) missingVars.push("GOOGLE_ADS_CUSTOMER_ID");
    if (!client_id) missingVars.push("GOOGLE_ADS_CLIENT_ID");
    if (!client_secret) missingVars.push("GOOGLE_ADS_CLIENT_SECRET");
    if (!refresh_token) missingVars.push("GOOGLE_ADS_REFRESH_TOKEN");
    if (!openAiApiKey) missingVars.push("GPT_KEY");

    if (missingVars.length > 0) {
      const errorMsg = `Missing environment variables in container: ${missingVars.join(", ")}`;
      log(errorMsg);
      return NextResponse.json({ error: errorMsg, logs: executionLogs }, { status: 500 });
    }

    // Initialize Google Ads client
    const googleAdsClient = new GoogleAdsApi({
      client_id: client_id!,
      client_secret: client_secret!,
      developer_token: developerToken!,
    });

    const customer = googleAdsClient.Customer({
      customer_id: customerId,
      login_customer_id: "1886283319", // Manager account 188-628-3319
      refresh_token: refresh_token!,
    });

    // 4. Fetch Keyword Ideas from Google Ads API or GPT Fallback
    const defaultSeeds = config.packageType === "HOLIDAY" 
      ? ["family holiday deals", "luxury beach resort", "cheap flights from uk", "summer holiday packages"]
      : config.packageType === "UMRAH"
      ? ["umrah packages 2026", "cheap umrah from london", "5 star umrah packages", "family umrah deals"]
      : config.packageType === "HAJJ"
      ? ["hajj packages 2026", "uk hajj deals", "non shifting hajj package"]
      : config.packageType === "Cruise_Umrah"
      ? ["red sea umrah cruise", "jeddah cruise package", "luxury cruise umrah"]
      : ["umrah packages", "holiday deals", "cheap flights"];

    const seedPhrases = config.seedKeywords
      ? config.seedKeywords.split(",").map(k => k.trim()).filter(Boolean)
      : defaultSeeds;

    log(`Querying Google Keyword Planner for seeds: ${seedPhrases.join(", ")}`);
    
    let keywordIdeas: Array<{ text: string; searches: number; competition: string; competitionIndex: number }> = [];

    for (const seed of seedPhrases.slice(0, 3)) { // Limit to 3 seeds to respect quotas
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
          customer_id: customerId,
          keyword_seed: { keywords: [seed] },
          geo_target_constants: ["geoTargetConstants/2826"], // UK targeting
          keyword_plan_network: "GOOGLE_SEARCH",
          language: "languageConstants/1000", // English
        } as any);

        if (Array.isArray(response)) {
          const mapped = response.map((item: any) => {
            const metrics = item.keywordIdeaMetrics || item.keyword_idea_metrics || {};
            return {
              text: item.text || "",
              searches: Number(metrics.avgMonthlySearches || metrics.avg_monthly_searches || 0),
              competition: metrics.competition || "UNSPECIFIED",
              competitionIndex: Number(metrics.competitionIndex || metrics.competition_index || 0)
            };
          });
          keywordIdeas = [...keywordIdeas, ...mapped];
        }
      } catch (err: any) {
        let errMsg = err.message || err.details;
        if (!errMsg && err.errors) errMsg = JSON.stringify(err.errors);
        if (!errMsg) errMsg = JSON.stringify(err);
        
        if (errMsg.includes("invalid_grant")) {
          log(`Google Ads API Auth Notice for seed '${seed}': Refresh token expired/invalid (invalid_grant). Falling back to GPT AI keyword generation.`);
        } else {
          log(`Failed to fetch keywords for seed '${seed}': ${errMsg}`);
        }
      }
    }

    // Fallback to GPT-generated keywords if Google Ads API fails or is inactive
    if (keywordIdeas.length === 0) {
      log("Notice: Google Ads API inactive/unreachable. Activating GPT AI Engine to generate 15 high-intent UK keywords...");
      
      try {
        const typeConstraint = config.packageType !== "ALL" ? `Target package type: ${config.packageType}.` : "";
        const contentConstraint = config.contentType !== "ALL" ? `Target content category: ${config.contentType}.` : "";

        const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert SEO planner. Generate a list of 15 highly relevant, high-intent travel keyword ideas related to the seeds: "${seedPhrases.join(", ")}".
${typeConstraint} ${contentConstraint}
The keywords MUST target the UK market specifically (e.g. UK departures, London/Manchester/Birmingham routes).
${config.packageType === "HOLIDAY" ? "CRITICAL: Strictly prohibit all religious Hajj, Umrah, Makkah, and Madinah terms. Generate pure leisure/holiday vacation keywords." : ""}

Output JSON matching this schema exactly:
{
  "keywords": [
    {
      "text": "keyword phrase",
      "searches": 1500,
      "competition": "LOW",
      "competitionIndex": 15
    }
  ]
}`
              },
              {
                role: "user",
                content: `Generate travel keyword ideas for seeds: ${seedPhrases.join(", ")}`
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
          }),
        });

        const resJson = await gptResponse.json();
        if (resJson.choices?.[0]?.message?.content) {
          const data = JSON.parse(resJson.choices[0].message.content);
          if (data.keywords && Array.isArray(data.keywords)) {
            keywordIdeas = data.keywords;
            log(`Successfully generated ${keywordIdeas.length} keywords dynamically via GPT.`);
          }
        }
      } catch (err: any) {
        log(`Failed to generate keywords via GPT fallback: ${err.message}`);
      }
    }

    // --- ANTI-CANNIBALISM LOGIC ---
    const existingPackages = await prisma.package.findMany({ select: { slug: true, metaKeywords: true } });
    const existingBlogs = await prisma.blog.findMany({ select: { slug: true, metaKeywords: true } });
    const existingFlights = await prisma.flight.findMany({ select: { slug: true, metaKeywords: true } });
    const pastLogs = await prisma.seoAutopilotLog.findMany({ where: { status: "SUCCESS" }, select: { keywords: true } });

    const usedSlugs = new Set([
      ...existingPackages.map(p => p.slug.toLowerCase().trim()),
      ...existingBlogs.map(b => b.slug.toLowerCase().trim()),
      ...existingFlights.filter(f => f.slug).map(f => f.slug!.toLowerCase().trim()),
    ]);

    const usedKeywords = new Set([
      ...pastLogs.flatMap(l => (l.keywords || "").split(",").map(k => k.trim().toLowerCase())),
      ...existingPackages.flatMap(p => (p.metaKeywords || "").split(",").map(k => k.trim().toLowerCase())),
      ...existingBlogs.flatMap(b => (b.metaKeywords || "").split(",").map(k => k.trim().toLowerCase())),
    ]);

    log(`[DEBUG] Anti-Cannibalism: Loaded ${usedSlugs.size} existing slugs and ${usedKeywords.size} unique used keywords.`);

    const filteredKeywords = keywordIdeas
      .filter(k => {
        const keywordText = k.text.toLowerCase().trim();
        const slug = keywordText.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const isSlugTaken = usedSlugs.has(slug);
        const isKeywordTaken = usedKeywords.has(keywordText);

        // Strict Holiday isolation rule
        if (config.packageType === "HOLIDAY") {
          const religiousTerms = ["umrah", "hajj", "makkah", "mecca", "madinah", "medina", "ziyarat", "ihram", "qurbani"];
          if (religiousTerms.some(t => keywordText.includes(t))) return false;
        }

        if (isSlugTaken || isKeywordTaken) return false;
        return true;
      })
      .sort((a, b) => b.searches - a.searches);

    log(`Retrieved ${keywordIdeas.length} ideas, filtered down to ${filteredKeywords.length} unique high-intent options.`);

    if (filteredKeywords.length === 0) {
      log("No eligible keywords found matching SEO criteria. Run completed.");
      return NextResponse.json({ message: "No eligible keywords found.", logs: executionLogs });
    }

    // 5. Execute Actions
    let processedCount = 0;

    const baseRulebook = `
=== WRITING RULEBOOK ===
1. HUMANIZED STYLE: Write in a natural, premium, professional tone. Must read as if written by an elite travel consultant.
2. NO AI JARGON/CLICHÉS: Strictly avoid AI vocabulary (e.g. "embark on a journey", "testament to", "delve", "furthermore", "moreover", "discover the magic").
3. NO HALLUCINATIONS: Do not invent unrealistic data. Ensure airport codes (LHR, LGW, MAN, BHX), airline codes, and duration calculations are realistic.
4. CLEAN HTML: Output clean structural HTML tags (<h3>, <strong>, <ul>, <li>, <p>). No inline style attributes.
5. UK DEPARTURES ONLY: All generated flight routes must originate from a UK airport (LHR/LGW/MAN/BHX) and return back to the UK.
`;

    const getPackageRules = (pType: string) => {
      if (pType === "HOLIDAY") {
        return `
=== STRICT HOLIDAY PACKAGE RULES ===
- This package is purely a GENERAL HOLIDAY/VACATION.
- STRICTLY PROHIBITED: Do NOT mention Umrah, Hajj, Makkah, Madinah, Ziyarat, Ihram, Qurbani, Haram, or Nabawi.
- Focus on leisure, resort accommodation, UK flights, transfers, sightseeing, relaxation, and local attractions.
`;
      }
      if (pType === "UMRAH" || pType === "HAJJ" || pType === "Cruise_Umrah") {
        return `
=== RELIGIOUS PILGRIMAGE & DAY-BY-DAY TIMELINE RULES ===
- EVERY SINGLE SECTION HEADING inside the HTML description MUST start with explicit, sequential Day numbers covering the total package duration. NEVER output a section header without Day numbers!
- Separate Makkah and Madinah stays clearly with explicit Day ranges and night counts (e.g. Day 1, Day 2–Day 7, Day 8, Day 9–Day 11, Day 12).
- Provide TWO DISTINCT HOTELS: One for Makkah (meccaHotel) and a DIFFERENT hotel for Madinah (medinaHotel).
- Detail distance/proximity to Masjid al-Haram for Makkah and Masjid an-Nabawi for Madinah without making unverified exact walking meter claims.
- Structure description into clean sequential HTML sections with explicit Day headings:
  <h3>Day 1: UK Departure & Arrival in Makkah</h3> (Flight details from UK, transfer to Makkah, hotel check-in)
  <h3>Day 2 – Day [MakkahNights+1]: Makkah Stay & Performing Umrah</h3> (Hotel details, Haram access, Umrah guidance, Ziyarat in Makkah)
  <h3>Day [MakkahNights+2]: Transfer to Madinah Al-Munawwarah</h3> (AC Coach or Haramain Train transfer)
  <h3>Day [MakkahNights+3] – Day [TotalNights]: Madinah Stay & Prophet's Mosque Ziyarat</h3> (Madinah hotel stay, Masjid an-Nabawi prayers, Rawdah visits, Ziyarat)
  <h3>Final Day (Day [TotalNights+1]): Departure & Return Flight to UK</h3> (Transfer to airport, return flight back to UK)
`;
      }
      return `
=== STRICT HOLIDAY DAY-BY-DAY TIMELINE RULES ===
- Structure description into clean sequential HTML sections with explicit Day headings:
  <h3>Day 1: Arrival & Hotel Check-in</h3>
  <h3>Day 2 – Day [TotalNights]: Destination Stay & Excursions</h3>
  <h3>Final Day (Day [TotalNights+1]): Departure & Return Journey</h3>
`;
    };

    // Determine target entity types to process
    const targetEntityTypes = config.contentType === "ALL" 
      ? ["PACKAGE", "FLIGHT", "BLOG"]
      : [config.contentType];

    // OPTIMIZE EXISTING CONTENT
    if (config.mode === "optimize_existing" || config.mode === "both") {
      log(`Executing mode: OPTIMIZE EXISTING CONTENT (Target: ${targetEntityTypes.join(", ")})...`);

      if (targetEntityTypes.includes("PACKAGE") && processedCount < limitCount) {
        const packageWhere: any = {};
        if (config.packageType !== "ALL") {
          packageWhere.type = config.packageType;
        }

        const packagesToOptimize = await prisma.package.findMany({
          where: packageWhere,
          take: Math.ceil(limitCount / targetEntityTypes.length),
          orderBy: { createdAt: "asc" }
        });

        for (const pkg of packagesToOptimize) {
          if (processedCount >= limitCount) break;

          const pTypeKey = (pkg.type || config.packageType || "").toLowerCase();
          let kwMatch = filteredKeywords.find(k => {
            const txt = k.text.toLowerCase();
            if (pTypeKey === "umrah" || pTypeKey === "cruise_umrah") return txt.includes("umrah") || txt.includes("makkah") || txt.includes("madinah");
            if (pTypeKey === "hajj") return txt.includes("hajj");
            if (pTypeKey === "holiday") return !txt.includes("umrah") && !txt.includes("hajj");
            return txt.includes((pkg.destination || "").toLowerCase());
          })?.text;

          if (!kwMatch) {
            kwMatch = filteredKeywords[0]?.text || (
              pTypeKey === "umrah" ? "cheap umrah packages from uk" :
              pTypeKey === "hajj" ? "hajj packages 2026 uk" :
              pTypeKey === "cruise_umrah" ? "red sea umrah cruise deals" :
              "luxury holiday packages from uk"
            );
          }

          log(`Optimizing Package: '${pkg.title}' (ID: ${pkg.id}) [Type: ${pkg.type || config.packageType}] targeting keyword: [${kwMatch}]`);

          try {
            const pRules = getPackageRules(pkg.type || config.packageType);

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiApiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: `${baseRulebook} ${pRules}
You are an expert SEO optimizer. Refine the existing travel package title, description, meta elements, and FAQs to rank for: "${kwMatch}".
Return valid JSON matching this schema:
{
  "title": "Optimized Package Title",
  "description": "Improved HTML content incorporating keywords naturally",
  "meccaHotel": "Hotel name in Makkah (or null if holiday)",
  "meccaNights": 6,
  "medinaHotel": "Hotel name in Madinah (different from Makkah, or null if holiday)",
  "medinaNights": 4,
  "metaTitle": "SEO title under 60 characters",
  "metaDescription": "SEO description under 160 characters",
  "metaKeywords": "comma-separated list of keywords",
  "faqs": [
    { "question": "FAQ Question 1?", "answer": "Detailed helpful answer." }
  ]
}`
                  },
                  {
                    role: "user",
                    content: `Existing Package: Title: ${pkg.title}, Destination: ${pkg.destination}, Description: ${pkg.description}`
                  }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
              }),
            });

            const resJson = await response.json();
            if (resJson.choices?.[0]?.message?.content) {
              const data = JSON.parse(resJson.choices[0].message.content);

              const imgRes = await fetchRelevantImage({
                topic: kwMatch,
                destination: pkg.destination,
                type: pkg.type || config.packageType,
                fallbackTitle: data.title || pkg.title
              });

              await prisma.package.update({
                where: { id: pkg.id },
                data: {
                  title: data.title || pkg.title,
                  description: data.description || pkg.description,
                  images: JSON.stringify([imgRes.url]),
                  meccaHotel: data.meccaHotel ?? pkg.meccaHotel,
                  meccaNights: data.meccaNights ?? pkg.meccaNights,
                  medinaHotel: data.medinaHotel ?? pkg.medinaHotel,
                  medinaNights: data.medinaNights ?? pkg.medinaNights,
                  metaTitle: data.metaTitle || pkg.metaTitle,
                  metaDescription: data.metaDescription || pkg.metaDescription,
                  metaKeywords: data.metaKeywords || pkg.metaKeywords,
                }
              });

              await prisma.seoAutopilotLog.create({
                data: {
                  actionType: "OPTIMIZE",
                  targetType: "PACKAGE",
                  targetId: pkg.id,
                  targetTitle: pkg.title,
                  keywords: kwMatch,
                  status: "SUCCESS",
                  details: `Optimized package metadata, itinerary structure, and FAQs for keyword '${kwMatch}'.`
                }
              });

              log(`Successfully optimized package: '${pkg.title}'`);
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to optimize package '${pkg.title}': ${err.message}`);
          }
        }
      }

      // OPTIMIZE BLOGS
      if (targetEntityTypes.includes("BLOG") && processedCount < limitCount) {
        const blogsToOptimize = await prisma.blog.findMany({
          take: 2,
          orderBy: { updatedAt: "asc" }
        });

        for (const blog of blogsToOptimize) {
          if (processedCount >= limitCount) break;

          const kwMatch = filteredKeywords[0]?.text || "uk travel tips";
          log(`Optimizing Blog Article: '${blog.title}' (ID: ${blog.id})`);

          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiApiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: `${baseRulebook}
Refine this travel blog article to improve E-E-A-T, structure, headings (<h2>, <h3>), and meta tags targeting: "${kwMatch}".
Include helpful FAQs and internal link references to "/v/economy-flight-london-to-dhaka" or relevant packages.
Return JSON matching schema:
{
  "title": "Refined Blog Title",
  "excerpt": "Compelling excerpt under 160 chars",
  "content": "Full HTML article content with internal links",
  "metaTitle": "SEO meta title",
  "metaDescription": "SEO meta description",
  "metaKeywords": "comma-separated keywords"
}`
                  },
                  {
                    role: "user",
                    content: `Existing Blog: Title: ${blog.title}, Content snippet: ${blog.content.substring(0, 300)}`
                  }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
              }),
            });

            const resJson = await response.json();
            if (resJson.choices?.[0]?.message?.content) {
              const data = JSON.parse(resJson.choices[0].message.content);

              await prisma.blog.update({
                where: { id: blog.id },
                data: {
                  title: data.title || blog.title,
                  excerpt: data.excerpt || blog.excerpt,
                  content: data.content || blog.content,
                  metaTitle: data.metaTitle || blog.metaTitle,
                  metaDescription: data.metaDescription || blog.metaDescription,
                  metaKeywords: data.metaKeywords || blog.metaKeywords,
                }
              });

              await prisma.seoAutopilotLog.create({
                data: {
                  actionType: "OPTIMIZE",
                  targetType: "BLOG",
                  targetId: blog.id,
                  targetTitle: blog.title,
                  keywords: kwMatch,
                  status: "SUCCESS",
                  details: `Optimized blog structure, internal links, and SEO tags.`
                }
              });

              log(`Successfully optimized blog: '${blog.title}'`);
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to optimize blog '${blog.title}': ${err.message}`);
          }
        }
      }
    }

    // GENERATE NEW DRAFTS
    if ((config.mode === "generate_new" || config.mode === "both") && processedCount < limitCount) {
      log(`Executing mode: GENERATE NEW CONTENT (Target: ${targetEntityTypes.join(", ")})...`);

      const keywordsToDraft = filteredKeywords.slice(0, limitCount - processedCount);

      for (const kw of keywordsToDraft) {
        if (processedCount >= limitCount) break;

        const slug = kw.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        // Determine entity type to generate
        const targetType = config.contentType !== "ALL"
          ? config.contentType
          : targetEntityTypes.includes("FLIGHT") && kw.text.includes("flight")
          ? "FLIGHT"
          : targetEntityTypes.includes("BLOG") && (kw.text.includes("guide") || kw.text.includes("how to") || kw.text.includes("tips") || kw.text.includes("requirements"))
          ? "BLOG"
          : "PACKAGE";

        log(`Generating new ${targetType} draft for keyword: '${kw.text}'`);

        if (targetType === "PACKAGE") {
          try {
            const pType = config.packageType !== "ALL" 
              ? config.packageType 
              : kw.text.toLowerCase().includes("umrah") ? "UMRAH" : kw.text.toLowerCase().includes("hajj") ? "HAJJ" : "HOLIDAY";

            const pRules = getPackageRules(pType);

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiApiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: `${baseRulebook} ${pRules}
You are an elite travel planner. Generate a new travel package targeting: "${kw.text}".
Output valid JSON matching schema:
{
  "title": "Compelling package title",
  "destination": "Destination city/country",
  "duration": "7 Nights",
  "price": 999.00,
  "description": "Complete HTML details (Day 1 Arrival, Hotel stays, Transfers, Return)",
  "travelDates": "Oct 2026 - Nov 2026",
  "meccaHotel": "${pType !== "HOLIDAY" ? "Luxury Hotel in Makkah (e.g. Swissotel Makkah)" : null}",
  "meccaNights": ${pType !== "HOLIDAY" ? 6 : null},
  "medinaHotel": "${pType !== "HOLIDAY" ? "Luxury Hotel in Madinah (e.g. Pullman Zamzam Madinah)" : null}",
  "medinaNights": ${pType !== "HOLIDAY" ? 4 : null},
  "metaTitle": "SEO title under 60 characters",
  "metaDescription": "SEO description under 160 characters",
  "metaKeywords": "comma-separated keywords"
}`
                  },
                  {
                    role: "user",
                    content: `Generate package for: ${kw.text}`
                  }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
              }),
            });

            const resJson = await response.json();
            if (resJson.choices?.[0]?.message?.content) {
              const data = JSON.parse(resJson.choices[0].message.content);

              const imgRes = await fetchRelevantImage({
                topic: kw.text,
                destination: data.destination,
                type: pType,
                fallbackTitle: data.title
              });

              const newPkg = await prisma.package.create({
                data: {
                  slug,
                  title: data.title || `Package for ${kw.text}`,
                  type: pType,
                  destination: data.destination || "Worldwide",
                  duration: data.duration || "7 Nights",
                  price: Number(data.price) || 899.0,
                  description: data.description || "<p>Package details</p>",
                  includedServices: "Flights, Hotel, Transfers, Visa Assistance",
                  images: JSON.stringify([imgRes.url]),
                  travelDates: data.travelDates || "Flexible departures 2026",
                  meccaHotel: data.meccaHotel || null,
                  meccaNights: data.meccaNights ? Number(data.meccaNights) : null,
                  medinaHotel: data.medinaHotel || null,
                  medinaNights: data.medinaNights ? Number(data.medinaNights) : null,
                  availability: false,
                  isSold: false,
                  stars: 4,
                  metaTitle: data.metaTitle,
                  metaDescription: data.metaDescription,
                  metaKeywords: data.metaKeywords || kw.text,
                }
              });

              await prisma.seoAutopilotLog.create({
                data: {
                  actionType: "GENERATE",
                  targetType: "PACKAGE",
                  targetId: newPkg.id,
                  targetTitle: newPkg.title,
                  keywords: kw.text,
                  status: "SUCCESS",
                  details: `Created draft package '${newPkg.title}' [Type: ${pType}] with relevant Unsplash image and hotel details.`
                }
              });

              log(`Successfully generated new package draft: '${data.title}' [Type: ${pType}]`);
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to generate package for keyword '${kw.text}': ${err.message}`);
          }
        } else if (targetType === "FLIGHT") {
          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiApiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: `${baseRulebook}
Generate a new Flight deal record for UK departures targeting keyword: "${kw.text}".
Return JSON matching schema:
{
  "airline": "Saudia",
  "airlineCode": "SV",
  "departure": "London Heathrow",
  "departureCode": "LHR",
  "destination": "Jeddah",
  "destinationCode": "JED",
  "price": 549.00,
  "duration": "6h 30m",
  "isTransit": false,
  "country": "Saudi Arabia",
  "metaTitle": "Cheap Flights from London to Jeddah",
  "metaDescription": "Book flights from London Heathrow to Jeddah with Saudia. Great fares and luggage included.",
  "metaKeywords": "cheap flights to jeddah, london to jeddah flights"
}`
                  },
                  {
                    role: "user",
                    content: `Generate flight deal for: ${kw.text}`
                  }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
              }),
            });

            const resJson = await response.json();
            if (resJson.choices?.[0]?.message?.content) {
              const data = JSON.parse(resJson.choices[0].message.content);

              const newFlight = await prisma.flight.create({
                data: {
                  slug,
                  airline: data.airline || "Saudia",
                  airlineCode: data.airlineCode || "SV",
                  departure: data.departure || "London Heathrow",
                  departureCode: data.departureCode || "LHR",
                  destination: data.destination || "Jeddah",
                  destinationCode: data.destinationCode || "JED",
                  price: Number(data.price) || 499.0,
                  duration: data.duration || "6h 30m",
                  isTransit: Boolean(data.isTransit),
                  country: data.country || "Saudi Arabia",
                  metaTitle: data.metaTitle,
                  metaDescription: data.metaDescription,
                  metaKeywords: data.metaKeywords || kw.text,
                }
              });

              await prisma.seoAutopilotLog.create({
                data: {
                  actionType: "GENERATE",
                  targetType: "FLIGHT",
                  targetId: newFlight.id,
                  targetTitle: `${newFlight.airline} ${newFlight.departure} to ${newFlight.destination}`,
                  keywords: kw.text,
                  status: "SUCCESS",
                  details: `Created new flight deal for route ${newFlight.departureCode} to ${newFlight.destinationCode}.`
                }
              });

              log(`Successfully generated new flight deal: '${newFlight.airline} ${newFlight.departure} to ${newFlight.destination}'`);
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to generate flight deal for '${kw.text}': ${err.message}`);
          }
        } else if (targetType === "BLOG") {
          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiApiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: `${baseRulebook}
Write an authoritative, high E-E-A-T travel article targeting keyword: "${kw.text}".
Include HTML headings (<h2>, <h3>), internal links to "/terrific-travel/umrah" or "/terrific-travel/flights", and helpful FAQs.
Return JSON matching schema:
{
  "title": "Informative Blog Article Title",
  "excerpt": "Engaging summary under 160 characters",
  "content": "Full article HTML with headings, guidance, internal links, and FAQs",
  "category": "Travel Guide",
  "readTime": "5 min read",
  "metaTitle": "SEO title under 60 characters",
  "metaDescription": "SEO description under 160 characters",
  "metaKeywords": "comma-separated keywords"
}`
                  },
                  {
                    role: "user",
                    content: `Write blog article for: ${kw.text}`
                  }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7,
              }),
            });

            const resJson = await response.json();
            if (resJson.choices?.[0]?.message?.content) {
              const data = JSON.parse(resJson.choices[0].message.content);

              const imgRes = await fetchRelevantImage({
                topic: kw.text,
                fallbackTitle: data.title
              });

              const newBlog = await prisma.blog.create({
                data: {
                  slug,
                  title: data.title || `Guide: ${kw.text}`,
                  excerpt: data.excerpt || `Complete guide to ${kw.text}`,
                  content: data.content || `<p>Article content</p>`,
                  category: data.category || "Travel Guide",
                  readTime: data.readTime || "5 min read",
                  date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                  image: imgRes.url,
                  metaTitle: data.metaTitle,
                  metaDescription: data.metaDescription,
                  metaKeywords: data.metaKeywords || kw.text,
                }
              });

              await prisma.seoAutopilotLog.create({
                data: {
                  actionType: "GENERATE",
                  targetType: "BLOG",
                  targetId: newBlog.id,
                  targetTitle: newBlog.title,
                  keywords: kw.text,
                  status: "SUCCESS",
                  details: `Created new blog article with Unsplash image and internal links.`
                }
              });

              log(`Successfully generated new blog draft: '${newBlog.title}'`);
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to generate blog for '${kw.text}': ${err.message}`);
          }
        }
      }
    }

    log(`SEO Autopilot completed. Processed ${processedCount} operations.`);

    // 6. Update last run date in SystemSettings
    await prisma.systemSetting.upsert({
      where: { key: "seo_autopilot_last_run" },
      update: { value: new Date().toISOString() },
      create: { key: "seo_autopilot_last_run", value: new Date().toISOString() }
    });

    return NextResponse.json({
      success: true,
      processed: processedCount,
      logs: executionLogs
    });

  } catch (error: any) {
    log(`CRITICAL ERROR during Autopilot execution: ${error.message}`);
    return NextResponse.json({
      success: false,
      error: error.message,
      logs: executionLogs
    }, { status: 500 });
  }
}
