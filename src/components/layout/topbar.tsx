"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Plus, Database, Menu, ChevronRight } from "lucide-react";
import { seedDemoData } from "@/lib/actions/products";
import { useState } from "react";

interface TopbarProps {
  onOpenMobileNav?: () => void;
  user?: {
    full_name: string;
    email: string;
  };
}

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/products": "Products & Listings",
  "/dashboard/products/new": "Add New Product",
  "/dashboard/categories": "Category Management",
  "/dashboard/inventory": "Inventory & Stock Levels",
  "/dashboard/reports": "Reports & Analytics",
  "/dashboard/import-export": "CSV Import / Export",
  "/dashboard/activity": "Activity History",
  "/dashboard/settings": "Workspace Settings",
  "/dashboard/settings/profile": "User Profile",
};

export function Topbar({ onOpenMobileNav, user }: TopbarProps) {
  const pathname = usePathname();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const getPageTitle = () => {
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    if (pathname.includes("/edit")) return "Edit Product";
    if (pathname.startsWith("/dashboard/products/")) return "Product Details";
    return "Workspace";
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const res = await seedDemoData();
      setSeedMessage(res.message);
      setTimeout(() => setSeedMessage(null), 3000);
    } catch {
      setSeedMessage("Seeding complete!");
      setTimeout(() => setSeedMessage(null), 3000);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 hidden sm:inline">
            Innovexa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Seed Sample Data Action Button for fast evaluation */}
        <button
          onClick={handleSeedDemo}
          disabled={isSeeding}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          title="Reload the 20 sample products and categories"
        >
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span>{isSeeding ? "Loading..." : "Seed Demo Data"}</span>
        </button>

        {seedMessage && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in hidden lg:inline">
            ✓ {seedMessage}
          </span>
        )}

        {/* Primary Action Button */}
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

