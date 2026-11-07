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
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

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
    category_id: initialData?.category_id || (categories[0]?.id || ""),
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
    stock_quantity: initialData?.stock_quantity ?? 0,
    low_stock_threshold: initialData?.low_stock_threshold ?? 10,
    status: initialData?.status || "Draft",
    internal_notes: initialData?.internal_notes || "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Client-side quick checks
    if (!formData.product_name.trim()) {
      setErrorMessage("Product name is required.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.sku.trim()) {
      setErrorMessage("SKU is required.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.category_id) {
      setErrorMessage("Please select a category.");
      setIsSubmitting(false);
      return;
    }

    if (formData.purchase_cost < 0 || formData.selling_price < 0) {
      setErrorMessage("Prices cannot be negative.");
      setIsSubmitting(false);
      return;
    }

    if (formData.stock_quantity < 0) {
      setErrorMessage("Stock quantity cannot be negative.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing && initialData) {
        const res = await updateProduct(initialData.id, formData as any);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to update product");
          setIsSubmitting(false);
          return;
        }
        router.push(`/dashboard/products/${initialData.id}`);
      } else {
        const res = await createProduct(formData as any);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to create product");
          setIsSubmitting(false);
          return;
        }
        router.push(`/dashboard/products/${res.data.id}`);
      }
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit: ${initialData?.product_name}` : "Create New Product Listing"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill in all product specifications and tax details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/products"
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          1. Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              required
              value={formData.product_name}
              onChange={handleChange}
              placeholder="e.g. Aura ANC Wireless Studio Headphones"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              SKU / Internal Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              required
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. ELEC-HDPH-001"
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Listing Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed commercial description, marketplace bullet points, specifications..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 2: Pricing */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          2. Pricing & Currency
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Purchase Cost (INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                ₹
              </span>
              <input
                type="number"
                name="purchase_cost"
                step="0.01"
                min="0"
                required
                value={formData.purchase_cost}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Selling Price (INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                ₹
              </span>
              <input
                type="number"
                name="selling_price"
                step="0.01"
                min="0"
                required
                value={formData.selling_price}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900 dark:text-slate-100 shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              disabled
              value="INR (Indian Rupee)"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/20 dark:bg-slate-800/40 text-slate-500 border border-white/40 dark:border-white/10 cursor-not-allowed shadow-xs"
            />
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 3: Physical Details & Dimensions */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          3. Physical Specifications & Dimensions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="space-y-1 col-span-2 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight_value"
                step="0.01"
                min="0"
                value={formData.weight_value}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              <select
                name="weight_unit"
                value={formData.weight_unit}
                onChange={handleChange}
                className="w-20 px-2 py-2 text-xs rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none shadow-xs"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Length
            </label>
            <input
              type="number"
              name="length"
              step="0.1"
              min="0"
              value={formData.length}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Width
            </label>
            <input
              type="number"
              name="width"
              step="0.1"
              min="0"
              value={formData.width}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Height
            </label>
            <input
              type="number"
              name="height"
              step="0.1"
              min="0"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Unit
            </label>
            <select
              name="dimension_unit"
              value={formData.dimension_unit}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none shadow-xs"
            >
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 4: Product Attributes */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          4. Product Attributes (Optional)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Material
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Aluminum, Full Grain Leather"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Colour
            </label>
            <input
              type="text"
              name="colour"
              value={formData.colour}
              onChange={handleChange}
              placeholder="e.g. Midnight Black, Cognac Tan"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Size / Variant
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g. Fits 16-inch, 140x70cm"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 5: Inventory & Thresholds */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          5. Inventory & Stock Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Available Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="stock_quantity"
              min="0"
              step="1"
              required
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Low-Stock Warning Threshold <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="low_stock_threshold"
              min="0"
              step="1"
              required
              value={formData.low_stock_threshold}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
            <p className="text-[11px] text-slate-500">
              An alert is triggered when available stock drops to or below this count.
            </p>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 6: Media & Listing Links (With Image Preview) */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          6. Media & Listing Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Product Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={(e) => {
                  handleChange(e);
                  setPreviewImageFailed(false);
                }}
                placeholder="https://images.unsplash.com/... or CDN link"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Google Drive / Asset Folder Link
              </label>
              <input
                type="url"
                name="drive_url"
                value={formData.drive_url}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Searchable Keywords (Comma separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="anc headphones, studio audio, wireless bluetooth"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Live Image Preview Card */}
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Image Preview
            </span>
            <div className="w-36 h-36 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-sm">
              {formData.image_url && !previewImageFailed ? (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  onError={() => setPreviewImageFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px]">
                    {previewImageFailed ? "Failed to load image" : "No image preview"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 7: Tax Information */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          7. Tax & Compliance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              HSN Code
            </label>
            <input
              type="text"
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleChange}
              placeholder="e.g. 85183000"
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              GST Percentage (%)
            </label>
            <input
              type="number"
              name="gst_percentage"
              min="0"
              max="100"
              step="0.01"
              value={formData.gst_percentage}
              onChange={handleChange}
              placeholder="18"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>
      </LiquidGlassCard>

      {/* Section 8: Status & Internal Notes */}
      <LiquidGlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-white/50 dark:border-white/10 pb-2">
          8. Status & Remarks
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Listing Status <span className="text-rose-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
            >
              <option value="Draft">Draft</option>
              <option value="Ready for Listing">Ready for Listing</option>
              <option value="Listed">Listed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Internal Remarks & Notes
            </label>
            <textarea
              name="internal_notes"
              rows={2}
              value={formData.internal_notes}
              onChange={handleChange}
              placeholder="Private team notes, supplier reorder info, warehouse batch numbers..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>
      </LiquidGlassCard>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/dashboard/products"
          className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}</span>
        </button>
      </div>
    </form>
  );
}

