"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adjustProductStock } from "@/lib/actions/products";
import { ArrowUpDown, AlertCircle, CheckCircle } from "lucide-react";

interface StockAdjustmentDialogProps {
  productId: string;
  productName: string;
  currentStock: number;
}

export function StockAdjustmentDialog({
  productId,
  productName,
  currentStock,
}: StockAdjustmentDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState(currentStock);
  const [reason, setReason] = useState("Manual stock correction");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await adjustProductStock(productId, newQuantity, reason);
    if (!res.success) {
      setError(res.error || "Failed to adjust stock");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => {
          setNewQuantity(currentStock);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
      >
        <ArrowUpDown className="w-4 h-4 text-blue-500" />
        <span>Adjust Stock</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Adjust Inventory Stock
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {productName}
            </p>

            <form onSubmit={handleAdjust} className="space-y-4 mt-4">
              {error && (
                <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="text-slate-500">Current Stock:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {currentStock} units
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Reason for Adjustment
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Manual stock count correction">Manual stock count correction</option>
                  <option value="Supplier purchase shipment arrival">Supplier purchase shipment arrival</option>
                  <option value="Customer order dispatch / sale">Customer order dispatch / sale</option>
                  <option value="Damaged / expired goods write-off">Damaged / expired goods write-off</option>
                  <option value="Customer return / restock">Customer return / restock</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Save Stock Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

