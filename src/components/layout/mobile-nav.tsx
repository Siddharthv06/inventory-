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
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    full_name: string;
    email: string;
    role: string;
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

export function MobileNav({ isOpen, onClose, user }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
              IX
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              INNOVEXA
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.full_name || "Team Member"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "reviewer@innovexa.tech"}
              </p>
            </div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

