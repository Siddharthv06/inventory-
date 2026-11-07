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
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidGlassContainer } from "@/components/ui/liquid-glass-container";
import { LiquidGlassLens } from "@/components/ui/liquid-glass-lens";
import { LiquidGlassControls } from "@/components/ui/liquid-glass-controls";
import { LensHeroTrigger } from "@/components/ui/lens-hero-trigger";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-100/70 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden">
      {/* Apple WWDC 2025 Liquid Glass Ambient Optical Refraction Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-blue-500/30 via-sky-400/25 to-transparent blur-[110px] dark:from-blue-600/30 dark:via-indigo-600/25 dark:to-transparent animate-ambient-slow" />
        <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-indigo-500/30 via-purple-500/25 to-transparent blur-[130px] dark:from-indigo-600/30 dark:via-purple-800/25 dark:to-transparent animate-ambient-reverse" />
        <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-cyan-400/30 via-blue-500/25 to-transparent blur-[140px] dark:from-cyan-700/25 dark:via-blue-800/20 dark:to-transparent" />
      </div>

      {/* Public Navbar */}
      <header className="h-16 liquid-glass border-b border-white/60 dark:border-white/10 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-blue-500/20">
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
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-5xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-white/80 dark:border-white/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Innovexa Technologies • Liquid Glass Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 max-w-3xl leading-[1.15]">
          Next-Generation B2B Product Listing & Inventory
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Production-ready multi-tenant catalog manager engineered with Supabase PostgreSQL,
          Row Level Security, and Apple WWDC 2025 Liquid Glass WebGL shader refraction.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Open Management Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <LensHeroTrigger />

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 liquid-glass hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-sm transition-all"
          >
            <span>Sign In to Account</span>
          </Link>
        </div>

        {/* Feature Highlights Grid with @ybouane/liquidglass Container */}
        <LiquidGlassContainer className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
          <LiquidGlassCard className="p-5">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Full Catalog CRUD
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Name, SKU uniqueness, physical dimensions, materials, Indian GST rates, and drive links.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-5">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Stock & Replenishment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Configurable reorder thresholds, low stock warning badges, and transaction movement logs.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-5">
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 w-fit mb-3">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Bulk CSV Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              RFC-4180 compliant CSV export and previewed import with error feedback.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-5">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 w-fit mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              PostgreSQL RLS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Strict multi-tenant Row Level Security ensuring zero data leaks across workspaces.
            </p>
          </LiquidGlassCard>
        </LiquidGlassContainer>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/60 dark:border-white/10 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Innovexa Technologies • Product Inventory & Listing Manager Assessment</p>
      </footer>

      {/* Interactive Draggable Liquid Glass Magnifier Lens */}
      <LiquidGlassLens />

      {/* Floating Liquid Glass Physics Lab Dock */}
      <LiquidGlassControls />
    </div>
  );
}
