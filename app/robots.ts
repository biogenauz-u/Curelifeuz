import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/i18n/page-meta";

/**
 * `/robots.txt` — Next.js Metadata Route orqali. Faqat production'da
 * to'liq ruxsat beriladi (Vercel preview/branch deploy'lari, `VERCEL_ENV`
 * orqali aniqlanib, indekslanishdan butunlay chetlashtiriladi).
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
