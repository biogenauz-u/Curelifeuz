"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Product } from "@/lib/admin/store";
import { withLocale } from "@/lib/i18n/config";
import { cn, CONTAINER, H2, H2_LG, productName, SECTION_Y } from "@/lib/utils";

/**
 * Rasm kartasi. Mahsulot sahifasi bo'lsa — butun karta havola bo'ladi
 * (maketdagi o'lchamlar buzilmasligi uchun alohida tugma qo'shilmagan).
 */
function ImageCard({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  const box =
    "group relative block h-[260px] overflow-hidden rounded-[22px] lg:h-full lg:min-h-[390px]";
  if (!href) return <div className={box}>{children}</div>;
  return (
    <Link
      href={href}
      className={`${box} transition-shadow hover:shadow-[0_0_0_2px_rgba(151,225,219,0.9)] focus-visible:shadow-[0_0_0_2px_rgba(151,225,219,0.9)]`}
    >
      {children}
      <span className="absolute right-[16px] bottom-[16px] inline-flex items-center gap-[8px] rounded-pill bg-ink-deep/85 px-[14px] py-[8px] text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
        <ArrowRightIcon className="size-[14px]" />
      </span>
    </Link>
  );
}

/**
 * Figma node 189:749 — "04 / Паспорт продукта".
 *
 * Mahsulotlar `lib/admin/store.ts` dan keladi — hero statistikasi va
 * "CureLife haqida" matni bilan bir xil manba, shuning uchun ro'yxatga
 * yangi mahsulot qo'shilsa bu yerda ham avtomatik paydo bo'ladi.
 */
export function ProductPassport({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage();
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const items = products;
  if (!items.length) return null;

  const product = items[Math.min(active, items.length - 1)];
  const text = product[locale];
  const title = productName(product, locale);
  const origin = text.detail.origin;

  const stats = [
    [text.stats[0], t.passport.statLabels.form],
    [text.stats[1], t.passport.statLabels.pack],
    [text.stats[2], t.passport.statLabels.intake],
  ] as const;

  const rows = (
    origin.type === "imported"
      ? [
          ["maker", origin.importedFull || origin.importedCountry],
          ["role", origin.role],
        ]
      : [
          ["raw", origin.rawFull || origin.rawCountry],
          ["maker", origin.manufacturerFull || origin.makeCountry],
          ["role", origin.role],
        ]
  ) as ReadonlyArray<readonly [keyof typeof t.passport.fields, string]>;

  /** Klaviatura: ←/→ tab almashtiradi, Home/End chetlarga o'tadi. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;

    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section
      id="passport"
      className={`${SECTION_Y} lg:pt-[136px] lg:pb-[75px]`}
    >
      <div className={CONTAINER}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,565px)] lg:items-center lg:gap-10">
          <div>
            <SectionLabel>{t.passport.label}</SectionLabel>
            <h2 className={`${H2} ${H2_LG[58]} mt-8 lg:mt-[32px]`}>
              {t.passport.title}
            </h2>
          </div>
          <p className="text-[16px] leading-[1.7] text-body">{t.passport.body}</p>
        </div>

        {/* Tablist — node 189:754 */}
        <div
          role="tablist"
          aria-label={t.passport.title}
          onKeyDown={onKeyDown}
          className="mt-10 -mx-4 flex snap-x gap-[10px] overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-[48px] lg:grid-cols-3"
        >
          {items.map((p, i) => {
            const selected = i === active;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`passport-tab-${p.slug}`}
                aria-selected={selected}
                aria-controls="passport-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "h-[67px] min-w-[240px] shrink-0 snap-start cursor-pointer rounded-[15px] border px-[15px] text-left transition-colors sm:min-w-0",
                  selected
                    ? "border-ink-deep bg-ink-deep shadow-[0_14px_16px_rgba(16,32,33,0.14)]"
                    : "border-hairline bg-white/64 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "block text-[10px] font-bold tracking-[0.09em]",
                    selected ? "text-[#addcd8]" : "text-[#5f7876]",
                  )}
                >
                  {p.number || String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-[6px] block text-[16px] font-bold",
                    selected ? "text-white" : "text-ink-deep",
                  )}
                >
                  {productName(p, locale)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Qorong'i panel — node 189:767 */}
        <div
          id="passport-panel"
          role="tabpanel"
          aria-labelledby={`passport-tab-${product.slug}`}
          tabIndex={0}
          className="relative mt-[14px] overflow-hidden rounded-[32px] bg-[linear-gradient(140deg,rgba(16,32,33,0.98)_0%,rgba(6,121,120,0.93)_100%)] p-5 sm:p-[24px]"
        >
          {/* dekorativ yorug'lik dog'i */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[140px] -bottom-[220px] size-[480px] rounded-full bg-[rgba(151,225,219,0.15)] blur-[5px]"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <SectionLabel tone="dark" className="!text-[#a7d7d3]">
                {text.category}
              </SectionLabel>
              <h3 className="mt-[10px] font-display text-[32px] leading-[1.05] font-bold tracking-[-0.045em] text-white lg:text-[44px] lg:leading-[44px]">
                {title}
              </h3>
              <p className="mt-[13px] max-w-[520px] text-[14px] leading-[1.6] text-[#cbe3e1]">
                {text.description}
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-[8px] lg:shrink-0">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="flex min-h-[96px] w-full flex-col rounded-[16px] border border-white/12 bg-white/9 p-[14px] lg:w-[132px]"
                >
                  <dd className="font-display text-[17px] leading-[1.25] font-bold text-balance text-white">
                    {value || "—"}
                  </dd>
                  <dt className="mt-auto pt-[10px] text-[11px] leading-[1.35] text-[#c3ddda]">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mt-8 grid items-stretch gap-[16px] lg:mt-[33px] lg:grid-cols-[minmax(0,586px)_minmax(0,530px)]">
            {/* Mahsulot rasmi — node 189:796. Maketda alohida tugma yo'q,
                shuning uchun kartaning o'zi bosiladigan qilingan. */}
            <ImageCard
              href={withLocale(locale, `/products/${product.slug}`)}
              label={t.passport.openProduct}
            >
              {product.detailImage ?? product.image ? (
                // Maketda rasm 434×303 ramkada, markazidan kesilgan (node 278:2)
                <div className="absolute inset-0">
                  <Image
                    src={(product.detailImage ?? product.image) as string}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 540px"
                    className="object-contain object-center"
                  />
                </div>
              ) : (
                <p className="absolute inset-0 grid place-items-center px-6 text-center font-display text-[22px] font-bold text-ink-deep/25">
                  {title}
                </p>
              )}
            </ImageCard>

            {/* Kelib chiqishi — node 189:783 */}
            <div className="rounded-[22px] bg-white/94 p-6 sm:p-[28px]">
              <h4 className="font-display text-[20px] font-bold text-ink-deep">
                {t.passport.originTitle}
              </h4>

              <dl className="mt-[16px]">
                {rows.map(([key, value]) => (
                  <div key={key} className="border-b border-hairline py-[11px]">
                    <dt className="text-[11px] tracking-[0.09em] text-[#5f7876] uppercase">
                      {t.passport.fields[key]}
                    </dt>
                    <dd className="mt-[7px] text-[14px] font-bold text-ink-deep">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
