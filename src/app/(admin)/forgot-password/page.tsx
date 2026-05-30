"use client";

import { useState } from "react";
import { Plane, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset link");
      }

      setStatus("success");
      setMessage(
        "If an account exists with this email, a reset link has been sent.",
      );
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center">
          <Plane className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 font-heading">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-8">
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm font-medium">
              {message}
            </div>
            <div className="mt-6 text-center">
              <a
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Return to Login
              </a>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {status === "error" && (
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
                {message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full text-md h-12 rounded-xl flex items-center justify-center gap-2"
            >
              {status === "loading" && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-center mt-4">
              <a
                href="/login"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Back to Login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
