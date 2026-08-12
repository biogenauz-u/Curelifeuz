export const locales = ["ru", "uz"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

/** Tanlangan til shu cookie'da saqlanadi, shunda server ham uni biladi. */
export const LOCALE_COOKIE = "curelife-locale";

/**
 * `proxy.ts` (middleware) URL prefiksidan (`/ru`, `/uz`) aniqlagan tilni
 * shu sarlavha orqali server komponentlarga uzatadi — `resolveLocale()`
 * birinchi navbatda shundan o'qiydi.
 */
export const LOCALE_HEADER = "x-curelife-locale";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Ichki (`/products`, `/articles/slug` kabi) manzilga til prefiksini
 * qo'shadi: `withLocale("uz", "/products")` → `/uz/products`.
 * Tashqi havolalar (`http…`, `mailto:`, `tel:`) va faqat hash (`#...`)
 * o'zgarishsiz qaytadi — ular joriy tilga allaqachon nisbiy.
 */
export function withLocale(locale: Locale, path: string): string {
  if (/^([a-z]+:|#)/i.test(path)) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}
