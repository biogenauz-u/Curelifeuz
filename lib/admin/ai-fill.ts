/**
 * Erkin matndan mahsulot paspoti maydonlarini avtomatik ajratib olish
 * (admin panel — "Yangi mahsulot" formasi tepasidagi AI qismi).
 *
 * Google Gemini'ning bepul API'idan foydalanadi (`GEMINI_API_KEY`).
 * Tarjima (`translator.ts`) uchun ishlatiladigan Google/Claude
 * provayderlaridan MUSTAQIL — bu yerda erkin matnni tuzilmali JSON'ga
 * aylantirish kerak, oddiy tarjima emas.
 */

import { normalizeUzbek } from "@/lib/admin/translator";
import { emptyDetail, normalizeDetail, type ProductLocale } from "@/lib/admin/store";

/** Foydalanuvchiga ko'rsatiladigan matn bilan xato. */
export class AiFillError extends Error {}

// «-latest» taxallusi Google tomonidan doim joriy Flash modeliga yo'naltiriladi —
// aniq versiya nomlari (masalan «gemini-2.5-flash») vaqti-vaqti bilan yopilib qoladi.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const SYSTEM_PROMPT = `You extract structured product-passport data for CureLife, an Uzbek dietary-supplement company, from free-form text an admin pastes in (often Russian, sometimes mixed languages, copied from a packaging insert or supplier sheet).

