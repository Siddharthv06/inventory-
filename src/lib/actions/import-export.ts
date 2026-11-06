"use server";

import { Product, ProductStatus } from "@/types";
import { INITIAL_CATEGORIES } from "@/lib/seed-data";
import { createProduct, getProducts } from "@/lib/actions/products";
import { revalidatePath } from "next/cache";

export interface ParsedCsvRow {
  rowNumber: number;
  data: Partial<Product>;
  isValid: boolean;
  errors: string[];
}

export interface ImportPreviewResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ParsedCsvRow[];
}

export async function parseAndValidateCsv(csvText: string): Promise<ImportPreviewResult> {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      rows: [],
    };
  }

  // Parse header
  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine).map((h) => h.trim().toLowerCase());

  // Existing SKUs
  const { products: existingProds } = await getProducts({ limit: 1000, includeArchived: true });
  const existingSkuSet = new Set(existingProds.map((p) => p.sku.toLowerCase()));
  const seenInFileSkus = new Set<string>();

  const rows: ParsedCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseCsvLine(lines[i]);
    if (rawCols.length === 0 || rawCols.every((c) => c.trim() === "")) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = rawCols[idx]?.trim() || "";
    });

    const errors: string[] = [];
    const sku = (rowObj["sku"] || rowObj["product code"] || "").trim();
    const name = (rowObj["product name"] || rowObj["name"] || "").trim();
    const categoryName = (rowObj["category"] || "").trim();

    if (!name) errors.push("Product name is required");
    if (!sku) {
      errors.push("SKU is required");
    } else {
      if (seenInFileSkus.has(sku.toLowerCase())) {
        errors.push(`Duplicate SKU "${sku}" repeated in CSV file`);
      }
      if (existingSkuSet.has(sku.toLowerCase())) {
        errors.push(`SKU "${sku}" already exists in your workspace`);
      }
      seenInFileSkus.add(sku.toLowerCase());
    }

    const purchaseCost = parseFloat(rowObj["purchase cost"] || rowObj["cost"] || "0");
    if (isNaN(purchaseCost) || purchaseCost < 0) errors.push("Purchase cost must be a non-negative number");

    const sellingPrice = parseFloat(rowObj["selling price"] || rowObj["price"] || "0");
    if (isNaN(sellingPrice) || sellingPrice < 0) errors.push("Selling price must be a non-negative number");

    const stock = parseInt(rowObj["stock quantity"] || rowObj["stock"] || "0", 10);
    if (isNaN(stock) || stock < 0) errors.push("Stock quantity must be a non-negative integer");

    const statusVal = rowObj["status"] || "Draft";
    const validStatuses = ["Draft", "Ready for Listing", "Listed", "Archived"];
    const status = validStatuses.includes(statusVal) ? statusVal : "Draft";

    // Match or create category
    const matchedCat = INITIAL_CATEGORIES.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    const categoryId = matchedCat ? matchedCat.id : INITIAL_CATEGORIES[0].id;

    const parsedData: Partial<Product> = {
      product_name: name,
      sku,
      category_id: categoryId,
      purchase_cost: purchaseCost,
      selling_price: sellingPrice,
      currency: "INR",
      stock_quantity: stock,
      low_stock_threshold: parseInt(rowObj["low stock threshold"] || "10", 10) || 10,
      status: status as ProductStatus,
      weight_value: parseFloat(rowObj["weight"] || "0") || 0,
      weight_unit: (rowObj["weight unit"]?.toLowerCase() === "kg" ? "kg" : "g"),
      length: parseFloat(rowObj["length"] || "0") || 0,
      width: parseFloat(rowObj["width"] || "0") || 0,
      height: parseFloat(rowObj["height"] || "0") || 0,
      dimension_unit: "cm",
      material: rowObj["material"] || "",
      colour: rowObj["colour"] || rowObj["color"] || "",
      size: rowObj["size"] || "",
      description: rowObj["description"] || "",
      keywords: rowObj["keywords"] || "",
      hsn_code: rowObj["hsn code"] || rowObj["hsn"] || "",
      gst_percentage: parseFloat(rowObj["gst"] || rowObj["gst %"] || "18") || 18,
      internal_notes: rowObj["notes"] || rowObj["internal remarks"] || "Imported via CSV",
    };

    rows.push({
      rowNumber: i,
      data: parsedData,
      isValid: errors.length === 0,
      errors,
    });
  }

  const validRows = rows.filter((r) => r.isValid).length;
  const invalidRows = rows.filter((r) => !r.isValid).length;

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    rows,
  };
}

export async function executeCsvImport(validItems: Partial<Product>[]) {
  let importedCount = 0;
  const errors: string[] = [];

  for (const item of validItems) {
    try {
      const res = await createProduct({
        product_name: item.product_name!,
        sku: item.sku!,
        category_id: item.category_id || INITIAL_CATEGORIES[0].id,
        purchase_cost: item.purchase_cost || 0,
        selling_price: item.selling_price || 0,
        currency: "INR",
        stock_quantity: item.stock_quantity || 0,
        low_stock_threshold: item.low_stock_threshold || 10,
        status: item.status || "Draft",
        weight_value: item.weight_value || 0,
        weight_unit: item.weight_unit || "g",
        length: item.length || 0,
        width: item.width || 0,
        height: item.height || 0,
        dimension_unit: item.dimension_unit || "cm",
        material: item.material || "",
        colour: item.colour || "",
        size: item.size || "",
        description: item.description || "",
        keywords: item.keywords || "",
        hsn_code: item.hsn_code || "",
        gst_percentage: item.gst_percentage || 18,
        internal_notes: item.internal_notes || "Imported via CSV",
      });

      if (res.success) {
        importedCount++;
      } else {
        errors.push(`Failed for SKU ${item.sku}: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Error on SKU ${item.sku}: ${msg}`);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  return {
    success: importedCount > 0,
    importedCount,
    errors,
  };
}

// Utility to parse standard CSV line with quoted values support
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

