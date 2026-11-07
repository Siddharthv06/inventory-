import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  ArrowUpDown,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Boxes,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Public Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              IX
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                INNOVEXA
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Listing Manager
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-5xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Innovexa Technologies • Assessment Delivery</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15] max-w-4xl">
          Centralized Product Inventory & Marketplace Listing Manager
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Say goodbye to fragmented spreadsheets and outdated shared documents. Empower your listing team to find, create, update, and manage accurate product records with sub-second search and strict database validation.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Open Workspace Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all"
          >
            <span>Sign In to Account</span>
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <span>Create New Workspace</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Full Catalog CRUD
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Name, SKU uniqueness, physical dimensions, materials, Indian GST rates, and drive links.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Stock & Replenishment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Configurable reorder thresholds, low stock warning badges, and transaction movement logs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 w-fit mb-3">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Bulk CSV Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              RFC-4180 compliant CSV export and previewed import with error feedback.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 w-fit mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              PostgreSQL RLS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Strict multi-tenant Row Level Security ensuring zero data leaks across workspaces.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Innovexa Technologies • Product Inventory & Listing Manager Assessment</p>
      </footer>
    </div>
  );
}
