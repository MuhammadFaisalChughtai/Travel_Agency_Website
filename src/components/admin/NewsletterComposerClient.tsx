"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Send, Loader2, AlertCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import "react-quill/dist/quill.snow.css";

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const DEFAULT_TEMPLATE = `
<div style="text-align: center; margin-bottom: 24px;">
  <img src="https://terrifictravel.co.uk/Logo.svg" alt="Terrific Travel" width="220" style="display: inline-block;" />
</div>

<p>Dear {{name}},</p>

<p>Are you planning your sacred journey of a lifetime? At Terrific Travel, we understand how important and deeply spiritual the Umrah pilgrimage is. That is why we have put together exclusive, all-inclusive Umrah packages designed to give you peace of mind from start to finish.</p>

<p>Whether you are traveling solo, with your spouse, or bringing the whole family, we have options tailored just for you.</p>

<p><strong>Our Premium Umrah Packages Include:</strong></p>
<ul>
  <li><strong>Flights:</strong> Round-trip flights with top-tier airlines.</li>
  <li><strong>Accommodation:</strong> Luxury and budget-friendly hotel stays located just steps away from the Haram in Makkah and the Prophet's Mosque in Madinah.</li>
  <li><strong>Ground Transport:</strong> Seamless, air-conditioned transfers between airports, hotels, and holy sites.</li>
  <li><strong>Visa Processing:</strong> Complete handling of your Umrah visa documentation.</li>
  <li><strong>Guided Support:</strong> 24/7 on-ground assistance to guide you through your rituals.</li>
</ul>

<p><strong>Limited-Time Offer</strong></p>
<p>Book your package this month and enjoy an exclusive discount of up to <strong>10% off</strong> your total booking, plus a complimentary premium Ziyarah tour in both holy cities.</p>

<p><strong><a href="https://terrifictravel.co.uk/umrah" style="color: #6b4f4f; font-size: 15px;">[Click Here to Explore Packages & Book Now]</a></strong></p>

<p>If you have any specific requirements or would like a customized itinerary, simply reply directly to this email or reach out to us at <a href="mailto:inquires@terrifictravel.co.uk">inquires@terrifictravel.co.uk</a>. Our dedicated travel experts are ready to assist you.</p>

<p>May your journey be blessed and accepted.</p>

<br/>
<p>Warm regards,</p>
<p><strong>The Terrific Travel Team</strong></p>

<br/>
<hr style="border: none; border-top: 2px solid #eed6c4; margin: 24px 0;" />

<div style="font-size: 13px; color: #382626; line-height: 2.2;">
  <p style="margin: 4px 0;">
    <strong style="color: #6b4f4f; padding-right: 8px;">WhatsApp:</strong> 
    <a href="https://wa.me/441215291630" style="color: #000000; text-decoration: none;">+44 1215 291630</a>
  </p>
  <p style="margin: 4px 0;">
    <strong style="color: #6b4f4f; padding-right: 8px;">Direct Line:</strong> 
    <a href="tel:+441215291630" style="color: #000000; text-decoration: none;">+44 1215 291630</a>
  </p>
  <p style="margin: 4px 0;">
    <strong style="color: #6b4f4f; padding-right: 8px;">Email:</strong> 
    <a href="mailto:inquires@terrifictravel.co.uk" style="color: #000000; text-decoration: underline;">inquires@terrifictravel.co.uk</a>
  </p>
  <p style="margin: 4px 0;">
    <strong style="color: #6b4f4f; padding-right: 8px;">Website:</strong> 
    <a href="https://terrifictravel.co.uk" style="color: #000000; text-decoration: underline;">www.terrifictravel.co.uk</a>
  </p>
</div>
`;

export function NewsletterComposerClient() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return;
    if (!confirm("Are you sure you want to send this newsletter to ALL your customers?")) return;

    setLoading(true);
    setStatus("idle");
    setMsg("");

    try {
      const res = await fetch("/api/admin/marketing/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
        setMsg(`Successfully sent to ${data.count} out of ${data.total} customers!`);
        setSubject("");
        setContent("");
      } else {
        setStatus("error");
        setMsg(data.error || "Failed to send newsletter.");
      }
    } catch (err) {
      setStatus("error");
      setMsg("Network error sending newsletter.");
    } finally {
      setLoading(false);
    }
  };

  const quillRef = React.useRef<any>(null);

  const imageHandler = React.useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        
        if (data.url) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.url);
          quill.setSelection(range.index + 1);
        } else {
          alert("Image upload failed");
        }
      } catch (err) {
        alert("Upload error");
      }
    };
  }, []);

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
      {status === "success" && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold mb-6">
          <CheckCircle className="w-5 h-5 shrink-0" />
          {msg}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {msg}
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-6 max-w-4xl">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-200 mb-6">
          <strong>Tip:</strong> Personalize your email by typing <code>{`{{name}}`}</code> in the content or subject. It will be replaced with each customer's actual name when sent!
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Line *</label>
          <input 
            required 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b4f4f] transition-colors"
            placeholder="e.g. Exclusive Umrah Deals For You, {{name}}!" 
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold text-slate-700">Email Content *</label>
            <span className="text-xs text-slate-400">Use the toolbar to upload images</span>
          </div>
          <div className="bg-white rounded-lg overflow-hidden border border-slate-300">
            <ReactQuill 
              ref={quillRef}
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-[400px] mb-12"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Emails will be sent from <strong>inquires@terrifictravel.co.uk</strong></p>
          <button 
            type="submit" 
            disabled={loading || !subject || !content}
            className="flex items-center gap-2 bg-[#6b4f4f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5a4242] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? "Sending Campaign..." : "Send Newsletter Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
