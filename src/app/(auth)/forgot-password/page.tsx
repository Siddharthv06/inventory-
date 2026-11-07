"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("email", email);

    const res = await forgotPasswordAction(formData);

    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
      return;
    }

    setSuccessMsg(res?.message || "Password recovery instructions sent to your email!");
    setIsSubmitting(false);
  };

  return (
    <LiquidGlassCard className="p-8 space-y-6">
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to login</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Reset password
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Work Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@innovexa.tech"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          <span>{isSubmitting ? "Sending..." : "Send Reset Link"}</span>
        </button>
      </form>
    </LiquidGlassCard>
  );
}