Rules:
- Output every field in Uzbek, Latin script, using ‘ (U+2018) in o‘ and g‘ — never a plain apostrophe.
- Only use facts explicitly present in the source text. Never invent numbers, countries, company names, or claims. If a field isn't mentioned, return an empty string ("") or empty array ([]) for it — do not guess.
- Keep numbers, units and dosages exactly as written (just translate surrounding words).
- "originType" is "imported" only if the text says the product itself is fully imported/made abroad with no local manufacturing step. Otherwise, if it mentions raw material from one country and manufacturing in another (or manufacturing isn't mentioned at all), use "local".
- "dailyDose" is just the number of capsules/doses per day (e.g. "1", "2"), not a sentence.
- "composition" lists active ingredients with their per-dose amount (e.g. amount: "500 mg"). Skip inactive/auxiliary ingredients unless clearly the point of the text.
- "safety" is a list of short warning cards, each with its own title (e.g. contraindications, pregnancy, storage) and body.
- "beforeUse" is a list of short bullet-point precautions to check before taking the product.`;

/** Gemini `responseSchema` — OpenAPI-ga o'xshash subset, `type` katta harfda. */
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" },
    category: { type: "STRING" },
    description: { type: "STRING" },
    dosageForm: { type: "STRING" },
    packageQuantity: { type: "STRING" },
    intakeInstructions: { type: "STRING" },
    warning: { type: "STRING" },
    rawMaterialFact: { type: "STRING" },
    manufacturerFact: { type: "STRING" },
    usageTitle: { type: "STRING" },
    usageBody: { type: "STRING" },
    dailyDose: { type: "STRING" },
    beforeUse: { type: "ARRAY", items: { type: "STRING" } },
    safety: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { title: { type: "STRING" }, body: { type: "STRING" } },
        required: ["title", "body"],
      },
    },
    composition: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { name: { type: "STRING" }, amount: { type: "STRING" } },
        required: ["name", "amount"],
      },
    },
    originType: { type: "STRING", enum: ["local", "imported"] },
    rawCountry: { type: "STRING" },
    makeCountry: { type: "STRING" },
    rawFull: { type: "STRING" },
    manufacturerFull: { type: "STRING" },
    role: { type: "STRING" },
    importedCountry: { type: "STRING" },
    importedFull: { type: "STRING" },
  },
  required: [
    "name", "category", "description", "dosageForm", "packageQuantity",
    "intakeInstructions", "warning", "rawMaterialFact", "manufacturerFact",
    "usageTitle", "usageBody", "dailyDose", "beforeUse", "safety",
    "composition", "originType", "rawCountry", "makeCountry", "rawFull",
    "manufacturerFull", "role", "importedCountry", "importedFull",
  ],
};

type GeminiFields = {
  name: string;
  category: string;
  description: string;
  dosageForm: string;
  packageQuantity: string;
  intakeInstructions: string;
  warning: string;
  rawMaterialFact: string;
  manufacturerFact: string;
  usageTitle: string;
  usageBody: string;
  dailyDose: string;
  beforeUse: string[];
  safety: Array<{ title: string; body: string }>;
  composition: Array<{ name: string; amount: string }>;
  originType: "local" | "imported";
  rawCountry: string;
  makeCountry: string;
  rawFull: string;
  manufacturerFull: string;
  role: string;
  importedCountry: string;
  importedFull: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? normalizeUzbek(v.trim()) : "";
}

/** Gemini javobini formaga mos `ProductLocale` (uz) shakliga o'giradi. */
function toProductLocale(fields: GeminiFields): ProductLocale {
  const detail = normalizeDetail({
    ...emptyDetail(),
    warning: str(fields.warning),
    raw: str(fields.rawMaterialFact),
    manufacturer: str(fields.manufacturerFact),
    usageTitle: str(fields.usageTitle),
    usageBody: str(fields.usageBody),
    // Faqat raqam kerak — «1 kapsula» kabi to'liq jumla kelib qolsa ham.
    dailyDose: str(fields.dailyDose).match(/\d+/)?.[0] ?? str(fields.dailyDose),
    before: Array.isArray(fields.beforeUse) ? fields.beforeUse.map(str).filter(Boolean) : [],
    safety: Array.isArray(fields.safety)
      ? fields.safety
          .map((s) => ({ title: str(s?.title), body: str(s?.body) }))
          .filter((s) => s.title || s.body)
      : [],
    composition: Array.isArray(fields.composition)
      ? fields.composition
          .map((c) => ({ name: str(c?.name), amount: str(c?.amount) }))
          .filter((c) => c.name || c.amount)
      : [],
    origin: {
      type: fields.originType === "imported" ? "imported" : "local",
      rawCountry: str(fields.rawCountry),
      makeCountry: str(fields.makeCountry),
      rawFull: str(fields.rawFull),
      manufacturerFull: str(fields.manufacturerFull),
      role: str(fields.role),
      importedCountry: str(fields.importedCountry),
      importedFull: str(fields.importedFull),
    },
  });

  return {
    name: str(fields.name),
    category: str(fields.category),
    description: str(fields.description),
    stats: [str(fields.dosageForm), str(fields.packageQuantity), str(fields.intakeInstructions)],
    detail,
  };
}

/**
 * Erkin matndan (mahsulot haqidagi to'liq ma'lumot) o'zbekcha `ProductLocale`
 * ni tuzadi. `GEMINI_API_KEY` sozlanmagan bo'lsa foydalanuvchiga tushunarli
 * xato qaytaradi.
 */
export async function fillProductFromText(rawText: string): Promise<ProductLocale> {
  const text = rawText.trim();
  if (!text) throw new AiFillError("Avval mahsulot haqida matn kiriting.");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiFillError(
      "GEMINI_API_KEY sozlanmagan. https://aistudio.google.com/apikey dan bepul kalit oling va .env.local fayliga qo‘shing.",
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    if (error instanceof Error && /timed out|aborted|fetch failed/i.test(error.message)) {
      throw new AiFillError("Gemini xizmatiga ulanib bo‘lmadi. Internet aloqasini tekshiring.");
    }
    throw error;
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new AiFillError("Gemini so‘rovlar chegarasi to‘ldi. Bir oz kutib, qayta urinib ko‘ring.");
    }
    if (response.status === 400 || response.status === 403) {
      throw new AiFillError("GEMINI_API_KEY noto‘g‘ri yoki faol emas. Kalitni tekshiring.");
    }
    const body = await response.text().catch(() => "");
    console.error("gemini fill", response.status, body);
    throw new AiFillError(`Gemini xizmati javob bermadi (${response.status}).`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
  };

  const candidate = data.candidates?.[0];
  if (candidate?.finishReason === "SAFETY") {
    throw new AiFillError("Matn xavfsizlik filtridan o‘tmadi. Matnni tekshirib ko‘ring.");
  }

  const raw = candidate?.content?.parts?.[0]?.text;
  if (!raw) throw new AiFillError("Gemini'dan bo‘sh javob keldi.");

  let fields: GeminiFields;
  try {
    fields = JSON.parse(raw) as GeminiFields;
  } catch {
    throw new AiFillError("Gemini javobini o‘qib bo‘lmadi. Qayta urinib ko‘ring.");
  }

  return toProductLocale(fields);
}
