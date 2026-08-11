import sanitizeHtml from "sanitize-html";

/**
 * Maqola matni uchun ruxsat etilgan HTML — rich-text muharrir
 * (`components/admin/RichTextEditor.tsx`) chiqaradigan teglar bilan bir xil.
 * Saqlashdan oldin har doim shu orqali o'tkaziladi (`data-actions.ts`),
 * shuning uchun manba qanday bo'lishidan qat'iy nazar (qo'lda yozilgan,
 * tarjima qilingan yoki AI tayyorlagan) natija doim xavfsiz.
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s",
  "h2", "h3",
  "ul", "ol", "li",
  "blockquote",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
];

export function sanitizeArticleBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      }),
    },
    // Bo'sh qatorlar/teglar orasidagi bo'shliqlarni saqlaydi, lekin
    // ruxsat etilmagan teglarni butunlay olib tashlaydi (matnini emas).
    disallowedTagsMode: "discard",
  }).trim();
}
