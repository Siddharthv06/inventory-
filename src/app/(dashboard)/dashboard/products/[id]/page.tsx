import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, archiveProduct, restoreProduct, deleteProduct } from "@/lib/actions/products";
import { formatCurrencyINR, formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Package,
  ExternalLink,
  Layers,
  Tag,
  Scale,
  Maximize2,
  AlertTriangle,
  FolderOpen,
  Calendar,
  Clock,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { StockAdjustmentDialog } from "@/components/products/stock-adjustment-dialog";

export const metadata = {
  title: "Product Details | Innovexa",
};

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Margin calculation
  const marginAmount = product.selling_price - product.purchase_cost;
  const marginPercent =
    product.selling_price > 0 ? Math.round((marginAmount / product.selling_price) * 100) : 0;

  const isLowStock = product.stock_quantity <= product.low_stock_threshold;
  const isOutOfStock = product.stock_quantity === 0;

  const statusStyles: Record<string, string> = {
    Listed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    "Ready for Listing": "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    Archived: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {product.sku}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                  statusStyles[product.status] || ""
                }`}
              >
                {product.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {product.product_name}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <StockAdjustmentDialog
            productId={product.id}
            productName={product.product_name}
            currentStock={product.stock_quantity}
          />

          <Link
            href={`/dashboard/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
          >
            <Edit2 className="w-4 h-4 text-amber-500" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Image & Fast Specs) */}
        <div className="space-y-6">
          {/* Product Image Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-full aspect-square rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <span className="text-xs">No product image uploaded</span>
                </div>
              )}
            </div>

            {product.image_url && (
              <div className="mt-3 text-center">
                <a
                  href={product.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Resolution Image</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Drive Asset Link */}
          {product.drive_url && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Google Drive Folder
                  </h2>
                  <p className="text-[11px] text-slate-500">Master product media & raw shots</p>
                </div>
              </div>
              <a
                href={product.drive_url}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Metadata & Timestamps */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Created
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(product.created_at)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Last Updated
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDateTime(product.updated_at)}
              </span>
            </div>
            {product.archived_at && (
              <div className="flex items-center justify-between text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Archive className="w-3.5 h-3.5" /> Archived
                </span>
                <span className="font-medium">{formatDate(product.archived_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns (Pricing, Stock, Specifications, Remarks) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing & Commercial Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-blue-500" /> Pricing & Profitability
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
                <span className="text-xs text-slate-500 block">Selling Price</span>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrencyINR(product.selling_price)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">MSRP on Marketplaces</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
                <span className="text-xs text-slate-500 block">Purchase Cost</span>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrencyINR(product.purchase_cost)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Procurement / Unit Cost</span>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 block">Gross Margin</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {marginPercent}%
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 block mt-0.5">
                  +{formatCurrencyINR(marginAmount)} per unit
                </span>
              </div>
            </div>
          </div>

          {/* Inventory & Stock Health Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-500" /> Inventory & Warehousing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Stock Available</span>
                  <span
                    className={`text-2xl font-bold ${
                      isOutOfStock
                        ? "text-rose-600 dark:text-rose-400"
                        : isLowStock
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {product.stock_quantity} units
                  </span>
                </div>
                {isLowStock && (
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                      isOutOfStock
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {isOutOfStock ? "Out of Stock" : "Low Stock"}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
                <span className="text-xs text-slate-500 block">Reorder Alert Threshold</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {product.low_stock_threshold} units
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Notification triggers when stock ≤ {product.low_stock_threshold}
                </span>
              </div>
            </div>
          </div>

          {/* Physical Specifications & Attributes */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-sky-500" /> Physical Specifications & Attributes
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.category?.name || "Uncategorized"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Weight</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.weight_value} {product.weight_unit}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Dimensions (L×W×H)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.length} × {product.width} × {product.height} {product.dimension_unit}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Material</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.material || "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Colour</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.colour || "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Size / Variant</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.size || "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">HSN Code</span>
                <span className="font-semibold font-mono text-slate-900 dark:text-slate-100">
                  {product.hsn_code || "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">GST Rate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product.gst_percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Description & Search Keywords */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-500" /> Listing Description & SEO Copy
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description || "No description provided for this listing."}
            </p>

            {product.keywords && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Search Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.keywords.split(",").map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          {product.internal_notes && (
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                Internal Remarks:
              </span>
              <p className="text-amber-900 dark:text-amber-200">{product.internal_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

