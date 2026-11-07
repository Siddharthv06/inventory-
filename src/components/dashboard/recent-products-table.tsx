import Link from "next/link";
import { Product } from "@/types";
import { formatCurrencyINR } from "@/lib/utils";
import { Package, ArrowRight, ExternalLink } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

interface RecentProductsTableProps {
  products: Product[];
  className?: string;
}

export function RecentProductsTable({ products, className = "" }: RecentProductsTableProps) {
  return (
    <LiquidGlassCard className={`p-0 overflow-hidden ${className}`}>
      <div className="p-5 border-b border-white/50 dark:border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recently Added Products
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest items introduced into the catalog
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View full catalog <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/40 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-white/50 dark:border-white/10">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Selling Price</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40 dark:divide-white/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No products added yet.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const statusColors: Record<string, string> = {
                  Listed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
                  "Ready for Listing": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
                  Archived: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                };

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <Link
                            href={`/dashboard/products/${p.id}`}
                            className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                          >
                            {p.product_name}
                          </Link>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {p.material || "Standard"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {p.category?.name || "Uncategorized"}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrencyINR(p.selling_price)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          statusColors[p.status] || ""
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </LiquidGlassCard>
  );
}

