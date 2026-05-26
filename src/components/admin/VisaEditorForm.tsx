"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createVisa, updateVisa } from "@/app/(admin)/admin/visa/actions";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const inputClass =
  "block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4f4f] focus:border-[#6b4f4f] transition-colors";

export function VisaEditorForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [country, setCountry] = useState(initialData?.country || "");
  const [visaType, setVisaType] = useState(initialData?.visaType || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [processingTime, setProcessingTime] = useState(initialData?.processingTime || "");
  const [validity, setValidity] = useState(initialData?.validity || "");
  const [entries, setEntries] = useState(initialData?.entries || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [isPopular, setIsPopular] = useState(initialData?.isPopular || false);
  const [requiredDocuments, setRequiredDocuments] = useState(initialData?.requiredDocuments || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
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
      formData.append("country", country);
      formData.append("visaType", visaType);
      formData.append("price", price);
      formData.append("processingTime", processingTime);
      formData.append("validity", validity);
      formData.append("entries", entries);
      formData.append("image", image);
      if (isPopular) formData.append("isPopular", "on");
      formData.append("requiredDocuments", requiredDocuments);
      formData.append("features", features);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("slug", slug);

      if (initialData?.id) {
        await updateVisa(initialData.id, formData);
        setStatus("success");
        setTimeout(() => router.push("/admin/visa"), 1200);
      } else {
        await createVisa(formData);
        setStatus("success");
        // Reset form
        setCountry(""); setVisaType(""); setPrice(""); setProcessingTime("");
        setValidity(""); setEntries(""); setImage(""); setIsPopular(false);
        setRequiredDocuments(""); setFeatures(""); setMetaTitle("");
        setMetaDescription(""); setSlug("");
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
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold mb-5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {initialData?.id ? "Visa updated! Redirecting…" : "Visa added successfully!"}
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">Country *</label>
            <input required value={country} onChange={e => setCountry(e.target.value)} type="text" className={inputClass} placeholder="e.g. Saudi Arabia" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Visa Type *</label>
            <input required value={visaType} onChange={e => setVisaType(e.target.value)} type="text" className={inputClass} placeholder="e.g. Umrah & Tourist Visa" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} type="text" className={inputClass} placeholder="e.g. saudi-arabia-umrah-visa (leave blank to auto-generate)" />
          <p className="text-xs text-slate-500 mt-1">Leave blank to auto-generate from Country and Visa Type.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (£) *</label>
            <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className={inputClass} placeholder="e.g. 150" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Processing Time *</label>
            <input required value={processingTime} onChange={e => setProcessingTime(e.target.value)} type="text" className={inputClass} placeholder="e.g. 24–48 Hours" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Validity</label>
            <input value={validity} onChange={e => setValidity(e.target.value)} type="text" className={inputClass} placeholder="e.g. 1 Year" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Entries</label>
            <input value={entries} onChange={e => setEntries(e.target.value)} type="text" className={inputClass} placeholder="e.g. Multiple Entry" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} type="url" className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input id="isPopularVisa" type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6b4f4f] focus:ring-[#6b4f4f] cursor-pointer" />
          <label htmlFor="isPopularVisa" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">Mark as "Most Popular"</label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Required Documents *</label>
          <textarea required value={requiredDocuments} onChange={e => setRequiredDocuments(e.target.value)} rows={3} className={inputClass} placeholder="Passport copy, photo, etc." />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Features / Benefits (One per line)</label>
          <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={4} className={inputClass} placeholder={"Electronic e-Visa processing\nHealth insurance included"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 border border-slate-200 rounded-lg">
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
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow hover:bg-[#6b4f4f] transition-colors disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Saving…" : initialData?.id ? "Update Visa Service" : "Add Visa Service"}
          </button>
          {initialData?.id && (
            <a href="/admin/visa" className="text-sm text-slate-500 hover:text-slate-700 font-semibold underline">
              Cancel
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
