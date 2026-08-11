"use client";

import { useEffect, useRef } from "react";

import { registerArticleView } from "@/app/articles/actions";

/**
 * Maqola ochilganda ko'rishlar sonini bir marta oshiradi.
 * Render paytida emas, mount'dan keyin ishlaydi — shuning uchun
 * prefetch va bot so'rovlari hisobga qo'shilmaydi.
 */
export function ViewCounter({ articleId }: { articleId: string }) {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    void registerArticleView(articleId);
  }, [articleId]);

  return null;
}
