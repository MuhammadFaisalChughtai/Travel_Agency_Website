import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleAdsApi } from "google-ads-api";
import { fetchRelevantImage } from "@/lib/imageFetcher";
import { 
  getGscCredentials, 
  fetchSearchConsoleAnalytics, 
  analyzeSearchConsoleOpportunities, 
  GscOpportunities, 
  GscSearchRow 
} from "@/lib/googleSearchConsole";

export async function GET(req: Request) {
  return handleAutopilotRequest(req);
}

export async function POST(req: Request) {
  return handleAutopilotRequest(req);
}

async function handleAutopilotRequest(req: Request) {
  const executionLogs: string[] = [];
  const affectedPages: Array<{
    action: "OPTIMIZE" | "GENERATE";
    targetType: string;
    id: string;
    title: string;
    slug?: string | null;
    keywords: string;
  }> = [];

  const log = (msg: string) => {
    console.log(msg);
    executionLogs.push(`[${new Date().toISOString()}] ${msg}`);
  };

  try {
    // 1. Security check - verify CRON_SECRET, Vercel cron header, or check if manually triggered by admin
    const authHeader = req.headers.get("Authorization");
    const isVercelCron = req.headers.get("x-vercel-cron") === "1";
    const isCronSecretValid = Boolean(process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`);
    
    // Also allow request if there is a query param manual=true
    const url = new URL(req.url);
    const isManual = url.searchParams.get("manual") === "true";

    if (!isCronSecretValid && !isVercelCron && !isManual) {
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

    // 3. Check ChatGPT API key (Required for AI content generation and optimization)
    const openAiApiKey = process.env['GPT_KEY'];
    if (!openAiApiKey) {
      const errorMsg = "Missing GPT_KEY in environment variables. ChatGPT API is required.";
      log(errorMsg);
      return NextResponse.json({ error: errorMsg, logs: executionLogs }, { status: 500 });
    }

    let keywordIdeas: Array<{ 
      text: string; 
      searches: number; 
      competition: string; 
      competitionIndex: number;
      source?: string;
      page?: string;
      position?: number;
    }> = [];
    let gscOpportunities: GscOpportunities | null = null;

    // 4. TIER 1: Fetch Real Search Queries from Google Search Console API
    try {
      const gscCreds = await getGscCredentials();
      if (gscCreds) {
        log(`[GSC] Connecting to Google Search Console for property: '${gscCreds.siteUrl}'...`);
        const gscRows = await fetchSearchConsoleAnalytics({ daysBack: 28, rowLimit: 1000 });
        if (gscRows.length > 0) {
          gscOpportunities = analyzeSearchConsoleOpportunities(gscRows);
          log(`[GSC] Successfully fetched ${gscRows.length} real Google search queries! Found ${gscOpportunities.strikingDistance.length} striking-distance queries (Pos 4-20) and ${gscOpportunities.highImpressionLowCtr.length} high-impression/low-CTR opportunities.`);

          // Map GSC striking-distance and high-intent queries into keywordIdeas
          const gscKeywords = gscOpportunities.strikingDistance.map(r => ({
            text: r.query,
            searches: r.impressions,
            competition: r.position <= 10 ? "HIGH" : "MEDIUM",
            competitionIndex: Math.round(r.position),
            source: "GOOGLE_SEARCH_CONSOLE",
            page: r.page,
            position: r.position,
          }));

          keywordIdeas = [...keywordIdeas, ...gscKeywords];
        } else {
          log("[GSC] Connected to Google Search Console, but 0 search rows were returned for this date window.");
        }
      } else {
        log("[GSC] Google Search Console credentials not detected. Proceeding to secondary keyword sources.");
      }
    } catch (gscErr: any) {
      log(`[GSC Notice] Could not fetch Google Search Console queries: ${gscErr.message}`);
    }

    // 5. TIER 2: Google Ads API (Optional if configured)
    const developerToken = process.env['GOOGLE_ADS_DEVELOPER_TOKEN'];
    const rawCustomerId = process.env['GOOGLE_ADS_CUSTOMER_ID'] || "";
    const customerId = rawCustomerId.replace(/[^0-9]/g, "");
    const client_id = process.env['GOOGLE_ADS_CLIENT_ID'];
    const client_secret = process.env['GOOGLE_ADS_CLIENT_SECRET'];
    const refresh_token = process.env['GOOGLE_ADS_REFRESH_TOKEN'];

    const hasGoogleAds = developerToken && customerId && client_id && client_secret && refresh_token;

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

    if (keywordIdeas.length < 5 && hasGoogleAds) {
      log(`[Google Ads] Querying Google Keyword Planner for seeds: ${seedPhrases.join(", ")}`);
      try {
        const googleAdsClient = new GoogleAdsApi({
          client_id: client_id!,
          client_secret: client_secret!,
          developer_token: developerToken!,
        });

        const customer = googleAdsClient.Customer({
          customer_id: customerId,
          login_customer_id: "1886283319",
          refresh_token: refresh_token!,
        });

        for (const seed of seedPhrases.slice(0, 3)) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
              customer_id: customerId,
              keyword_seed: { keywords: [seed] },
              geo_target_constants: ["geoTargetConstants/2826"],
              keyword_plan_network: "GOOGLE_SEARCH",
              language: "languageConstants/1000",
            } as any);

            if (Array.isArray(response)) {
              const mapped = response.map((item: any) => {
                const metrics = item.keywordIdeaMetrics || item.keyword_idea_metrics || {};
                return {
                  text: item.text || "",
                  searches: Number(metrics.avgMonthlySearches || metrics.avg_monthly_searches || 0),
                  competition: metrics.competition || "UNSPECIFIED",
                  competitionIndex: Number(metrics.competitionIndex || metrics.competition_index || 0),
                  source: "GOOGLE_ADS"
                };
              });
              keywordIdeas = [...keywordIdeas, ...mapped];
            }
          } catch (seedErr: any) {
            log(`[Google Ads Notice] Seed '${seed}': ${seedErr.message || "Failed"}`);
          }
        }
      } catch (err: any) {
        log(`[Google Ads Client Notice] ${err.message}`);
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

          // Check if Google Search Console has specific search queries for this package
          let pkgGscQueries: GscSearchRow[] = [];
          if (gscOpportunities) {
            const pkgSlug = (pkg.slug || "").toLowerCase().trim();
            for (const [pageUrl, queries] of Object.entries(gscOpportunities.pageQueryMap)) {
              if (pageUrl.toLowerCase().includes(pkgSlug)) {
                pkgGscQueries = [...pkgGscQueries, ...queries];
              }
            }
          }

          let kwMatch = "";
          let gscDetailNotice = "";

          if (pkgGscQueries.length > 0) {
            const striking = pkgGscQueries
              .filter(q => q.position >= 4 && q.position <= 20)
              .sort((a, b) => b.impressions - a.impressions);
            const chosen = striking[0] || pkgGscQueries.sort((a, b) => b.impressions - a.impressions)[0];
            kwMatch = chosen.query;
            gscDetailNotice = `[GSC Live Query: Pos ${chosen.position}, ${chosen.impressions} imps]`;
          } else {
            kwMatch = filteredKeywords.find(k => {
              const txt = k.text.toLowerCase();
              if (pTypeKey === "umrah" || pTypeKey === "cruise_umrah") return txt.includes("umrah") || txt.includes("makkah") || txt.includes("madinah");
              if (pTypeKey === "hajj") return txt.includes("hajj");
              if (pTypeKey === "holiday") return !txt.includes("umrah") && !txt.includes("hajj");
              return txt.includes((pkg.destination || "").toLowerCase());
            })?.text || "";

            if (!kwMatch) {
              kwMatch = filteredKeywords[0]?.text || (
                pTypeKey === "umrah" ? "cheap umrah packages from uk" :
                pTypeKey === "hajj" ? "hajj packages 2026 uk" :
                pTypeKey === "cruise_umrah" ? "red sea umrah cruise deals" :
                "luxury holiday packages from uk"
              );
            }
          }

          log(`Optimizing Package: '${pkg.title}' (ID: ${pkg.id}) [Type: ${pkg.type || config.packageType}] targeting: [${kwMatch}] ${gscDetailNotice}`);

          try {
            const pRules = getPackageRules(pkg.type || config.packageType);
            const gscInstruction = pkgGscQueries.length > 0
              ? `\nREAL GOOGLE SEARCH CONSOLE DATA FOR THIS URL:\nGoogle is already ranking this exact page for these queries:\n${pkgGscQueries.slice(0, 4).map(q => `- "${q.query}" (Current Pos: ${q.position}, Impressions: ${q.impressions})`).join("\n")}\nYou MUST seamlessly integrate these real queries into the title, headings, and FAQ schema to push this page to top 3 rankings.`
              : `\nTarget Primary Keyword: "${kwMatch}"`;

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
You are an expert SEO optimizer. Refine the existing travel package title, description, meta elements, and FAQs. ${gscInstruction}
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
              affectedPages.push({
                action: "OPTIMIZE",
                targetType: "PACKAGE",
                id: pkg.id,
                title: pkg.title,
                slug: pkg.slug,
                keywords: kwMatch
              });
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

          let blogGscQueries: GscSearchRow[] = [];
          if (gscOpportunities) {
            const blogSlug = (blog.slug || "").toLowerCase().trim();
            for (const [pageUrl, queries] of Object.entries(gscOpportunities.pageQueryMap)) {
              if (pageUrl.toLowerCase().includes(blogSlug)) {
                blogGscQueries = [...blogGscQueries, ...queries];
              }
            }
          }

          const kwMatch = blogGscQueries.length > 0 
            ? blogGscQueries[0].query 
            : (filteredKeywords[0]?.text || "uk travel tips");

          const gscBlogNotice = blogGscQueries.length > 0
            ? `[GSC Live Query: Pos ${blogGscQueries[0].position}, ${blogGscQueries[0].impressions} imps]`
            : "";

          log(`Optimizing Blog Article: '${blog.title}' (ID: ${blog.id}) targeting: [${kwMatch}] ${gscBlogNotice}`);

          try {
            const gscBlogContext = blogGscQueries.length > 0
              ? `\nREAL GOOGLE SEARCH CONSOLE DATA:\nGoogle ranks this article for:\n${blogGscQueries.slice(0, 3).map(q => `- "${q.query}" (Pos ${q.position})`).join("\n")}\nIncorporate these queries naturally into headings and content.`
              : "";

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
Refine this travel blog article to improve E-E-A-T, structure, headings (<h2>, <h3>), and meta tags targeting: "${kwMatch}". ${gscBlogContext}
Include helpful FAQs and internal link references to relevant packages or flight destinations.
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
              affectedPages.push({
                action: "OPTIMIZE",
                targetType: "BLOG",
                id: blog.id,
                title: blog.title,
                slug: blog.slug,
                keywords: kwMatch
              });
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to optimize blog '${blog.title}': ${err.message}`);
          }
        }
      }

      // OPTIMIZE FLIGHTS
      if (targetEntityTypes.includes("FLIGHT") && processedCount < limitCount) {
        const flightsToOptimize = await prisma.flight.findMany({
          take: Math.max(1, limitCount - processedCount),
          orderBy: { createdAt: "asc" }
        });

        if (flightsToOptimize.length === 0) {
          log("[Notice] 0 existing flight deals found in database to optimize. Auto-initiating initial flight deal generation...");
          const kw = filteredKeywords[0] || { text: "cheap flights from london" };
          const slug = kw.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

          try {
            log(`Generating initial flight deal for keyword: '${kw.text}'`);
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
  "metaTitle": "Cheap Flights from London to Jeddah | Best UK Fares",
  "metaDescription": "Book flights from London Heathrow to Jeddah with Saudia. Great fares, direct routing, and luggage included.",
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
                  details: `Auto-generated initial flight deal (fallback from 0 existing flights in database).`
                }
              });

              log(`Successfully generated new flight deal: '${newFlight.airline} ${newFlight.departure} to ${newFlight.destination}'`);
              affectedPages.push({
                action: "GENERATE",
                targetType: "FLIGHT",
                id: newFlight.id,
                title: `${newFlight.departure} → ${newFlight.destination} (${newFlight.airline})`,
                slug: newFlight.slug,
                keywords: kw.text
              });
              processedCount++;
            }
          } catch (err: any) {
            log(`Failed to generate initial flight deal: ${err.message}`);
          }
        } else {
          for (const fl of flightsToOptimize) {
            if (processedCount >= limitCount) break;

            let flGscQueries: GscSearchRow[] = [];
            if (gscOpportunities) {
              const flSlug = (fl.slug || "").toLowerCase().trim();
              const flDest = (fl.destination || "").toLowerCase().trim();
              const flAirline = (fl.airline || "").toLowerCase().trim();
              for (const [pageUrl, queries] of Object.entries(gscOpportunities.pageQueryMap)) {
                if (
                  (flSlug && pageUrl.toLowerCase().includes(flSlug)) ||
                  (flDest && pageUrl.toLowerCase().includes(flDest)) ||
                  (flAirline && pageUrl.toLowerCase().includes(flAirline))
                ) {
                  flGscQueries = [...flGscQueries, ...queries];
                }
              }
            }

            let kwMatch = "";
            let gscDetailNotice = "";

            if (flGscQueries.length > 0) {
              const striking = flGscQueries
                .filter(q => q.position >= 4 && q.position <= 20)
                .sort((a, b) => b.impressions - a.impressions);
              const chosen = striking[0] || flGscQueries.sort((a, b) => b.impressions - a.impressions)[0];
              kwMatch = chosen.query;
              gscDetailNotice = `[GSC Live Query: Pos ${chosen.position}, ${chosen.impressions} imps]`;
            } else {
              const flightKw = filteredKeywords.find(k => {
                const txt = k.text.toLowerCase();
                return txt.includes((fl.destination || "").toLowerCase()) ||
                       txt.includes((fl.airline || "").toLowerCase()) ||
                       txt.includes("flight");
              });
              kwMatch = flightKw?.text || filteredKeywords[0]?.text || `cheap flights from ${fl.departure} to ${fl.destination}`;
            }

            const flTitle = `${fl.airline} ${fl.departure} (${fl.departureCode || "UK"}) to ${fl.destination} (${fl.destinationCode || "INTL"})`;
            log(`Optimizing Flight Deal: '${flTitle}' (ID: ${fl.id}) targeting: [${kwMatch}] ${gscDetailNotice}`);

            try {
              const gscFlightInstruction = flGscQueries.length > 0
                ? `\nREAL GOOGLE SEARCH CONSOLE DATA:\nGoogle ranks this route for:\n${flGscQueries.slice(0, 3).map(q => `- "${q.query}" (Pos ${q.position})`).join("\n")}\nIncorporate these exact terms into the metaTitle, metaDescription, and keywords.`
                : `\nTarget Primary Keyword: "${kwMatch}"`;

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
You are an expert flight deals SEO copywriter. Optimize this UK flight deal route. ${gscFlightInstruction}
Return valid JSON matching schema:
{
  "metaTitle": "Compelling SEO title under 60 chars (e.g. Cheap Flights from London to Jeddah | Terrific Travel)",
  "metaDescription": "SEO meta description under 160 chars highlighting airlines, baggage, best fares",
  "metaKeywords": "comma-separated high-intent search terms",
  "baggage": "e.g. 30kg Checked, 7kg Cabin",
  "aircraft": "e.g. Boeing 777-300ER"
}`
                    },
                    {
                      role: "user",
                      content: `Existing Flight: Airline: ${fl.airline}, Route: ${fl.departure} to ${fl.destination}, Price: £${fl.price}`
                    }
                  ],
                  response_format: { type: "json_object" },
                  temperature: 0.7,
                }),
              });

              const resJson = await response.json();
              if (resJson.choices?.[0]?.message?.content) {
                const data = JSON.parse(resJson.choices[0].message.content);

                const updatedSlug = fl.slug || `${fl.departureCode || "lhr"}-to-${fl.destinationCode || "jed"}-${fl.airline.toLowerCase().replace(/[^a-z0-9]+/g, "")}`.toLowerCase();

                await prisma.flight.update({
                  where: { id: fl.id },
                  data: {
                    slug: updatedSlug,
                    metaTitle: data.metaTitle || fl.metaTitle,
                    metaDescription: data.metaDescription || fl.metaDescription,
                    metaKeywords: data.metaKeywords || kwMatch,
                    baggage: data.baggage || fl.baggage,
                    aircraft: data.aircraft || fl.aircraft,
                  }
                });

                await prisma.seoAutopilotLog.create({
                  data: {
                    actionType: "OPTIMIZE",
                    targetType: "FLIGHT",
                    targetId: fl.id,
                    targetTitle: flTitle,
                    keywords: kwMatch,
                    status: "SUCCESS",
                    details: `Optimized flight SEO metadata and route keywords.`
                  }
                });

                log(`Successfully optimized flight deal: '${flTitle}'`);
                affectedPages.push({
                  action: "OPTIMIZE",
                  targetType: "FLIGHT",
                  id: fl.id,
                  title: flTitle,
                  slug: updatedSlug,
                  keywords: kwMatch
                });
                processedCount++;
              }
            } catch (err: any) {
              log(`Failed to optimize flight '${flTitle}': ${err.message}`);
            }
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
              affectedPages.push({
                action: "GENERATE",
                targetType: "PACKAGE",
                id: newPkg.id,
                title: newPkg.title,
                slug: newPkg.slug,
                keywords: kw.text
              });
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
              affectedPages.push({
                action: "GENERATE",
                targetType: "FLIGHT",
                id: newFlight.id,
                title: `${newFlight.departure} → ${newFlight.destination} (${newFlight.airline})`,
                slug: newFlight.slug,
                keywords: kw.text
              });
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
              affectedPages.push({
                action: "GENERATE",
                targetType: "BLOG",
                id: newBlog.id,
                title: newBlog.title,
                slug: newBlog.slug,
                keywords: kw.text
              });
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
      updatedCount: affectedPages.filter(p => p.action === "OPTIMIZE").length,
      generatedCount: affectedPages.filter(p => p.action === "GENERATE").length,
      affectedPages,
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
