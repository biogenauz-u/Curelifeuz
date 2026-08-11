"use server";

import { assertAdmin } from "@/lib/admin/guard";
import { normalizeDetail, type ProductLocale } from "@/lib/admin/store";
import { type Locale, TranslateError, translateMany } from "@/lib/admin/translator";

/**
 * Mahsulotning bitta tildagi barcha matnlarini ikkinchi tilga tarjima qiladi.
 *
 * Matnlar tekis ro'yxatga yig'iladi, tarjima qilinadi va o'sha tartibda
 * qaytariladi — shu sababli provayderni almashtirish (`TRANSLATE_PROVIDER`)
 * bu faylga tegmaydi.
 *
 * Miqdorlar («500 mg») tarjima qilinmaydi — ular o'zgarishsiz ko'chiriladi.
 */

export type TranslateResult =
  | { ok: true; data: ProductLocale }
  | { ok: false; error: string };

/** Sobit tartibdagi maydonlar — indekslar yig'ish va qayta yig'ishda bir xil. */
function flatten(f: ProductLocale): string[] {
  const d = f.detail;
  return [
    f.category,
    f.description,
    f.stats[0],
    f.stats[1],
    f.stats[2],
    d.warning,
    d.raw,
    d.manufacturer,
    d.usageTitle,
    d.usageBody,
    d.origin.rawCountry,
    d.origin.makeCountry,
    d.origin.rawFull,
    d.origin.manufacturerFull,
    d.origin.role,
    d.origin.importedCountry,
    d.origin.importedFull,
    ...d.before,
    ...d.safety.flatMap((s) => [s.title, s.body]),
    ...d.composition.map((c) => c.name),
  ];
}

const FIXED = 17;

function rebuild(source: ProductLocale, out: string[]): ProductLocale {
  const d = source.detail;
  let i = FIXED;

  const before = d.before.map(() => out[i++] ?? "");
  const safety = d.safety.map(() => ({
    title: out[i++] ?? "",
    body: out[i++] ?? "",
  }));
  const composition = d.composition.map((c) => ({
    name: out[i++] ?? "",
    // Miqdor tarjima qilinmaydi.
    amount: c.amount,
  }));

  return {
    name: source.name,
    category: out[0] ?? "",
    description: out[1] ?? "",
    stats: [out[2] ?? "", out[3] ?? "", out[4] ?? ""],
    detail: normalizeDetail({
      warning: out[5] ?? "",
      raw: out[6] ?? "",
      manufacturer: out[7] ?? "",
      usageTitle: out[8] ?? "",
      usageBody: out[9] ?? "",
      // Raqam — tarjima qilinmaydi, o'zgarishsiz ko'chiriladi.
      dailyDose: d.dailyDose,
      origin: {
        // Tur (local/imported) — tarjima qilinmaydi, o'zgarishsiz ko'chiriladi.
        type: d.origin.type,
        rawCountry: out[10] ?? "",
        makeCountry: out[11] ?? "",
        rawFull: out[12] ?? "",
        manufacturerFull: out[13] ?? "",
        role: out[14] ?? "",
        importedCountry: out[15] ?? "",
        importedFull: out[16] ?? "",
      },
      before,
      safety,
      composition,
    }),
  };
}

export async function translateProduct(input: {
  from: Locale;
  name: string;
  fields: ProductLocale;
}): Promise<TranslateResult> {
  await assertAdmin();

  const texts = flatten(input.fields);
  if (!texts.some((t) => t.trim())) {
    return { ok: false, error: "Avval matnlarni to‘ldiring, keyin tarjima qiling." };
  }

  const to: Locale = input.from === "ru" ? "uz" : "ru";

  try {
    const translated = await translateMany(texts, input.from, to);
    return { ok: true, data: rebuild(input.fields, translated) };
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
