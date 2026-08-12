import type { MetadataRoute } from "next";

import { getArticles, getProducts } from "@/lib/admin/store";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/page-meta";

/** `/sitemap.xml` — har bir ochiq sahifaning ikkala til versiyasi, hreflang bilan. */
function entry(
  path: string,
  options: { lastModified?: string; priority?: number } = {},
): MetadataRoute.Sitemap[number][] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path === "/" ? "" : path}`;

  return locales.map((locale) => ({
    url: languages[locale],
    ...(options.lastModified ? { lastModified: options.lastModified } : {}),
    ...(options.priority !== undefined ? { priority: options.priority } : {}),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getProducts(), getArticles()]);

  const staticPages = [
    entry("/", { priority: 1 }),
    entry("/products", { priority: 0.9 }),
    entry("/about", { priority: 0.6 }),
    entry("/contact", { priority: 0.5 }),
    entry("/articles", { priority: 0.7 }),
  ].flat();

  const productPages = products
    .filter((p) => p.visible)
    .flatMap((p) => entry(`/products/${p.slug}`, { priority: 0.8 }));

  const articlePages = articles.flatMap((a) =>
    entry(`/articles/${a.slug}`, {
      lastModified: a.publishedAt || undefined,
      priority: 0.6,
    }),
  );

  return [...staticPages, ...productPages, ...articlePages];
}
