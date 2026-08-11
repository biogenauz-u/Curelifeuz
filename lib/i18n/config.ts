export const locales = ["ru", "uz"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

/** Tanlangan til shu cookie'da saqlanadi, shunda server ham uni biladi. */
export const LOCALE_COOKIE = "curelife-locale";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
