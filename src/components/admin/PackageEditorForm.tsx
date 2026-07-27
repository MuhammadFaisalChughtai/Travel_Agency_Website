"use client";

import React, { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export function PackageEditorForm({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState(initialData?.type || "UMRAH");
  const [stars, setStars] = useState(initialData?.stars?.toString() || "3");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [travelDates, setTravelDates] = useState(initialData?.travelDates || "Flexible departures throughout 2026/27");
  const [content, setContent] = useState(initialData?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.images ? (() => { try { return JSON.parse(initialData.images)[0]; } catch { return initialData.images; } })() : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSold, setIsSold] = useState(initialData?.isSold || false);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiFill = async () => {
    if (!aiPrompt) {
      alert("Please enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    try {
      const currentData = {
        title, type, stars, price, duration, travelDates, metaTitle, metaDescription, metaKeywords
      };
      const res = await fetch("/api/admin/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "package", prompt: aiPrompt, currentData })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const fields = data.result;
      if (fields.title) setTitle(fields.title);
      if (fields.price) setPrice(fields.price);
      if (fields.duration) setDuration(fields.duration);
      if (fields.travelDates) setTravelDates(fields.travelDates);
      if (fields.description) setContent(fields.description);
      if (fields.metaTitle) setMetaTitle(fields.metaTitle);
      if (fields.metaDescription) setMetaDescription(fields.metaDescription);
      if (fields.metaKeywords) setMetaKeywords(fields.metaKeywords);
      
      alert("Form fields generated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate package content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const quillRef = useRef<any>(null);

  // Inline image upload handler for Quill
  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range ? range.index : 0, "image", data.url);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
  }), []);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) imageUrl = data.url;
        else throw new Error("Image upload failed");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("stars", stars);
      formData.append("price", price);
      formData.append("duration", duration);
      formData.append("travelDates", travelDates);
      formData.append("description", content);
      formData.append("image", imageUrl);
      formData.append("isSold", isSold.toString());
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeywords", metaKeywords);
      formData.append("slug", slug);

      if (initialData?.id) {
        const { updatePackage } = await import("@/app/(admin)/admin/packages/actions");
        await updatePackage(initialData.id, formData);
        alert("Package updated successfully!");
      } else {
        const { createPackage } = await import("@/app/(admin)/admin/packages/actions");
        await createPackage(formData);
        setTitle(""); setType("UMRAH"); setStars("3"); setPrice("");
        setDuration(""); setContent(""); setImageFile(null); setImagePreview("");
        setIsSold(false); setMetaTitle(""); setMetaDescription(""); setMetaKeywords(""); setSlug("");
        alert("Package added successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save package.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* AI Form Assistant */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-indigo-100 rounded-2xl shadow-sm space-y-3">
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
          Describe your travel package (e.g. "10 Nights 5-star Luxury family Umrah package in December") and the AI will auto-fill the details, rich text description, and SEO metadata.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe the package..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
          />
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleAiFill}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 transition-all disabled:opacity-60 shrink-0"
          >
            {isGenerating ? "Generating..." : "Generate All Fields"}
          </button>
        </div>
      </div>

      {/* Row 1: Title + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Package Title *</label>
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            placeholder="e.g. 7 Nights 5 Star Umrah"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Package Type *</label>
          <select
            required
            value={type}
            onChange={e => setType(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="UMRAH">Umrah</option>
            <option value="Cruise_Umrah">Cruise Umrah</option>
            <option value="HAJJ">Hajj</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">URL Slug</label>
        <input value={slug} onChange={e => setSlug(e.target.value)} type="text" className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="e.g. 7-nights-5-star-umrah (leave blank to auto-generate)" />
        <p className="text-xs text-slate-400 mt-1">Leave blank to auto-generate from Package Title.</p>
      </div>

      {/* Row 2: Stars + Price + Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Star Rating *</label>
          <select
            required
            value={stars}
            onChange={e => setStars(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="3">⭐⭐⭐ 3 Star</option>
            <option value="4">⭐⭐⭐⭐ 4 Star</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Star</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Starting Price (£) *</label>
          <input
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 590"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Duration *</label>
          <input
            required
            value={duration}
            onChange={e => setDuration(e.target.value)}
            type="text"
            placeholder="e.g. 7 Nights, 8 Days"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Travel Dates */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Travel Dates</label>
        <input
          value={travelDates}
          onChange={e => setTravelDates(e.target.value)}
          type="text"
          className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
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
              placeholder="e.g. Best 5 Star Umrah Package | Terrific Travel"
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
            placeholder="e.g. umrah, family packages, luxury travel, 5 star hotel"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <p className="text-[10px] text-slate-500 mt-1">Enter keywords separated by commas.</p>
        </div>
      </div>

      {/* Sold Out Option */}
      <div className="flex items-center gap-2">
        <input
          id="isSold"
          type="checkbox"
          checked={isSold}
          onChange={e => setIsSold(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-[#f5f0eb]0 cursor-pointer"
        />
        <label htmlFor="isSold" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
          Mark as Sold Out (Unavailable)
        </label>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Cover Image {!initialData?.id && "*"}
        </label>
        <input
          required={!initialData?.id}
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
        />
        {imagePreview && (
          <div className="mt-3 w-full h-48 rounded-xl overflow-hidden border border-slate-200">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Rich Text Content */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Package Details (Rich Content) *
        </label>
        <p className="text-xs text-slate-400 mb-2">
          Add all package details here — pricing, accommodation, inclusions, itinerary, features etc. Use headings, bullet points, and bold text to structure your content.
        </p>
        <div className="bg-white rounded-lg border border-slate-300">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-72 mb-12"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-8 h-[50px] text-sm font-bold text-white shadow hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : initialData?.id ? "Update Package" : "Add Package"}
        </button>
      </div>
    </form>
  );
}
