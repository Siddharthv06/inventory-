"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, Product } from "@/types";
import { createProduct, updateProduct } from "@/lib/actions/products";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  categories: Category[];
  initialData?: Product;
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    product_name: initialData?.product_name || "",
    sku: initialData?.sku || "",
    category_id: initialData?.category_id || categories[0]?.id || "",
    description: initialData?.description || "",
    purchase_cost: initialData?.purchase_cost ?? 0,
    selling_price: initialData?.selling_price ?? 0,
    currency: "INR",
    weight_value: initialData?.weight_value ?? 0,
    weight_unit: initialData?.weight_unit || "g",
    length: initialData?.length ?? 0,
    width: initialData?.width ?? 0,
    height: initialData?.height ?? 0,
    dimension_unit: initialData?.dimension_unit || "cm",
    material: initialData?.material || "",
    colour: initialData?.colour || "",
    size: initialData?.size || "",
    keywords: initialData?.keywords || "",
    image_url: initialData?.image_url || "",
    drive_url: initialData?.drive_url || "",
    hsn_code: initialData?.hsn_code || "",
    gst_percentage: initialData?.gst_percentage ?? 18,
    stock_quantity: initialData?.stock_quantity ?? 10,
    low_stock_threshold: initialData?.low_stock_threshold ?? 5,
    status: initialData?.status || "Listed",
    internal_notes: initialData?.internal_notes || "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImageFailed, setPreviewImageFailed] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  // 1-Click Auto-generate SKU
  const handleGenerateSku = () => {
    const prefix = formData.product_name
      ? formData.product_name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase()
      : "PRD";
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formData.product_name.trim()) {
      setErrorMessage("Please enter a product name.");
      setIsSubmitting(false);
      return;
    }

    // Auto-generate SKU if blank
    let finalSku = formData.sku.trim();
    if (!finalSku) {
      const prefix = formData.product_name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "PRD";
      finalSku = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const payload = {
      ...formData,
      sku: finalSku,
      purchase_cost:
        formData.purchase_cost > 0
          ? formData.purchase_cost
          : Math.round(Number(formData.selling_price) * 0.7),
      category_id: formData.category_id || categories[0]?.id || "",
    };

    try {
      if (isEditing && initialData) {
        const res = await updateProduct(initialData.id, payload as any);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to update product");
          setIsSubmitting(false);
          return;
        }
        router.push(`/dashboard/products/${initialData.id}`);
      } else {
        const res = await createProduct(payload as any);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to create product");
          setIsSubmitting(false);
          return;
        }
        router.push(`/dashboard/products`);
      }
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit: ${initialData?.product_name}` : "Add New Product"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simple & fast product listing entry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/products"
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN SIMPLE CARD: Essential Fields */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#181a20] border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Core Details
        </h2>

        {/* Product Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="product_name"
            required
            value={formData.product_name}
            onChange={handleChange}
            placeholder="e.g. Wireless Ergonomic Keyboard"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Listing Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Listed">Listed (Active)</option>
              <option value="Ready for Listing">Ready for Listing</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* SKU with Auto-Generate Helper */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              SKU Code
            </label>
            <button
              type="button"
              onClick={handleGenerateSku}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-generate
            </button>
          </div>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. KEYB-1002 (or leave empty to auto-fill)"
            className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
          />
        </div>

        {/* Pricing & Stock Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Selling Price (INR ₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                ₹
              </span>
              <input
                type="number"
                name="selling_price"
                step="0.01"
                min="0"
                required
                value={formData.selling_price || ""}
                onChange={handleChange}
                placeholder="2499"
                className="w-full pl-8 pr-4 py-2.5 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Initial Stock Units <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="stock_quantity"
              min="0"
              required
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="50"
              className="w-full px-4 py-2.5 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Product Image URL & Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Image URL <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={(e) => {
                setPreviewImageFailed(false);
                handleChange(e);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.image_url && !previewImageFailed ? (
              <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  onError={() => setPreviewImageFailed(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OPTIONAL / ADVANCED ACCORDION: Keeps form compact by default */}
      <div className="rounded-3xl bg-white dark:bg-[#181a20] border border-slate-200/70 dark:border-slate-800 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
              Additional Details (Optional)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Description, cost price, dimensions, and notes
            </span>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Listing Description
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Product highlights, specifications, or box contents..."
                className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Purchase Cost & Threshold */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Purchase Cost (INR ₹)
                </label>
                <input
                  type="number"
                  name="purchase_cost"
                  min="0"
                  step="0.01"
                  value={formData.purchase_cost || ""}
                  onChange={handleChange}
                  placeholder="Defaults to 70% of price"
                  className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  min="0"
                  value={formData.low_stock_threshold}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Material & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g. Aluminium"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Colour
                </label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleChange}
                  placeholder="e.g. Space Gray"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Weight (g)
                </label>
                <input
                  type="number"
                  name="weight_value"
                  min="0"
                  value={formData.weight_value || ""}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Internal Team Notes
              </label>
              <textarea
                name="internal_notes"
                rows={2}
                value={formData.internal_notes}
                onChange={handleChange}
                placeholder="Private supplier notes or warehouse locations..."
                className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/dashboard/products"
          className="px-5 py-2.5 text-sm font-semibold rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}</span>
        </button>
      </div>
    </form>
  );
}
