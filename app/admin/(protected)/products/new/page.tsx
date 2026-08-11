import type { Metadata } from "next";

import { ProductFormPage } from "@/components/admin/ProductFormPage";
import { emptyDetail, getProducts, type Product } from "@/lib/admin/store";

export const metadata: Metadata = {
  title: "Yangi mahsulot · CureLife Admin",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const products = await getProducts();

  const empty: Product = {
    id: "",
    slug: "",
    // Keyingi tartib raqami avtomatik taklif qilinadi.
    number: String(products.length + 1).padStart(2, "0"),
    name: "",
    image: null,
    detailImage: null,
    certificate: null,
    instruction: null,
    originLogo: null,
    visible: true,
    ru: { name: "", category: "", description: "", stats: ["", "", ""], detail: emptyDetail() },
    uz: { name: "", category: "", description: "", stats: ["", "", ""], detail: emptyDetail() },
  };

  return <ProductFormPage product={empty} isNew />;
}
