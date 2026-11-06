import { DashboardStats } from "@/types";
import { formatCurrencyINR } from "@/lib/utils";
import { Package, CheckCircle2, Clock, Boxes, AlertTriangle, Coins } from "lucide-react";

interface AnalyticsCardsProps {
  stats: DashboardStats;
}

export function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      subtext: `${stats.archivedCount} archived`,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Active Listings",
      value: stats.activeListings.toLocaleString(),
      subtext: "Live on marketplaces",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Ready for Listing",
      value: stats.readyForListing.toLocaleString(),
      subtext: "Catalog approved",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Total Inventory Units",
      value: stats.totalUnits.toLocaleString(),
      subtext: "Across all active items",
      icon: Boxes,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      label: "Low Stock Products",
      value: stats.lowStockCount.toLocaleString(),
      subtext: `${stats.outOfStockCount} completely out of stock`,
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-500",
      bg: stats.lowStockCount > 0 ? "bg-rose-50 dark:bg-rose-950/30" : "bg-slate-50 dark:bg-slate-800",
    },
    {
      label: "Inventory Cost Value",
      value: formatCurrencyINR(stats.totalPurchaseValue),
      subtext: `Est. retail: ${formatCurrencyINR(stats.totalSellingValue)}`,
      icon: Coins,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {c.label}
              </span>
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {c.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {c.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}

