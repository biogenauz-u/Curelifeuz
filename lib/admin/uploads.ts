import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Admin paneldan yuklangan fayllar (mahsulot rasmlari, sertifikat,
 * yo'riqnoma) `public/uploads/` ichida saqlanadi va saytga
 * `/uploads/<nom>` manzili orqali beriladi.
 *
 * ⚠️ Store'dagi JSON kabi, bu ham diskka yoziladi — doimiy diskli hostingda
 * (VPS/Docker) ishlaydi. Serverless muhitda S3 kabi obyekt saqlagichga
 * o'tkazish kerak bo'ladi.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Saqlangan fayl URL'i shu prefiks bilan boshlanadi. */
export const UPLOAD_PREFIX = "/uploads/";

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
 * Yuklangan faylni saqlaydi va uning ommaviy URL'ini qaytaradi.
 * Xatolik bo'lsa foydalanuvchiga ko'rsatiladigan matn bilan `Error` tashlaydi.
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

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}${EXTENSIONS[type]}`;
  await writeFile(path.join(UPLOAD_DIR, name), bytes);

  return UPLOAD_PREFIX + name;
}

/**
 * Eski faylni diskdan o'chiradi. Faqat o'zimiz yuklagan fayllarga tegadi —
 * `/images/...` dagi dizayn rasmlari saqlanib qoladi.
 */
export async function deleteUploadedFile(url: string | null): Promise<void> {
  if (!url || !url.startsWith(UPLOAD_PREFIX)) return;

  const name = path.basename(url);
  const target = path.join(UPLOAD_DIR, name);
  // Papkadan chiqib ketishga urinishlarni to'sish.
  if (path.dirname(target) !== UPLOAD_DIR) return;

  try {
    await unlink(target);
  } catch {
    // Fayl allaqachon yo'q — muammo emas.
  }
}
