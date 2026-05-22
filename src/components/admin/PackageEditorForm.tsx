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

      if (initialData?.id) {
        const { updatePackage } = await import("@/app/(admin)/admin/packages/actions");
        await updatePackage(initialData.id, formData);
        alert("Package updated successfully!");
      } else {
        const { createPackage } = await import("@/app/(admin)/admin/packages/actions");
        await createPackage(formData);
        setTitle(""); setType("UMRAH"); setStars("3"); setPrice("");
        setDuration(""); setContent(""); setImageFile(null); setImagePreview("");
        setIsSold(false); setMetaTitle(""); setMetaDescription("");
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
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Package Type *</label>
          <select
            required
            value={type}
            onChange={e => setType(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="UMRAH">Umrah</option>
            <option value="HAJJ">Hajj</option>
            <option value="HOLIDAY">Holiday</option>
          </select>
        </div>
      </div>

      {/* Row 2: Stars + Price + Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Star Rating *</label>
          <select
            required
            value={stars}
            onChange={e => setStars(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
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
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
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
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
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
          className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* SEO Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 border border-slate-200 rounded-lg">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Title</label>
          <input
            value={metaTitle}
            onChange={e => setMetaTitle(e.target.value)}
            type="text"
            placeholder="e.g. Best 5 Star Umrah Package | Terrific Travel"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">SEO Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={e => setMetaDescription(e.target.value)}
            rows={2}
            placeholder="A short description for search engines..."
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* Sold Out Option */}
      <div className="flex items-center gap-2">
        <input
          id="isSold"
          type="checkbox"
          checked={isSold}
          onChange={e => setIsSold(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
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
          className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : initialData?.id ? "Update Package" : "Add Package"}
        </button>
      </div>
    </form>
  );
}
