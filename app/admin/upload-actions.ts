"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { saveUploadedFile } from "@/lib/admin/uploads";

export type UploadImageResult = { ok: true; url: string } | { ok: false; error: string };

/** Rich-text muharrirga rasm qo'yish uchun — mustaqil (forma bilan bog'liq emas). */
export async function uploadEditorImage(file: File): Promise<UploadImageResult> {
  await assertAdmin();

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Rasm tanlanmagan." };
  }

  try {
    const url = await saveUploadedFile(file, "image");
    return { ok: true, url };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Rasmni yuklab bo‘lmadi.",
    };
  }
}
