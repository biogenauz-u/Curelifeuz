import Link from "next/link";

import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getArticles } from "@/lib/admin/store";
import { getServerDictionary, resolveLocale } from "@/lib/i18n/server";
import { CONTAINER, H2, H2_LG, SECTION_Y } from "@/lib/utils";

/** Bosh sahifadagi maqolalar bo'limi — eng yangi 4 tasi. */
export async function Articles() {
  const [articles, dict, locale] = await Promise.all([
    getArticles(),
    getServerDictionary(),
    resolveLocale(),
  ]);

  if (!articles.length) return null;
  const a = dict.articles;

  return (
    <section id="articles" className={`${SECTION_Y} bg-[linear-gradient(180deg,#f2fbfa_0%,#f2fbfa_62%,#fff_100%)] lg:py-28`}>
      <div className={CONTAINER}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <SectionLabel>{a.label}</SectionLabel>
            <h2 className={`mt-7 max-w-[640px] ${H2} ${H2_LG[50]}`}>
              {a.title} <span className="text-accent">{a.titleAccent}</span>
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[440px] text-[14px] leading-6 text-body">
              {a.intro}
            </p>
            <Link
              href="/articles"
              className="mt-5 inline-flex h-11 items-center gap-3 rounded-pill border border-brand-200 bg-white px-5 text-[13px] font-semibold text-brand-700"
            >
              {a.all} <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale}
              labels={{ readMore: a.readMore }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
