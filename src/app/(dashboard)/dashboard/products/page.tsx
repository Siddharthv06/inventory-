import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { ProductTable } from "@/components/products/product-table";
import { Suspense } from "react";

export const metadata = {
  title: "Products & Listings | Innovexa",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    sortBy?: "name" | "price" | "stock" | "created_at";
    sortOrder?: "asc" | "desc";
    page?: string;
    includeArchived?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const includeArchived = params.includeArchived === "true";

  const [{ products, totalCount, totalPages }, categories] = await Promise.all([
    getProducts({
      search: params.search,
      category: params.category,
      status: params.status,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      page,
      limit: 10,
      includeArchived,
    }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Product Catalog & Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Centralized listing records, inventory pricing, and marketplace sync status.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading catalog...</div>}>
        <ProductTable
          initialProducts={products}
          categories={categories}
          totalCount={totalCount}
          currentPage={page}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}
