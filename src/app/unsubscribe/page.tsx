"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnsubscribe = async () => {
    if (!id) {
      setStatus("error");
      setErrorMsg("Invalid unsubscribe link. Missing customer ID.");
      return;
    }

    setStatus("loading");
    
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to unsubscribe.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#f5f0eb]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#eed6c4]/60 text-center">
        
        {status === "idle" && (
          <>
            <h1 className="text-2xl font-black text-[#6b4f4f] mb-4">Unsubscribe</h1>
            <p className="text-slate-600 mb-8">
              Are you sure you want to unsubscribe? You will no longer receive our exclusive travel deals and newsletters.
            </p>
            <button
              onClick={handleUnsubscribe}
              className="w-full py-3 px-4 bg-[#6b4f4f] hover:bg-[#382626] text-white font-bold rounded-xl transition-colors duration-300 shadow-sm"
            >
              Confirm Unsubscribe
            </button>
            <Link href="/" className="inline-block mt-6 text-sm font-semibold text-[#6b4f4f] hover:underline">
              Wait, I want to stay subscribed!
            </Link>
          </>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-[#6b4f4f] mb-4" />
            <p className="text-slate-600 font-medium">Processing your request...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">You've been unsubscribed</h2>
            <p className="text-slate-600 mb-8">
              We've successfully removed your email from our newsletter mailing list. We're sorry to see you go!
            </p>
            <Link href="/" className="inline-block px-6 py-3 bg-[#f5f0eb] text-[#6b4f4f] font-bold rounded-xl hover:bg-[#eed6c4] transition-colors">
              Return to Homepage
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Something went wrong</h2>
            <p className="text-red-600 font-medium mb-8">
              {errorMsg}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="inline-block px-6 py-3 bg-[#f5f0eb] text-[#6b4f4f] font-bold rounded-xl hover:bg-[#eed6c4] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#6b4f4f]" /></div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
