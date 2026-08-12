import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticleCard, excerpt, formatDate } from "@/components/articles/ArticleCard";
import { ViewCounter } from "@/components/articles/ViewCounter";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getArticles, getProducts, type Article } from "@/lib/admin/store";
import { withLocale } from "@/lib/i18n/config";
import { plural, VIEWS_FORMS } from "@/lib/i18n/plural";
import { SITE_URL, resolvePageMeta } from "@/lib/i18n/page-meta";
import { getServerDictionary, resolveLocale } from "@/lib/i18n/server";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { CONTAINER, productName } from "@/lib/utils";

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
  return resolvePageMeta(`/articles/${slug}`, {
    title: `${text.title} — CureLife`,
    description: excerpt(text.body, 160),
    image: article.image,
  });
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const [article, dict, locale, all, products] = await Promise.all([
    findArticle(slug),
    getServerDictionary(),
    resolveLocale(),
    getArticles(),
    getProducts(),
  ]);
  if (!article) notFound();

  const a = dict.articles;
  const text = article[locale];
  const others = all.filter((x) => x.id !== article.id).slice(0, 3);

  const relatedProduct = products.find(
    (p) => p.id === article.relatedProductId && p.visible,
  );
  const relatedText = relatedProduct?.[locale];
  const pageUrl = `${SITE_URL}/${locale}/articles/${slug}`;

  return (
    <>
      <JsonLd data={articleSchema(locale, article, text.title, excerpt(text.body, 160), pageUrl)} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.nav.home, path: "/" },
          { name: a.listTitle, path: "/articles" },
          { name: text.title, path: `/articles/${slug}` },
        ])}
      />
      <ViewCounter articleId={article.id} />
      <main className="overflow-hidden bg-[linear-gradient(180deg,#fff,#f3fdfc)] text-ink-deep">
        <Header />

        <article className="pt-12 pb-24 lg:pt-16 lg:pb-32">
          <div className={`${CONTAINER} max-w-[900px]`}>
            <Link
              href={withLocale(locale, "/articles")}
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

            {relatedProduct && relatedText && (
              <div className="mt-14 overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(8,126,125,.08)] sm:grid sm:grid-cols-[260px_1fr] sm:items-stretch">
                <div className="relative h-[200px] bg-[#eefaf9] sm:h-auto">
                  {relatedProduct.image ? (
                    <Image
                      src={relatedProduct.image}
                      alt={productName(relatedProduct, locale)}
                      fill
                      sizes="(max-width:640px) 100vw, 260px"
                      className="object-contain p-7"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center px-4">
                      <p className="text-center font-display text-[20px] font-bold text-ink-deep/15">
                        {productName(relatedProduct, locale)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-7 sm:p-9">
                  <SectionLabel>{a.relatedProduct.label}</SectionLabel>
                  <h2 className="mt-5 font-display text-[26px] leading-[1.1] font-bold tracking-[-.03em] sm:text-[32px]">
                    {a.relatedProduct.title}{" "}
                    <span className="text-accent">{a.relatedProduct.titleAccent}</span>
                  </h2>
                  <p className="mt-4 font-display text-[19px] font-bold text-ink-deep">
                    {productName(relatedProduct, locale)}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-body">
                    {relatedText.description}
                  </p>
                  <Link
                    href={withLocale(locale, `/products/${relatedProduct.slug}`)}
                    className="bg-brand-gradient mt-6 inline-flex h-11 items-center gap-4 rounded-pill px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {a.relatedProduct.cta} <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              </div>
            )}
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
