import { cookies, headers } from "next/headers";

import { defaultLocale, isLocale, LOCALE_COOKIE, LOCALE_HEADER, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

/**
 * Server komponentlar uchun til aniqlash.
 *
 * Ustuvorlik: 1) `proxy.ts` (middleware) URL prefiksidan (`/ru`, `/uz`)
 * o'qib qo'ygan sarlavha — bu HAQIQIY manzilga mos, shuning uchun eng
 * ishonchli manba (SEO uchun ham muhim: Google/Yandex cookie yubormaydi,
 * faqat URL'ga qaraydi). 2) Cookie — middleware chetlab o'tilgan noyob
 * holatlar uchun zaxira. 3) Standart til.
 */
export async function resolveLocale(): Promise<Locale> {
  const hdrs = await headers();
  const fromHeader = hdrs.get(LOCALE_HEADER) ?? undefined;
  if (isLocale(fromHeader)) return fromHeader;

  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getServerDictionary(): Promise<Dictionary> {
  return getDictionary(await resolveLocale());
}
