import { getCategories } from "@/lib/actions/categories";
import { ProductForm } from "@/components/forms/product-form";

export const metadata = {
  title: "Add New Product | Innovexa",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="py-2">
      <ProductForm categories={categories} />
    </div>
  );
}
