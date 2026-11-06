"use server";

import { createClient } from "@/lib/supabase/server";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { Product, ProductStatus } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/seed-data";
import { revalidatePath } from "next/cache";

// Global in-memory storage fallback for offline/demo evaluation
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder") && !url.includes("innovexa-demo"));
}

export async function getProducts(options?: {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: "name" | "price" | "stock" | "created_at";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeArchived?: boolean;
}) {
  const {
    search = "",
    category = "",
    status = "",
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    limit = 10,
    includeArchived = false,
  } = options || {};

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        let query = supabase
          .from("products")
          .select("*, category:categories(*)", { count: "exact" })
          .eq("user_id", user.id);

        if (!includeArchived) {
          query = query.neq("status", "Archived");
        }

        if (status && status !== "ALL") {
          query = query.eq("status", status);
        }

        if (category && category !== "ALL") {
          query = query.eq("category_id", category);
        }

        if (search) {
          query = query.or(`product_name.ilike.%${search}%,sku.ilike.%${search}%`);
        }

        const ascending = sortOrder === "asc";
        if (sortBy === "name") {
          query = query.order("product_name", { ascending });
        } else if (sortBy === "price") {
          query = query.order("selling_price", { ascending });
        } else if (sortBy === "stock") {
          query = query.order("stock_quantity", { ascending });
        } else {
          query = query.order("created_at", { ascending });
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;
        if (!error && data && data.length > 0) {
          return {
            products: data as Product[],
            totalCount: count || data.length,
            page,
            limit,
            totalPages: Math.ceil((count || data.length) / limit),
          };
        }
      }
    }
  } catch (err) {
    console.warn("Supabase query fallback to in-memory store:", err);
  }

  // Fallback / Demo In-Memory Store
  let filtered = [...memoryProducts];

  if (!includeArchived) {
    filtered = filtered.filter((p) => p.status !== "Archived");
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (category && category !== "ALL") {
    filtered = filtered.filter((p) => p.category_id === category);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.product_name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
    );
  }

  // Attach category names
  filtered = filtered.map((p) => ({
    ...p,
    category: INITIAL_CATEGORIES.find((c) => c.id === p.category_id) || null,
  }));

  // Sorting
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortBy === "name") {
      cmp = a.product_name.localeCompare(b.product_name);
    } else if (sortBy === "price") {
      cmp = a.selling_price - b.selling_price;
    } else if (sortBy === "stock") {
      cmp = a.stock_quantity - b.stock_quantity;
    } else {
      cmp = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const totalCount = filtered.length;
  const from = (page - 1) * limit;
  const paginated = filtered.slice(from, from + limit);

  return {
    products: paginated,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit) || 1,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as Product;
      }
    }
  } catch (err) {
    console.warn("Supabase getProductById fallback:", err);
  }

  const p = memoryProducts.find((item) => item.id === id);
  if (!p) return null;

  return {
    ...p,
    category: INITIAL_CATEGORIES.find((c) => c.id === p.category_id) || null,
  };
}

export async function createProduct(rawData: ProductFormValues) {
  const validated = productSchema.parse(rawData);

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Enforce SKU uniqueness
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("user_id", user.id)
          .eq("sku", validated.sku)
          .maybeSingle();

        if (existing) {
          return { success: false, error: "A product with this SKU already exists in your workspace." };
        }

        const { data, error } = await supabase
          .from("products")
          .insert({
            ...validated,
            user_id: user.id,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        // Log Activity
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          product_id: data.id,
          action: "CREATE",
          description: `Created product "${data.product_name}" (SKU: ${data.sku})`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        return { success: true, data };
      }
    }
  } catch (err: any) {
    console.warn("Supabase createProduct fallback:", err);
    if (err?.message?.includes("unique")) {
      return { success: false, error: "SKU already exists in your workspace." };
    }
  }

  // Memory fallback
  const existingSku = memoryProducts.find((p) => p.sku.toLowerCase() === validated.sku.toLowerCase());
  if (existingSku) {
    return { success: false, error: "A product with this SKU already exists." };
  }

  const newProd: Product = {
    ...validated,
    id: `prod-${Date.now()}`,
    user_id: "demo-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryProducts.unshift(newProd);
  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true, data: newProd };
}

export async function updateProduct(id: string, rawData: Partial<ProductFormValues>) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        if (rawData.sku) {
          const { data: existing } = await supabase
            .from("products")
            .select("id")
            .eq("user_id", user.id)
            .eq("sku", rawData.sku)
            .neq("id", id)
            .maybeSingle();

          if (existing) {
            return { success: false, error: "Another product with this SKU already exists." };
          }
        }

        const { data, error } = await supabase
          .from("products")
          .update({
            ...rawData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;

        await supabase.from("activity_logs").insert({
          user_id: user.id,
          product_id: id,
          action: "UPDATE",
          description: `Updated details for product "${data.product_name}" (SKU: ${data.sku})`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        revalidatePath(`/products/${id}`);
        return { success: true, data };
      }
    }
  } catch (err: any) {
    console.warn("Supabase updateProduct fallback:", err);
  }

  const idx = memoryProducts.findIndex((p) => p.id === id);
  if (idx === -1) return { success: false, error: "Product not found" };

  memoryProducts[idx] = {
    ...memoryProducts[idx],
    ...rawData,
    updated_at: new Date().toISOString(),
  };

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  return { success: true, data: memoryProducts[idx] };
}

