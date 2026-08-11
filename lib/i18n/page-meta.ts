import type { Metadata } from "next";

import { getPagesMeta } from "@/lib/admin/store";

import { resolveLocale } from "./server";

/**
 * Admin panelda sahifa uchun title/description kiritilgan bo'lsa — o'sha
 * ishlatiladi, bo'lmasa lug'atdagi standart matn qoladi.
 */
export async function resolvePageMeta(
  key: string,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  const [locale, pages] = await Promise.all([resolveLocale(), getPagesMeta()]);
  const custom = pages[key]?.[locale];

  return {
    title: custom?.title?.trim() || fallback.title,
    description: custom?.description?.trim() || fallback.description,
  };
}
