import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { ProductForm } from "@/components/forms/product-form";

export const metadata = {
  title: "Edit Product | Innovexa",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-2">
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}

