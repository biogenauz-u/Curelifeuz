"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { CONTAINER } from "@/lib/utils";

/**
 * Figma node 189:695 — 4 ustunli "muzli" panel. Maketda u hero rasmining
 * pastki qismiga chiqib turadi, shuning uchun manfiy margin bilan ko'tarilgan.
 *
 * Mahsulotlar soni lug'atda emas — u `getProducts()` dan hisoblanadi
 * (`app/page.tsx`), shunda hero, "CureLife haqida" va pasport bir xil bo'ladi.
 */
export function Stats({ productCount }: { productCount: number }) {
  const { t } = useLanguage();

  const items = [
    { key: "experience", value: t.stats.experience.value, label: t.stats.experience.label },
    { key: "team", value: t.stats.team.value, label: t.stats.team.label },
    { key: "packages", value: t.stats.packages.value, label: t.stats.packages.label },
    { key: "products", value: String(productCount), label: t.stats.products.label },
  ];

  return (
    <div className={CONTAINER}>
      <dl className="glass-panel relative z-10 -mt-[60px] grid grid-cols-2 overflow-hidden rounded-[26px] lg:-mt-[146px] lg:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={item.key}
            className={
              "bg-white/58 px-5 py-[18px] sm:px-[28px] sm:py-[22px] " +
              // maketda ustunlar orasida ingichka chiziq bor
              (i % 2 === 0 ? "border-r border-hairline " : "") +
              (i < 2 ? "border-b border-hairline lg:border-b-0 " : "") +
              (i === 2 ? "lg:border-r " : "")
            }
          >
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="block font-display text-[24px] leading-none font-bold tracking-[-0.04em] text-ink-deep sm:text-[28px]">
                {item.value}
              </span>
              <span className="mt-[12px] block text-[13px] leading-[1.4] text-body sm:mt-[14px]">
                {item.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
