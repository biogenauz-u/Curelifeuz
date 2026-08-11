import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticleCard, excerpt, formatDate } from "@/components/articles/ArticleCard";
import { ViewCounter } from "@/components/articles/ViewCounter";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getArticles, type Article } from "@/lib/admin/store";
import { plural, VIEWS_FORMS } from "@/lib/i18n/plural";
import { getServerDictionary, resolveLocale } from "@/lib/i18n/server";
import { CONTAINER } from "@/lib/utils";

async function findArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [article, locale] = await Promise.all([findArticle(slug), resolveLocale()]);
  if (!article) return {};

  const text = article[locale];
  return {
    title: `${text.title} — CureLife`,
    description: excerpt(text.body, 160),
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const [article, dict, locale, all] = await Promise.all([
    findArticle(slug),
    getServerDictionary(),
    resolveLocale(),
    getArticles(),
  ]);
  if (!article) notFound();

  const a = dict.articles;
  const text = article[locale];
  const others = all.filter((x) => x.id !== article.id).slice(0, 3);

  return (
    <>
      <ViewCounter articleId={article.id} />
      <main className="overflow-hidden bg-[linear-gradient(180deg,#fff,#f3fdfc)] text-ink-deep">
        <Header />

        <article className="pt-12 pb-24 lg:pt-16 lg:pb-32">
          <div className={`${CONTAINER} max-w-[900px]`}>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[12px] font-semibold text-body transition-colors hover:text-accent"
            >
              <span aria-hidden>&larr;</span> {a.back}
            </Link>

            <p className="mt-10 text-[11px] font-bold tracking-[.12em] text-label">
              {formatDate(article.publishedAt)} ·{" "}
              {plural(locale, article.views, VIEWS_FORMS)}
            </p>
            <h1 className="mt-4 font-display text-[38px] leading-[1.05] font-bold tracking-[-.045em] sm:text-[52px]">
              {text.title}
            </h1>

            {article.image && (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[26px] bg-[#eefaf9]">
                <Image
                  src={article.image}
                  alt={text.title}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="article-body mt-10 text-[15px] leading-[1.8] text-body"
              dangerouslySetInnerHTML={{ __html: text.body }}
            />
          </div>
        </article>

        {Boolean(others.length) && (
          <section className="bg-[#f2fbfa] py-20">
            <div className={CONTAINER}>
              <h2 className="font-display text-[28px] font-bold tracking-[-.04em]">
                {a.listTitle}
              </h2>
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {others.map((other) => (
                  <ArticleCard
                    key={other.id}
                    article={other}
                    locale={locale}
                    labels={{ readMore: a.readMore }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