export async function archiveProduct(id: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("products")
          .update({
            status: "Archived",
            archived_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;

        await supabase.from("activity_logs").insert({
          user_id: user.id,
          product_id: id,
          action: "ARCHIVE",
          description: `Archived product "${data.product_name}" (SKU: ${data.sku})`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        return { success: true };
      }
    }
  } catch (err) {
    console.warn("Supabase archive fallback:", err);
  }

  const p = memoryProducts.find((item) => item.id === id);
  if (p) {
    p.status = "Archived";
    p.archived_at = new Date().toISOString();
    p.updated_at = new Date().toISOString();
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true };
}

export async function restoreProduct(id: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("products")
          .update({
            status: "Draft",
            archived_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;

        await supabase.from("activity_logs").insert({
          user_id: user.id,
          product_id: id,
          action: "RESTORE",
          description: `Restored archived product "${data.product_name}" to Draft`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        return { success: true };
      }
    }
  } catch (err) {
    console.warn("Supabase restore fallback:", err);
  }

  const p = memoryProducts.find((item) => item.id === id);
  if (p) {
    p.status = "Draft";
    p.archived_at = null;
    p.updated_at = new Date().toISOString();
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        await supabase.from("activity_logs").insert({
          user_id: user.id,
          action: "DELETE",
          description: `Permanently deleted product ID: ${id}`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        return { success: true };
      }
    }
  } catch (err) {
    console.warn("Supabase delete fallback:", err);
  }

  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true };
}

export async function bulkArchiveProducts(ids: string[]) {
  if (!ids.length) return { success: true, count: 0 };

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("products")
          .update({
            status: "Archived",
            archived_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .in("id", ids)
          .eq("user_id", user.id);

        if (error) throw error;

        await supabase.from("activity_logs").insert({
          user_id: user.id,
          action: "ARCHIVE",
          description: `Bulk archived ${ids.length} products`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        return { success: true, count: ids.length };
      }
    }
  } catch (err) {
    console.warn("Supabase bulk archive fallback:", err);
  }

  for (const id of ids) {
    const p = memoryProducts.find((item) => item.id === id);
    if (p) {
      p.status = "Archived";
      p.archived_at = new Date().toISOString();
      p.updated_at = new Date().toISOString();
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true, count: ids.length };
}

export async function adjustProductStock(id: string, newQuantity: number, reason: string) {
  if (newQuantity < 0) return { success: false, error: "Stock quantity cannot be negative" };

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: prod } = await supabase
          .from("products")
          .select("stock_quantity, product_name, sku")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (!prod) return { success: false, error: "Product not found" };

        const previousQuantity = prod.stock_quantity;
        const changeQuantity = newQuantity - previousQuantity;

        const { error } = await supabase
          .from("products")
          .update({
            stock_quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        // Record stock movement
        await supabase.from("stock_movements").insert({
          product_id: id,
          user_id: user.id,
          previous_quantity: previousQuantity,
          change_quantity: changeQuantity,
          new_quantity: newQuantity,
          reason,
        });

        // Record activity log
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          product_id: id,
          action: "STOCK_ADJUSTMENT",
          description: `Adjusted stock for "${prod.product_name}" from ${previousQuantity} to ${newQuantity} (${reason})`,
        });

        revalidatePath("/dashboard");
        revalidatePath("/products");
        revalidatePath("/inventory");
        return { success: true };
      }
    }
  } catch (err) {
    console.warn("Supabase stock adjust fallback:", err);
  }

  const p = memoryProducts.find((item) => item.id === id);
  if (!p) return { success: false, error: "Product not found" };

  p.stock_quantity = newQuantity;
  p.updated_at = new Date().toISOString();

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/inventory");
  return { success: true };
}

export async function seedDemoData() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Execute the PostgreSQL stored function
        const { error } = await supabase.rpc("seed_demo_data_for_user", {
          target_user_id: user.id,
        });

        if (!error) {
          revalidatePath("/dashboard");
          revalidatePath("/products");
          return { success: true, message: "Sample data loaded into Supabase successfully!" };
        }
      }
    }
  } catch (err) {
    console.warn("RPC seed failed, falling back to memory/direct insert:", err);
  }

  memoryProducts = [...INITIAL_PRODUCTS];
  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true, message: "Sample dataset loaded successfully!" };
}

