"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Package,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { LiquidGlassContainer } from "@/components/ui/liquid-glass-container";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [modalState, setModalState] = useState<{
    type: "create" | "edit" | "delete" | null;
    category?: Category;
  }>({ type: null });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setName("");
    setDescription("");
    setError(null);
    setModalState({ type: "create" });
  };

  const openEdit = (cat: Category) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setError(null);
    setModalState({ type: "edit", category: cat });
  };

  const openDelete = (cat: Category) => {
    setError(null);
    setModalState({ type: "delete", category: cat });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (modalState.type === "create") {
      const res = await createCategory({ name, description });
      if (!res.success) {
        setError(res.error || "Failed to create category");
        setIsSubmitting(false);
        return;
      }
    } else if (modalState.type === "edit" && modalState.category) {
      const res = await updateCategory(modalState.category.id, { name, description });
      if (!res.success) {
        setError(res.error || "Failed to update category");
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setModalState({ type: null });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!modalState.category) return;
    setIsSubmitting(true);
    setError(null);

    const res = await deleteCategory(modalState.category.id);
    if (!res.success) {
      setError(res.error || "Failed to delete category");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setModalState({ type: null });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Organize products into hierarchical marketplace departments.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <LiquidGlassContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <LiquidGlassCard
            key={cat.id}
            className="p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {cat.product_count ?? 0} SKUs
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {cat.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {cat.description || "No description provided."}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
              <Link
                href={`/dashboard/products?category=${cat.id}`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View Products</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  title="Edit category"
                  className="p-1.5 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openDelete(cat)}
                  title="Delete category"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </LiquidGlassCard>
        ))}
      </LiquidGlassContainer>

      {/* Modal for Create/Edit */}
      {(modalState.type === "create" || modalState.type === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {modalState.type === "create" ? "Create New Category" : "Edit Category"}
            </h3>

            {error && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smart Home & Lighting"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Department scope, product classification rules..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalState({ type: null })}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalState.type === "delete" && modalState.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Delete Category
            </h3>

            {error ? (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Are you sure you want to delete &ldquo;{modalState.category.name}&rdquo;? Categories with active products assigned cannot be deleted.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setModalState({ type: null })}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
              {!error && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDelete}
                  className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Confirm Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

