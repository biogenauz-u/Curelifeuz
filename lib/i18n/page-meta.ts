import type { Metadata } from "next";

import { getPagesMeta } from "@/lib/admin/store";

import { locales, type Locale } from "./config";
import { resolveLocale } from "./server";

export const SITE_URL = "https://curelife.uz";

/** OG/Twitter uchun rasm berilmagan sahifalarda ishlatiladigan umumiy zaxira. */
export const DEFAULT_OG_IMAGE = "/images/hero-bg.jpg";

const OG_LOCALE: Record<Locale, string> = { ru: "ru_RU", uz: "uz_UZ" };

/** `/products/foo` kabi tildan mustaqil yo'lni to'liq (protokol+domen) manzilga aylantiradi. */
function absoluteUrl(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}/${locale}${clean}`;
}

/**
 * O'zini o'zi ko'rsatuvchi (self-referencing) canonical + ru/uz/x-default
 * hreflang xaritasi. `path` har doim TIL PREFIKSISIZ, ichki yo'l bo'lishi
 * kerak (masalan `/products/fimbriolok-plus`, bosh sahifa uchun `/`).
 */
export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(l, path);
  // x-default — tilni aniqlay olmagan botlar/foydalanuvchilar uchun asosiy til.
  languages["x-default"] = absoluteUrl("ru", path);

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}

/**
 * Sahifa uchun to'liq metadata: title/description (admin panelda kiritilgan
 * bo'lsa o'shandan, bo'lmasa lug'atdagi standart matndan), canonical,
 * hreflang, Open Graph va Twitter Card.
 *
 * `key` — tildan mustaqil ichki yo'l (`/`, `/products`, `/products/slug`
 * kabi) — ham `pages.json`dagi admin sozlamasini topish, ham canonical
 * qurish uchun ishlatiladi.
 */
export async function resolvePageMeta(
  key: string,
  fallback: { title: string; description: string; image?: string | null },
): Promise<Metadata> {
  const [locale, pages] = await Promise.all([resolveLocale(), getPagesMeta()]);
  const custom = pages[key]?.[locale];

  const title = custom?.title?.trim() || fallback.title;
  const description = custom?.description?.trim() || fallback.description;
  const image = fallback.image || DEFAULT_OG_IMAGE;
  const url = absoluteUrl(locale, key);

  return {
    title,
    description,
    alternates: buildAlternates(locale, key),
    openGraph: {
      title,
      description,
      url,
      siteName: "CureLife",
      locale: OG_LOCALE[locale],
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
