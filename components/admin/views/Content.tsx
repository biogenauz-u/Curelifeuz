"use client";

import Link from "next/link";
import { useState } from "react";

import { updatePageMeta } from "@/app/admin/data-actions";
import type { PagesMeta } from "@/lib/admin/store";

const PAGES: Array<{ key: string; title: string; note: string }> = [
  { key: "/", title: "Bosh sahifa", note: "11 ta bo‘lim" },
  { key: "/products", title: "Mahsulotlar", note: "Katalog va qidiruv" },
  { key: "/about", title: "Kompaniya haqida", note: "7 ta bo‘lim" },
  { key: "/contact", title: "Kontaktlar", note: "Forma va FAQ" },
  { key: "/articles", title: "Maqolalar", note: "Maqolalar ro‘yxati" },
  // Mahsulot pasportlari bu yerda yo'q — ularning meta'si "Mahsulotlar"
  // bo'limidagi nom va tavsifdan avtomatik olinadi.
];

function Row({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <label className="block text-[9px] font-bold tracking-[.08em] text-label uppercase">
      {label}
      <input
        name={name}
        defaultValue={value}
        className="mt-2 w-full rounded-[12px] border border-[#dce9e8] px-3 py-2.5 text-[12px] font-normal text-ink-deep outline-none focus:border-accent"
      />
    </label>
  );
}

export function ContentView({ pages }: { pages: PagesMeta }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const current = editing ? PAGES.find((p) => p.key === editing) : null;
  const meta = editing ? pages[editing] : undefined;

  return (
    <section>
      <h1 className="font-display text-[32px] font-bold">Sayt kontenti</h1>
      <p className="mt-2 text-[11px] text-body">
        Sahifalarning brauzer sarlavhasi va qidiruv tizimi uchun tavsifi.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PAGES.map((p) => {
          const custom = pages[p.key];
          return (
            <article key={p.key} className="rounded-[22px] border border-[#deebea] bg-white p-6">
              <span className="grid size-11 place-items-center rounded-[13px] bg-brand-100 text-brand-700">
                ▤
              </span>
              <h2 className="mt-6 font-display text-[18px] font-bold">{p.title}</h2>
              <p className="mt-2 text-[10px] text-body">{p.note}</p>
              <p className="mt-3 text-[9px] font-bold text-brand-700">
                {custom ? "✎ o‘zgartirilgan" : "standart matn"}
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(p.key);
                    setSavedKey(null);
                  }}
                  className="flex-1 cursor-pointer rounded-[11px] bg-ink-deep py-3 text-[10px] font-bold text-white"
                >
                  Tahrirlash
                </button>
                <Link
                  href={p.key}
                  target="_blank"
                  className="grid size-10 place-items-center rounded-[11px] border border-[#deebea]"
                >
                  ↗
                </Link>
              </div>
              {savedKey === p.key && (
                <p className="mt-3 rounded-[10px] bg-brand-100 p-3 text-[9px] font-bold text-brand-700">
                  Saqlandi
                </p>
              )}
            </article>
          );
        })}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/35 p-4">
          <form
            action={async (fd) => {
              await updatePageMeta(fd);
              setSavedKey(current.key);
              setEditing(null);
            }}
            className="my-8 w-full max-w-[620px] rounded-[24px] bg-white p-7 sm:p-9"
          >
            <h2 className="font-display text-[22px] font-bold">{current.title}</h2>
            <p className="mt-1 text-[10px] text-body">{current.key}</p>
            <input type="hidden" name="key" value={current.key} />

            <p className="mt-7 text-[10px] font-bold tracking-[.1em] text-brand-700">RUSCHA</p>
            <div className="mt-3 grid gap-4">
              <Row label="Sarlavha (title)" name="ru_title" value={meta?.ru.title ?? ""} />
              <Row label="Tavsif (description)" name="ru_description" value={meta?.ru.description ?? ""} />
            </div>

            <p className="mt-7 text-[10px] font-bold tracking-[.1em] text-brand-700">O‘ZBEKCHA</p>
            <div className="mt-3 grid gap-4">
              <Row label="Sarlavha (title)" name="uz_title" value={meta?.uz.title ?? ""} />
              <Row label="Tavsif (description)" name="uz_description" value={meta?.uz.description ?? ""} />
            </div>

            <p className="mt-5 rounded-[12px] bg-[#f6faf9] p-4 text-[10px] leading-5 text-body">
              Bo‘sh qoldirilsa — saytdagi standart matn ishlatiladi.
            </p>

            <div className="mt-6 flex gap-3">
              <button className="bg-brand-gradient h-11 flex-1 cursor-pointer rounded-[12px] text-[11px] font-bold text-white">
                Saqlash
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-11 cursor-pointer rounded-[12px] border border-[#dce9e8] px-6 text-[11px] font-bold"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
