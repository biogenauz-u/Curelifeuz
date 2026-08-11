"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { deleteArticle } from "@/app/admin/data-actions";
import type { Article } from "@/lib/admin/store";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : iso;
}

export function ArticlesView({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [pending, start] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? articles.filter((a) =>
          `${a.ru.title} ${a.uz.title}`.toLowerCase().includes(q),
        )
      : articles;
  }, [articles, query]);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold">Maqolalar</h1>
          <p className="mt-2 text-[11px] text-body">
            Bosh sahifada eng yangi 4 tasi, «Maqolalar» sahifasida hammasi chiqadi.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-brand-gradient grid h-11 cursor-pointer place-items-center rounded-[13px] px-5 text-[11px] font-bold text-white"
        >
          + Yangi maqola
        </Link>
      </div>

      <div className="mt-7 flex items-center rounded-[16px] border border-[#dfeceb] bg-white px-4">
        <span className="text-brand-700">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Maqolani qidirish..."
          className="h-12 flex-1 bg-transparent px-3 text-[12px] outline-none"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#dfeae9] bg-white">
        <div className="hidden grid-cols-[2.4fr_1fr_.8fr_.8fr] gap-4 border-b border-[#e5eeee] bg-[#f8fbfb] px-6 py-4 text-[9px] font-bold tracking-[.1em] text-label md:grid">
          <span>MAQOLA</span>
          <span>SANA</span>
          <span>KO‘RILDI</span>
          <span />
        </div>

        {visible.map((a) => (
          <article
            key={a.id}
            className="grid gap-4 border-b border-[#eaf1f0] p-5 last:border-0 md:grid-cols-[2.4fr_1fr_.8fr_.8fr] md:items-center md:px-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-[#edf8f7]">
                {a.image ? (
                  <Image src={a.image} alt="" fill sizes="56px" className="object-cover" />
                ) : (
                  <span className="text-[16px] text-brand-200">✎</span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-[12px] font-bold">
                  {a.ru.title || a.uz.title}
                </h2>
                <p className="mt-1 truncate text-[9px] text-body">/{a.slug}</p>
              </div>
            </div>

            <p className="text-[11px] text-body">{formatDate(a.publishedAt)}</p>
            <p className="text-[11px] font-semibold">{a.views}</p>

            <div className="flex gap-2">
              <Link
                href={`/admin/articles/${a.id}`}
                className="grid h-9 flex-1 cursor-pointer place-items-center rounded-[10px] border border-[#dfeae9] text-[10px] font-bold"
              >
                Tahrirlash
              </Link>
              <button
                disabled={pending}
                onClick={() => {
                  if (confirm(`"${a.ru.title || a.uz.title}" o‘chirilsinmi?`)) {
                    start(() => void deleteArticle(a.id));
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
          <p className="p-10 text-center text-[12px] text-body">Maqola topilmadi.</p>
        )}
      </div>
    </section>
  );
}
