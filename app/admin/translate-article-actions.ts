"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { isImageBlock, splitTopLevelBlocks } from "@/lib/admin/html-blocks";
import type { ArticleLocale } from "@/lib/admin/store";
import { type Locale, TranslateError, translateMany } from "@/lib/admin/translator";

export type TranslateArticleResult =
  | { ok: true; data: ArticleLocale }
  | { ok: false; error: string };

/** Maqola sarlavhasi va matnini ikkinchi tilga tarjima qiladi. */
export async function translateArticle(input: {
  from: Locale;
  fields: ArticleLocale;
}): Promise<TranslateArticleResult> {
  await assertAdmin();

  const { title, body } = input.fields;
  if (!title.trim() && !body.trim()) {
    return { ok: false, error: "Avval matnni to‘ldiring, keyin tarjima qiling." };
  }

  const to: Locale = input.from === "ru" ? "uz" : "ru";

  try {
    // Har bir blok (<p>, <h2>, <ul> va h.k.) o'z ichidagi <strong>/<a> kabi
    // teglar bilan birga bitta birlik sifatida tarjima qilinadi — shunda
    // bo'lim tuzilishi (sarlavhalar, ro'yxatlar, havolalar) saqlanib qoladi.
    // Rasm bloklari ("<img ...>") tarjimasiz, o'zgarishsiz qoladi.
    const blocks = splitTopLevelBlocks(body);
    const translatableIdx: number[] = [];
    const toTranslate: string[] = [];
    blocks.forEach((block, i) => {
      if (isImageBlock(block)) return;
      translatableIdx.push(i);
      toTranslate.push(block);
    });

    const out = await translateMany([title, ...toTranslate], input.from, to);
    const translatedBlocks = [...blocks];
    translatableIdx.forEach((blockIndex, j) => {
      translatedBlocks[blockIndex] = out[1 + j] ?? blocks[blockIndex];
    });

    return {
      ok: true,
      data: { title: out[0] ?? "", body: translatedBlocks.join("") },
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof TranslateError
          ? error.message
          : "Tarjimada xatolik yuz berdi. Qayta urinib ko‘ring.",
    };
  }
}
