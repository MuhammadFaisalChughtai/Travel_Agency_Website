"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
    "seo_autopilot_last_run"
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
    seo_autopilot_last_run: "Never"
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
