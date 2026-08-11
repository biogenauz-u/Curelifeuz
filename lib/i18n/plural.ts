import type { Locale } from "./config";

/**
 * Ruscha son-kelishik: 1 просмотр · 2–4 просмотра · 5–20 просмотров ·
 * 21 просмотр · 22 просмотра …
 *
 * O'zbek tilida son bilan ko'plik qo'shimchasi ishlatilmaydi
 * ("5 mahsulot"), shuning uchun bitta shakl yetarli.
 */
export function pluralRu(
  count: number,
  [one, few, many]: [string, string, string],
): string {
  const n = Math.abs(count) % 100;
  const last = n % 10;
  if (n > 10 && n < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

type Forms = { ru: [string, string, string]; uz: string };

/** `count` + tilga mos so'z. */
export function plural(locale: Locale, count: number, forms: Forms): string {
  const word = locale === "ru" ? pluralRu(count, forms.ru) : forms.uz;
  return `${count} ${word}`;
}

/** Maqola ko'rishlari. */
export const VIEWS_FORMS: Forms = {
  ru: ["просмотр", "просмотра", "просмотров"],
  uz: "ko‘rildi",
};

/** Mahsulotlar soni. */
export const PRODUCTS_FORMS: Forms = {
  ru: ["продукт", "продукта", "продуктов"],
  uz: "mahsulot",
};
