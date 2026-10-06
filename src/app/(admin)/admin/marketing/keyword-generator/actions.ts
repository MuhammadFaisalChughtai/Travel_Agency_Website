"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { 
  testSearchConsoleConnection,
  getGscCredentials,
  fetchSearchConsoleAnalytics,
  GscSearchRow
} from "@/lib/googleSearchConsole";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function getAutopilotSettings() {
  await requireAuth();
  
  const keys = [
    "seo_autopilot_enabled",
    "seo_autopilot_mode",
    "seo_autopilot_limit",
    "seo_autopilot_seed_keywords",
    "seo_autopilot_package_type",
    "seo_autopilot_content_type",
    "seo_autopilot_last_run",
    "gsc_site_url",
    "gsc_client_email",
    "gsc_private_key"
  ];
  
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: { in: keys }
    }
  });
  
  const config: Record<string, string> = {
    seo_autopilot_enabled: "false",
    seo_autopilot_mode: "optimize_existing",
    seo_autopilot_limit: "50",
    seo_autopilot_seed_keywords: "",
    seo_autopilot_package_type: "ALL",
    seo_autopilot_content_type: "ALL",
    seo_autopilot_last_run: "Never",
    gsc_site_url: process.env.GSC_SITE_URL || "",
    gsc_client_email: process.env.GSC_CLIENT_EMAIL || "",
    gsc_private_key: process.env.GSC_PRIVATE_KEY || ""
  };
  
  for (const s of settings) {
    config[s.key] = s.value;
  }
  
  return config;
}

export async function saveAutopilotSettings(config: Record<string, string>) {
  await requireAuth();
  
  const promises = Object.entries(config).map(([key, value]) => {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  });
  
  await Promise.all(promises);
  revalidatePath("/admin/marketing/keyword-generator");
  return { success: true };
}

export async function testGscAction() {
  await requireAuth();
  return await testSearchConsoleConnection();
}

export async function getAutopilotLogs() {
  await requireAuth();
  
  const logs = await prisma.seoAutopilotLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 500
  });

  const packages = await prisma.package.findMany({
    select: { id: true, slug: true, type: true, title: true }
  });
  const blogs = await prisma.blog.findMany({
    select: { id: true, slug: true, title: true }
  });
  const flights = await prisma.flight.findMany({
    select: { id: true, slug: true, airline: true, departure: true, destination: true }
  });

  const packageMap = new Map(packages.map(p => [p.id, p]));
  const packageTitleMap = new Map(packages.map(p => [p.title.toLowerCase().trim(), p]));
  const blogMap = new Map(blogs.map(b => [b.id, b]));
  const blogTitleMap = new Map(blogs.map(b => [b.title.toLowerCase().trim(), b]));
  const flightMap = new Map(flights.map(f => [f.id, f]));

  return logs.map(log => {
    let slug: string | null = null;
    let packageType: string | null = null;

    if (log.targetType === "PACKAGE") {
      const p = (log.targetId ? packageMap.get(log.targetId) : null) || packageTitleMap.get(log.targetTitle.toLowerCase().trim());
      if (p) {
        slug = p.slug;
        packageType = p.type;
      } else {
        const match = log.details?.match(/\[Type:\s*([A-Za-z_]+)\]/);
        if (match) packageType = match[1];
      }
    } else if (log.targetType === "BLOG") {
      const b = (log.targetId ? blogMap.get(log.targetId) : null) || blogTitleMap.get(log.targetTitle.toLowerCase().trim());
      if (b) slug = b.slug;
    } else if (log.targetType === "FLIGHT") {
      const f = log.targetId ? flightMap.get(log.targetId) : null;
      if (f && f.slug) {
        slug = f.slug;
      }
    }

    if (!slug && log.keywords) {
      slug = log.keywords.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || null;
    }

    return {
      ...log,
      slug,
      packageType,
    };
  });
}

