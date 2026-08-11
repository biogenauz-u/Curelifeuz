import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductFormPage } from "@/components/admin/ProductFormPage";
import { getProducts } from "@/lib/admin/store";

export const metadata: Metadata = {
  title: "Mahsulotni tahrirlash · CureLife Admin",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const product = (await getProducts()).find((p) => p.id === id);
  if (!product) notFound();

  return <ProductFormPage product={product} isNew={false} />;
}
