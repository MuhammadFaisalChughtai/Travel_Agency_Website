"use client";

import React, { useState } from "react";
import { Plane, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { createFlight, updateFlight } from "@/app/(admin)/admin/flights/actions";

export function FlightEditorForm({ initialData }: { initialData?: any }) {
  const [airline, setAirline] = useState(initialData?.airline || "");
  const [airlineCode, setAirlineCode] = useState(initialData?.airlineCode || "");
  const [departure, setDeparture] = useState(initialData?.departure || "");
  const [departureCode, setDepartureCode] = useState(initialData?.departureCode || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [destinationCode, setDestinationCode] = useState(initialData?.destinationCode || "");
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

  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (initialData) {
        await updateFlight(initialData.id, formData);
        alert("Flight deal updated successfully!");
      } else {
        await updateFlight(initialData?.id || '', formData).catch(async () => await createFlight(formData)); // fallback 
        if(!initialData) await createFlight(formData);
        
        // Reset form on create
        setAirline("");
        setAirlineCode("");
        setDeparture("");
        setDepartureCode("");
        setDestination("");
        setDestinationCode("");
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white p-6 rounded-2xl border border-slate-200">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plane className="w-5 h-5 text-slate-500" />
          {initialData ? "Edit Flight Deal" : "Add New Flight Deal"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">Provide outbound flight parameters and optional return flight configurations.</p>
      </div>

      {/* Row 1: General Airline & Price */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
      <div className="bg-slate-50/50 p-4.5 rounded-xl border border-slate-200/60 space-y-4">
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
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
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

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-8 py-3 text-xs font-bold text-white shadow hover:bg-slate-700 transition-colors disabled:opacity-60 uppercase tracking-widest"
        >
          {isSubmitting ? (initialData ? "Updating..." : "Adding Flight...") : (initialData ? "Update Flight Deal" : "Add Flight Deal")}
        </button>
      </div>
    </form>
  );
}