export async function getSeoAnalyticsData() {
  await requireAuth();

  // 1. Fetch inventory counts
  const [totalPackages, totalBlogs, totalFlights, packagesByType] = await Promise.all([
    prisma.package.count(),
    prisma.blog.count(),
    prisma.flight.count(),
    prisma.package.groupBy({
      by: ["type"],
      _count: { id: true },
    }),
  ]);

  // 2. Fetch all logs to calculate progress
  const logs = await prisma.seoAutopilotLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  const successLogs = logs.filter((l) => l.status === "SUCCESS");
  const failedLogs = logs.filter((l) => l.status === "FAILED");

  // Track unique IDs that have been optimized
  const optimizedPackageIds = new Set(
    successLogs.filter((l) => l.targetType === "PACKAGE" && l.targetId).map((l) => l.targetId!)
  );
  const optimizedBlogIds = new Set(
    successLogs.filter((l) => l.targetType === "BLOG" && l.targetId).map((l) => l.targetId!)
  );
  const optimizedFlightIds = new Set(
    successLogs.filter((l) => l.targetType === "FLIGHT" && l.targetId).map((l) => l.targetId!)
  );

  const totalContent = totalPackages + totalBlogs + totalFlights;
  const totalOptimized = optimizedPackageIds.size + optimizedBlogIds.size + optimizedFlightIds.size;
  const overallProgressPct = totalContent > 0 ? Math.round((totalOptimized / totalContent) * 100) : 0;

  // Breakdown by category
  const packageTypeCountMap: Record<string, number> = {};
  packagesByType.forEach((p) => {
    packageTypeCountMap[p.type] = p._count.id;
  });

  // Breakdown by action type: Updated vs Generated
  const updatedLogs = successLogs.filter((l) => l.actionType === "OPTIMIZE");
  const generatedLogs = successLogs.filter((l) => l.actionType === "GENERATE");

  const actionReport = {
    totalUpdates: updatedLogs.length,
    totalCreated: generatedLogs.length,
    totalOperations: successLogs.length,
    updatesRatio: successLogs.length > 0 ? Math.round((updatedLogs.length / successLogs.length) * 100) : 0,
    createdRatio: successLogs.length > 0 ? Math.round((generatedLogs.length / successLogs.length) * 100) : 0,
    byType: {
      packagesUpdated: updatedLogs.filter((l) => l.targetType === "PACKAGE").length,
      packagesCreated: generatedLogs.filter((l) => l.targetType === "PACKAGE").length,
      blogsUpdated: updatedLogs.filter((l) => l.targetType === "BLOG").length,
      blogsCreated: generatedLogs.filter((l) => l.targetType === "BLOG").length,
      flightsUpdated: updatedLogs.filter((l) => l.targetType === "FLIGHT").length,
      flightsCreated: generatedLogs.filter((l) => l.targetType === "FLIGHT").length,
    }
  };

  // Calculate activity in the last 7 days with update vs create split
  const last7Days: { date: string; label: string; count: number; updated: number; generated: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
    const dayLogs = logs.filter((l) => l.createdAt.toISOString().split("T")[0] === dateStr);
    const updated = dayLogs.filter((l) => l.status === "SUCCESS" && l.actionType === "OPTIMIZE").length;
    const generated = dayLogs.filter((l) => l.status === "SUCCESS" && l.actionType === "GENERATE").length;
    last7Days.push({ date: dateStr, label, count: dayLogs.length, updated, generated });
  }

  // 3. Live Google Search Console Data
  let gscData = {
    connected: false,
    siteUrl: "",
    totalImpressions: 0,
    totalClicks: 0,
    avgPosition: 0,
    avgCtr: 0,
    positionDistribution: {
      top3: 0,
      strikingDistance: 0,
      page2: 0,
      beyond: 0,
    },
    topQueries: [] as any[],
    strikingQueries: [] as any[],
  };

  try {
    const creds = await getGscCredentials();
    if (creds) {
      gscData.siteUrl = creds.siteUrl;
      const rows = await fetchSearchConsoleAnalytics({ daysBack: 28, rowLimit: 250 });
      if (rows && rows.length > 0) {
        gscData.connected = true;
        const totalImps = rows.reduce((acc: number, r: GscSearchRow) => acc + r.impressions, 0);
        const totalClicks = rows.reduce((acc: number, r: GscSearchRow) => acc + r.clicks, 0);
        const weightedPosSum = rows.reduce((acc: number, r: GscSearchRow) => acc + r.position * r.impressions, 0);
        const avgPos = totalImps > 0 ? weightedPosSum / totalImps : 0;
        const avgCtr = totalImps > 0 ? totalClicks / totalImps : 0;

        gscData.totalImpressions = totalImps;
        gscData.totalClicks = totalClicks;
        gscData.avgPosition = Number(avgPos.toFixed(1));
        gscData.avgCtr = Number((avgCtr * 100).toFixed(1));

        rows.forEach((r: GscSearchRow) => {
          if (r.position < 4.0) gscData.positionDistribution.top3++;
          else if (r.position <= 10.0) gscData.positionDistribution.strikingDistance++;
          else if (r.position <= 20.0) gscData.positionDistribution.page2++;
          else gscData.positionDistribution.beyond++;
        });

        // Top queries by impressions
        gscData.topQueries = [...rows].sort((a: GscSearchRow, b: GscSearchRow) => b.impressions - a.impressions).slice(0, 6);
        // Striking distance queries (pos 4-20)
        gscData.strikingQueries = rows
          .filter((r: GscSearchRow) => r.position >= 4.0 && r.position <= 20.0)
          .sort((a: GscSearchRow, b: GscSearchRow) => b.impressions - a.impressions)
          .slice(0, 6);
      }
    }
  } catch (err: any) {
    console.error("[getSeoAnalyticsData] GSC Error:", err);
  }

  const cronInfo = {
    configured: true,
    schedule: "0 0 * * *",
    humanSchedule: "Every Day at Midnight (00:00 UTC)",
    endpoint: "/api/cron/seo-autopilot",
    secretConfigured: Boolean(process.env.CRON_SECRET),
  };

  return {
    inventory: {
      totalContent,
      totalPackages,
      totalBlogs,
      totalFlights,
      packageTypeCountMap,
    },
    progress: {
      totalOptimized,
      overallProgressPct,
      optimizedPackages: optimizedPackageIds.size,
      optimizedBlogs: optimizedBlogIds.size,
      optimizedFlights: optimizedFlightIds.size,
      successCount: successLogs.length,
      failedCount: failedLogs.length,
      successRate: logs.length > 0 ? Math.round((successLogs.length / logs.length) * 100) : 100,
      last7Days,
    },
    actionReport,
    cronInfo,
    gsc: gscData,
  };
}
