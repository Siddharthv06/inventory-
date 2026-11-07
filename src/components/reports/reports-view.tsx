"use client";

import { formatCurrencyINR } from "@/lib/utils";
import { DashboardStats } from "@/types";
import {
  BarChart3,
  PieChart as PieChartIcon,
  Coins,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidGlassContainer } from "@/components/ui/liquid-glass-container";

interface ReportsViewProps {
  data: {
    stats: DashboardStats;
    categoryStats: { name: string; count: number; units: number; value: number }[];
    statusStats: { name: string; count: number; color: string }[];
    stockHealth: { name: string; count: number; color: string }[];
    avgSellingPrice: number;
  };
}

export function ReportsView({ data }: ReportsViewProps) {
  const { stats, categoryStats, statusStats, stockHealth, avgSellingPrice } = data;

  const totalCatUnits = categoryStats.reduce((sum, c) => sum + c.units, 0) || 1;
  const totalCatValue = categoryStats.reduce((sum, c) => sum + c.value, 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Executive Reports & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Comprehensive inventory valuation, status breakdowns, and category concentration metrics.
        </p>
      </div>

      {/* KPI Cards inside LiquidGlassContainer */}
      <LiquidGlassContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiquidGlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total Catalog Value
            </span>
            <Coins className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrencyINR(stats.totalPurchaseValue)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Procurement investment
          </span>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Avg. Selling Price
            </span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrencyINR(avgSellingPrice)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across active listings
          </span>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Marketplace Ready Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.totalProducts > 0
              ? Math.round(
                  ((stats.activeListings + stats.readyForListing) / stats.totalProducts) * 100
                )
              : 0}
            %
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Listed or approved
          </span>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Depletion Alert Rate
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {stats.totalProducts > 0
              ? Math.round((stats.lowStockCount / stats.totalProducts) * 100)
              : 0}
            %
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Low stock warning active
          </span>
        </LiquidGlassCard>
      </LiquidGlassContainer>

      {/* Category Performance Breakdown */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" /> Department / Category Distribution Analysis
        </h2>

        <div className="space-y-4 pt-2">
          {categoryStats.map((cat, idx) => {
            const unitPct = Math.round((cat.units / totalCatUnits) * 100);
            const valuePct = Math.round((cat.value / totalCatValue) * 100);

            return (
              <div
                key={idx}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {cat.name}
                    </span>
                    <span className="text-slate-400 font-mono">({cat.count} SKUs)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrencyINR(cat.value)}
                    </span>
                    <span className="text-slate-400 text-[11px] block">{cat.units} units</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${valuePct}%` }}
                    title={`${cat.name}: ${valuePct}% of valuation`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Valuation Share: {valuePct}%</span>
                  <span>Unit Share: {unitPct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </LiquidGlassCard>

      {/* 2-Column: Status Health & Stock Distribution inside LiquidGlassContainer */}
      <LiquidGlassContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <LiquidGlassCard className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-500" /> Lifecycle Status Breakdown
          </h2>

          <div className="space-y-3">
            {statusStats.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                  {item.count} items
                </span>
              </div>
            ))}
          </div>
        </LiquidGlassCard>

        {/* Stock Health */}
        <LiquidGlassCard className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-indigo-500" /> Stock Health Overview
          </h2>

          <div className="space-y-3">
            {stockHealth.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                  {item.count} items
                </span>
              </div>
            ))}
          </div>
        </LiquidGlassCard>
      </LiquidGlassContainer>
    </div>
  );
}

