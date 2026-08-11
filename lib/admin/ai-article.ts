/**
 * Havoladan maqola tayyorlash (admin panel — "Maqolalar" bo'limi).
 *
 * Admin bironta manba havolasini beradi — shu sahifa matni o'qib olinadi va
 * Google Gemini (bepul API, `GEMINI_API_KEY`) yordamida CureLife blogi uchun
 * ORIGINAL (so'zma-so'z ko'chirilmagan) o'zbekcha maqolaga aylantiriladi.
 * Natija darhol saqlanmaydi — admin uni tahrirlab, keyin "Tarjima qilish"
 * bilan ruschaga o'tkazadi.
 */

import { sanitizeArticleBody } from "@/lib/admin/sanitize";
import type { ArticleLocale } from "@/lib/admin/store";

export class AiArticleError extends Error {}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[?::1\]?|0\.0\.0\.0)/i;

/** Ichki/lokal manzillarga so'rov yuborilishining oldini oladi (SSRF himoyasi). */
function assertPublicHttpUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new AiArticleError("Havola noto‘g‘ri formatda.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new AiArticleError("Faqat http:// yoki https:// havolalar qabul qilinadi.");
  }
  const host = url.hostname;
  const is172 = /^172\.(\d+)\./.exec(host);
  if (PRIVATE_HOST_RE.test(host) || (is172 && Number(is172[1]) >= 16 && Number(is172[1]) <= 31)) {
    throw new AiArticleError("Bu havolaga so‘rov yuborib bo‘lmaydi.");
  }
  return url;
}

/** Sahifa HTML'ini o'qib, tozalab, oddiy matn qilib qaytaradi. */
async function fetchSourceText(url: URL): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      },
    });
  } catch (error) {
    if (error instanceof Error && /timed out|aborted/i.test(error.message)) {
      throw new AiArticleError("Havola javob bermadi (vaqt tugadi).");
    }
    throw new AiArticleError("Havolaga ulanib bo‘lmadi.");
  }

  if (!response.ok) {
    throw new AiArticleError(`Sahifa ochilmadi (${response.status}).`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !contentType.includes("html") && !contentType.includes("text")) {
    throw new AiArticleError("Bu havola HTML sahifa emas.");
  }

  const html = await response.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length < 40) {
    throw new AiArticleError("Sahifadan yetarli matn topilmadi.");
  }
  // Gemini kontekstiga sig'dirish uchun cheklanadi.
  return text.slice(0, 24_000);
}

const SYSTEM_PROMPT = `You are a content writer for CureLife, an Uzbek dietary-supplement (BAD) company's blog. You are given raw extracted text from a source web page (any language). Write a NEW, ORIGINAL article in Uzbek (Latin script) inspired by that source's topic and key facts — never translate or copy it sentence-by-sentence, rewrite it in your own words and structure it for CureLife's audience.

Rules:
- Uzbek Latin script, using ‘ (U+2018) in o‘ and g‘ — never a plain apostrophe.
- Professional, calm, informative tone. Short paragraphs (2-4 sentences). No hype, no exaggerated claims.
- CureLife sells dietary supplements (BAD), not medicine — never claim a supplement cures, treats, or prevents a disease. If the source discusses a health condition, keep the article educational/informational, not prescriptive, and where relevant remind the reader that a doctor's advice matters for personal health decisions.
- Structure bodyHtml as clean semantic HTML using ONLY these tags: <p>, <h2>, <h3>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>. Use 2-4 <h2> subheadings to break up the article. Use a list where it genuinely helps readability. No inline styles, no class attributes, no <a> or <img> unless the source text itself names a specific external reference worth linking (rare — omit if unsure).
- Do not invent statistics, studies, or specific numbers that aren't grounded in the source text.
- title: a concise, engaging Uzbek headline (no more than ~70 characters).`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    bodyHtml: { type: "STRING" },
  },
  required: ["title", "bodyHtml"],
};

async function callGemini(sourceText: string, sourceUrl: string): Promise<{ title: string; bodyHtml: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiArticleError(
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
        contents: [
          {
            role: "user",
            parts: [{ text: `Source URL: ${sourceUrl}\n\nSource page text:\n${sourceText}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (error) {
    if (error instanceof Error && /timed out|aborted|fetch failed/i.test(error.message)) {
      throw new AiArticleError("Gemini xizmatiga ulanib bo‘lmadi. Internet aloqasini tekshiring.");
    }
    throw error;
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new AiArticleError("Gemini so‘rovlar chegarasi to‘ldi. Bir oz kutib, qayta urinib ko‘ring.");
    }
    if (response.status === 400 || response.status === 403) {
      throw new AiArticleError("GEMINI_API_KEY noto‘g‘ri yoki faol emas. Kalitni tekshiring.");
    }
    const body = await response.text().catch(() => "");
    console.error("gemini article", response.status, body);
    throw new AiArticleError(`Gemini xizmati javob bermadi (${response.status}).`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  };
  const candidate = data.candidates?.[0];
  if (candidate?.finishReason === "SAFETY") {
    throw new AiArticleError("Manba matni xavfsizlik filtridan o‘tmadi.");
  }

  const raw = candidate?.content?.parts?.[0]?.text;
  if (!raw) throw new AiArticleError("Gemini'dan bo‘sh javob keldi.");

  try {
    return JSON.parse(raw) as { title: string; bodyHtml: string };
  } catch {
    throw new AiArticleError("Gemini javobini o‘qib bo‘lmadi. Qayta urinib ko‘ring.");
  }
}

/** Havoladan o'zbekcha `ArticleLocale` (sarlavha + tozalangan HTML matn) tayyorlaydi. */
export async function generateArticleFromUrl(rawUrl: string): Promise<ArticleLocale> {
  if (!rawUrl.trim()) throw new AiArticleError("Avval havola kiriting.");

  const url = assertPublicHttpUrl(rawUrl);
  const sourceText = await fetchSourceText(url);
  const { title, bodyHtml } = await callGemini(sourceText, url.toString());

  return {
    title: title.trim(),
    body: sanitizeArticleBody(bodyHtml),
  };
}
