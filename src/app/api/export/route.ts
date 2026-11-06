import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/actions/products";
import { Product } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const includeArchived = searchParams.get("includeArchived") === "true";

  const { products } = await getProducts({
    status,
    category,
    search,
    includeArchived,
    limit: 10000,
  });

  const headers = [
    "SKU",
    "Product Name",
    "Category",
    "Status",
    "Purchase Cost (INR)",
    "Selling Price (INR)",
    "Stock Quantity",
    "Low Stock Threshold",
    "Weight Value",
    "Weight Unit",
    "Length",
    "Width",
    "Height",
    "Dimension Unit",
    "Material",
    "Colour",
    "Size",
    "HSN Code",
    "GST Percentage",
    "Keywords",
    "Image URL",
    "Drive URL",
    "Internal Notes",
    "Created Date",
  ];

  const rows = products.map((p: Product) => [
    escapeCsv(p.sku),
    escapeCsv(p.product_name),
    escapeCsv(p.category?.name || "Uncategorized"),
    escapeCsv(p.status),
    p.purchase_cost.toFixed(2),
    p.selling_price.toFixed(2),
    p.stock_quantity.toString(),
    p.low_stock_threshold.toString(),
    p.weight_value.toString(),
    escapeCsv(p.weight_unit),
    p.length.toString(),
    p.width.toString(),
    p.height.toString(),
    escapeCsv(p.dimension_unit),
    escapeCsv(p.material || ""),
    escapeCsv(p.colour || ""),
    escapeCsv(p.size || ""),
    escapeCsv(p.hsn_code || ""),
    p.gst_percentage.toString(),
    escapeCsv(p.keywords || ""),
    escapeCsv(p.image_url || ""),
    escapeCsv(p.drive_url || ""),
    escapeCsv(p.internal_notes || ""),
    new Date(p.created_at).toISOString().split("T")[0],
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const filename = `innovexa-products-export-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function escapeCsv(str: string): string {
  if (!str) return '""';
  const clean = str.replace(/"/g, '""');
  return `"${clean}"`;
}
