/**
 * JSON-LD (schema.org) tuzuvchi sof funksiyalar. Faqat bazadagi haqiqiy
 * ma'lumotdan foydalanadi — bo'sh maydon uchun soxta qiymat qo'yilmaydi,
 * shunchaki o'sha kalit chiqarilmaydi.
 */
import type { Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/page-meta";
import { SOCIAL_LINKS } from "@/lib/site-config";
import type { Article, Product, ProductLocale, Settings } from "@/lib/admin/store";

const OG_LOCALE: Record<Locale, string> = { ru: "ru-RU", uz: "uz-UZ" };

function assetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function organizationId(): string {
  return `${SITE_URL}/#organization`;
}

export function organizationSchema(settings: Settings) {
  const sameAs = Object.values(SOCIAL_LINKS).filter((v): v is string => Boolean(v));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: "CureLife",
    url: SITE_URL,
    logo: assetUrl("/images/curelife-logo.svg"),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "CureLife",
    inLanguage: OG_LOCALE[locale],
    publisher: { "@id": organizationId() },
  };
}

export function breadcrumbSchema(
  locale: Locale,
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function productSchema(
  locale: Locale,
  product: Product,
  text: ProductLocale,
  name: string,
  url: string,
) {
  const d = text.detail;
  const image = assetUrl(product.detailImage ?? product.image);

  const manufacturerName =
    d.origin.type === "imported" ? d.origin.importedFull : d.origin.manufacturerFull;
  const countryOfOrigin =
    d.origin.type === "imported" ? d.origin.importedCountry : d.origin.makeCountry;

  const additionalProperty = [
    ...(text.stats[0]
      ? [{ "@type": "PropertyValue", name: "dosageForm", value: text.stats[0] }]
      : []),
    ...(text.stats[1]
      ? [{ "@type": "PropertyValue", name: "packageQuantity", value: text.stats[1] }]
      : []),
    ...d.composition.map((c) => ({
      "@type": "PropertyValue",
      name: c.name,
      value: c.amount,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    description: text.description || undefined,
    ...(image ? { image: [image] } : {}),
    url,
    brand: { "@type": "Brand", name: "CureLife" },
    ...(text.category ? { category: text.category } : {}),
    ...(manufacturerName ? { manufacturer: { "@type": "Organization", name: manufacturerName } } : {}),
    ...(countryOfOrigin ? { countryOfOrigin } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
  };
}

export function articleSchema(
  locale: Locale,
  article: Article,
  title: string,
  description: string,
  url: string,
) {
  const image = assetUrl(article.image);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    ...(image ? { image: [image] } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    inLanguage: OG_LOCALE[locale],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: { "@id": organizationId() },
    author: { "@id": organizationId() },
  };
}
