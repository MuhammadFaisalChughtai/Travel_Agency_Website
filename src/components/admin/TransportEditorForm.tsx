"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createTransport, updateTransport } from "@/app/(admin)/admin/transport/actions";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const inputClass =
  "block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-[#6b4f4f] transition-colors";

export function TransportEditorForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [vehicleType, setVehicleType] = useState(initialData?.vehicleType || "");
  const [type, setType] = useState(initialData?.type || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [capacity, setCapacity] = useState(initialData?.capacity || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [isPopular, setIsPopular] = useState(initialData?.isPopular || false);
  const [description, setDescription] = useState(initialData?.description || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const initialFeatures = initialData?.features
    ? (typeof initialData.features === "string"
        ? JSON.parse(initialData.features)
        : initialData.features
      ).join("\n")
    : "";
  const [features, setFeatures] = useState(initialFeatures);

  // Scroll to top of form when editing
  useEffect(() => {
    if (initialData?.id && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialData?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("vehicleType", vehicleType);
      formData.append("type", type);
      formData.append("slug", slug);
      formData.append("price", price);
      formData.append("capacity", capacity);
      formData.append("image", image);
      if (isPopular) formData.append("isPopular", "on");
      formData.append("description", description);
      formData.append("features", features);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);

      if (initialData?.id) {
        await updateTransport(initialData.id, formData);
        setStatus("success");
        setTimeout(() => router.push("/admin/transport"), 1200);
      } else {
        await createTransport(formData);
        setStatus("success");
        // Reset form
        setVehicleType(""); setType(""); setSlug(""); setPrice("");
        setCapacity(""); setImage(""); setIsPopular(false);
        setDescription(""); setFeatures(""); setMetaTitle(""); setMetaDescription("");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef}>
      {status === "success" && (
        <div className="flex items-center gap-2 bg-[#fff3e4] border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold mb-5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {initialData?.id ? "Transport updated! Redirecting…" : "Transport service added successfully!"}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Type *</label>
            <input required value={vehicleType} onChange={e => setVehicleType(e.target.value)} type="text" className={inputClass} placeholder="e.g. Premium GMC / SUV" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Service Type *</label>
            <input required value={type} onChange={e => setType(e.target.value)} type="text" className={inputClass} placeholder="e.g. VIP Airport Transfer" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} type="text" className={inputClass} placeholder="e.g. premium-gmc-airport-transfer (leave blank to auto-generate)" />
          <p className="text-xs text-[#f5f0eb]0 mt-1">Leave blank to auto-generate from Vehicle Type and Service Type.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (£) *</label>
            <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className={inputClass} placeholder="e.g. 150" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity *</label>
            <input required value={capacity} onChange={e => setCapacity(e.target.value)} type="text" className={inputClass} placeholder="e.g. Up to 7 Guests" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} type="url" className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input id="isPopularTransport" type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6b4f4f] focus:ring-[#6b4f4f] cursor-pointer" />
          <label htmlFor="isPopularTransport" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">Mark as "Most Popular"</label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputClass} placeholder="Describe the transport service..." />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Features / Inclusions (One per line)</label>
          <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={4} className={inputClass} placeholder={"Meet & greet service\nComplimentary water\nFlight tracking"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-[#f5f0eb] border border-slate-200 rounded-lg">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Title</label>
            <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} type="text" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Description</label>
            <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-8 h-[50px] text-sm font-bold text-white shadow hover:bg-[#6b4f4f] transition-colors disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Saving…" : initialData?.id ? "Update Transport Service" : "Add Transport Service"}
          </button>
          {initialData?.id && (
            <a href="/admin/transport" className="text-sm text-[#f5f0eb]0 hover:text-slate-700 font-semibold underline">
              Cancel
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
