import Image from "next/image";
import Link from "next/link";

import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Article, Product } from "@/lib/admin/store";

/** Maqola qo'shish/tahrirlash uchun alohida sahifa qobig'i. */
export function ArticleFormPage({
  article,
  products,
  isNew,
}: {
  article: Article;
  products: Product[];
  isNew: boolean;
}) {
  return (
    <div className="admin-root min-h-screen bg-[#f2f8f7] text-ink-deep">
      <header className="sticky top-0 z-20 flex h-[82px] items-center gap-4 border-b border-[#dfebea] bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
        <Link
          href="/admin?view=articles"
          aria-label="Maqolalar ro‘yxatiga qaytish"
          className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-brand-100 text-brand-700"
        >
          ←
        </Link>
        <div className="min-w-0">
          <p className="truncate font-display text-[18px] font-bold">
            {isNew ? "Yangi maqola" : article.ru.title || article.uz.title}
          </p>
          <p className="mt-1 text-[10px] text-body">
            Maqolalar · {isNew ? "qo‘shish" : "tahrirlash"}
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
        <ArticleForm article={article} products={products} isNew={isNew} />
      </main>
    </div>
  );
}
