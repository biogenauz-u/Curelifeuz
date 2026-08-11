/**
 * Matn tarjimasi. Ikkita provayder bor, `TRANSLATE_PROVIDER` bilan tanlanadi:
 *
 *   google (standart) — Google Translate'ning ochiq endpointi. Kalit ham,
 *                       to'lov ham kerak emas.
 *   claude            — Claude API (ANTHROPIC_API_KEY kerak). Sifati yaxshiroq,
 *                       lekin pullik.
 *
 * ⚠️ Google endpointi rasmiy hujjatlashtirilmagan: juda ko'p so'rovda
 * vaqtincha bloklashi mumkin. Shu sababli bir xil matnlar keshlanadi va
 * so'rovlar kichik guruhlarga bo'lib yuboriladi.
 */

export type Locale = "ru" | "uz";

/** Foydalanuvchiga ko'rsatiladigan matn bilan xato. */
export class TranslateError extends Error {}

const GOOGLE_URL = "https://translate.googleapis.com/translate_a/single";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

/**
 * O'zbekcha apostroflarni sayt uslubiga keltiradi:
 * `o'`/`g'` → `o‘`/`g‘`, qolgan tutuq belgisi → `’`.
 */
export function normalizeUzbek(text: string): string {
  return text
    .replace(/([ogOG])[ʻʼ'‘’`´]/g, (_, letter: string) => `${letter}‘`)
    .replace(/[ʻʼ'`´]/g, "’");
}

async function googleOnce(
  text: string,
  from: Locale,
  to: Locale,
): Promise<string> {
  const url = `${GOOGLE_URL}?client=gtx&sl=${from}&tl=${to}&dt=t`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      "user-agent": UA,
    },
    body: new URLSearchParams({ q: text }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new TranslateError(
      response.status === 429
        ? "Tarjima xizmati vaqtincha so‘rovlarni cheklab qo‘ydi. Bir necha daqiqadan keyin qayta urinib ko‘ring."
        : `Tarjima xizmati javob bermadi (${response.status}).`,
    );
  }

  // Javob: [[["tarjima","asl",...], ...], ...] — bo'laklarni birlashtiramiz.
  const data = (await response.json()) as unknown;
  const segments = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
  const out = segments
    .map((s) => (Array.isArray(s) && typeof s[0] === "string" ? s[0] : ""))
    .join("");

  if (!out.trim()) throw new TranslateError("Tarjima xizmatidan bo‘sh javob keldi.");
  return to === "uz" ? normalizeUzbek(out) : out;
}

async function google(
  texts: string[],
  from: Locale,
  to: Locale,
): Promise<string[]> {
  // Bir xil matnlar (masalan umumiy xavfsizlik jumlalari) bir marta so'raladi.
  const cache = new Map<string, string>();
  const unique = [...new Set(texts.filter((t) => t.trim()))];

  for (let i = 0; i < unique.length; i += 5) {
    const chunk = unique.slice(i, i + 5);
    const results = await Promise.all(
      chunk.map(async (text) => {
        try {
          return await googleOnce(text, from, to);
        } catch (error) {
          // Bir marta qayta urinib ko'ramiz — vaqtinchalik uzilishlar uchun.
          await new Promise((r) => setTimeout(r, 700));
          if (error instanceof TranslateError && /cheklab/.test(error.message)) throw error;
          return googleOnce(text, from, to);
        }
      }),
    );
    chunk.forEach((text, j) => cache.set(text, results[j]));
  }

  return texts.map((t) => (t.trim() ? (cache.get(t) ?? t) : t));
}

const CLAUDE_SYSTEM = `You translate product-passport text for CureLife, an Uzbek dietary-supplement company.

Rules:
- Translate faithfully. Never add, drop, or strengthen a claim — these texts are regulated.
- Keep brand and company names (CureLife, SternVitamin, EVERT Pharma AG), numbers, units and dosages exactly as written.
- Translate country names naturally (Германия ↔ Germaniya, Узбекистан ↔ O‘zbekiston).
- Uzbek uses the Latin alphabet with the ‘ character in o‘ and g‘.
- Return exactly one output string per input string, in the same order. Keep empty strings empty.`;

async function claude(
  texts: string[],
  from: Locale,
  to: Locale,
): Promise<string[]> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const language = { ru: "Russian", uz: "Uzbek (Latin script)" };

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: CLAUDE_SYSTEM,
      output_config: {
        effort: "low",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: { items: { type: "array", items: { type: "string" } } },
            required: ["items"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: `Translate each string from ${language[from]} to ${language[to]}.\n\n${JSON.stringify(texts, null, 2)}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      throw new TranslateError("Matnni tarjima qilib bo‘lmadi. Matnni tekshirib ko‘ring.");
    }

    const raw = response.content.find((b) => b.type === "text")?.text;
    if (!raw) throw new TranslateError("Tarjimadan bo‘sh javob keldi.");

    const parsed = JSON.parse(raw) as { items?: unknown };
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    return texts.map((t, i) => (typeof items[i] === "string" ? items[i] : t));
  } catch (error) {
    if (error instanceof TranslateError) throw error;
    const message = error instanceof Error ? error.message : "";

    if (/authentication method|ANTHROPIC_API_KEY/i.test(message)) {
      throw new TranslateError(
        "Tarjima kaliti sozlanmagan. .env.local fayliga ANTHROPIC_API_KEY qo‘shing.",
      );
    }
    if (/credit balance/i.test(message)) {
      throw new TranslateError(
        "Anthropic hisobingizda mablag‘ tugagan. TRANSLATE_PROVIDER=google qilib qo‘ying yoki hisobni to‘ldiring.",
      );
    }
    if (/rate limit|429/i.test(message)) {
      throw new TranslateError("So‘rovlar chegarasi to‘ldi. Bir oz kutib, qayta urinib ko‘ring.");
    }
    console.error("claude translate", error);
    throw new TranslateError("Tarjimada xatolik yuz berdi. Qayta urinib ko‘ring.");
  }
}

/**
 * Matnlar ro'yxatini tarjima qiladi. Javob har doim kirish bilan bir xil
 * uzunlikda va tartibda bo'ladi; bo'sh satrlar bo'sh qoladi.
 */
export async function translateMany(
  texts: string[],
  from: Locale,
  to: Locale,
): Promise<string[]> {
  if (!texts.some((t) => t.trim())) return texts;

  const provider = process.env.TRANSLATE_PROVIDER === "claude" ? "claude" : "google";

  try {
    return provider === "claude"
      ? await claude(texts, from, to)
      : await google(texts, from, to);
  } catch (error) {
    if (error instanceof TranslateError) throw error;
    if (error instanceof Error && /timed out|aborted|fetch failed/i.test(error.message)) {
      throw new TranslateError(
        "Tarjima xizmatiga ulanib bo‘lmadi. Internet aloqasini tekshiring.",
      );
    }
    console.error("translateMany", error);
    throw new TranslateError("Tarjimada xatolik yuz berdi. Qayta urinib ko‘ring.");
  }
}
