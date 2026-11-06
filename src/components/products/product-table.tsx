"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, Category } from "@/types";
import { formatCurrencyINR, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit2,
  Archive,
  Trash2,
  Download,
  Plus,
  Package,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square,
  ExternalLink,
} from "lucide-react";
import { archiveProduct, restoreProduct, deleteProduct, bulkArchiveProducts } from "@/lib/actions/products";

interface ProductTableProps {
  initialProducts: Product[];
  categories: Category[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function ProductTable({
  initialProducts,
  categories,
  totalCount,
  currentPage,
  totalPages,
}: ProductTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "ALL");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [includeArchived, setIncludeArchived] = useState(
    searchParams.get("includeArchived") === "true"
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionModal, setActionModal] = useState<{
    type: "archive" | "delete" | "bulk-archive" | null;
    targetId?: string;
    productName?: string;
  }>({ type: null });

  // Update query params
  const applyFilters = (updates: Record<string, string | boolean | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "ALL" || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.set("page", "1"); // Reset to page 1 on filter change
    startTransition(() => {
      router.push(`/dashboard/products?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === initialProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialProducts.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirmArchive = async () => {
    if (!actionModal.targetId) return;
    await archiveProduct(actionModal.targetId);
    setActionModal({ type: null });
    router.refresh();
  };

  const handleConfirmRestore = async (id: string) => {
    await restoreProduct(id);
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!actionModal.targetId) return;
    await deleteProduct(actionModal.targetId);
    setActionModal({ type: null });
    router.refresh();
  };

  const handleConfirmBulkArchive = async () => {
    await bulkArchiveProducts(selectedIds);
    setSelectedIds([]);
    setActionModal({ type: null });
    router.refresh();
  };

  const statusStyles: Record<string, string> = {
    Listed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    "Ready for Listing": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    Archived: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  };

  return (
    <div className="space-y-4">
      {/* Action Bar: Search, Filters & Export */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              applyFilters({ category: e.target.value });
            }}
            className="px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              applyFilters({ status: e.target.value });
            }}
            className="px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Listed">Listed</option>
            <option value="Ready for Listing">Ready for Listing</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Include Archived toggle */}
          <label className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => {
                setIncludeArchived(e.target.checked);
                applyFilters({ includeArchived: e.target.checked });
              }}
              className="rounded text-blue-600"
            />
            <span>Include Archived</span>
          </label>

          {/* CSV Export Button */}
          <a
            href={`/api/export?status=${status === "ALL" ? "" : status}&category=${
              category === "ALL" ? "" : category
            }&search=${encodeURIComponent(search)}&includeArchived=${includeArchived}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          {/* Add Product Button */}
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-medium text-blue-900 dark:text-blue-300">
            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{selectedIds.length} product(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActionModal({ type: "bulk-archive" })}
              className="px-3 py-1.5 text-xs font-medium rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Bulk Archive Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:underline"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                    aria-label="Select all"
                  >
                    {selectedIds.length === initialProducts.length && initialProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Category</th>
                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    const nextOrder = sortBy === "price" && sortOrder === "asc" ? "desc" : "asc";
                    setSortBy("price");
                    setSortOrder(nextOrder);
                    applyFilters({ sortBy: "price", sortOrder: nextOrder });
                  }}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Cost</th>
                <th className="py-3 px-3">Weight</th>
                <th
                  className="py-3 px-3 text-center cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    const nextOrder = sortBy === "stock" && sortOrder === "asc" ? "desc" : "asc";
                    setSortBy("stock");
                    setSortOrder(nextOrder);
                    applyFilters({ sortBy: "stock", sortOrder: nextOrder });
                  }}
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Updated</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {initialProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      No products found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try clearing search filters or add a new product.
                    </p>
                  </td>
                </tr>
              ) : (
                initialProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isLowStock = p.stock_quantity <= p.low_stock_threshold;
                  const isOutOfStock = p.stock_quantity === 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(p.id)}
                          className="rounded text-blue-600"
                        />
                      </td>

                      {/* Product Name with Image */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 max-w-[240px]">
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
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/products/${p.id}`}
                              className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                            >
                              {p.product_name}
                            </Link>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {p.material || "Standard"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {p.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {p.category?.name || "Uncategorized"}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrencyINR(p.selling_price)}
                      </td>

                      {/* Purchase Cost */}
                      <td className="py-3 px-3 text-right text-slate-500">
                        {formatCurrencyINR(p.purchase_cost)}
                      </td>

                      {/* Weight */}
                      <td className="py-3 px-3 text-slate-500">
                        {p.weight_value} {p.weight_unit}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              isOutOfStock
                                ? "text-rose-600 dark:text-rose-400"
                                : isLowStock
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {p.stock_quantity}
                          </span>
                          {isLowStock && p.status !== "Archived" && (
                            <span
                              title={
                                isOutOfStock
                                  ? "Out of stock!"
                                  : `Low stock warning (threshold: ${p.low_stock_threshold})`
                              }
                            >
                              <AlertTriangle
                                className={`w-3.5 h-3.5 ${
                                  isOutOfStock ? "text-rose-500" : "text-amber-500"
                                }`}
                              />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            statusStyles[p.status] || ""
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {formatDate(p.updated_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/products/${p.id}`}
                            title="View details"
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/dashboard/products/${p.id}/edit`}
                            title="Edit product"
                            className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {p.status === "Archived" ? (
                            <button
                              onClick={() => handleConfirmRestore(p.id)}
                              title="Restore to Draft"
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setActionModal({
                                  type: "archive",
                                  targetId: p.id,
                                  productName: p.product_name,
                                })
                              }
                              title="Archive product"
                              className="p-1 text-slate-400 hover:text-zinc-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setActionModal({
                                type: "delete",
                                targetId: p.id,
                                productName: p.product_name,
                              })
                            }
                            title="Delete permanently"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {initialProducts.length} of {totalCount} products
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => applyFilters({ page: currentPage - 1 })}
              className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => applyFilters({ page: currentPage + 1 })}
              className="px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {actionModal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {actionModal.type === "archive" && "Archive Product"}
              {actionModal.type === "delete" && "Permanently Delete Product"}
              {actionModal.type === "bulk-archive" && "Bulk Archive Products"}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {actionModal.type === "archive" &&
                `Are you sure you want to archive "${actionModal.productName}"? It will be hidden from default active product listings.`}
              {actionModal.type === "delete" &&
                `Are you sure you want to permanently delete "${actionModal.productName}"? This action cannot be undone.`}
              {actionModal.type === "bulk-archive" &&
                `Are you sure you want to archive all ${selectedIds.length} selected products?`}
            </p>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setActionModal({ type: null })}
                className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              {actionModal.type === "archive" && (
                <button
                  type="button"
                  onClick={handleConfirmArchive}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-zinc-700 hover:bg-zinc-800"
                >
                  Confirm Archive
                </button>
              )}

              {actionModal.type === "delete" && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700"
                >
                  Delete Permanently
                </button>
              )}

              {actionModal.type === "bulk-archive" && (
                <button
                  type="button"
                  onClick={handleConfirmBulkArchive}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-zinc-700 hover:bg-zinc-800"
                >
                  Archive Selected
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
