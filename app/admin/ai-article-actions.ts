"use server";

import { AiArticleError, generateArticleFromUrl } from "@/lib/admin/ai-article";
import { assertAdmin } from "@/lib/admin/guard";
import type { ArticleLocale } from "@/lib/admin/store";

export type GenerateArticleResult =
  | { ok: true; data: ArticleLocale }
  | { ok: false; error: string };

export async function generateArticle(url: string): Promise<GenerateArticleResult> {
  await assertAdmin();

  try {
    const data = await generateArticleFromUrl(url);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AiArticleError
          ? error.message
          : "Maqola tayyorlashda xatolik yuz berdi. Qayta urinib ko‘ring.",
    };
  }
}
