import { getCategories } from "@/lib/actions/categories";
import { CategoryManager } from "@/components/categories/category-manager";

export const metadata = {
  title: "Categories | Innovexa",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoryManager categories={categories} />;
}
