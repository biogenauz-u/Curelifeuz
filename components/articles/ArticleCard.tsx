import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import type { Article } from "@/lib/admin/store";
import type { Locale } from "@/lib/i18n/config";
import { plural, VIEWS_FORMS } from "@/lib/i18n/plural";

/** "2026-07-14" → "14.07.2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : iso;
}

/** Matn HTML bo'lishi mumkin (rich-text muharrir chiqarishi) — teglar olib tashlanadi. */
export function excerpt(bodyHtml: string, max = 150): string {
  const text = bodyHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/**
 * Maqola kartochkasi: rasm chapda, matn o'ngda.
 * Kichik ekranda ustunga tushadi.
 */
export function ArticleCard({
  article,
  locale,
  labels,
}: {
  article: Article;
  locale: Locale;
  labels: { readMore: string };
}) {
  const text = article[locale];

  return (
    <article className="flex gap-4 rounded-[26px] bg-white p-4 shadow-[0_16px_50px_rgba(8,126,125,.07)] sm:gap-7 sm:p-7">
      <div className="relative aspect-square w-[108px] shrink-0 overflow-hidden rounded-[16px] bg-[#eefaf9] sm:w-[38%] sm:max-w-[220px] sm:rounded-[18px]">
        {article.image ? (
          <Image
            src={article.image}
            alt={text.title}
            fill
            sizes="(max-width:640px) 108px, 220px"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[34px] text-brand-200">
            ✎
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[9px] font-bold tracking-[.12em] text-label">
          {formatDate(article.publishedAt)} ·{" "}
          {plural(locale, article.views, VIEWS_FORMS)}
        </p>
        <h3 className="mt-2 line-clamp-2 font-display text-[17px] leading-[1.25] font-bold text-ink-deep sm:mt-3 sm:line-clamp-none sm:text-[20px]">
          {text.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-body sm:mt-3 sm:line-clamp-3 sm:leading-[1.65]">
          {excerpt(text.body, 190)}
        </p>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-auto inline-flex min-h-11 items-center gap-3 pt-5 text-[13px] font-bold text-accent transition-colors hover:text-brand-700"
        >
          {labels.readMore} <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </article>
  );
}
