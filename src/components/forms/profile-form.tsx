"use client";

import { useState } from "react";
import { updateProfileAction } from "@/lib/actions/auth";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  initialFullName: string;
  initialEmail: string;
  initialCompany: string;
}

export function ProfileForm({
  initialFullName,
  initialEmail,
  initialCompany,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [companyName, setCompanyName] = useState(initialCompany);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("companyName", companyName);

    const res = await updateProfileAction(formData);
    setIsSubmitting(false);

    if (res?.error) {
      setStatus("error");
      setErrorMsg(res.error);
    } else {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "success" && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg || "Failed to update profile"}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={initialEmail}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Company / Organization
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Default Currency
          </label>
          <input
            type="text"
            disabled
            value="INR (₹) - Indian Rupee"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}

