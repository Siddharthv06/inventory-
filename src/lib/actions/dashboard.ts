"use server";

import { createClient, getAuthUser } from "@/lib/supabase/server";
import { DashboardStats, Product, ActivityLog } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ACTIVITIES } from "@/lib/seed-data";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder") && !url.includes("innovexa-demo"));
}

export async function getDashboardData() {
  try {
    if (isSupabaseConfigured()) {
      const user = await getAuthUser();

      if (user) {
        const supabase = await createClient();
        // Fetch all user products
        const { data: products, error } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .eq("user_id", user.id);

        // Fetch recent activities
        const { data: activities } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6);

        if (!error && products && products.length > 0) {
          const typedProducts = products as Product[];
          const stats = calculateStats(typedProducts);
          const lowStockProducts = typedProducts.filter(
            (p) => p.status !== "Archived" && p.stock_quantity <= p.low_stock_threshold
          );
          const recentProducts = [...typedProducts]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

          return {
            stats,
            lowStockProducts,
            recentProducts,
            recentActivities: (activities || []) as ActivityLog[],
          };
        }
      }
    }
  } catch (err) {
    console.warn("Supabase getDashboardData fallback:", err);
  }

  // Fallback to sample seed data
  const stats = calculateStats(INITIAL_PRODUCTS);
  const lowStockProducts = INITIAL_PRODUCTS.filter(
    (p) => p.status !== "Archived" && p.stock_quantity <= p.low_stock_threshold
  ).map((p) => ({
    ...p,
    category: INITIAL_CATEGORIES.find((c) => c.id === p.category_id) || null,
  }));

  const recentProducts = [...INITIAL_PRODUCTS]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((p) => ({
      ...p,
      category: INITIAL_CATEGORIES.find((c) => c.id === p.category_id) || null,
    }));

  return {
    stats,
    lowStockProducts,
    recentProducts,
    recentActivities: INITIAL_ACTIVITIES,
  };
}

function calculateStats(products: Product[]): DashboardStats {
  const activeProducts = products.filter((p) => p.status !== "Archived");

  const totalProducts = activeProducts.length;
  const activeListings = activeProducts.filter((p) => p.status === "Listed").length;
  const readyForListing = activeProducts.filter((p) => p.status === "Ready for Listing").length;
  const draftCount = activeProducts.filter((p) => p.status === "Draft").length;
  const archivedCount = products.filter((p) => p.status === "Archived").length;

  const totalUnits = activeProducts.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const lowStockCount = activeProducts.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
  ).length;
  const outOfStockCount = activeProducts.filter((p) => p.stock_quantity === 0).length;

  const totalPurchaseValue = activeProducts.reduce(
    (sum, p) => sum + (p.purchase_cost || 0) * (p.stock_quantity || 0),
    0
  );

  const totalSellingValue = activeProducts.reduce(
    (sum, p) => sum + (p.selling_price || 0) * (p.stock_quantity || 0),
    0
  );

  return {
    totalProducts,
    activeListings,
    readyForListing,
    totalUnits,
    lowStockCount,
    outOfStockCount,
    totalPurchaseValue,
    totalSellingValue,
    draftCount,
    archivedCount,
  };
}

export async function getReportsData() {
  const { stats, recentProducts } = await getDashboardData();
  const products = INITIAL_PRODUCTS;
  const categories = INITIAL_CATEGORIES;

  // Category Breakdown
  const categoryStats = categories.map((cat) => {
    const prods = products.filter((p) => p.category_id === cat.id && p.status !== "Archived");
    const count = prods.length;
    const units = prods.reduce((sum, p) => sum + p.stock_quantity, 0);
    const value = prods.reduce((sum, p) => sum + p.purchase_cost * p.stock_quantity, 0);
    return {
      name: cat.name,
      count,
      units,
      value,
    };
  });

  // Status Breakdown
  const statusStats = [
    { name: "Listed", count: stats.activeListings, color: "#10B981" },
    { name: "Ready for Listing", count: stats.readyForListing, color: "#F59E0B" },
    { name: "Draft", count: stats.draftCount, color: "#64748B" },
    { name: "Archived", count: stats.archivedCount, color: "#94A3B8" },
  ];

  // Stock Health Distribution
  const stockHealth = [
    { name: "Healthy Stock", count: stats.totalProducts - stats.lowStockCount - stats.outOfStockCount, color: "#10B981" },
    { name: "Low Stock", count: stats.lowStockCount, color: "#F59E0B" },
    { name: "Out of Stock", count: stats.outOfStockCount, color: "#EF4444" },
  ];

  const avgSellingPrice =
    stats.totalProducts > 0
      ? products
          .filter((p) => p.status !== "Archived")
          .reduce((sum, p) => sum + p.selling_price, 0) / stats.totalProducts
      : 0;

  return {
    stats,
    categoryStats,
    statusStats,
    stockHealth,
    avgSellingPrice,
  };
}

