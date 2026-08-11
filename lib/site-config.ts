/**
 * Tashqi manzillar uchun yagona joy.
 *
 * ⚠️ TODO (mijozdan olinadi): quyidagi qiymatlar `null` bo'lsa, saytda
 * havola ko'rsatiladi, lekin bosilmaydi — soxta `href="#"` qoldirmaslik
 * uchun. Haqiqiy manzil kelganda shu yerga yozilsa, hamma joyda ishlaydi.
 */
export const SOCIAL_LINKS: Record<
  "instagram" | "telegram" | "facebook" | "youtube",
  string | null
> = {
  instagram: null,
  telegram: null,
  facebook: null,
  youtube: null,
};

/**
 * Bosh sahifadagi ishlab chiqarish videosi (YouTube/Vimeo havolasi yoki
 * `/videos/...` fayli). `null` bo'lsa poster rasm statik ko'rsatiladi va
 * ishlamaydigan "play" tugmasi chizilmaydi.
 */
export const VIDEO_URL: string | null = null;

/**
 * Sertifikatlar bo'limining yagona manzili. Haqiqiy hujjatlar `/about`
 * sahifasida, shuning uchun barcha menyu va CTA shu yerga olib boradi.
 */
export const CERTIFICATES_HREF = "/about#certificates";

/**
 * Ofis joylashuvi — Yandex Xaritalar.
 *
 * `MAP_LINK` — foydalanuvchini to'liq xaritaga olib boradigan qisqa havola.
 * `MAP_EMBED` — sahifaga qo'yiladigan interaktiv xarita (iframe).
 *
 * Koordinatalar qisqa havoladan olingan: Zargarlik ko'chasi 30V, 3-kirish.
 * Manzil o'zgarsa: Yandex Xaritalarda joyni oching → «Поделиться» →
 * «Код для сайта» va bu yerdagi ikkala qiymatni yangilang.
 */
export const MAP_LINK = "https://yandex.uz/maps/-/CTSzqRY3";

export const MAP_EMBED =
  "https://yandex.uz/map-widget/v1/?ll=69.165478%2C41.262323&z=17&pt=69.165478,41.262323,pm2rdm";
