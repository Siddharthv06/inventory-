"use client";

import { useState } from "react";
import { ActivityLog } from "@/types";
import { formatDateTime } from "@/lib/utils";
import {
  History,
  PlusCircle,
  Edit3,
  Archive,
  RotateCcw,
  Trash2,
  ArrowUpDown,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

interface ActivityViewProps {
  initialActivities: ActivityLog[];
}

export function ActivityView({ initialActivities }: ActivityViewProps) {
  const [selectedAction, setSelectedAction] = useState("ALL");

  const filtered = initialActivities.filter((a) => {
    if (selectedAction !== "ALL" && a.action !== selectedAction) return false;
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <PlusCircle className="w-3 h-3" /> Created
          </span>
        );
      case "UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Edit3 className="w-3 h-3" /> Updated
          </span>
        );
      case "ARCHIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <Archive className="w-3 h-3" /> Archived
          </span>
        );
      case "RESTORE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <RotateCcw className="w-3 h-3" /> Restored
          </span>
        );
      case "DELETE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <Trash2 className="w-3 h-3" /> Deleted
          </span>
        );
      case "STOCK_ADJUSTMENT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <ArrowUpDown className="w-3 h-3" /> Stock
          </span>
        );
      case "IMPORT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            <FileSpreadsheet className="w-3 h-3" /> CSV Import
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Audit Trail & Activity Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Immutable workspace event stream tracking catalog modifications, stock adjustments, and imports.
          </p>
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Action Types</option>
            <option value="CREATE">Created</option>
            <option value="UPDATE">Updated</option>
            <option value="STOCK_ADJUSTMENT">Stock Adjustments</option>
            <option value="ARCHIVE">Archived</option>
            <option value="RESTORE">Restored</option>
            <option value="IMPORT">CSV Imports</option>
            <option value="DELETE">Deleted</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <LiquidGlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/40 dark:border-white/10 text-xs font-semibold text-slate-500 flex items-center justify-between">
          <span>Logged Event</span>
          <span>Timestamp</span>
        </div>

        <div className="divide-y divide-white/20 dark:divide-white/5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No activity records match this filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="shrink-0">{getActionBadge(item.action)}</div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.description}
                    </p>
                    {item.product_name && (
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Product: {item.product_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  {formatDateTime(item.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      </LiquidGlassCard>
    </div>
  );
}

