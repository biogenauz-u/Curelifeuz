import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { getProducts } from "@/lib/admin/store";
import { getServerDictionary } from "@/lib/i18n/server";
import { resolvePageMeta } from "@/lib/i18n/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = (await getServerDictionary()).productsPage;
  return resolvePageMeta("/products", meta);
}

export default async function ProductsPage() {
  // Yashirin mahsulot klientga umuman yuborilmaydi (HTML manbasida ham qolmasin).
  const products = (await getProducts()).filter((p) => p.visible);

  return (
    <>
      <main className="overflow-hidden bg-[radial-gradient(circle_at_0%_45%,rgba(151,225,219,.24),transparent_17%),linear-gradient(180deg,#fff,#f3fdfc)] text-ink-deep">
        <Header />
        <ProductCatalog products={products} />
      </main>
      <Footer />
    </>
  );
}
