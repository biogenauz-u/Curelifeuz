"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Product } from "@/lib/admin/store";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { FileIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { withLocale } from "@/lib/i18n/config";
import { CONTAINER, productName } from "@/lib/utils";

export function ProductCatalog({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage();
  const c = t.productsPage;
  const [query, setQuery] = useState("");

  // Yashirin mahsulotlar serverda allaqachon ajratilgan.
  const items = useMemo(
    () =>
      products
        .map((p) => ({
          ...p[locale],
          slug: p.slug,
          name: productName(p, locale),
          image: p.image,
          // Hujjat tugmasi: avval yo'riqnoma, bo'lmasa sertifikat.
          document: p.instruction ?? p.certificate,
        })),
    [products, locale],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      `${p.name} ${p.category} ${p.description}`.toLocaleLowerCase().includes(q),
    );
  }, [query, items]);

  return (
    <>
      <section id="products" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="pointer-events-none absolute top-16 right-[-170px] hidden size-[430px] rounded-full bg-brand-100/70 lg:block" />
        <div className={`${CONTAINER} relative z-10`}>
          <form
            onSubmit={(e) => e.preventDefault()}
            role="search"
            className="relative z-10 flex h-[72px] items-center rounded-[22px] border border-brand-200/50 bg-white pl-6 shadow-[0_18px_55px_rgba(8,126,125,.05)]"
          >
            <span aria-hidden className="mr-4 text-2xl text-accent">
              ⌕
            </span>
            <label htmlFor="product-search" className="sr-only">
              {c.searchLabel}
            </label>
            <input
              id="product-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-body/70"
              placeholder={c.searchPlaceholder}
            />
            <button className="bg-brand-gradient mr-2 h-14 rounded-[16px] px-7 text-[13px] font-bold text-white">
              {c.searchButton}
            </button>
          </form>

          <div className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <SectionLabel>{c.label}</SectionLabel>
              <h1 className="mt-7 max-w-[670px] font-display text-[48px] leading-[.98] font-bold tracking-[-.055em] sm:text-[70px]">
                {c.title}
              </h1>
            </div>
            <p className="max-w-[480px] pb-2 text-[14px] leading-6 text-body">
              {c.intro}
            </p>
          </div>

          {visible.length ? (
            <div className="mt-16 grid gap-5 lg:grid-cols-2">
              {visible.map((product) => {
                const statValues = [
                  [c.statLabels.form, product.stats[0]],
                  [c.statLabels.pack, product.stats[1]],
                  [c.statLabels.intake, product.stats[2]],
                ] as const;
                return (
                  <article
                    key={product.slug}
                    className="overflow-hidden rounded-[30px] border border-white bg-white/80 shadow-[0_20px_65px_rgba(8,126,125,.07)]"
                  >
                    <div className="relative h-[380px] bg-[radial-gradient(circle_at_50%_55%,rgba(81,218,207,.24),transparent_42%),#eefaf9] sm:h-[460px]">
                      <span className="absolute top-6 left-6 z-10 rounded-pill bg-white/80 px-4 py-2 text-[9px] font-bold tracking-[.11em] text-label uppercase">
                        {product.category}
                      </span>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width:1024px) 100vw,590px"
                          className="object-contain p-8 sm:p-10"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <p className="font-display text-[42px] font-bold tracking-[-.05em] text-ink-deep/12">
                            {product.name}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-6 sm:p-8">
                      <h2 className="font-display text-[30px] font-bold tracking-[-.04em]">
                        {product.name}
                      </h2>
                      <p className="mt-3 min-h-[48px] text-[12px] leading-5 text-body">
                        {product.description}
                      </p>
                      <dl className="mt-6 grid grid-cols-3 gap-2">
                        {statValues.map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-[14px] border border-brand-200/30 bg-brand-100/45 p-4"
                          >
                            <dt className="text-[8px] font-bold tracking-[.1em] text-label uppercase">
                              {label}
                            </dt>
                            <dd className="mt-3 text-[11px] leading-4 font-bold">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-5 flex gap-2">
                        <Link
                          href={withLocale(locale, `/products/${product.slug}`)}
                          className="bg-brand-gradient flex h-12 flex-1 items-center justify-between rounded-[14px] px-5 text-[12px] font-bold text-white"
                        >
                          {c.passportCta} <ArrowRightIcon className="size-4" />
                        </Link>
                        <a
                          href={product.document ?? `/products/${product.slug}#documents`}
                          target={product.document ? "_blank" : undefined}
                          rel={product.document ? "noreferrer" : undefined}
                          aria-label={`${c.docsAria} — ${product.name}`}
                          className="grid size-12 shrink-0 place-items-center rounded-[14px] border border-brand-200/40 bg-white text-brand-600"
                        >
                          <FileIcon className="size-5" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-16 rounded-[24px] bg-white p-10 text-center text-body">
              {c.notFound}
            </p>
          )}

          <p className="mt-16 rounded-[18px] bg-white/75 px-6 py-5 text-[11px] leading-5 text-body">
            {c.disclaimer}
          </p>
        </div>
      </section>

      <section id="contact-products" className="pb-24 lg:pb-32">
        <div
          className={`${CONTAINER} grid overflow-hidden rounded-[32px] bg-white shadow-[0_24px_75px_rgba(8,126,125,.08)] lg:grid-cols-[1.05fr_.95fr]`}
        >
          <div className="p-8 sm:p-12 lg:p-16">
            <SectionLabel>{c.contact.label}</SectionLabel>
            <h2 className="mt-8 max-w-[560px] font-display text-[45px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[62px]">
              {c.contact.title}
            </h2>
            <p className="mt-6 max-w-[520px] text-[13px] leading-6 text-body">
              {c.contact.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={withLocale(locale, "/contact")}
                className="bg-brand-gradient inline-flex h-12 items-center gap-4 rounded-[14px] px-5 text-[12px] font-bold text-white"
              >
                {c.contact.primary} <ArrowRightIcon className="size-4" />
              </a>
              <a
                href="#products"
                className="inline-flex h-12 items-center rounded-[14px] border border-brand-200/50 px-5 text-[12px] font-bold"
              >
                {c.contact.secondary}
              </a>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[480px]">
            <Image
              src="/images/products-contact.png"
              alt={c.contact.imageAlt}
              fill
              sizes="(max-width:1024px) 100vw,520px"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
