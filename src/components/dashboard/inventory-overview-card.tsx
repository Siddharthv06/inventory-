import { DashboardStats } from "@/types";

interface InventoryOverviewProps {
  stats: DashboardStats;
}

export function InventoryOverviewCard({ stats }: InventoryOverviewProps) {
  const total = Math.max(stats.totalProducts, 1);

  const statuses = [
    {
      name: "Listed",
      count: stats.activeListings,
      pct: Math.round((stats.activeListings / total) * 100),
      color: "bg-emerald-500",
      textColor: "text-emerald-700 dark:text-emerald-400",
    },
    {
      name: "Ready for Listing",
      count: stats.readyForListing,
      pct: Math.round((stats.readyForListing / total) * 100),
      color: "bg-amber-500",
      textColor: "text-amber-700 dark:text-amber-400",
    },
    {
      name: "Draft",
      count: stats.draftCount,
      pct: Math.round((stats.draftCount / total) * 100),
      color: "bg-slate-400",
      textColor: "text-slate-700 dark:text-slate-400",
    },
    {
      name: "Archived",
      count: stats.archivedCount,
      pct: Math.round((stats.archivedCount / Math.max(total + stats.archivedCount, 1)) * 100),
      color: "bg-slate-300 dark:bg-slate-600",
      textColor: "text-slate-500 dark:text-slate-400",
    },
  ];

  const healthyStock = Math.max(
    0,
    stats.totalProducts - stats.lowStockCount - stats.outOfStockCount
  );

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Inventory Status Distribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catalog lifecycle and stock availability
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
          {stats.totalProducts} Active SKUs
        </span>
      </div>

      {/* Segmented bar */}
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5 mb-6">
        {statuses.map((s, idx) => (
          <div
            key={idx}
            className={`${s.color} transition-all duration-500`}
            style={{ width: `${s.pct}%` }}
            title={`${s.name}: ${s.count} (${s.pct}%)`}
          />
        ))}
      </div>

      {/* Grid of status breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {statuses.map((s, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {s.name}
              </span>
            </div>
            <span className={`text-xs font-bold ${s.textColor}`}>
              {s.count} <span className="font-normal text-[10px] text-slate-400">({s.pct}%)</span>
            </span>
          </div>
        ))}
      </div>

      {/* Stock Health Quick Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">Stock Availability Health</span>
          <span className="text-slate-500">{healthyStock} / {stats.totalProducts} Healthy</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full"
            style={{ width: `${Math.round((healthyStock / total) * 100)}%` }}
            title={`Healthy Stock: ${healthyStock}`}
          />
          <div
            className="bg-amber-500 h-full"
            style={{ width: `${Math.round((stats.lowStockCount / total) * 100)}%` }}
            title={`Low Stock: ${stats.lowStockCount}`}
          />
          <div
            className="bg-rose-500 h-full"
            style={{ width: `${Math.round((stats.outOfStockCount / total) * 100)}%` }}
            title={`Out of Stock: ${stats.outOfStockCount}`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy ({healthyStock})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Low ({stats.lowStockCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Depleted ({stats.outOfStockCount})
          </span>
        </div>
      </div>
    </div>
  );
}

