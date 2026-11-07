import { getCurrentUser } from "@/lib/actions/auth";
import { User, Database } from "lucide-react";
import { ProfileForm } from "@/components/forms/profile-form";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

export const metadata = {
  title: "Settings | Innovexa",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("innovexa-demo")
  );

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Workspace & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your organization account, listing preferences, and database configurations.
        </p>
      </div>

      {/* Profile Card */}
      <LiquidGlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/40 dark:border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              User Profile
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            {user.role}
          </span>
        </div>

        <ProfileForm
          initialFullName={user.full_name}
          initialEmail={user.email}
          initialCompany={user.company_name || "Innovexa Technologies"}
        />
      </LiquidGlassCard>

      {/* Database & Infrastructure Status */}
      <LiquidGlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Database & Cloud Persistence
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Primary Database
              </span>
              <span className="text-slate-500">
                Supabase PostgreSQL with Row Level Security (RLS)
              </span>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                isSupabaseConfigured
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
              }`}
            >
              {isSupabaseConfigured ? "Connected (Live Cloud)" : "Demo Simulation Mode"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
              Connecting Your Supabase Cloud Project:
            </span>
            <p className="text-slate-500 leading-relaxed mb-2">
              1. Run the SQL schema in <code className="text-blue-600">supabase/migrations/20260101000000_create_schema.sql</code> in your Supabase SQL Editor.<br />
              2. Add your project URL and Anon Key to <code className="text-blue-600">.env.local</code>:<br />
              <code className="text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-900 px-2 py-0.5 rounded block my-1 font-mono">
                NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
              </code>
              3. Run <code className="text-blue-600">supabase/seed.sql</code> to load the 20 sample products.
            </p>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
