"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MathChallenge } from "@/components/ui/MathChallenge";
import { PhoneInput } from "@/components/ui/PhoneInput";
import {
  Mail,
  Phone,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  X,
  MessageSquare,
} from "lucide-react";

interface Props {
  flightId: string;
  flightTitle: string;
}

export function FlightEnquireButton({ flightId, flightTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isMathValid, setIsMathValid] = useState(false);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [resetMathKey, setResetMathKey] = useState(0);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    if (!isMathValid) {
      setErrorMsg("Please solve the math problem correctly.");
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: challengeData,
          ...form,
          type: "flight",
          packageId: flightId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send enquiry.");
      }
      setStatus("success");
      setResetMathKey(prev => prev + 1);
      setIsMathValid(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const modalContent = open && mounted ? createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d4af37]/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#043427] to-[#064e3b] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-heading font-black text-base tracking-tight">
              Flight Enquiry
            </h2>
            <p className="text-[#d4af37]/80 text-xs mt-0.5 truncate max-w-[240px]">
              {flightTitle}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
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
                <h3 className="font-heading font-black text-[#043427] text-lg">
                  Enquiry Sent!
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Our team will contact you within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  setStatus("idle");
                }}
                className="px-6 py-2.5 rounded-xl bg-[#064e3b] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#043427] transition-colors"
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
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none transition-all font-medium placeholder-slate-400"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#064e3b] pointer-events-none" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none transition-all font-medium placeholder-slate-400"
                  />
                </div>

                <PhoneInput value={form.phone} onChange={(val) => setForm((prev: any) => ({ ...prev, phone: val }))} brand="rtu" />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any specific requirements or questions…"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-sm focus:bg-white focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] outline-none transition-all font-medium placeholder-slate-400 resize-none"
                />
              </div>

              <MathChallenge onValidChange={(valid, data) => { setIsMathValid(valid); setChallengeData(data); }} resetKey={resetMathKey} brand="rtu" />

                  <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 w-full h-[50px] rounded-xl bg-gradient-to-r from-[#064e3b] to-[#043427] hover:from-[#043427] hover:to-[#251717] text-emerald-50 font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
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
                <span className="text-[#064e3b] font-semibold">
                  inquiry@terrifictravel.co.uk
                </span>
              </p>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-white text-[#064e3b] border border-[#d4af37]/80 hover:bg-emerald-50 hover:border-[#064e3b]/40 font-heading font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Enquire Now
      </button>

      {modalContent}
    </>
  );
}
