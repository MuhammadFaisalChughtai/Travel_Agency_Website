"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { MathChallenge } from "@/components/ui/MathChallenge";
import { PhoneInput } from "@/components/ui/PhoneInput";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isMathValid, setIsMathValid] = useState(false);
  const [resetMathKey, setResetMathKey] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          type: "contact",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send message.");
      }

      setStatus("success");
      setResetMathKey(prev => prev + 1);
      setIsMathValid(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#064e3b]/10 border border-[#d4af37]/30">
      <h2 className="text-3xl font-black text-[#064e3b] mb-8 font-heading">
        Send us a message
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-black tracking-wide uppercase leading-6 text-[#064e3b]"
            >
              First name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border-0 py-3 text-[#064e3b] shadow-sm ring-1 ring-inset ring-[#d4af37]/40 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#064e3b] sm:text-sm sm:leading-6 px-4 bg-slate-50 outline-none transition-all duration-300"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-black tracking-wide uppercase leading-6 text-[#064e3b]"
            >
              Last name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="block w-full rounded-xl border-0 py-3 text-[#064e3b] shadow-sm ring-1 ring-inset ring-[#d4af37]/40 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#064e3b] sm:text-sm sm:leading-6 px-4 bg-slate-50 outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-black tracking-wide uppercase leading-6 text-[#064e3b]"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full rounded-xl border-0 py-3 text-[#064e3b] shadow-sm ring-1 ring-inset ring-[#d4af37]/40 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#064e3b] sm:text-sm sm:leading-6 px-4 bg-slate-50 outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-black tracking-wide uppercase leading-6 text-[#064e3b]"
          >
            Phone number
          </label>
          <div className="mt-2">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-full rounded-xl border-0 py-3 text-[#064e3b] shadow-sm ring-1 ring-inset ring-[#d4af37]/40 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#064e3b] sm:text-sm sm:leading-6 px-4 bg-slate-50 outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-black tracking-wide uppercase leading-6 text-[#064e3b]"
          >
            Message
          </label>
          <div className="mt-2">
            <textarea
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="block w-full rounded-xl border-0 py-3 text-[#064e3b] shadow-sm ring-1 ring-inset ring-[#d4af37]/40 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#064e3b] sm:text-sm sm:leading-6 px-4 bg-slate-50 resize-none outline-none transition-all duration-300"
            />
          </div>
        </div>

        {status === "success" && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
            <p>
              Thank you! Your message has been sent. We'll be in touch soon.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <p>{errorMsg}</p>
          </div>
        )}

        <MathChallenge onValidChange={setIsMathValid} resetKey={resetMathKey} brand="rtu" />

                  <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full h-12 text-md flex justify-center items-center gap-2 bg-[#064e3b] hover:bg-[#d4af37] text-white hover:text-[#064e3b] rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold tracking-widest uppercase"
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
