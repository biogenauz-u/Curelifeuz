import Image from "next/image";
import Link from "next/link";

import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/admin/store";

/**
 * Mahsulot qo'shish/tahrirlash uchun alohida sahifa qobig'i.
 * `admin-root` klassi admin uchun masshtabni qaytaradi (globals.css).
 */
export function ProductFormPage({
  product,
  isNew,
}: {
  product: Product;
  isNew: boolean;
}) {
  return (
    <div className="admin-root min-h-screen bg-[#f2f8f7] text-ink-deep">
      <header className="sticky top-0 z-20 flex h-[82px] items-center gap-4 border-b border-[#dfebea] bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
        <Link
          href="/admin?view=products"
          aria-label="Mahsulotlar ro‘yxatiga qaytish"
          className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-brand-100 text-brand-700"
        >
          ←
        </Link>
        <div className="min-w-0">
          <p className="truncate font-display text-[18px] font-bold">
            {isNew ? "Yangi mahsulot" : product.name}
          </p>
          <p className="mt-1 text-[10px] text-body">
            Mahsulotlar · {isNew ? "qo‘shish" : "tahrirlash"}
          </p>
        </div>
        <Image
          src="/images/curelife-logo.svg"
          alt="CureLife"
          width={160}
          height={36}
          unoptimized
          className="ml-auto hidden h-7 w-auto sm:block"
        />
      </header>

      <main className="p-4 sm:p-7 lg:p-10">
        <ProductForm product={product} isNew={isNew} />
      </main>
    </div>
  );
}
