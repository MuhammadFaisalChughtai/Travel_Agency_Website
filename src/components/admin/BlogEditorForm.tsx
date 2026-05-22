"use client";

import React, { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { createBlog } from "@/app/(admin)/admin/blogs/actions";
import { Button } from "@/components/ui/Button";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export function BlogEditorForm({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "Holiday");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");

  const quillRef = useRef<any>(null);

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range ? range.index : 0, "image", data.url);
        }
      } catch (err) {
        console.error("Failed to upload image:", err);
        alert("Failed to upload image.");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      // Upload main blog image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          imageUrl = data.url;
        } else {
          throw new Error("Failed to upload main image");
        }
      }

      // Create or Update blog post
      const blogData = new FormData();
      blogData.append("title", title);
      blogData.append("category", category);
      blogData.append("image", imageUrl); // main image
      blogData.append("excerpt", excerpt);
      blogData.append("content", content);
      blogData.append("metaTitle", metaTitle);
      blogData.append("metaDescription", metaDescription);

      if (initialData?.id) {
        const { updateBlog } = await import("@/app/(admin)/admin/blogs/actions");
        await updateBlog(initialData.id, blogData);
        alert("Blog updated successfully!");
      } else {
        await createBlog(blogData);
        // Reset form
        setTitle("");
        setCategory("Holiday");
        setExcerpt("");
        setContent("");
        setImageFile(null);
        setImagePreview("");
        alert("Blog created successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text" 
            className="block w-full rounded-md border-slate-300 shadow-sm sm:text-sm px-4 py-2 border" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select 
            required 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-md border-slate-300 shadow-sm sm:text-sm px-4 py-2 border"
          >
            <option value="Holiday">Holiday</option>
            <option value="Umrah">Umrah</option>
            <option value="Hajj">Hajj</option>
            <option value="Flights">Flights</option>
            <option value="Visa">Visa</option>
            <option value="Transport">Transport</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Main Cover Image</label>
        <input 
          required={!initialData?.image}
          type="file" 
          accept="image/*"
          onChange={handleMainImageChange}
          className="block w-full rounded-md border-slate-300 shadow-sm sm:text-sm px-4 py-2 border bg-white" 
        />
        {imagePreview && (
          <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* SEO FIELDS */}
      <div className="pt-6 border-t border-slate-200 mt-6">
        <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">SEO Configuration</h3>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="sm:col-span-2">
            <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700">Meta Title</label>
            <div className="mt-1">
              <input
                type="text"
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                placeholder="SEO Title (e.g., Best Places to Visit in Makkah)"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Keep it under 60 characters for best results.</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="metaDescription" className="block text-sm font-medium text-slate-700">Meta Description</label>
            <div className="mt-1">
              <textarea
                id="metaDescription"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                placeholder="Brief summary for search engines..."
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Keep it between 150-160 characters.</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Short Excerpt</label>
        <textarea 
          required 
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2} 
          className="block w-full rounded-md border-slate-300 shadow-sm sm:text-sm px-4 py-2 border"
          placeholder="A brief summary of the post..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Rich Content (HTML)</label>
        <div className="bg-white rounded-md">
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            className="h-64 mb-12"
          />
        </div>
      </div>

      <div className="pt-8">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-700 w-full md:w-auto"
        >
          {isSubmitting ? "Publishing..." : "Publish Blog Post"}
        </Button>
      </div>
    </form>
  );
}
