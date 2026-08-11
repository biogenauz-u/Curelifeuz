import { cookies } from "next/headers";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

/**
 * Server komponentlar uchun til aniqlash. Klient tomonda `useLanguage()`
 * ishlatiladi, server tomonda esa cookie to'g'ridan-to'g'ri o'qiladi —
 * shunda sahifa allaqachon to'g'ri tilda render bo'ladi (SEO uchun ham).
 */
export async function resolveLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getServerDictionary(): Promise<Dictionary> {
  return getDictionary(await resolveLocale());
}
