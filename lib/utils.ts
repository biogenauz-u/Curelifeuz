import type { Product } from "@/lib/admin/store";
import type { Locale } from "@/lib/i18n/config";

/**
 * Maketda ikki xil kontent kengligi bor:
 *  • 1372px — header va hero (1920 freymda x = 278…1650);
 *  • 1180px — qolgan barcha bo'limlar (x = 370…1550).
 * max-w = kontent + 2×32 padding, shunda keng ekranda kontent aynan
 * kerakli kenglikda bo'ladi, tor ekranda esa yon bo'shliq saqlanadi.
 */
export const CONTAINER_WIDE =
  "mx-auto w-full max-w-[1436px] px-4 sm:px-6 lg:px-8";

export const CONTAINER = "mx-auto w-full max-w-[1244px] px-4 sm:px-6 lg:px-8";

/**
 * Bo'lim sarlavhasining UMUMIY qismi: shrift, qalinlik, tracking, rang va
 * kichik ekran o'lchamlari. Desktop o'lchami har bo'limda TURLICHA (maketda
 * 50 / 58 / 62px), shuning uchun uni shu yerga yozib bo'lmaydi — aks holda
 * bo'limdagi `lg:text-[50px]` bilan to'qnashadi va qaysi biri yutishi
 * Tailwind'ning CSS tartibiga bog'liq bo'lib qoladi.
 *
 * Ishlatish: `${H2} ${H2_LG[50]}` yoki `${H2} lg:text-[50px] lg:leading-[51px]`
 */
export const H2 =
  "font-display text-[34px] font-bold leading-[1.03] tracking-[-0.045em] text-ink-deep sm:text-[44px]";

/** Maketdagi desktop sarlavha o'lchamlari (kegl / qator balandligi). */
export const H2_LG = {
  50: "lg:text-[50px] lg:leading-[51px]",
  58: "lg:text-[58px] lg:leading-[59.16px]",
  62: "lg:text-[62px] lg:leading-[62px]",
} as const;

/** Bo'lim ichidagi asosiy matn. Figma: Inter 16px / 27.2px, #607776. */
export const BODY = "text-[16px] leading-[1.7] text-body";

/**
 * Bo'limlarning MOBIL vertikal ritmi.
 *
 * Desktop qiymatlari Figma maketiga qattiq bog'langan — bo'limlar orasidagi
 * masofa maketdan o'lchab chiqilgan (178/222/185/163/117/96/206/85/108 px),
 * shuning uchun bu yerda faqat mobil qiymat beriladi va har bir bo'lim
 * o'zining `lg:` qiymatini qo'shadi.
 */
export const SECTION_Y = "py-14 sm:py-[72px]";
export const SECTION_PT = "pt-14 sm:pt-[72px]";
export const SECTION_PB = "pb-14 sm:pb-[72px]";

/** Shartli class nomlarini birlashtirish uchun kichik yordamchi. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Mahsulotning tilga xos nomi (ruschada kirill, o'zbekchada lotin).
 * Admin panelda to'ldirilmagan bo'lsa umumiy `name` ishlatiladi.
 *
 * Faqat `import type` ishlatilgani uchun bu funksiya klient komponentlarda
 * ham xavfsiz — store'ning fayl tizimi kodi bandlga tushmaydi.
 */
export function productName(product: Product, locale: Locale): string {
  return product[locale].name.trim() || product.name;
}
