import { randomUUID } from "node:crypto";

import { supabaseAdmin, UPLOADS_BUCKET } from "@/lib/admin/supabase";

/**
 * Admin paneldan yuklangan fayllar (mahsulot rasmlari, sertifikat,
 * yo'riqnoma) Supabase Storage'ning `uploads` (ochiq) bucket'ida saqlanadi.
 * `saveUploadedFile` to'liq ommaviy URL qaytaradi — u to'g'ridan-to'g'ri
 * `<Image>`/`<a href>` da ishlatiladi, hech qanday qo'shimcha proksi kerak
 * emas.
 */

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * SVG ataylab ro'yxatda yo'q: u bir xil domendan beriladi va ichida skript
 * bo'lishi mumkin (XSS). Faqat rasterli formatlar va PDF qabul qilinadi.
 */
const EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

/** Rasm kutilayotgan joyda PDF qabul qilinmaydi. */
export type UploadKind = "image" | "document";

/** `file.type` klientdan keladi — shuning uchun fayl imzosi ham tekshiriladi. */
function detectType(bytes: Buffer): string | null {
  if (bytes.length < 16) return null;
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes.subarray(0, 4).toString("latin1") === "RIFF" &&
    bytes.subarray(8, 12).toString("latin1") === "WEBP"
  ) {
    return "image/webp";
  }
  if (bytes.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = bytes.subarray(8, 12).toString("latin1");
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  if (bytes.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  return null;
}

/**
 * Yuklangan faylni Supabase Storage'ga saqlaydi va uning ommaviy URL'ini
 * qaytaradi. Xatolik bo'lsa foydalanuvchiga ko'rsatiladigan matn bilan
 * `Error` tashlaydi.
 */
export async function saveUploadedFile(
  file: File,
  kind: UploadKind = "image",
): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("Fayl hajmi 10 MB dan oshmasligi kerak.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const type = detectType(bytes);
  const allowed = type && (kind === "document" || type !== "application/pdf");

  if (!type || !allowed) {
    throw new Error(
      kind === "document"
        ? "Faqat PDF, PNG, JPG, WEBP yoki AVIF fayl yuklash mumkin."
        : "Faqat PNG, JPG, WEBP yoki AVIF rasm yuklash mumkin.",
    );
  }

  const name = `${randomUUID()}${EXTENSIONS[type]}`;
  const { error } = await supabaseAdmin()
    .storage.from(UPLOADS_BUCKET)
    .upload(name, bytes, { contentType: type, upsert: false });

  if (error) throw new Error(`Faylni yuklab bo‘lmadi: ${error.message}`);

  return supabaseAdmin().storage.from(UPLOADS_BUCKET).getPublicUrl(name).data.publicUrl;
}

/**
 * Eski faylni Storage'dan o'chiradi. Faqat o'zimiz yuklagan fayllarga
 * tegadi — `/images/...` dagi dizayn rasmlari (repo bilan birga keladi)
 * saqlanib qoladi.
 */
export async function deleteUploadedFile(url: string | null): Promise<void> {
  if (!url) return;

  const marker = `/storage/v1/object/public/${UPLOADS_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const name = url.slice(index + marker.length);
  if (!name) return;

  const { error } = await supabaseAdmin().storage.from(UPLOADS_BUCKET).remove([name]);
  if (error) console.error(`deleteUploadedFile(${name})`, error);
}
