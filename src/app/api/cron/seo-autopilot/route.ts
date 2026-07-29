import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleAdsApi } from "google-ads-api";

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
            "seo_autopilot_seed_keywords"
          ]
        }
      }
    });

    const config = {
      enabled: "false",
      mode: "optimize_existing",
      limit: "10",
      seedKeywords: ""
    };

    for (const s of settings) {
      if (s.key === "seo_autopilot_enabled") config.enabled = s.value;
      if (s.key === "seo_autopilot_mode") config.mode = s.value;
      if (s.key === "seo_autopilot_limit") config.limit = s.value;
      if (s.key === "seo_autopilot_seed_keywords") config.seedKeywords = s.value;
    }

    // If autopilot is disabled and this is NOT a manual trigger, exit
    if (config.enabled !== "true" && !isManual) {
      log("SEO Autopilot is disabled in settings. Skipping run.");
      return NextResponse.json({ message: "Autopilot is disabled. Run skipped.", logs: executionLogs });
    }

    const limitCount = Math.max(1, Math.min(100, Number(config.limit) || 10));
    log(`Autopilot configured: mode=${config.mode}, limit=${limitCount}, seeds='${config.seedKeywords}'`);

    // 3. Setup Google Ads API credentials
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const rawCustomerId = process.env.GOOGLE_ADS_CUSTOMER_ID || "";
    const customerId = rawCustomerId.replace(/[^0-9]/g, ""); // Strip any dashes, spaces, or quotes
    const client_id = process.env.GOOGLE_ADS_CLIENT_ID;
    const client_secret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const refresh_token = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const openAiApiKey = process.env.GPT_KEY;

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
      client_id,
      client_secret,
      developer_token: developerToken,
    });

    const customer = googleAdsClient.Customer({
      customer_id: customerId,
      refresh_token,
    });

    // 4. Fetch Keyword Ideas from Google Ads API
    const seedPhrases = config.seedKeywords
      ? config.seedKeywords.split(",").map(k => k.trim()).filter(Boolean)
      : ["umrah packages", "holiday deals"];

    log(`Querying Google Keyword Planner for seeds: ${seedPhrases.join(", ")}`);
    
    let keywordIdeas: Array<{ text: string; searches: number; competition: string; competitionIndex: number }> = [];

    for (const seed of seedPhrases.slice(0, 3)) { // Limit to 3 seeds to respect quotas
      try {
        const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
          keywordSeed: { keywords: [seed] },
          geoTargetConstants: ["geoTargetConstants/2826"], // UK targeting
          keywordPlanNetwork: "GOOGLE_SEARCH",
        });

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
        if (!errMsg && err.errors) {
          errMsg = JSON.stringify(err.errors);
        }
        if (!errMsg) {
          errMsg = JSON.stringify(err);
        }
        log(`Failed to fetch keywords for seed '${seed}': ${errMsg}`);
      }
    }

    // Filter for low/medium competition and high intent phrases
    const filteredKeywords = keywordIdeas
      .filter(k => 
        (k.competition === "LOW" || k.competition === "MEDIUM" || k.competitionIndex < 50) &&
        k.searches >= 30 &&
        (k.text.includes("package") || k.text.includes("deal") || k.text.includes("book") || k.text.includes("cheap") || k.text.includes("best") || k.text.includes("umrah") || k.text.includes("holiday"))
      )
      .sort((a, b) => b.searches - a.searches);

    log(`Retrieved ${keywordIdeas.length} ideas from Google, filtered down to ${filteredKeywords.length} high-intent options.`);

    if (filteredKeywords.length === 0) {
      log("No eligible keywords found matching SEO criteria. Run completed.");
      return NextResponse.json({ message: "No keywords found.", logs: executionLogs });
    }

    // 5. Execute Action based on SEO Mode
    let processedCount = 0;

    const rulebook = `
=== WRITING RULEBOOK ===
1. HUMANIZED STYLE: Write in a natural, premium, and professional tone. It must read as if written by an elite travel consultant or human copywriter, not a machine.
2. NO AI JARGON/CLICHÉS: Strictly avoid typical AI vocabulary, transition words, and buzzwords (e.g., "embark on a journey", "testament to", "delve", "furthermore", "moreover", "in summary", "discover the magic").
3. NO HALLUCINATIONS: Do not invent unrealistic data. Ensure airport codes (e.g. LHR, DXB), airline codes, and duration calculations are realistic.
4. CLEAN HTML: Output clean structural HTML tags (e.g. <h3>, <strong>, <ul>, <li>, <p>). Do not include style attributes.
`;

    if (config.mode === "optimize_existing" || config.mode === "both") {
      log("Executing mode: OPTIMIZE EXISTING CONTENT...");
      
      // Fetch packages/blogs that haven't been updated recently or are missing metadata
      const packagesToOptimize = await prisma.package.findMany({
        take: Math.ceil(limitCount / 2),
        orderBy: { createdAt: "asc" } // Re-optimize oldest entries
      });

      for (const pkg of packagesToOptimize) {
        if (processedCount >= limitCount) break;
        
        // Find relevant keywords for this package
        const relevantKeywords = filteredKeywords
          .filter(k => k.text.toLowerCase().includes(pkg.destination.toLowerCase()) || k.text.toLowerCase().includes(pkg.title.split(" ")[0].toLowerCase()))
          .slice(0, 3)
          .map(k => k.text);

        const targetKeywordsStr = relevantKeywords.length > 0 ? relevantKeywords.join(", ") : "premium travel, holiday packages";
        log(`Optimizing Package: '${pkg.title}' (ID: ${pkg.id}) targeting keywords: [${targetKeywordsStr}]`);

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
                  content: `${rulebook}
You are an expert SEO optimizer. Refine the existing travel package title, description, and meta elements to rank for these high-intent target keywords: "${targetKeywordsStr}".
Maintain the existing structure but write highly engaging, human copy.
The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Optimized Package Title",
  "description": "Improved HTML content incorporating keywords naturally",
  "metaTitle": "SEO title under 60 characters",
  "metaDescription": "SEO description under 160 characters",
  "metaKeywords": "comma-separated list of keywords including target ones"
}`
                },
                {
                  role: "user",
                  content: `Existing Package Details:
Title: ${pkg.title}
Description: ${pkg.description}
MetaTitle: ${pkg.metaTitle || ""}
MetaDescription: ${pkg.metaDescription || ""}`
                }
              ],
              response_format: { type: "json_object" },
              temperature: 0.7,
            }),
          });

          const resJson = await response.json();
          if (resJson.choices?.[0]?.message?.content) {
            const data = JSON.parse(resJson.choices[0].message.content);
            
            await prisma.package.update({
              where: { id: pkg.id },
              data: {
                title: data.title || pkg.title,
                description: data.description || pkg.description,
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
                keywords: targetKeywordsStr,
                status: "SUCCESS",
                details: `Optimized SEO metadata and description with keywords: ${targetKeywordsStr}.`
              }
            });

            log(`Successfully optimized package: '${pkg.title}'`);
            processedCount++;
          }
        } catch (err: any) {
          log(`Failed to optimize package '${pkg.title}': ${err.message}`);
          await prisma.seoAutopilotLog.create({
            data: {
              actionType: "OPTIMIZE",
              targetType: "PACKAGE",
              targetId: pkg.id,
              targetTitle: pkg.title,
              keywords: targetKeywordsStr,
              status: "FAILED",
              details: err.message
            }
          });
        }
      }
    }

    if ((config.mode === "generate_new" || config.mode === "both") && processedCount < limitCount) {
      log("Executing mode: GENERATE NEW DRAFTS...");

      const keywordsToDraft = filteredKeywords.slice(0, limitCount - processedCount);

      for (const kw of keywordsToDraft) {
        const slug = kw.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        
        // Skip if package or blog already exists with this slug
        const existsPkg = await prisma.package.findUnique({ where: { slug } });
        if (existsPkg) continue;

        log(`Generating new travel package draft for keyword: '${kw.text}'`);

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
                  content: `${rulebook}
You are an elite travel planner. Generate a complete new travel package targeting the query keyword: "${kw.text}".
Output a realistic, high-quality holiday package.
For the package description field: Output structured, clean HTML containing clear headers/details for:
1. Flights (airline, route)
2. Hotels (highly-rated accommodations in destination)
3. Transfers/Transport inclusions
4. Visa assistance info
The output MUST be a valid JSON object matching this schema exactly:
{
  "title": "Creative, compelling package title",
  "destination": "Destination city/country",
  "duration": "Duration (e.g. 7 Nights)",
  "price": 999.00, // Price as a number
  "description": "Complete HTML details showing flights, hotels, transport, and visa sections",
  "travelDates": "Travel season details",
  "metaTitle": "SEO title under 60 characters",
  "metaDescription": "SEO description under 160 characters",
  "metaKeywords": "comma-separated list of keywords including target ones"
}`
                },
                {
                  role: "user",
                  content: `Generate a new package for: ${kw.text}`
                }
              ],
              response_format: { type: "json_object" },
              temperature: 0.7,
            }),
          });

          const resJson = await response.json();
          if (resJson.choices?.[0]?.message?.content) {
            const data = JSON.parse(resJson.choices[0].message.content);
            
            const newPkg = await prisma.package.create({
              data: {
                slug,
                title: data.title || `Deluxe package for ${kw.text}`,
                type: kw.text.toLowerCase().includes("umrah") ? "UMRAH" : "HOLIDAY",
                destination: data.destination || "Worldwide",
                duration: data.duration || "7 Nights",
                price: Number(data.price) || 899.0,
                description: data.description || "<p>Draft Package description</p>",
                includedServices: "Flights, Hotel, Transfers, Visa",
                images: JSON.stringify(["/images/placeholder.jpg"]),
                travelDates: data.travelDates || "Departures throughout 2026",
                availability: false, // Default to unpublished draft
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
                details: `Draft created targeting keyword: '${kw.text}'.`
              }
            });

            log(`Successfully generated new package draft: '${data.title}'`);
            processedCount++;
          }
        } catch (err: any) {
          log(`Failed to generate package for keyword '${kw.text}': ${err.message}`);
          await prisma.seoAutopilotLog.create({
            data: {
              actionType: "GENERATE",
              targetType: "PACKAGE",
              targetTitle: `Keyword: ${kw.text}`,
              keywords: kw.text,
              status: "FAILED",
              details: err.message
            }
          });
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
