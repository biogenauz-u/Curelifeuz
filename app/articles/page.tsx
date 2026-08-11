import type { Metadata } from "next";

import { ArticleCard } from "@/components/articles/ArticleCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getArticles } from "@/lib/admin/store";
import { getServerDictionary, resolveLocale } from "@/lib/i18n/server";
import { resolvePageMeta } from "@/lib/i18n/page-meta";
import { CONTAINER } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = (await getServerDictionary()).articles;
  return resolvePageMeta("/articles", meta);
}

export default async function ArticlesPage() {
  const [articles, dict, locale] = await Promise.all([
    getArticles(),
    getServerDictionary(),
    resolveLocale(),
  ]);
  const a = dict.articles;

  return (
    <>
      <main className="overflow-hidden bg-[linear-gradient(180deg,#fff,#f3fdfc)] text-ink-deep">
        <Header />

        <section className="pt-16 pb-24 lg:pt-20 lg:pb-32">
          <div className={CONTAINER}>
            <SectionLabel>{a.label}</SectionLabel>
            <h1 className="mt-7 max-w-[720px] font-display text-[48px] leading-[.98] font-bold tracking-[-.055em] sm:text-[70px]">
              {a.listTitle}
            </h1>
            <p className="mt-6 max-w-[560px] text-[14px] leading-6 text-body">
              {a.listIntro}
            </p>

            {articles.length ? (
              <div className="mt-14 grid gap-4 lg:grid-cols-2">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    locale={locale}
                    labels={{ readMore: a.readMore }}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-14 rounded-[24px] bg-white p-10 text-center text-body">
                {a.empty}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
