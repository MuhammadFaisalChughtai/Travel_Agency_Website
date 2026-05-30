"use client";

import { useState, Suspense } from "react";
import { Plane, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setStatus("success");
      setMessage("Password successfully reset! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <div className="text-center">
        <Plane className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 font-heading">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your new password below.
        </p>
      </div>

      {status === "success" ? (
        <div className="mt-8">
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm font-medium">
            {message}
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {status === "error" && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              {message}
            </div>
          )}
          {!token && status !== "error" && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              Warning: Missing reset token in URL.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                New Password
              </label>
              <input
                type="password"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={status === "loading" || !token}
            className="w-full text-md h-12 rounded-xl flex items-center justify-center gap-2"
          >
            {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center w-full max-w-md h-64 bg-white rounded-2xl shadow-xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
