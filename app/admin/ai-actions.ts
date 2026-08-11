"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { AiFillError, fillProductFromText } from "@/lib/admin/ai-fill";
import type { ProductLocale } from "@/lib/admin/store";

export type AiFillResult =
  | { ok: true; data: ProductLocale }
  | { ok: false; error: string };

/**
 * Admin mahsulot haqida erkin matn kiritadi (masalan qadoqdagi yozuv) —
 * shu matndan o'zbekcha maydonlar avtomatik to'ldiriladi. Rus tiliga esa
 * mavjud "⇄ Tarjima qilish" tugmasi orqali o'tkaziladi.
 */
export async function fillProduct(text: string): Promise<AiFillResult> {
  await assertAdmin();

  try {
    const data = await fillProductFromText(text);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AiFillError
          ? error.message
          : "AI to‘ldirishda xatolik yuz berdi. Qayta urinib ko‘ring.",
    };
  }
}
