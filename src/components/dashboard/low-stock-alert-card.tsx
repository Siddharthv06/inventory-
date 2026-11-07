import Link from "next/link";
import { Product } from "@/types";
import { AlertCircle, ChevronRight, Boxes } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

interface LowStockAlertCardProps {
  products: Product[];
}

export function LowStockAlertCard({ products }: LowStockAlertCardProps) {
  return (
    <LiquidGlassCard className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Low Stock Alerts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Items at or below safety threshold
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/inventory"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px]">
        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">All inventory levels are currently healthy!</p>
          </div>
        ) : (
          products.slice(0, 5).map((p) => {
            const isZero = p.stock_quantity === 0;
            return (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                  >
                    {p.product_name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {p.sku}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[11px] text-slate-500">
                      Threshold: {p.low_stock_threshold} units
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      isZero
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}
                  >
                    {p.stock_quantity} {isZero ? "OUT" : "LEFT"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </LiquidGlassCard>
  );
}

