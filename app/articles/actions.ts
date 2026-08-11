"use server";

import { bumpArticleViews } from "@/lib/admin/store";

/**
 * Maqola ochilganda ko'rishlar sonini oshiradi.
 * Ochiq action — faqat mavjud maqolaning hisoblagichini bittaga oshiradi.
 */
export async function registerArticleView(id: string): Promise<void> {
  if (!id) return;
  await bumpArticleViews(id);
}
