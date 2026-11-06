import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { InventoryView } from "@/components/inventory/inventory-view";

export const metadata = {
  title: "Inventory & Stock Levels | Innovexa",
};

export default async function InventoryPage() {
  const [{ products }, categories] = await Promise.all([
    getProducts({ limit: 1000, includeArchived: false }),
    getCategories(),
  ]);

  return <InventoryView products={products} categories={categories} />;
}

