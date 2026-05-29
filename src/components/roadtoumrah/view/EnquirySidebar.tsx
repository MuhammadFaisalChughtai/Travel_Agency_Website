"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, User, Send, CheckCircle, AlertCircle, X, MessageSquare } from "lucide-react";

interface Props {
  type: string;
  id: string;
  packageTitle?: string;
}

export function EnquirySidebar({ type, id, packageTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Set context for Tawk.to chat if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const setTawkContext = () => {
        if ((window as any).Tawk_API && (window as any).Tawk_API.setAttributes) {
          (window as any).Tawk_API.setAttributes({
            'Interested In': packageTitle || type,
            'Package ID': id
          }, function (error: any) {});
        }
      };
      
      // Try setting it immediately and after a short delay in case Tawk is still loading
      setTawkContext();
      const timer = setTimeout(setTawkContext, 2000);
      return () => clearTimeout(timer);
    }
  }, [id, packageTitle, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type,
          packageId: id,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send enquiry.");
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Quick Enquire Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl border-2 border-[#8c3061]/80 text-[#8c3061] hover:text-[#F9FAFB] hover:border-[#F9FAFB] hover:bg-[#8c3061]/10 font-heading font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Quick Enquire
      </button>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/441215291630?text=${encodeURIComponent(
          `Hello, I am interested in the ${packageTitle ? `"${packageTitle}"` : type} package (ID: ${id}). Could you provide more details?`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-10 rounded-2xl border border-[#8c3061]/30 text-[#8c3061]/70 hover:text-[#8c3061] hover:border-[#8c3061]/60 font-heading font-bold text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
        </svg>
        WhatsApp Us
      </a>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#8c3061]/50"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#c63c51] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-heading font-black text-base tracking-tight">Quick Enquiry</h2>
                {packageTitle && (
                  <p className="text-[#8c3061]/80 text-xs mt-0.5 truncate max-w-[240px]">{packageTitle}</p>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {status === "success" ? (
                <div className="py-8 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-[#382626] text-lg">Enquiry Sent!</h3>
                    <p className="text-slate-500 text-sm mt-1">Our team will contact you within 24 hours.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setStatus("idle"); }}
                    className="px-6 py-2.5 rounded-xl bg-[#c63c51] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#382626] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {status === "error" && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2.5 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3.5">
                    {/* Name */}
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c63c51] pointer-events-none" />
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Full Name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#c63c51] focus:ring-1 focus:ring-[#c63c51] outline-none transition-all font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c63c51] pointer-events-none" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#c63c51] focus:ring-1 focus:ring-[#c63c51] outline-none transition-all font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c63c51] pointer-events-none" />
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#c63c51] focus:ring-1 focus:ring-[#c63c51] outline-none transition-all font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Message */}
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any specific requirements or questions…"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#c63c51] focus:ring-1 focus:ring-[#c63c51] outline-none transition-all font-medium placeholder-slate-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#c63c51] hover:bg-[#522258] text-[#F9FAFB] font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-400">
                    Sent directly to{" "}
                    <span className="text-[#c63c51] font-semibold">inquires@terrifictravel.co.uk</span>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
