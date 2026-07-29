"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  getAutopilotSettings, 
  saveAutopilotSettings, 
  getAutopilotLogs 
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
  RefreshCw
} from "lucide-react";

export default function KeywordGeneratorPage() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("optimize_existing");
  const [limit, setLimit] = useState("50");
  const [seeds, setSeeds] = useState("");
  const [lastRun, setLastRun] = useState("Never");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [dbLogs, setDbLogs] = useState<any[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

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
      const config = await getAutopilotSettings();
      setEnabled(config.seo_autopilot_enabled === "true");
      setMode(config.seo_autopilot_mode);
      setLimit(config.seo_autopilot_limit);
      setSeeds(config.seo_autopilot_seed_keywords);
      setLastRun(config.seo_autopilot_last_run || "Never");

      const logs = await getAutopilotLogs();
      setDbLogs(logs);
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
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleManualRun = async () => {
    if (running) return;
    if (!confirm("Are you sure you want to trigger a manual SEO autopilot cycle now?")) return;
    
    setRunning(true);
    setConsoleLogs(["[System] Starting manual trigger execution..."]);
    
    try {
      const res = await fetch("/api/cron/seo-autopilot?manual=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await res.json();
      if (data.logs) {
        setConsoleLogs(data.logs);
      }
      
      if (data.success) {
        setConsoleLogs(prev => [...prev, `[System] Run succeeded. Processed ${data.processed} operations.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[System] Run failed: ${data.error || "Unknown error"}`]);
      }
      
      // Reload logs
      const updatedLogs = await getAutopilotLogs();
      setDbLogs(updatedLogs);
      
      // Update last run state
      const config = await getAutopilotSettings();
      setLastRun(config.seo_autopilot_last_run || "Never");
    } catch (err: any) {
      console.error(err);
      setConsoleLogs(prev => [...prev, `[System] Critical failure: ${err.message}`]);
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-slate-500">Loading Autopilot Settings...</span>
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
            Automate keyword research, page metadata optimization, and content draft generation.
          </p>
        </div>

        {/* Status Indicator & Trigger Button */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            enabled 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
              : "bg-slate-50 text-slate-600 border border-slate-200"
          }`}>
            <span className={`h-2.5 w-2.5 rounded-full ${enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
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
                  <label className="text-sm font-bold text-slate-700">Autopilot Mode</label>
                  <p className="text-xs text-slate-400">Trigger daily SEO keyword runs automatically</p>
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
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">SEO Strategy</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white font-medium"
                >
                  <option value="optimize_existing">Optimize Existing Content (In-place updates)</option>
                  <option value="generate_new">Generate New Content (Draft new pages)</option>
                  <option value="both">Hybrid Mode (Optimize current & Write new drafts)</option>
                </select>
              </div>

              {/* Daily Limit */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Max Daily Pages Limit</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                />
                <p className="text-[10px] text-slate-400">Caps total API/GPT operations daily to prevent token over-utilization.</p>
              </div>

              {/* Seed Keywords */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Seed Keywords</label>
                <textarea
                  rows={3}
                  value={seeds}
                  onChange={(e) => setSeeds(e.target.value)}
                  placeholder="e.g. umrah packages, cheap flights, family holidays"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none resize-none"
                />
                <p className="text-[10px] text-slate-400">Comma-separated topics sent to Google Ads to search for long-tail ideas.</p>
              </div>

              {/* Last Run Info */}
              <div className="rounded-lg bg-slate-50 p-3 flex justify-between items-center text-xs text-slate-500">
                <span>Last Run Timestamp:</span>
                <span className="font-semibold text-slate-700">
                  {lastRun !== "Never" ? new Date(lastRun).toLocaleString() : "Never"}
                </span>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 transition-all disabled:opacity-60 shadow-sm"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Configuration..." : "Save Settings"}
              </button>
            </form>
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
                  Autopilot idle. Click "Run Manual Cycle" above to check live logs.
                </div>
              ) : (
                consoleLogs.map((logStr, idx) => (
                  <div key={idx} className={logStr.includes("Successfully") ? "text-emerald-400" : logStr.includes("Failed") ? "text-red-400" : ""}>
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
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-600" />
            AI Operation Audit History
          </h3>
          <button 
            onClick={loadData} 
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Target Title</th>
                <th className="px-4 py-3">Keywords Targeted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {dbLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                    No autopilot operations have been logged yet.
                  </td>
                </tr>
              ) : (
                dbLogs.map((logItem) => (
                  <tr key={logItem.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                      {new Date(logItem.createdAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        logItem.actionType === "OPTIMIZE" 
                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}>
                        {logItem.actionType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                      {logItem.targetType}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate">
                      {logItem.targetTitle}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">
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
                    <td className="px-4 py-3 text-slate-400 max-w-[250px] truncate" title={logItem.details}>
                      {logItem.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
