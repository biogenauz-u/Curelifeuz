/**
 * Rich-text muharrir chiqargan HTML har doim yassi (nested bo'lmagan)
 * bloklar ketma-ketligi: `<p>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<blockquote>`,
 * `<table>`, `<img>` — bir-birining ichiga kirmaydi. Tarjima paytida har bir
 * blokni (ichidagi `<strong>`/`<a>` kabi teglar bilan birga) bitta birlik
 * sifatida yuborish uchun shu funksiya ulardan ajratib beradi.
 */
const VOID_TAGS = new Set(["img", "br", "hr"]);

export function splitTopLevelBlocks(html: string): string[] {
  const blocks: string[] = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/)?>/g;
  let depth = 0;
  let blockStart = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(html))) {
    const [, closing, tag, selfClose] = match;
    const isVoid = VOID_TAGS.has(tag.toLowerCase()) || Boolean(selfClose);

    if (isVoid) {
      if (depth === 0) blocks.push(html.slice(match.index, tagRe.lastIndex));
      continue;
    }
    if (!closing) {
      if (depth === 0) blockStart = match.index;
      depth++;
    } else {
      depth = Math.max(0, depth - 1);
      if (depth === 0) blocks.push(html.slice(blockStart, tagRe.lastIndex));
    }
  }

  return blocks;
}

/** Rasm bloki — tarjima qilinadigan matni yo'q. */
export function isImageBlock(block: string): boolean {
  return /^<img\b/i.test(block.trim());
}
