/**
 * Admin panelidagi bo'limlar. Alohida (klient bo'lmagan) faylda, chunki
 * `parseView` server komponentida ham chaqiriladi.
 */
export type View =
  | "dashboard"
  | "products"
  | "articles"
  | "certificates"
  | "content"
  | "messages"
  | "settings";

const VIEWS: View[] = [
  "dashboard",
  "products",
  "articles",
  "certificates",
  "content",
  "messages",
  "settings",
];

/** `/admin?view=products` — masalan mahsulot saqlangandan keyin qaytish uchun. */
export function parseView(value: unknown): View {
  return VIEWS.includes(value as View) ? (value as View) : "dashboard";
}
