"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  BarChart3,
  ArrowUpDown,
  History,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

interface SidebarProps {
  user?: {
    full_name: string;
    email: string;
    role: string;
    company_name?: string | null;
  };
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Layers },
  { label: "Inventory", href: "/dashboard/inventory", icon: Boxes },
  { label: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Import & Export", href: "/dashboard/import-export", icon: ArrowUpDown },
  { label: "Activity History", href: "/dashboard/activity", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/60 dark:border-white/10 liquid-glass flex flex-col h-screen sticky top-0 transition-all select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/50 dark:border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            IX
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-white text-base tracking-tight leading-none">
              INNOVEXA
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-1">
              Listing Manager
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "liquid-glass-lens-tab text-blue-700 dark:text-blue-300 font-semibold shadow-md shadow-blue-500/10"
                  : "text-slate-600 hover:text-slate-900 hover:liquid-glass-lens-tab dark:text-slate-400 dark:hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Workspace Plan Badge */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Production Ready</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          Apple WWDC 2025 Liquid Glass WebGL shader active.
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-white/50 dark:border-white/10">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-medium text-xs flex items-center justify-center shrink-0 shadow-sm">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                {user?.full_name || "Innovexa Reviewer"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.role || "Listing Manager"}
              </p>
            </div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-white/60 dark:hover:bg-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

