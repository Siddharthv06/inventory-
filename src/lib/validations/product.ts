import { z } from "zod";

export const productSchema = z.object({
  product_name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name cannot exceed 255 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(100, "SKU cannot exceed 100 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "SKU can only contain letters, numbers, hyphens, and underscores"),
  category_id: z
    .string()
    .min(1, "Category is required"),
  purchase_cost: z
    .coerce
    .number()
    .min(0, "Purchase cost cannot be negative"),
  selling_price: z
    .coerce
    .number()
    .min(0, "Selling price cannot be negative"),
  currency: z.string().default("INR"),
  weight_value: z
    .coerce
    .number()
    .min(0, "Weight cannot be negative")
    .default(0),
  weight_unit: z.enum(["g", "kg"]).default("g"),
  length: z
    .coerce
    .number()
    .min(0, "Length cannot be negative")
    .default(0),
  width: z
    .coerce
    .number()
    .min(0, "Width cannot be negative")
    .default(0),
  height: z
    .coerce
    .number()
    .min(0, "Height cannot be negative")
    .default(0),
  dimension_unit: z.enum(["cm", "mm", "in"]).default("cm"),
  material: z.string().optional().nullable(),
  colour: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  image_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  drive_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  hsn_code: z.string().optional().nullable(),
  gst_percentage: z
    .coerce
    .number()
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100%")
    .default(18),
  stock_quantity: z
    .coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .default(0),
  low_stock_threshold: z
    .coerce
    .number()
    .int("Threshold must be a whole number")
    .min(0, "Threshold cannot be negative")
    .default(10),
  status: z.enum(["Draft", "Ready for Listing", "Listed", "Archived"]).default("Draft"),
  internal_notes: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
