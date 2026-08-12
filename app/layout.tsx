import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { JsonLd } from "@/components/seo/JsonLd";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import { getSettings } from "@/lib/admin/store";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_OG_IMAGE, resolvePageMeta, SITE_URL } from "@/lib/i18n/page-meta";
import { resolveLocale } from "@/lib/i18n/server";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

import "./globals.css";

// Maketda sarlavhalar Manrope, matnlar Inter bilan terilgan.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getDictionary(await resolveLocale());
  const pageMeta = await resolvePageMeta("/", meta);

  return {
    ...pageMeta,
    metadataBase: new URL(SITE_URL),
    applicationName: "CureLife",
    creator: "CureLife",
    publisher: "CureLife",
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    verification: {
      // Faqat environment variable orqali — qiymatlar kodga yozilmaydi.
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.YANDEX_SITE_VERIFICATION || undefined,
    },
    openGraph: { ...pageMeta.openGraph, images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }] },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, settings] = await Promise.all([resolveLocale(), getSettings()]);

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white">
        {/* Sayt bo'yicha bir marta: kompaniya va veb-sayt haqida tuzilmali ma'lumot. */}
        <JsonLd data={organizationSchema(settings)} />
        <JsonLd data={websiteSchema(locale)} />
        <LanguageProvider initialLocale={locale}>
          <SiteSettingsProvider settings={settings}>
            {children}
          </SiteSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
