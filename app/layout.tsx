import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { cookies } from "next/headers";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import { getSettings } from "@/lib/admin/store";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolvePageMeta } from "@/lib/i18n/page-meta";

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

async function resolveLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getDictionary(await resolveLocale());
  return resolvePageMeta("/", meta);
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
        <LanguageProvider initialLocale={locale}>
          <SiteSettingsProvider settings={settings}>
            {children}
          </SiteSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
