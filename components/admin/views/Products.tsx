"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { deleteProduct, toggleProduct } from "@/app/admin/data-actions";
import type { Product } from "@/lib/admin/store";

export function ProductsView({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [pending, start] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? products.filter((p) =>
          `${p.name} ${p.ru.category} ${p.uz.category}`.toLowerCase().includes(q),
        )
      : products;
  }, [products, query]);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold">Mahsulotlar</h1>
          <p className="mt-2 text-[11px] text-body">
            Bu yerdagi o‘zgarishlar saytdagi katalogga darhol tushadi.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-brand-gradient grid h-11 cursor-pointer place-items-center rounded-[13px] px-5 text-[11px] font-bold text-white"
        >
          + Yangi mahsulot
        </Link>
      </div>

      <div className="mt-7 flex items-center rounded-[16px] border border-[#dfeceb] bg-white px-4">
        <span className="text-brand-700">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mahsulotni qidirish..."
          className="h-12 flex-1 bg-transparent px-3 text-[12px] outline-none"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#dfeae9] bg-white">
        <div className="hidden grid-cols-[2fr_1.3fr_1fr_.7fr_.8fr] gap-4 border-b border-[#e5eeee] bg-[#f8fbfb] px-6 py-4 text-[9px] font-bold tracking-[.1em] text-label md:grid">
          <span>MAHSULOT</span>
          <span>YO‘NALISH</span>
          <span>QADOQ</span>
          <span>HOLAT</span>
          <span />
        </div>

        {visible.map((p) => (
          <article
            key={p.id}
            className="grid gap-4 border-b border-[#eaf1f0] p-5 last:border-0 md:grid-cols-[2fr_1.3fr_1fr_.7fr_.8fr] md:items-center md:px-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-[#edf8f7]">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill sizes="56px" className="object-contain p-1" />
                ) : (
                  <span className="text-[9px] font-bold text-ink-deep/25">
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-[12px] font-bold">{p.name}</h2>
                <p className="mt-1 text-[9px] text-body">/{p.slug}</p>
              </div>
            </div>

            <p className="text-[11px] text-body">{p.ru.category}</p>
            <p className="text-[11px] font-semibold">{p.ru.stats[1]}</p>

            <button
              disabled={pending}
              onClick={() => start(() => void toggleProduct(p.id))}
              className={`w-fit cursor-pointer rounded-pill px-3 py-2 text-[9px] font-bold disabled:opacity-50 ${
                p.visible
                  ? "bg-[#dff7ec] text-[#177c58]"
                  : "bg-[#f5ecec] text-[#9d4c4c]"
              }`}
            >
              {p.visible ? "Faol" : "Yashirin"}
            </button>

            <div className="flex gap-2">
              <Link
                href={`/admin/products/${p.id}`}
                className="grid h-9 flex-1 cursor-pointer place-items-center rounded-[10px] border border-[#dfeae9] text-[10px] font-bold"
              >
                Tahrirlash
              </Link>
              <button
                disabled={pending}
                onClick={() => {
                  if (confirm(`"${p.name}" o‘chirilsinmi?`)) {
                    start(() => void deleteProduct(p.id));
                  }
                }}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#f0dede] text-[#9d4c4c] disabled:opacity-50"
                aria-label="O‘chirish"
              >
                ✕
              </button>
            </div>
          </article>
        ))}

        {!visible.length && (
          <p className="p-10 text-center text-[12px] text-body">
            Mahsulot topilmadi.
          </p>
        )}
      </div>
    </section>
  );
}
