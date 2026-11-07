"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";
import { formatCurrencyINR } from "@/lib/utils";
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Coins,
  Package,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { StockAdjustmentDialog } from "@/components/products/stock-adjustment-dialog";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidGlassContainer } from "@/components/ui/liquid-glass-container";

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
}

export function InventoryView({ products, categories }: InventoryViewProps) {
  const [filter, setFilter] = useState<"ALL" | "HEALTHY" | "LOW" | "OUT">("ALL");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const totalUnits = products.reduce((sum, p) => sum + p.stock_quantity, 0);
  const outOfStock = products.filter((p) => p.stock_quantity === 0);
  const lowStock = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
  );
  const healthy = products.filter((p) => p.stock_quantity > p.low_stock_threshold);

  const totalCostValue = products.reduce(
    (sum, p) => sum + p.purchase_cost * p.stock_quantity,
    0
  );
  const totalRetailValue = products.reduce(
    (sum, p) => sum + p.selling_price * p.stock_quantity,
    0
  );

  const filteredProducts = products.filter((p) => {
    // Stock status filter
    if (filter === "HEALTHY" && p.stock_quantity <= p.low_stock_threshold) return false;
    if (filter === "LOW" && (p.stock_quantity === 0 || p.stock_quantity > p.low_stock_threshold))
      return false;
    if (filter === "OUT" && p.stock_quantity !== 0) return false;

    // Category filter
    if (selectedCategory !== "ALL" && p.category_id !== selectedCategory) return false;

    // Search
    if (
      search &&
      !p.product_name.toLowerCase().includes(search.toLowerCase()) &&
      !p.sku.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Inventory & Stock Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track warehouse levels, threshold warnings, and real-time replenishment needs.
        </p>
      </div>

      {/* 4 Metric Cards */}
      {/* KPI Cards inside LiquidGlassContainer */}
      <LiquidGlassContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiquidGlassCard
          onClick={() => setFilter("ALL")}
          className={`p-5 cursor-pointer transition-all ${
            filter === "ALL"
              ? "border-blue-500 ring-2 ring-blue-500/20"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total Units
            </span>
            <Boxes className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalUnits.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Across {products.length} products
          </span>
        </LiquidGlassCard>

        <LiquidGlassCard
          onClick={() => setFilter("HEALTHY")}
          className={`p-5 cursor-pointer transition-all ${
            filter === "HEALTHY"
              ? "border-emerald-500 ring-2 ring-emerald-500/20"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Healthy Stock
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {healthy.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Above reorder threshold
          </span>
        </LiquidGlassCard>

        <LiquidGlassCard
          onClick={() => setFilter("LOW")}
          className={`p-5 cursor-pointer transition-all ${
            filter === "LOW"
              ? "border-amber-500 ring-2 ring-amber-500/20"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {lowStock.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            At or below threshold
          </span>
        </LiquidGlassCard>

        <LiquidGlassCard
          onClick={() => setFilter("OUT")}
          className={`p-5 cursor-pointer transition-all ${
            filter === "OUT"
              ? "border-rose-500 ring-2 ring-rose-500/20"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Depleted / Out
            </span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {outOfStock.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Immediate reorder needed
          </span>
        </LiquidGlassCard>
      </LiquidGlassContainer>

      {/* Valuation Strip */}
      <LiquidGlassCard className="p-4 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg border border-white/20">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
            Total Inventory Valuation
          </span>
          <div className="text-xl sm:text-2xl font-extrabold mt-0.5">
            {formatCurrencyINR(totalCostValue)} (Cost)
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
            Potential Retail Realization
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-200 mt-0.5">
            {formatCurrencyINR(totalRetailValue)}
          </div>
        </div>
      </LiquidGlassCard>

      {/* Controls & Search */}
      <LiquidGlassCard className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product name or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 focus:outline-none shadow-xs"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </LiquidGlassCard>

      {/* Inventory Table */}
      <LiquidGlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/40 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-white/50 dark:border-white/10">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Available Units</th>
                <th className="py-3 px-4 text-center">Threshold</th>
                <th className="py-3 px-4 text-center">Status Alert</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Stock Valuation</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No matching inventory records found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isZero = p.stock_quantity === 0;
                  const isLow = p.stock_quantity <= p.low_stock_threshold && !isZero;
                  const stockValuation = p.purchase_cost * p.stock_quantity;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/products/${p.id}`}
                          className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 truncate block max-w-xs"
                        >
                          {p.product_name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {p.category?.name || "Uncategorized"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-sm text-slate-900 dark:text-slate-100">
                        {p.stock_quantity}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">
                        {p.low_stock_threshold}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isZero ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                        {formatCurrencyINR(p.purchase_cost)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrencyINR(stockValuation)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <StockAdjustmentDialog
                          productId={p.id}
                          productName={p.product_name}
                          currentStock={p.stock_quantity}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>
    </div>
  );
}

