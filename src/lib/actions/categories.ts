"use server";

import { createClient } from "@/lib/supabase/server";
import { categorySchema, CategoryFormValues } from "@/lib/validations/product";
import { Category } from "@/types";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/lib/seed-data";
import { revalidatePath } from "next/cache";

let memoryCategories: Category[] = [...INITIAL_CATEGORIES];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder") && !url.includes("innovexa-demo"));
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: categories, error } = await supabase
          .from("categories")
          .select("*, products(id)")
          .eq("user_id", user.id)
          .order("name", { ascending: true });

        if (!error && categories) {
          return categories.map((c: {
            id: string;
            user_id: string;
            name: string;
            description?: string | null;
            created_at: string;
            updated_at: string;
            products?: { id: string }[];
          }) => ({
            id: c.id,
            user_id: c.user_id,
            name: c.name,
            description: c.description,
            created_at: c.created_at,
            updated_at: c.updated_at,
            product_count: c.products ? c.products.length : 0,
          }));
        }
      }
    }
  } catch (err) {
    console.warn("Supabase getCategories fallback:", err);
  }

  // Count products for each memory category
  return memoryCategories.map((c) => ({
    ...c,
    product_count: INITIAL_PRODUCTS.filter((p) => p.category_id === c.id && p.status !== "Archived").length,
  }));
}

export async function createCategory(rawData: CategoryFormValues) {
  const validated = categorySchema.parse(rawData);

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("categories")
          .insert({
            name: validated.name,
            description: validated.description,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          if (error.code === "23505") {
            return { success: false, error: "A category with this name already exists." };
          }
          throw error;
        }

        revalidatePath("/dashboard/categories");
        revalidatePath("/dashboard/products/new");
        return { success: true, data };
      }
    }
  } catch (err: unknown) {
    console.warn("Supabase createCategory fallback:", err);
  }

  const existing = memoryCategories.find(
    (c) => c.name.toLowerCase() === validated.name.toLowerCase()
  );
  if (existing) {
    return { success: false, error: "A category with this name already exists." };
  }

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    user_id: "demo-user",
    name: validated.name,
    description: validated.description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 0,
  };

  memoryCategories.push(newCat);
  revalidatePath("/dashboard/categories");
  return { success: true, data: newCat };
}

export async function updateCategory(id: string, rawData: CategoryFormValues) {
  const validated = categorySchema.parse(rawData);

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("categories")
          .update({
            name: validated.name,
            description: validated.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;

        revalidatePath("/dashboard/categories");
        return { success: true, data };
      }
    }
  } catch (err) {
    console.warn("Supabase updateCategory fallback:", err);
  }

  const idx = memoryCategories.findIndex((c) => c.id === id);
  if (idx === -1) return { success: false, error: "Category not found" };

  memoryCategories[idx] = {
    ...memoryCategories[idx],
    name: validated.name,
    description: validated.description,
    updated_at: new Date().toISOString(),
  };

  revalidatePath("/dashboard/categories");
  return { success: true, data: memoryCategories[idx] };
}

export async function deleteCategory(id: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if any product is assigned to this category
        const { count } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("category_id", id)
          .eq("user_id", user.id);

        if (count && count > 0) {
          return {
            success: false,
            error: `Cannot delete: ${count} product(s) are assigned to this category. Please reassign them first.`,
          };
        }

        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        revalidatePath("/dashboard/categories");
        return { success: true };
      }
    }
  } catch (err) {
    console.warn("Supabase deleteCategory fallback:", err);
  }

  const assignedCount = INITIAL_PRODUCTS.filter(
    (p) => p.category_id === id && p.status !== "Archived"
  ).length;

  if (assignedCount > 0) {
    return {
      success: false,
      error: `Cannot delete: ${assignedCount} active product(s) belong to this category.`,
    };
  }

  memoryCategories = memoryCategories.filter((c) => c.id !== id);
  revalidatePath("/dashboard/categories");
  return { success: true };
}

