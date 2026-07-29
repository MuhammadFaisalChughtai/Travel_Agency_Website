"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    take: 100
  });
  
  return logs;
}
