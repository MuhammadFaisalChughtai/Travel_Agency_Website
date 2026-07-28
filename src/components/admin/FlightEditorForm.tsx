"use client";

import React, { useState } from "react";
import { Plane, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { createFlight, updateFlight } from "@/app/(admin)/admin/flights/actions";
import { useRouter } from "next/navigation";

export function FlightEditorForm({ initialData, currentPage = 1 }: { initialData?: any; currentPage?: number }) {
  const router = useRouter();
  const [airline, setAirline] = useState(initialData?.airline || "");
  const [airlineCode, setAirlineCode] = useState(initialData?.airlineCode || "");
  const [departure, setDeparture] = useState(initialData?.departure || "");
  const [departureCode, setDepartureCode] = useState(initialData?.departureCode || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [destinationCode, setDestinationCode] = useState(initialData?.destinationCode || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [month, setMonth] = useState(initialData?.month || "");

  const [duration, setDuration] = useState(initialData?.duration || "7h 00m");
  const [baggage, setBaggage] = useState(initialData?.baggage || "30kg Checked, 7kg Cabin");
  const [aircraft, setAircraft] = useState(initialData?.aircraft || "Boeing 777");

  // Transit outbound state
  const [isTransit, setIsTransit] = useState(initialData?.isTransit || false);
  const [transitAirport, setTransitAirport] = useState(initialData?.transitAirport || "");
  const [transitDuration, setTransitDuration] = useState(initialData?.transitDuration || "");

  // Return flight option
  const [isReturn, setIsReturn] = useState(initialData?.isReturn || false);
  const [returnAirline, setReturnAirline] = useState(initialData?.returnAirline || "");
  const [returnAirlineCode, setReturnAirlineCode] = useState(initialData?.returnAirlineCode || "");
  const [returnDuration, setReturnDuration] = useState(initialData?.returnDuration || "7h 00m");
  
  // Return transit state
  const [returnIsTransit, setReturnIsTransit] = useState(initialData?.returnIsTransit || false);
  const [returnTransitAirport, setReturnTransitAirport] = useState(initialData?.returnTransitAirport || "");
  const [returnTransitDuration, setReturnTransitDuration] = useState(initialData?.returnTransitDuration || "");

  const [returnBaggage, setReturnBaggage] = useState(initialData?.returnBaggage || "30kg Checked, 7kg Cabin");
  const [returnAircraft, setReturnAircraft] = useState(initialData?.returnAircraft || "Boeing 777");

  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiLength, setAiLength] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiFill = async () => {
    if (!aiPrompt) {
      alert("Please enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    try {
      const currentData = {
        airline, airlineCode, departure, departureCode, destination, destinationCode, country, price, month, duration, baggage, aircraft, isTransit, transitAirport, transitDuration, metaTitle, metaDescription, metaKeywords
      };
      const res = await fetch("/api/admin/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "flight", prompt: aiPrompt, currentData, keywords: aiKeywords, length: aiLength })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const fields = data.result;
      if (fields.airline) setAirline(fields.airline);
      if (fields.airlineCode) setAirlineCode(fields.airlineCode);
      if (fields.departure) setDeparture(fields.departure);
      if (fields.departureCode) setDepartureCode(fields.departureCode);
      if (fields.destination) setDestination(fields.destination);
      if (fields.destinationCode) setDestinationCode(fields.destinationCode);
      if (fields.country) setCountry(fields.country);
      if (fields.price) setPrice(fields.price.toString());
      if (fields.month) setMonth(fields.month);
      if (fields.duration) setDuration(fields.duration);
      if (fields.baggage) setBaggage(fields.baggage);
      if (fields.aircraft) setAircraft(fields.aircraft);
      if (typeof fields.isTransit === "boolean") {
        setIsTransit(fields.isTransit);
        if (fields.isTransit) {
          if (fields.transitAirport) setTransitAirport(fields.transitAirport);
          if (fields.transitDuration) setTransitDuration(fields.transitDuration);
        }
      }
      if (fields.metaTitle) setMetaTitle(fields.metaTitle);
      if (fields.metaDescription) setMetaDescription(fields.metaDescription);
      if (fields.metaKeywords) setMetaKeywords(fields.metaKeywords);

      alert("Form fields generated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate flight content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("airline", airline);
      formData.append("airlineCode", airlineCode);
      formData.append("departure", departure);
      formData.append("departureCode", departureCode);
      formData.append("destination", destination);
      formData.append("destinationCode", destinationCode);
      formData.append("country", country);
      formData.append("price", price);
      formData.append("month", month);

      formData.append("isTransit", isTransit.toString());
      if (isTransit) {
        formData.append("transitAirport", transitAirport);
        formData.append("transitDuration", transitDuration);
      }

      formData.append("duration", duration);
      formData.append("baggage", baggage);
      formData.append("aircraft", aircraft);

      formData.append("isReturn", isReturn.toString());
      if (isReturn) {
        formData.append("returnAirline", returnAirline || airline);
        formData.append("returnAirlineCode", returnAirlineCode || airlineCode);
        formData.append("returnDuration", returnDuration);
        formData.append("returnIsTransit", returnIsTransit.toString());
        if (returnIsTransit) {
          formData.append("returnTransitAirport", returnTransitAirport);
          formData.append("returnTransitDuration", returnTransitDuration);
        }
        formData.append("returnBaggage", returnBaggage);
        formData.append("returnAircraft", returnAircraft);
      }

      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeywords", metaKeywords);

      if (initialData) {
        await updateFlight(initialData.id, formData);
        alert("Flight deal updated successfully!");
        router.push(`/admin/flights?page=${currentPage}`);
      } else {
        await createFlight(formData);
        
        // Reset form on create
        setAirline("");
        setAirlineCode("");
        setDeparture("");
        setDepartureCode("");
        setDestination("");
        setDestinationCode("");
        setCountry("");
        setPrice("");
        setMonth("");
        setDuration("7h 00m");
        setBaggage("30kg Checked, 7kg Cabin");
        setAircraft("Boeing 777");
        setIsTransit(false);
        setTransitAirport("");
        setTransitDuration("");
        setIsReturn(false);
        setReturnAirline("");
        setReturnAirlineCode("");
        setReturnDuration("7h 00m");
        setReturnIsTransit(false);
        setReturnTransitAirport("");
        setReturnTransitDuration("");
        setReturnBaggage("30kg Checked, 7kg Cabin");
        setReturnAircraft("Boeing 777");
        setMetaTitle("");
        setMetaDescription("");
        setMetaKeywords("");
        alert("Flight deal added successfully!");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to save flight deal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-slate-50 p-6 rounded-xl border border-slate-200">
      {/* AI Form Assistant */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-indigo-100 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs">✨</span>
            AI Form Assistant
          </h3>
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            GPT-4o-mini
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Describe the flight deal and the AI will auto-fill all airports, codes, price, aircraft, duration, transit status, and SEO metadata.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6">
            <label className="block text-[10px] font-bold text-indigo-950 uppercase tracking-wider mb-1">Describe the flight *</label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Direct flight from London Heathrow to Dubai on Emirates in October"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-indigo-950 uppercase tracking-wider mb-1">Focus Keywords</label>
            <input
              type="text"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              placeholder="e.g. direct, premium"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-indigo-950 uppercase tracking-wider mb-1">Content Length</label>
            <select
              value={aiLength}
              onChange={(e) => setAiLength(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white"
            >
              <option value="short">Short (~200 words)</option>
              <option value="medium">Medium (~400 words)</option>
              <option value="long">Long (~800 words)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleAiFill}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 transition-all disabled:opacity-60 shadow-sm"
          >
            {isGenerating ? "Generating..." : "Generate All Fields"}
          </button>
        </div>
      </div>
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plane className="w-5 h-5 text-[#f5f0eb]0" />
          {initialData ? "Edit Flight Deal" : "Add New Flight Deal"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">Provide outbound flight parameters and optional return flight configurations.</p>
      </div>

      {/* Row 1: General Airline & Price */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Airline *</label>
          <input
            required
            value={airline}
            onChange={e => setAirline(e.target.value)}
            type="text"
            placeholder="e.g. Emirates"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Airline Code (2-Letter)</label>
          <input
            value={airlineCode}
            onChange={e => setAirlineCode(e.target.value)}
            type="text"
            placeholder="e.g. EK"
            maxLength={2}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Country *</label>
          <input
            required
            value={country}
            onChange={e => setCountry(e.target.value)}
            type="text"
            placeholder="e.g. UAE"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Price (£) *</label>
          <input
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 450"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Month Details</label>
          <input
            value={month}
            onChange={e => setMonth(e.target.value)}
            type="text"
            placeholder="e.g. January 2026"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Outbound Journey Section */}
      <div className="bg-[#f5f0eb]/50 p-4.5 rounded-xl border border-slate-200/60 space-y-4">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <ArrowRight className="w-4 h-4 text-slate-400" />
          Outbound Flight Info
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Departure Airport *</label>
            <input
              required
              value={departure}
              onChange={e => setDeparture(e.target.value)}
              type="text"
              placeholder="e.g. London Heathrow"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dep. Code (3-Letter) *</label>
            <input
              required
              value={departureCode}
              onChange={e => setDepartureCode(e.target.value)}
              type="text"
              placeholder="e.g. LHR"
              maxLength={3}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Arrival Destination *</label>
            <input
              required
              value={destination}
              onChange={e => setDestination(e.target.value)}
              type="text"
              placeholder="e.g. Dubai"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dest. Code (3-Letter) *</label>
            <input
              required
              value={destinationCode}
              onChange={e => setDestinationCode(e.target.value)}
              type="text"
              placeholder="e.g. DXB"
              maxLength={3}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration *</label>
            <input
              required
              value={duration}
              onChange={e => setDuration(e.target.value)}
              type="text"
              placeholder="e.g. 7h 00m"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Baggage Allowance *</label>
            <input
              required
              value={baggage}
              onChange={e => setBaggage(e.target.value)}
              type="text"
              placeholder="e.g. 30kg Checked, 7kg Cabin"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aircraft Type *</label>
            <input
              required
              value={aircraft}
              onChange={e => setAircraft(e.target.value)}
              type="text"
              placeholder="e.g. Boeing 777"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Transit Toggle Outbound */}
        <div className="pt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isTransit}
              onChange={e => setIsTransit(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            <span className="text-xs font-semibold text-slate-700">Outbound has transit / layover?</span>
          </label>
        </div>

        {isTransit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-amber-50/50 rounded-lg border border-amber-200/50 transition-all duration-300">
            <div>
              <label className="block text-[10px] font-bold text-amber-900 mb-1">Transit Airport Code *</label>
              <input
                required
                value={transitAirport}
                onChange={e => setTransitAirport(e.target.value)}
                type="text"
                placeholder="e.g. DOH (Doha)"
                className="block w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-amber-900 mb-1">Transit Duration *</label>
              <input
                required
                value={transitDuration}
                onChange={e => setTransitDuration(e.target.value)}
                type="text"
                placeholder="e.g. 2h 15m"
                className="block w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Return Option Section */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isReturn}
              onChange={e => setIsReturn(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-[#f5f0eb]0" />
              Include Return Journey? (Return Flight)
            </span>
          </label>
        </div>

        {isReturn && (
          <div className="p-4.5 bg-white space-y-4 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Return Airline (blank for same)</label>
                <input
                  value={returnAirline}
                  onChange={e => setReturnAirline(e.target.value)}
                  type="text"
                  placeholder={airline || "e.g. Emirates"}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Airline Code (blank for same)</label>
                <input
                  value={returnAirlineCode}
                  onChange={e => setReturnAirlineCode(e.target.value)}
                  type="text"
                  maxLength={2}
                  placeholder={airlineCode || "e.g. EK"}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Return Duration *</label>
                <input
                  required
                  value={returnDuration}
                  onChange={e => setReturnDuration(e.target.value)}
                  type="text"
                  placeholder="e.g. 7h 00m"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Return Baggage *</label>
                <input
                  required
                  value={returnBaggage}
                  onChange={e => setReturnBaggage(e.target.value)}
                  type="text"
                  placeholder="e.g. 30kg Checked, 7kg Cabin"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Return Aircraft *</label>
                <input
                  required
                  value={returnAircraft}
                  onChange={e => setReturnAircraft(e.target.value)}
                  type="text"
                  placeholder="e.g. Boeing 777"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Transit Toggle Return */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={returnIsTransit}
                  onChange={e => setReturnIsTransit(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <span className="text-xs font-semibold text-slate-700">Return journey has transit / layover?</span>
              </label>
            </div>

            {returnIsTransit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-amber-50/50 rounded-lg border border-amber-200/50 transition-all duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-amber-900 mb-1">Return Transit Airport Code *</label>
                  <input
                    required
                    value={returnTransitAirport}
                    onChange={e => setReturnTransitAirport(e.target.value)}
                    type="text"
                    placeholder="e.g. DOH (Doha)"
                    className="block w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-900 mb-1">Return Transit Duration *</label>
                  <input
                    required
                    value={returnTransitDuration}
                    onChange={e => setReturnTransitDuration(e.target.value)}
                    type="text"
                    placeholder="e.g. 2h 15m"
                    className="block w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SEO Fields */}
      <div className="p-5 bg-[#f5f0eb] border border-slate-200 rounded-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-300/60 pb-2">SEO & Metadata</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Title</label>
            <input
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              type="text"
              placeholder="e.g. Cheap Flights to Dubai | Terrific Travel"
              className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              rows={2}
              placeholder="A short description for search engines..."
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Keywords</label>
          <input
            value={metaKeywords}
            onChange={e => setMetaKeywords(e.target.value)}
            type="text"
            placeholder="e.g. cheap flights, london to dubai, airline deals"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <p className="text-[10px] text-slate-500 mt-1">Enter keywords separated by commas.</p>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-8 h-[50px] text-xs font-bold text-white shadow hover:bg-slate-700 transition-colors disabled:opacity-60 uppercase tracking-widest"
        >
          {isSubmitting ? (initialData ? "Updating..." : "Adding Flight...") : (initialData ? "Update Flight Deal" : "Add Flight Deal")}
        </button>
      </div>
    </form>
  );
}
