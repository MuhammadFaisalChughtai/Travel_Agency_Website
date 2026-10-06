"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getAutopilotSettings,
  saveAutopilotSettings,
  getAutopilotLogs,
  testGscAction,
  getSeoAnalyticsData,
} from "./actions";
import {
  Play,
  Settings,
  Activity,
  History,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  KeyRound,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Target,
  Globe,
  Zap,
  Check,
  MousePointerClick,
  ArrowUpRight,
  Layers,
  Clock,
  Copy,
  FileText,
  PlusCircle,
  CheckCheck,
  Filter,
  Plane,
  Palmtree,
  BookOpen,
} from "lucide-react";

export default function KeywordGeneratorPage() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("optimize_existing");
  const [limit, setLimit] = useState("50");
  const [seeds, setSeeds] = useState("");
  const [keywordsFlights, setKeywordsFlights] = useState("");
  const [keywordsPackages, setKeywordsPackages] = useState("");
  const [keywordsHolidays, setKeywordsHolidays] = useState("");
  const [keywordsBlogs, setKeywordsBlogs] = useState("");
  const [activeKeywordPocketTab, setActiveKeywordPocketTab] = useState<
    "flights" | "packages" | "holidays" | "blogs"
  >("flights");
  const [viewAllPockets, setViewAllPockets] = useState(false);
  const [packageType, setPackageType] = useState("ALL");
  const [contentType, setContentType] = useState("ALL");
  const [lastRun, setLastRun] = useState("Never");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [selectedReportTab, setSelectedReportTab] = useState<
    "ALL" | "OPTIMIZE" | "GENERATE"
  >("ALL");

  // Google Search Console State
  const [gscSiteUrl, setGscSiteUrl] = useState("");
  const [gscClientEmail, setGscClientEmail] = useState("");
  const [gscPrivateKey, setGscPrivateKey] = useState("");
  const [testingGsc, setTestingGsc] = useState(false);
  const [gscTestResult, setGscTestResult] = useState<{
    success: boolean;
    message: string;
    siteUrl?: string;
    rowCount?: number;
    sampleQueries?: string[];
  } | null>(null);

  // Analytics & Progress State
  const [analyticsData, setAnalyticsData] = useState<{
    inventory: {
      totalContent: number;
      totalPackages: number;
      totalBlogs: number;
      totalFlights: number;
      packageTypeCountMap: Record<string, number>;
    };
    progress: {
      totalOptimized: number;
      overallProgressPct: number;
      optimizedPackages: number;
      optimizedBlogs: number;
      optimizedFlights: number;
      successCount: number;
      failedCount: number;
      successRate: number;
      last7Days: {
        date: string;
        label: string;
        count: number;
        updated: number;
        generated: number;
      }[];
    };
    actionReport?: {
      totalUpdates: number;
      totalCreated: number;
      totalOperations: number;
      updatesRatio: number;
      createdRatio: number;
      byType: {
        packagesUpdated: number;
        packagesCreated: number;
        blogsUpdated: number;
        blogsCreated: number;
        flightsUpdated: number;
        flightsCreated: number;
      };
    };
    cronInfo?: {
      configured: boolean;
      schedule: string;
      humanSchedule: string;
      endpoint: string;
      secretConfigured: boolean;
    };
    gsc: {
      connected: boolean;
      siteUrl: string;
      totalImpressions: number;
      totalClicks: number;
      avgPosition: number;
      avgCtr: number;
      positionDistribution: {
        top3: number;
        strikingDistance: number;
        page2: number;
        beyond: number;
      };
      topQueries: any[];
      strikingQueries: any[];
    };
  } | null>(null);
  const [selectedGscTab, setSelectedGscTab] = useState<"striking" | "top">(
    "striking",
  );

  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [dbLogs, setDbLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const filteredLogs = dbLogs.filter((log) => {
    if (selectedReportTab === "ALL") return true;
    return log.actionType === selectedReportTab;
  });

  const totalLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalLogs / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalLogs);
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [config, logs, analytics] = await Promise.all([
        getAutopilotSettings(),
        getAutopilotLogs(),
        getSeoAnalyticsData(),
      ]);

      setEnabled(config.seo_autopilot_enabled === "true");
      setMode(config.seo_autopilot_mode || "optimize_existing");
      setLimit(config.seo_autopilot_limit || "50");
      setSeeds(config.seo_autopilot_seed_keywords || "");
      setKeywordsFlights(
        config.seo_autopilot_keywords_flights ||
          "cheap flights from london, flights to jeddah, flight deals uk, direct flights to makkah, airline tickets discount",
      );
      setKeywordsPackages(
        config.seo_autopilot_keywords_packages ||
          "umrah packages 2026, cheap umrah from london, 5 star umrah packages, family umrah packages, ramadan umrah deals, hajj packages",
      );
      setKeywordsHolidays(
        config.seo_autopilot_keywords_holidays ||
          "family holiday deals, luxury beach holidays, dubai holiday packages, all inclusive holidays from uk, turkey holiday deals",
      );
      setKeywordsBlogs(
        config.seo_autopilot_keywords_blogs ||
          "visa for umrah from uk, best time to perform umrah, umrah packing list, saudi tourist visa guide, uk travel requirements",
      );
      setPackageType(config.seo_autopilot_package_type || "ALL");
      setContentType(config.seo_autopilot_content_type || "ALL");
      setLastRun(config.seo_autopilot_last_run || "Never");

      setGscSiteUrl(config.gsc_site_url || "");
      setGscClientEmail(config.gsc_client_email || "");
      setGscPrivateKey(config.gsc_private_key || "");

      setDbLogs(logs);
      setAnalyticsData(analytics);
    } catch (err) {
      console.error("Failed to load settings or logs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAutopilotSettings({
        seo_autopilot_enabled: enabled ? "true" : "false",
        seo_autopilot_mode: mode,
        seo_autopilot_limit: limit,
        seo_autopilot_seed_keywords: seeds,
        seo_autopilot_keywords_flights: keywordsFlights,
        seo_autopilot_keywords_packages: keywordsPackages,
        seo_autopilot_keywords_holidays: keywordsHolidays,
        seo_autopilot_keywords_blogs: keywordsBlogs,
        seo_autopilot_package_type: packageType,
        seo_autopilot_content_type: contentType,
        gsc_site_url: gscSiteUrl,
        gsc_client_email: gscClientEmail,
        gsc_private_key: gscPrivateKey,
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestGsc = async () => {
    setTestingGsc(true);
    setGscTestResult(null);
    try {
      const res = await testGscAction();
      setGscTestResult(res);
      // If test succeeded, reload analytics to update GSC status immediately
      if (res.success) {
        const analytics = await getSeoAnalyticsData();
        setAnalyticsData(analytics);
      }
    } catch (err: any) {
      setGscTestResult({
        success: false,
        message: err.message || "Failed to execute GSC test.",
      });
    } finally {
      setTestingGsc(false);
    }
  };

  const handleManualRun = async () => {
    if (running) return;
    if (
      !confirm(
        "Are you sure you want to trigger a manual SEO autopilot cycle now?",
      )
    )
      return;

    setRunning(true);
    setConsoleLogs(["[System] Starting manual trigger execution..."]);

    try {
      const res = await fetch("/api/cron/seo-autopilot?manual=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        let errorMsg = `Server response HTTP ${res.status}: ${res.statusText || "Execution notice"}`;
        if (res.status === 504) {
          errorMsg =
            "Gateway Time-out (504): The reverse proxy reached its 60s timeout limit. Operations completed before cutoff have been committed to the database.";
        }
        setConsoleLogs((prev) => [
          ...prev,
          `[System] ${errorMsg}`,
          `[System] Fetching latest database audit logs and analytics...`,
        ]);
        await loadData();
        return;
      }

      const contentTypeHeader = res.headers.get("content-type") || "";
      if (!contentTypeHeader.includes("application/json")) {
        const rawText = await res.text();
        setConsoleLogs((prev) => [
          ...prev,
          `[System] Non-JSON server response (HTTP ${res.status}): ${rawText.slice(0, 120)}...`,
          `[System] Fetching latest database audit logs...`,
        ]);
        await loadData();
        return;
      }

      const data = await res.json();
      if (data.logs) {
        setConsoleLogs(data.logs);
      }

      if (data.success) {
        const updateStr =
          data.updatedCount !== undefined
            ? `[System] Run succeeded! Updated: ${data.updatedCount} pages, Created: ${data.generatedCount} new pages.`
            : `[System] Run succeeded. Processed ${data.processed} operations.`;
        setConsoleLogs((prev) => [...prev, updateStr]);
      } else {
        setConsoleLogs((prev) => [
          ...prev,
          `[System] Run failed: ${data.error || "Unknown error"}`,
        ]);
      }

      // Reload logs, analytics, and last run
      const [updatedLogs, updatedAnalytics, updatedConfig] = await Promise.all([
        getAutopilotLogs(),
        getSeoAnalyticsData(),
        getAutopilotSettings(),
      ]);
      setDbLogs(updatedLogs);
      setAnalyticsData(updatedAnalytics);
      setLastRun(updatedConfig.seo_autopilot_last_run || "Never");
    } catch (err: any) {
      console.error(err);
      setConsoleLogs((prev) => [
        ...prev,
        `[System] Execution notice: ${err.message}`,
        `[System] Fetching updated database records...`,
      ]);
      await loadData();
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-slate-500">
            Loading Autopilot Settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            AI SEO Autopilot
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Automate keyword research, page metadata optimization, and content
            draft generation.
          </p>
        </div>

        {/* Status Indicator & Trigger Button */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              enabled
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
            />
            Autopilot: {enabled ? "Active" : "Disabled"}
          </div>

          <button
            onClick={handleManualRun}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60 transition-all shadow-sm"
          >
            {running ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Run Manual Cycle
              </>
            )}
          </button>
        </div>
      </div>

      {/* SEO Progress, KPI Metrics & Visual Graphs */}
      {analyticsData && (
        <div className="space-y-6">
          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Overall Content Coverage */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Catalog Coverage
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {analyticsData.progress.overallProgressPct}%
                </span>
                <span className="text-xs text-slate-500">optimized</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(analyticsData.progress.overallProgressPct, 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>
                    {analyticsData.progress.totalOptimized} of{" "}
                    {analyticsData.inventory.totalContent} items
                  </span>
                  <span className="text-emerald-600 font-bold">
                    {analyticsData.progress.totalOptimized} done
                  </span>
                </div>
              </div>

              {/* Sub-breakdowns */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>
                  📦 Pkg:{" "}
                  <strong className="text-slate-800">
                    {analyticsData.progress.optimizedPackages}/
                    {analyticsData.inventory.totalPackages}
                  </strong>
                </span>
                <span>
                  📝 Blog:{" "}
                  <strong className="text-slate-800">
                    {analyticsData.progress.optimizedBlogs}/
                    {analyticsData.inventory.totalBlogs}
                  </strong>
                </span>
                <span>
                  ✈️ Flight:{" "}
                  <strong className="text-slate-800">
                    {analyticsData.progress.optimizedFlights}/
                    {analyticsData.inventory.totalFlights}
                  </strong>
                </span>
              </div>
            </div>

            {/* KPI 2: Google Search Console Impressions */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Search Impressions
                </span>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {analyticsData.gsc.totalImpressions > 0
                    ? analyticsData.gsc.totalImpressions.toLocaleString()
                    : "0"}
                </span>
                <span className="text-xs text-slate-500">last 28d</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <MousePointerClick className="h-3.5 w-3.5 text-indigo-500" />
                  {analyticsData.gsc.totalClicks.toLocaleString()} Clicks
                </span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                  {analyticsData.gsc.avgCtr}% CTR
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span
                  className="text-slate-400 truncate max-w-[170px]"
                  title={analyticsData.gsc.siteUrl}
                >
                  {analyticsData.gsc.siteUrl || "terrifictravel.co.uk"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    analyticsData.gsc.connected
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      analyticsData.gsc.connected
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />
                  {analyticsData.gsc.connected ? "GSC Live" : "Pending API"}
                </span>
              </div>
            </div>

            {/* KPI 3: Average SERP Position */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Average SERP Rank
                </span>
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Target className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {analyticsData.gsc.avgPosition > 0
                    ? analyticsData.gsc.avgPosition.toFixed(1)
                    : "—"}
                </span>
                <span className="text-xs text-slate-500">Google Position</span>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 font-bold px-2.5 py-1 rounded-md border border-emerald-200">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>
                  {analyticsData.gsc.positionDistribution.strikingDistance}{" "}
                  Striking Distance Keywords
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>
                  Top 3:{" "}
                  <strong className="text-emerald-700">
                    {analyticsData.gsc.positionDistribution.top3}
                  </strong>
                </span>
                <span>
                  Page 2:{" "}
                  <strong className="text-amber-700">
                    {analyticsData.gsc.positionDistribution.page2}
                  </strong>
                </span>
                <span>
                  Beyond:{" "}
                  <strong className="text-slate-600">
                    {analyticsData.gsc.positionDistribution.beyond}
                  </strong>
                </span>
              </div>
            </div>

            {/* KPI 4: Autopilot Reliability & Health */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Autopilot Reliability
                </span>
                <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {analyticsData.progress.successRate}%
                </span>
                <span className="text-xs text-slate-500">success rate</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" />{" "}
                  {analyticsData.progress.successCount} Successful
                </span>
                <span className="text-rose-500 font-semibold">
                  {analyticsData.progress.failedCount} Failed
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-indigo-600">
                  Tier 1: GSC + GPT-4o
                </span>
                <span>Cron: 02:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Visual Graphs Section (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Graph 1: SERP Ranking Distribution */}
            <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    Google SERP Ranking Distribution
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {analyticsData.gsc.positionDistribution.top3 +
                      analyticsData.gsc.positionDistribution.strikingDistance +
                      analyticsData.gsc.positionDistribution.page2 +
                      analyticsData.gsc.positionDistribution.beyond}{" "}
                    Ranked Queries
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Visual breakdown of ranked queries. Striking distance keywords
                  (positions 4–10) are prioritized for AI enrichment to enter
                  the top 3.
                </p>

                {/* Segmented Cumulative Visual Bar */}
                {(() => {
                  const total =
                    analyticsData.gsc.positionDistribution.top3 +
                      analyticsData.gsc.positionDistribution.strikingDistance +
                      analyticsData.gsc.positionDistribution.page2 +
                      analyticsData.gsc.positionDistribution.beyond || 1;
                  const pTop3 = Math.max(
                    (analyticsData.gsc.positionDistribution.top3 / total) * 100,
                    2,
                  );
                  const pStrike = Math.max(
                    (analyticsData.gsc.positionDistribution.strikingDistance /
                      total) *
                      100,
                    3,
                  );
                  const pPage2 = Math.max(
                    (analyticsData.gsc.positionDistribution.page2 / total) *
                      100,
                    3,
                  );
                  const pBeyond = Math.max(
                    (analyticsData.gsc.positionDistribution.beyond / total) *
                      100,
                    3,
                  );

                  return (
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                        <div
                          style={{ width: `${pTop3}%` }}
                          className="bg-emerald-500 transition-all hover:opacity-80"
                          title={`Top 3: ${analyticsData.gsc.positionDistribution.top3} queries`}
                        />
                        <div
                          style={{ width: `${pStrike}%` }}
                          className="bg-indigo-600 transition-all hover:opacity-80"
                          title={`Striking Distance (4-10): ${analyticsData.gsc.positionDistribution.strikingDistance} queries`}
                        />
                        <div
                          style={{ width: `${pPage2}%` }}
                          className="bg-amber-500 transition-all hover:opacity-80"
                          title={`Page 2 (11-20): ${analyticsData.gsc.positionDistribution.page2} queries`}
                        />
                        <div
                          style={{ width: `${pBeyond}%` }}
                          className="bg-slate-300 transition-all hover:opacity-80"
                          title={`Beyond 20: ${analyticsData.gsc.positionDistribution.beyond} queries`}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Legend & Count Rows */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-emerald-950">
                        Top 3 (Pos 1–3)
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700 text-sm">
                      {analyticsData.gsc.positionDistribution.top3}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-indigo-600" />
                      <div>
                        <span className="font-semibold text-indigo-950">
                          Striking (Pos 4–10)
                        </span>
                        <span className="block text-[9px] text-indigo-700 font-bold">
                          🎯 Highest Opportunity
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-700 text-sm">
                      {analyticsData.gsc.positionDistribution.strikingDistance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="font-semibold text-amber-950">
                        Page 2 (Pos 11–20)
                      </span>
                    </div>
                    <span className="font-bold text-amber-700 text-sm">
                      {analyticsData.gsc.positionDistribution.page2}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-slate-400" />
                      <span className="font-semibold text-slate-700">
                        Beyond (Pos 21+)
                      </span>
                    </div>
                    <span className="font-bold text-slate-700 text-sm">
                      {analyticsData.gsc.positionDistribution.beyond}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Live Google Search Console Sync
                </span>
                <span>Updated in real-time</span>
              </div>
            </div>

            {/* Graph 2: 7-Day AI Optimization Velocity */}
            <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    7-Day AI Velocity (Updates vs New Pages)
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Past 7 Days
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Visual daily volume showing pages updated (Indigo) vs
                  brand-new draft pages generated (Emerald).
                </p>

                {/* Vertical Stacked Bar Chart */}
                {(() => {
                  const maxCount = Math.max(
                    ...analyticsData.progress.last7Days.map((d) => d.count),
                    5,
                  );
                  return (
                    <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
                      {analyticsData.progress.last7Days.map((day, idx) => {
                        const isLatest =
                          idx === analyticsData.progress.last7Days.length - 1;
                        const updatedHeightPct = (day.updated / maxCount) * 100;
                        const generatedHeightPct =
                          (day.generated / maxCount) * 100;

                        return (
                          <div
                            key={day.date}
                            className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                          >
                            {/* Bar value tooltip */}
                            <span className="text-[10px] font-bold text-slate-600 opacity-90 group-hover:text-indigo-600 transition-colors">
                              {day.count}
                            </span>

                            {/* Stacked Bar element */}
                            <div className="w-full max-w-[36px] bg-slate-100 rounded-t-md h-full flex flex-col justify-end overflow-hidden">
                              {day.generated > 0 && (
                                <div
                                  style={{ height: `${generatedHeightPct}%` }}
                                  className="w-full bg-emerald-500 transition-all hover:opacity-85"
                                  title={`${day.generated} Newly Created Pages`}
                                />
                              )}
                              {day.updated > 0 && (
                                <div
                                  style={{ height: `${updatedHeightPct}%` }}
                                  className="w-full bg-indigo-600 transition-all hover:opacity-85"
                                  title={`${day.updated} Pages Updated`}
                                />
                              )}
                              {day.count === 0 && (
                                <div className="h-1 w-full bg-slate-200" />
                              )}
                            </div>

                            {/* Day label */}
                            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                              {day.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Legend & Summary */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-xs bg-indigo-600" />
                    <strong>Updates:</strong>{" "}
                    {analyticsData.progress.last7Days.reduce(
                      (a, b) => a + b.updated,
                      0,
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
                    <strong>New Pages:</strong>{" "}
                    {analyticsData.progress.last7Days.reduce(
                      (a, b) => a + b.generated,
                      0,
                    )}
                  </span>
                </div>
                <span className="text-indigo-600 font-semibold">
                  Autonomous Cron Active
                </span>
              </div>
            </div>

            {/* Precise Content Actions Impact Report Card (Full Width) */}
            {analyticsData.actionReport && (
              <div className="lg:col-span-12 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-indigo-600" />
                      Content Impact Report: Updated Pages vs. Newly Added
                      Content
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visual comparison of existing pages enriched with
                      high-intent keywords versus brand-new content generated
                      automatically.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                      Total Operations:{" "}
                      {analyticsData.actionReport.totalOperations}
                    </span>
                  </div>
                </div>

                {/* Split Segmented Visual Ratio Bar */}
                <div className="space-y-2">
                  <div className="h-5 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                    <div
                      style={{
                        width: `${Math.max(analyticsData.actionReport.updatesRatio, 2)}%`,
                      }}
                      className="bg-indigo-600 transition-all hover:opacity-90 flex items-center justify-center text-[10px] font-black text-white px-2 truncate"
                      title={`Updated Pages: ${analyticsData.actionReport.totalUpdates} (${analyticsData.actionReport.updatesRatio}%)`}
                    >
                      {analyticsData.actionReport.updatesRatio > 12
                        ? `${analyticsData.actionReport.updatesRatio}% Updates`
                        : ""}
                    </div>
                    <div
                      style={{
                        width: `${Math.max(analyticsData.actionReport.createdRatio, 2)}%`,
                      }}
                      className="bg-emerald-500 transition-all hover:opacity-90 flex items-center justify-center text-[10px] font-black text-white px-2 truncate"
                      title={`Newly Created: ${analyticsData.actionReport.totalCreated} (${analyticsData.actionReport.createdRatio}%)`}
                    >
                      {analyticsData.actionReport.createdRatio > 12
                        ? `${analyticsData.actionReport.createdRatio}% New Pages`
                        : ""}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600 font-semibold px-1">
                    <span className="flex items-center gap-1.5 text-indigo-700">
                      <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                      Updated Existing Pages:{" "}
                      <strong>
                        {analyticsData.actionReport.totalUpdates}
                      </strong>{" "}
                      ({analyticsData.actionReport.updatesRatio}%)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                      Newly Created Pages:{" "}
                      <strong>
                        {analyticsData.actionReport.totalCreated}
                      </strong>{" "}
                      ({analyticsData.actionReport.createdRatio}%)
                    </span>
                  </div>
                </div>

                {/* Category Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  {/* Packages Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        📦 Travel Packages
                      </span>
                      <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                        {analyticsData.actionReport.byType.packagesUpdated +
                          analyticsData.actionReport.byType
                            .packagesCreated}{" "}
                        Total
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-indigo-700 font-bold flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />{" "}
                        {analyticsData.actionReport.byType.packagesUpdated}{" "}
                        Updated
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <PlusCircle className="h-3 w-3" />{" "}
                        {analyticsData.actionReport.byType.packagesCreated}{" "}
                        Created
                      </span>
                    </div>
                  </div>

                  {/* Flights Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        ✈️ Flight Deals
                      </span>
                      <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                        {analyticsData.actionReport.byType.flightsUpdated +
                          analyticsData.actionReport.byType.flightsCreated}{" "}
                        Total
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-indigo-700 font-bold flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />{" "}
                        {analyticsData.actionReport.byType.flightsUpdated}{" "}
                        Updated
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <PlusCircle className="h-3 w-3" />{" "}
                        {analyticsData.actionReport.byType.flightsCreated}{" "}
                        Created
                      </span>
                    </div>
                  </div>

                  {/* Blogs Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        📝 Travel Guides & Blogs
                      </span>
                      <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                        {analyticsData.actionReport.byType.blogsUpdated +
                          analyticsData.actionReport.byType.blogsCreated}{" "}
                        Total
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-indigo-700 font-bold flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />{" "}
                        {analyticsData.actionReport.byType.blogsUpdated} Updated
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <PlusCircle className="h-3 w-3" />{" "}
                        {analyticsData.actionReport.byType.blogsCreated} Created
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live GSC Search Intent Feeder (Table Card) */}
          {analyticsData.gsc.connected && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Search className="h-4 w-4 text-emerald-600" />
                    Live Google Search Intent Feeder
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-world queries identified by Google Search Console.
                    These exact high-intent search terms are fed directly into
                    AI prompts to capture user bookings.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedGscTab("striking")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      selectedGscTab === "striking"
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🎯 Striking Distance (
                    {analyticsData.gsc.strikingQueries.length})
                  </button>
                  <button
                    onClick={() => setSelectedGscTab("top")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      selectedGscTab === "top"
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🔥 Top Impressions ({analyticsData.gsc.topQueries.length})
                  </button>
                </div>
              </div>

              {/* Queries Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Target Search Query</th>
                      <th className="px-4 py-2.5">Google Rank</th>
                      <th className="px-4 py-2.5">28d Impressions</th>
                      <th className="px-4 py-2.5">Clicks</th>
                      <th className="px-4 py-2.5">CTR</th>
                      <th className="px-4 py-2.5">AI Autopilot Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    {(selectedGscTab === "striking"
                      ? analyticsData.gsc.strikingQueries
                      : analyticsData.gsc.topQueries
                    ).length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-slate-400 italic"
                        >
                          No queries available for this segment.
                        </td>
                      </tr>
                    ) : (
                      (selectedGscTab === "striking"
                        ? analyticsData.gsc.strikingQueries
                        : analyticsData.gsc.topQueries
                      ).map((item: any, idx: number) => {
                        const pos = item.position;
                        const posBadge =
                          pos < 4.0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : pos <= 10.0
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : pos <= 20.0
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-700 border-slate-200";

                        const statusText =
                          pos < 4.0
                            ? "Top 3 Rank (High Intent)"
                            : pos <= 10.0
                              ? "🎯 Striking Target (Page 1)"
                              : pos <= 20.0
                                ? "🚀 Page 2 (Boosting Intent)"
                                : "Discovery Keyword";

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-4 py-3 font-semibold text-slate-900 font-mono">
                              "{item.query}"
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${posBadge}`}
                              >
                                Pos {pos.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-700">
                              {item.impressions.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-700">
                              {item.clicks}
                            </td>
                            <td className="px-4 py-3 text-slate-500 font-medium">
                              {(item.ctr * 100).toFixed(1)}%
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-full border border-indigo-200">
                                <Sparkles className="h-3 w-3 text-indigo-600" />
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>
                  💡 <strong>Tip:</strong> The autopilot dynamically pairs
                  queries with matching packages (e.g. Umrah queries into Umrah
                  packages, Birmingham queries into Birmingham departure
                  flights).
                </span>
                <span className="font-semibold text-indigo-600">
                  Auto-prioritization Active
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="h-4 w-4 text-indigo-600" />
              Autopilot Parameters
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Autopilot Enabled toggle */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Autopilot Mode
                  </label>
                  <p className="text-xs text-slate-400">
                    Trigger daily SEO keyword runs automatically
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Mode Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  SEO Strategy
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white font-medium"
                >
                  <option value="both">
                    Hybrid Mode (Update Existing & Add New Content)
                    [RECOMMENDED]
                  </option>
                  <option value="optimize_existing">
                    Optimize Existing Content (In-place updates only)
                  </option>
                  <option value="generate_new">
                    Generate New Content (Draft new pages only)
                  </option>
                </select>
              </div>

              {/* Target Content Type Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Target Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContentType(val);
                    if (val === "FLIGHT") setActiveKeywordPocketTab("flights");
                    else if (val === "BLOG") setActiveKeywordPocketTab("blogs");
                    else if (val.startsWith("PACKAGE")) {
                      if (packageType === "HOLIDAY")
                        setActiveKeywordPocketTab("holidays");
                      else setActiveKeywordPocketTab("packages");
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white font-medium"
                >
                  <option value="ALL">
                    ALL Content Types (Packages, Flights, Blogs)
                  </option>
                  <option value="PACKAGE">
                    Packages Only (Travel & Pilgrimage Packages)
                  </option>
                  <option value="FLIGHT">
                    Flights Only (Airlines & UK Route Deals)
                  </option>
                  <option value="BLOG">
                    Blogs Only (Travel Guides & Articles)
                  </option>
                </select>
              </div>

              {/* Package Type Niche Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Package Niche / Type
                </label>
                <select
                  value={packageType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPackageType(val);
                    if (val === "HOLIDAY")
                      setActiveKeywordPocketTab("holidays");
                    else if (
                      val === "UMRAH" ||
                      val === "HAJJ" ||
                      val === "Cruise_Umrah"
                    )
                      setActiveKeywordPocketTab("packages");
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white font-medium"
                >
                  <option value="ALL">
                    ALL Categories (Dynamic auto-detection)
                  </option>
                  <option value="UMRAH">
                    UMRAH (Pilgrimage Packages Only)
                  </option>
                  <option value="HOLIDAY">
                    HOLIDAY (General Vacations - Excludes Hajj/Umrah)
                  </option>
                  <option value="Cruise_Umrah">
                    Cruise_Umrah (Red Sea Cruise + Umrah Combo)
                  </option>
                  <option value="HAJJ">HAJJ (Hajj Pilgrimage Only)</option>
                </select>
                {packageType === "HOLIDAY" && (
                  <p className="text-[10px] text-amber-700 font-semibold bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ Holiday mode selected: The AI strictly isolates general
                    holidays from Hajj & Umrah content to prevent mixing
                    religious pilgrimages into leisure vacations.
                  </p>
                )}
              </div>

              {/* Daily Limit */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Max Daily Pages Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Caps total API/GPT operations daily to prevent token
                  over-utilization.
                </p>
              </div>

              {/* Category Keyword Pockets */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-600" />
                      Category Keyword Pockets
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dedicated keyword sets isolated by category to prevent
                      cross-contamination.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewAllPockets((prev) => !prev)}
                    className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-200 transition-colors"
                  >
                    {viewAllPockets ? "Tabbed View" : "View All Pockets"}
                  </button>
                </div>

                {/* Pocket Category Switcher Tabs (when not in View All mode) */}
                {!viewAllPockets && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setActiveKeywordPocketTab("flights")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${
                        activeKeywordPocketTab === "flights"
                          ? "bg-white text-sky-800 shadow-xs border border-sky-300 ring-1 ring-sky-400/20"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Plane className="h-3.5 w-3.5 text-sky-500" />
                      Flights
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 font-extrabold">
                        {
                          keywordsFlights.split(",").filter((s) => s.trim())
                            .length
                        }
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveKeywordPocketTab("packages")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${
                        activeKeywordPocketTab === "packages"
                          ? "bg-white text-emerald-800 shadow-xs border border-emerald-300 ring-1 ring-emerald-400/20"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                      Umrah
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                        {
                          keywordsPackages.split(",").filter((s) => s.trim())
                            .length
                        }
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveKeywordPocketTab("holidays")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${
                        activeKeywordPocketTab === "holidays"
                          ? "bg-white text-amber-800 shadow-xs border border-amber-300 ring-1 ring-amber-400/20"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Palmtree className="h-3.5 w-3.5 text-amber-500" />
                      Holidays
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-extrabold">
                        {
                          keywordsHolidays.split(",").filter((s) => s.trim())
                            .length
                        }
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveKeywordPocketTab("blogs")}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${
                        activeKeywordPocketTab === "blogs"
                          ? "bg-white text-purple-800 shadow-xs border border-purple-300 ring-1 ring-purple-400/20"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                      Blogs
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-extrabold">
                        {
                          keywordsBlogs.split(",").filter((s) => s.trim())
                            .length
                        }
                      </span>
                    </button>
                  </div>
                )}

                {/* Pocket Panels */}
                <div className="space-y-3">
                  {/* Pocket 1: Flights */}
                  {(viewAllPockets || activeKeywordPocketTab === "flights") && (
                    <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                          <Plane className="h-3.5 w-3.5 text-sky-600" />
                          ✈️ Flights Keyword Pocket
                        </span>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                          {
                            keywordsFlights.split(",").filter((s) => s.trim())
                              .length
                          }{" "}
                          keywords active
                        </span>
                      </div>
                      <p className="text-[10px] text-sky-800">
                        Target keywords used exclusively when generating or
                        optimizing flight deals & UK airline routes.
                      </p>
                      <textarea
                        rows={2}
                        value={keywordsFlights}
                        onChange={(e) => setKeywordsFlights(e.target.value)}
                        placeholder="e.g. cheap flights from london, flights to jeddah, flight deals uk, direct flights to makkah"
                        className="w-full rounded-md border border-sky-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 outline-none resize-none"
                      />
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-1">
                        {keywordsFlights
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean)
                          .map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded bg-sky-100/90 text-sky-900 px-1.5 py-0.5 text-[10px] font-medium border border-sky-200"
                            >
                              ✈️ {kw}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Pocket 2: Umrah Packages */}
                  {(viewAllPockets ||
                    activeKeywordPocketTab === "packages") && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                          🕋 Umrah & Pilgrimage Packages Pocket
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          {
                            keywordsPackages.split(",").filter((s) => s.trim())
                              .length
                          }{" "}
                          keywords active
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800">
                        Target keywords used exclusively for religious
                        pilgrimage packages (Umrah, Hajj & Cruise Umrah).
                      </p>
                      <textarea
                        rows={2}
                        value={keywordsPackages}
                        onChange={(e) => setKeywordsPackages(e.target.value)}
                        placeholder="e.g. umrah packages 2026, cheap umrah from london, 5 star umrah packages, family umrah"
                        className="w-full rounded-md border border-emerald-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                      />
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-1">
                        {keywordsPackages
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean)
                          .map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded bg-emerald-100/90 text-emerald-900 px-1.5 py-0.5 text-[10px] font-medium border border-emerald-200"
                            >
                              🕋 {kw}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Pocket 3: Holiday Packages */}
                  {(viewAllPockets ||
                    activeKeywordPocketTab === "holidays") && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <Palmtree className="h-3.5 w-3.5 text-amber-600" />
                          🏖️ Holiday Packages Pocket
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                          {
                            keywordsHolidays.split(",").filter((s) => s.trim())
                              .length
                          }{" "}
                          keywords active
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-800">
                        Target keywords used exclusively for general vacations
                        and leisure packages (strictly isolated from
                        pilgrimages).
                      </p>
                      <textarea
                        rows={2}
                        value={keywordsHolidays}
                        onChange={(e) => setKeywordsHolidays(e.target.value)}
                        placeholder="e.g. family holiday deals, luxury beach holidays, dubai holiday packages, all inclusive holidays"
                        className="w-full rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                      />
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-1">
                        {keywordsHolidays
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean)
                          .map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded bg-amber-100/90 text-amber-900 px-1.5 py-0.5 text-[10px] font-medium border border-amber-200"
                            >
                              🏖️ {kw}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Pocket 4: Blogs & Guides */}
                  {(viewAllPockets || activeKeywordPocketTab === "blogs") && (
                    <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                          📝 Blogs & Travel Guides Pocket
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                          {
                            keywordsBlogs.split(",").filter((s) => s.trim())
                              .length
                          }{" "}
                          keywords active
                        </span>
                      </div>
                      <p className="text-[10px] text-purple-800">
                        Target keywords used exclusively for travel guide
                        articles, visa advice, packing lists, and editorial
                        content.
                      </p>
                      <textarea
                        rows={2}
                        value={keywordsBlogs}
                        onChange={(e) => setKeywordsBlogs(e.target.value)}
                        placeholder="e.g. visa for umrah from uk, best time to perform umrah, umrah packing list, saudi tourist visa guide"
                        className="w-full rounded-md border border-purple-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                      />
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pt-1">
                        {keywordsBlogs
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean)
                          .map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded bg-purple-100/90 text-purple-900 px-1.5 py-0.5 text-[10px] font-medium border border-purple-200"
                            >
                              📝 {kw}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Last Run Info */}
              <div className="rounded-lg bg-slate-50 p-3 flex justify-between items-center text-xs text-slate-500">
                <span>Last Run Timestamp:</span>
                <span className="font-semibold text-slate-700">
                  {lastRun !== "Never"
                    ? new Date(lastRun).toLocaleString()
                    : "Never"}
                </span>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 transition-all disabled:opacity-60 shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Configuration..." : "Save Settings"}
              </button>
            </form>
          </div>

          {/* Automated Cron Scheduler Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Automated Cron Job Scheduler
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  enabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
                />
                {enabled ? "Daily Cron Active" : "Cron Paused"}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              The autonomous SEO engine runs automatically on a scheduled daily
              cron job to enrich your current inventory and generate new
              high-converting travel content.
            </p>

            {/* Quick Strategy Recommendation Banner */}
            {mode !== "both" ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-2">
                <div className="flex items-start gap-2 text-amber-900 font-semibold">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Current strategy is set to "
                    {mode === "optimize_existing"
                      ? "Optimize Existing Only"
                      : "Generate New Only"}
                    ".
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  To both update existing pages AND generate new content
                  automatically on each cron run, switch to Hybrid Mode.
                </p>
                <button
                  type="button"
                  onClick={() => setMode("both")}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Switch to Hybrid Mode (Update & Create)
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs flex items-center gap-2 text-emerald-900 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Hybrid Mode active: The cron will both update existing content
                  and generate new pages!
                </span>
              </div>
            )}

            {/* Schedule Info Box */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">
                  Cron Schedule:
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  0 0 * * * (Daily Midnight UTC)
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">
                  Webhook Endpoint:
                </span>
                <span className="font-bold text-indigo-700 font-mono text-[11px]">
                  /api/cron/seo-autopilot
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-medium">
                  Vercel Cron Integration:
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Active in vercel.json
                </span>
              </div>
            </div>

            {/* Manual Run & cURL helper */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleManualRun}
                disabled={running}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 transition-all disabled:opacity-60 shadow-xs cursor-pointer"
              >
                {running ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running Cron Cycle...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    Trigger Cron Job Now (Live Report)
                  </>
                )}
              </button>

              {/* cURL trigger copy */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>External Cron Webhook:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `curl -X GET "https://terrifictravel.co.uk/api/cron/seo-autopilot" -H "Authorization: Bearer terrific_travel_seo_cron_secret_2026"`,
                      );
                      setCopiedCurl(true);
                      setTimeout(() => setCopiedCurl(false), 2000);
                    }}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCurl ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copiedCurl ? "Copied!" : "Copy cURL"}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-300 font-mono text-[10px] p-2.5 rounded-lg overflow-x-auto select-all">
                  curl -X GET
                  "https://terrifictravel.co.uk/api/cron/seo-autopilot" -H
                  "Authorization: Bearer ***"
                </div>
              </div>
            </div>
          </div>

          {/* Google Search Console API Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="h-4 w-4 text-emerald-600" />
                Google Search Console API
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Live Intent Feeder
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Pulls actual Google search queries & striking-distance keywords
              (positions 4–20) directly into ChatGPT to optimize pages for
              keywords real searchers type.
            </p>

            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  GSC Property URL
                </label>
                <input
                  type="text"
                  value={gscSiteUrl}
                  onChange={(e) => setGscSiteUrl(e.target.value)}
                  placeholder="sc-domain:terrifictravel.co.uk or https://terrifictravel.co.uk"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Service Account Email
                </label>
                <input
                  type="email"
                  value={gscClientEmail}
                  onChange={(e) => setGscClientEmail(e.target.value)}
                  placeholder="gsc-seo-bot@project.iam.gserviceaccount.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Private Key (PEM format)
                </label>
                <textarea
                  rows={3}
                  value={gscPrivateKey}
                  onChange={(e) => setGscPrivateKey(e.target.value)}
                  placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono resize-none text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestGsc}
                  disabled={testingGsc}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 transition-all disabled:opacity-60 shadow-xs cursor-pointer"
                >
                  {testingGsc ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="h-3.5 w-3.5" />
                  )}
                  {testingGsc
                    ? "Verifying GSC Connection..."
                    : "Test GSC Connection"}
                </button>
              </div>

              {/* Test Result Display */}
              {gscTestResult && (
                <div
                  className={`rounded-lg p-3 text-xs border ${
                    gscTestResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {gscTestResult.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    )}
                    <span>{gscTestResult.message}</span>
                  </div>
                  {gscTestResult.sampleQueries &&
                    gscTestResult.sampleQueries.length > 0 && (
                      <div className="mt-2 space-y-1 text-[11px] font-mono text-emerald-900 bg-white/70 p-2 rounded border border-emerald-200">
                        <p className="font-bold font-sans text-emerald-950">
                          Sample High-Intent Queries:
                        </p>
                        {gscTestResult.sampleQueries.map((q, idx) => (
                          <p key={idx}>• {q}</p>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Console Terminal Logs */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-5 shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <Terminal className="h-4 w-4" />
                LIVE PIPELINE OUTPUT
              </div>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Clear Console
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] pr-2 text-slate-300 select-text leading-relaxed">
              {consoleLogs.length === 0 ? (
                <div className="text-slate-500 italic h-full flex items-center justify-center">
                  Autopilot idle. Click "Run Manual Cycle" above to check live
                  logs.
                </div>
              ) : (
                consoleLogs.map((logStr, idx) => (
                  <div
                    key={idx}
                    className={
                      logStr.includes("Successfully")
                        ? "text-emerald-400"
                        : logStr.includes("Failed")
                          ? "text-red-400"
                          : ""
                    }
                  >
                    {logStr}
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Audit History Database Logs */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-600" />
              AI Operation Audit History
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              ({totalLogs}{" "}
              {selectedReportTab === "ALL"
                ? "total records"
                : selectedReportTab === "OPTIMIZE"
                  ? "updates"
                  : "new drafts"}
              )
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedReportTab("ALL");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedReportTab === "ALL"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Changed ({dbLogs.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReportTab("OPTIMIZE");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedReportTab === "OPTIMIZE"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <RefreshCw className="h-3 w-3" />
                🔄 Updated Pages (
                {dbLogs.filter((l) => l.actionType === "OPTIMIZE").length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReportTab("GENERATE");
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedReportTab === "GENERATE"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <PlusCircle className="h-3 w-3" />➕ Newly Added Pages (
                {dbLogs.filter((l) => l.actionType === "GENERATE").length})
              </button>
            </div>

            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-indigo-600 hover:bg-slate-50 font-bold transition-colors shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Type & Niche</th>
                <th className="px-4 py-3">Target Title</th>
                <th className="px-4 py-3">Keywords Targeted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">View Content</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {currentLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400 italic"
                  >
                    No autopilot operations have been logged yet.
                  </td>
                </tr>
              ) : (
                currentLogs.map((logItem) => {
                  const itemSlug = logItem.slug;
                  const viewUrl = itemSlug ? `/v/${itemSlug}` : null;
                  const pkgType =
                    logItem.packageType ||
                    logItem.details?.match(/\[Type:\s*([A-Za-z_]+)\]/)?.[1];

                  return (
                    <tr
                      key={logItem.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                        {new Date(logItem.createdAt).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            logItem.actionType === "OPTIMIZE"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {logItem.actionType}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold">
                            {logItem.targetType}
                          </span>
                          {pkgType && (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                                pkgType === "UMRAH"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : pkgType === "HOLIDAY"
                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                    : pkgType === "HAJJ"
                                      ? "bg-purple-50 text-purple-800 border-purple-300"
                                      : "bg-cyan-50 text-cyan-800 border-cyan-300"
                              }`}
                            >
                              {pkgType}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate"
                        title={logItem.targetTitle}
                      >
                        {viewUrl ? (
                          <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 hover:underline flex items-center gap-1 group"
                          >
                            <span className="truncate">
                              {logItem.targetTitle}
                            </span>
                          </a>
                        ) : (
                          <span className="truncate text-slate-700">{logItem.targetTitle}</span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-slate-500 max-w-[150px] truncate"
                        title={logItem.keywords}
                      >
                        {logItem.keywords}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {logItem.status === "SUCCESS" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                            <XCircle className="h-3.5 w-3.5" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {viewUrl ? (
                          <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Page
                          </a>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            No Live Page
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-slate-400 max-w-[200px] truncate"
                        title={logItem.details}
                      >
                        {logItem.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalLogs > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                Showing{" "}
                <strong className="font-semibold text-slate-900">
                  {totalLogs > 0 ? startIndex + 1 : 0}
                </strong>{" "}
                to{" "}
                <strong className="font-semibold text-slate-900">
                  {endIndex}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-slate-900">
                  {totalLogs}
                </strong>{" "}
                entries
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className="flex items-center justify-center rounded border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safeCurrentPage) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && p - prevPage > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-[28px] h-7 px-2 rounded text-xs font-bold transition-colors ${
                            safeCurrentPage === p
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={safeCurrentPage >= totalPages}
                className="flex items-center justify-center rounded border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
